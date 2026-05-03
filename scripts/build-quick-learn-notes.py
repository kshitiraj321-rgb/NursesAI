import json
import re
from pathlib import Path
from collections import defaultdict

ROOT = Path('.').resolve()
MANIFEST = ROOT / 'data' / 'pyq' / 'manifest.json'
CHUNKS_DIR = ROOT / 'data' / 'pyq' / 'chunks'
OUT = ROOT / 'data' / 'quickLearnNotes.json'


def clean(text: str) -> str:
    text = (text or '').strip()
    text = re.sub(r'\s+', ' ', text)
    return text


def first_sentence(text: str, limit: int = 180) -> str:
    t = clean(text)
    if not t:
      return ''
    parts = re.split(r'(?<=[.!?])\s+', t)
    s = parts[0] if parts else t
    return s[:limit].strip()


def topic_from_record(rec: dict) -> str:
    t = clean(str(rec.get('topic', '')))
    if not t or len(t) > 80 or '?' in t:
        return clean(str(rec.get('subCategory', 'General')))
    return t


def build_note(rec: dict) -> dict:
    q = clean(str(rec.get('question', '')))
    ans = clean(str(rec.get('answer', '')))
    exp = clean(str(rec.get('explanation', '')))
    opts = [clean(str(o)) for o in rec.get('options', []) if clean(str(o))]

    definition = first_sentence(exp) or f"{q}"
    if len(definition) > 160:
        definition = definition[:160].rstrip() + '...'

    key_facts = []
    if ans:
        key_facts.append(f"Correct focus: {ans}")
    if opts:
        key_facts.append(f"Common options tested: {', '.join(opts[:3])}")
    if exp:
        maybe_fact = first_sentence(exp, 220)
        if maybe_fact and maybe_fact not in key_facts:
            key_facts.append(maybe_fact)

    nursing_points = []
    for token in ['monitor', 'assess', 'administer', 'position', 'safety', 'priority', 'nurse']:
        if token in exp.lower() or token in q.lower():
            nursing_points.append(f"Nursing priority around {token}: apply standard protocol and patient safety checks.")
            break
    if not nursing_points:
        nursing_points.append("Apply ABCs, reassess vitals, and document response to intervention.")

    exam_trick = "Eliminate distractors by matching the stem keyword to the most specific clinical cue."
    if 'except' in q.lower() or 'not' in q.lower():
        exam_trick = "This is a negative stem question; identify the outlier option after validating the true statements first."

    revision_60s = [
        f"Cue: {first_sentence(q, 90)}",
        f"Answer anchor: {ans or 'Review concept from explanation'}",
        "Memory hook: symptom -> diagnosis -> priority action",
    ]

    tags = [clean(str(t)) for t in rec.get('tags', []) if clean(str(t))]

    return {
        'id': clean(str(rec.get('id', ''))),
        'definition': definition,
        'keyFacts': key_facts[:3],
        'nursingPoints': nursing_points[:2],
        'examTrick': exam_trick,
        'revision60s': revision_60s,
        'verified': bool(rec.get('verified', False)),
        'source': clean(str(rec.get('source', ''))),
        'tags': tags,
    }


manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
records = []
for chunk in manifest.get('chunks', []):
    p = CHUNKS_DIR / chunk['file']
    if p.exists():
        records.extend(json.loads(p.read_text(encoding='utf-8')))

nested = defaultdict(lambda: defaultdict(list))
for rec in records:
    subject = clean(str(rec.get('subject', 'General')))
    topic = topic_from_record(rec) or 'General'
    nested[subject][topic].append(build_note(rec))

# Deduplicate notes within topic by definition + answer anchor
result_subjects = []
for subject in sorted(nested.keys()):
    topics_out = []
    for topic in sorted(nested[subject].keys()):
        seen = set()
        notes = []
        for n in nested[subject][topic]:
            key = (n['definition'].lower(), tuple(n['keyFacts'][:1]))
            if key in seen:
                continue
            seen.add(key)
            notes.append(n)
        topics_out.append({'topic': topic, 'notes': notes})
    result_subjects.append({'subject': subject, 'topics': topics_out})

output = {
    'version': 1,
    'generatedFrom': 'PYQ chunks + PDF-derived explanations',
    'subjectCount': len(result_subjects),
    'noteCount': sum(len(t['notes']) for s in result_subjects for t in s['topics']),
    'subjects': result_subjects,
}

OUT.write_text(json.dumps(output, indent=2, ensure_ascii=False), encoding='utf-8')
print(json.dumps({'subjectCount': output['subjectCount'], 'noteCount': output['noteCount'], 'path': str(OUT)}, indent=2))
