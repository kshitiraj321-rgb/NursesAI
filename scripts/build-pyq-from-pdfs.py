import json
import re
from pathlib import Path
from pypdf import PdfReader

ROOT = Path('.').resolve()
RAW_DIR = ROOT / 'data' / 'pyq' / 'raw_pdf'
OUT_DIR = ROOT / 'data' / 'pyq' / 'chunks'
MANIFEST = ROOT / 'data' / 'pyq' / 'manifest.json'
REPORT = ROOT / 'data' / 'pyq' / 'quality-report.json'

FILE_SUBJECT = {
    '01_MedicalSurgical.pdf.pdf': 'Medical-Surgical Nursing',
    '02_Fundamentals.pdf.pdf': 'Fundamentals of Nursing',
    '03_OBG.pdf.pdf': 'Obstetrics & Gynaecology',
    '04_Pediatric.pdf.pdf': 'Pediatric Nursing',
    '05_Community.pdf.pdf': 'Community Health Nursing',
    '06_Psychiatry.pdf.pdf': 'Psychiatric Nursing',
    '07_GK.pdf.pdf': 'General Aptitude',
    '08_MixedPYQ.pdf.pdf': 'General Aptitude',
}

ALIAS = {
    'med-surg': 'Medical-Surgical Nursing',
    'med surg': 'Medical-Surgical Nursing',
    'medical-surgical': 'Medical-Surgical Nursing',
    'pediatric': 'Pediatric Nursing',
    'community': 'Community Health Nursing',
    'psychiatry': 'Psychiatric Nursing',
    'obg': 'Obstetrics & Gynaecology',
    'gk': 'General Aptitude',
    'fundamentals': 'Fundamentals of Nursing',
    'fundamentals of nursing': 'Fundamentals of Nursing',
}

def clean(s: str) -> str:
    s = s.replace('\x00', ' ')
    s = re.sub(r'[\u0000-\u001f\u007f-\u009f]', ' ', s)
    s = re.sub(r'\s+', ' ', s)
    return s.strip()

def normalize(s: str) -> str:
    return clean(s).lower()

def slug(s: str) -> str:
    return re.sub(r'(^-|-$)', '', re.sub(r'[^a-z0-9]+', '-', s.lower()))

def fix_subject(s: str, fallback: str) -> str:
    n = normalize(s)
    for k, v in ALIAS.items():
        if k in n:
            return v
    return s if s else fallback

def has_corrupt(s: str) -> bool:
    if not s:
        return True
    if '�' in s:
        return True
    c = clean(s)
    bad = len(re.findall(r'[^\x20-\x7e]', c))
    return (bad / max(1, len(c))) > 0.35

def read_pdf(path: Path) -> str:
    r = PdfReader(str(path))
    t = '\n'.join((p.extract_text() or '') for p in r.pages)
    t = t.replace('\r', '\n')
    t = re.sub(r'\n{3,}', '\n\n', t)
    return t

def split_blocks(text: str):
    parts = re.split(r'\n\s*---\s*\n', text)
    return [p for p in parts if 'Q' in p and 'Answer:' in p]

def parse_meta(block: str, fallback_subject: str):
    # [Med-Surg > Cardiology > Heart Failure] High - VERIFIED
    m = re.search(r'\[([^\]]+)\]\s*([^\n]*)', block)
    subject = fallback_subject
    sub = 'General'
    topic = 'General'
    difficulty = 'medium'
    verified = False
    tags = []
    if m:
        chain = [clean(x) for x in m.group(1).split('>')]
        if len(chain) >= 1:
            subject = fix_subject(chain[0], fallback_subject)
        if len(chain) >= 2:
            sub = chain[1]
        if len(chain) >= 3:
            topic = chain[2]
        tail = normalize(m.group(2))
        if 'easy' in tail:
            difficulty = 'easy'
        elif 'hard' in tail or 'high' in tail:
            difficulty = 'hard'
        verified = 'verified' in tail
    tm = re.search(r'Tags:\s*([^\n]+)', block, re.I)
    if tm:
        tags = [t.strip('# ') for t in tm.group(1).split('#') if t.strip()]
    return subject, sub, topic, difficulty, verified, tags

def parse_question(block: str):
    m = re.search(r'Q\s*\d+\.\s*([\s\S]{8,500}?\?)\s*(?=A\)|A\.|A:)', block, re.I)
    return clean(m.group(1)) if m else ''

def parse_options(block: str):
    opts = {'A':'','B':'','C':'','D':''}
    for k in ['A','B','C','D']:
        m = re.search(rf'{k}[\)\.:]\s*([\s\S]{{1,260}}?)(?=\s+[ABCD][\)\.:]\s*|\s*Answer:|\s*Explanation:|$)', block, re.I)
        if m:
            opts[k] = clean(m.group(1))
    return [opts['A'], opts['B'], opts['C'], opts['D']]

def parse_answer(block: str, options):
    m = re.search(r'Answer:\s*([A-D]|[1-4])\)?\s*(.*)', block, re.I)
    if m:
        token = m.group(1).upper()
        idx = int(token)-1 if token in {'1','2','3','4'} else ord(token)-65
        if 0 <= idx < 4 and options[idx]:
            return options[idx], True
    # infer by matching answer text against options
    m2 = re.search(r'Answer:\s*([\s\S]{1,200}?)(?=\n|$)', block, re.I)
    if m2:
        ans_text = clean(m2.group(1))
        for opt in options:
            if opt and normalize(opt) in normalize(ans_text):
                return opt, False
    return '', False

def parse_explanation(block: str):
    m = re.search(r'Explanation:\s*([\s\S]{0,900}?)(?=\s*Source:|\s*Tags:|$)', block, re.I)
    return clean(m.group(1)) if m else ''

def integrity_flags(rec):
    flags=[]
    if not rec['question'] or len(rec['question'])<12 or has_corrupt(rec['question']):
        flags.append('bad_question')
    if len(rec['options'])!=4:
        flags.append('options_count_mismatch')
    if any((not o) or has_corrupt(o) for o in rec['options']):
        flags.append('bad_options')
    if not rec['answer'] or normalize(rec['answer']) not in {normalize(o) for o in rec['options'] if o}:
        flags.append('answer_mismatch')
    return flags

records_raw=[]
for pdf in sorted(RAW_DIR.glob('*.pdf')):
    text = read_pdf(pdf)
    blocks = split_blocks(text)
    fallback = FILE_SUBJECT.get(pdf.name,'General Aptitude')
    serial=1
    for b in blocks:
        subject, sub, topic, diff, verified_meta, tags = parse_meta(b, fallback)
        q = parse_question(b)
        opts = parse_options(b)
        ans, explicit = parse_answer(b, opts)
        exp = parse_explanation(b)
        rec = {
            'id': f"{slug(pdf.stem)}-{serial}",
            'exam': 'NORCET',
            'year': None,
            'subject': subject,
            'subCategory': sub,
            'topic': topic,
            'question': q,
            'options': opts,
            'answer': ans,
            'explanation': exp,
            'difficulty': diff,
            'verified': bool(verified_meta or explicit),
            'tags': list(dict.fromkeys([subject, sub, topic] + tags)),
            'source': pdf.name,
        }
        rec['integrityFlags']=integrity_flags(rec)
        rec['quizReady']=len(rec['integrityFlags'])==0
        records_raw.append(rec)
        serial += 1

# de-dupe by question
uniq={}
for r in records_raw:
    k=normalize(r['question'])
    if k and k not in uniq:
        uniq[k]=r
records=list(uniq.values())

OUT_DIR.mkdir(parents=True, exist_ok=True)
by_subject={}
for r in records:
    by_subject.setdefault(r['subject'], []).append(r)

chunks=[]
for subject, items in sorted(by_subject.items()):
    fname=f"{slug(subject)}.json"
    (OUT_DIR/fname).write_text(json.dumps(items, indent=2, ensure_ascii=False), encoding='utf-8')
    chunks.append({'subject':subject,'file':fname,'count':len(items)})

manifest={'total':len(records),'chunks':chunks}
MANIFEST.write_text(json.dumps(manifest,indent=2),encoding='utf-8')

quiz_ready=sum(1 for r in records if r['quizReady'])
quarantined=len(records)-quiz_ready
report={
    'totalExtracted': len(records),
    'quizReady': quiz_ready,
    'quarantined': quarantined,
    'subjectCounts': {k:len(v) for k,v in sorted(by_subject.items())},
    'duplicatesRemoved': len(records_raw)-len(records),
}
REPORT.write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))
