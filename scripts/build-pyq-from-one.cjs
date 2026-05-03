const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(process.cwd(), 'data/pyq/raw');
const OUT_DIR = path.join(process.cwd(), 'data/pyq/chunks');
const MANIFEST_PATH = path.join(process.cwd(), 'data/pyq/manifest.json');
const REPORT_PATH = path.join(process.cwd(), 'data/pyq/quality-report.json');

const subjectByFile = {
  'Med-Surg.one': 'Medical-Surgical Nursing',
  'Fundamentals.one': 'Fundamentals of Nursing',
  'OBG.one': 'Obstetrics & Gynaecology',
  'Pediatric.one': 'Pediatric Nursing',
  'Community.one': 'Community Health Nursing',
  'Psychiatry.one': 'Psychiatric Nursing',
  'GK.one': 'General Aptitude',
  'AIIMS Jodhpur.one': 'General Aptitude'
};

const subCategoryMap = {
  'Medical-Surgical Nursing': ['Cardiovascular','Respiratory','Renal','Neurology','Endocrine','GI','Emergency','Oncology'],
  'Fundamentals of Nursing': ['Infection Control','Nursing Procedures','Patient Safety','Vital Signs','CPR/BLS','Communication'],
  'Obstetrics & Gynaecology': ['Antenatal','Labour','Complications','Newborn Care','Family Planning'],
  'Pediatric Nursing': ['Growth Development','Neonatal','Diseases','Immunization'],
  'Community Health Nursing': ['Epidemiology','National Programs','Prevention','Demography'],
  'Pharmacology': ['Emergency Drugs','Antibiotics','Endocrine Drugs','CVS Drugs','Calculations','Antidotes'],
  'Psychiatric Nursing': ['Disorders','Communication','Therapies','Mental Health Acts'],
  'General Aptitude': ['Reasoning','Quant','GK','Current Affairs']
};

const keywordRules = [
  {kw:['copd','asthma','pneumonia','pneumothorax'], subject:'Medical-Surgical Nursing', sub:'Respiratory'},
  {kw:['ecg','myocardial','angina','cardiac','heart'], subject:'Medical-Surgical Nursing', sub:'Cardiovascular'},
  {kw:['ckd','renal','dialysis','urine'], subject:'Medical-Surgical Nursing', sub:'Renal'},
  {kw:['stroke','gcs','cranial nerve'], subject:'Medical-Surgical Nursing', sub:'Neurology'},
  {kw:['diabetes','thyroid','endocrine'], subject:'Medical-Surgical Nursing', sub:'Endocrine'},
  {kw:['peritonitis','liver','colonoscopy'], subject:'Medical-Surgical Nursing', sub:'GI'},
  {kw:['shock','burn','trauma','transfusion','emergency'], subject:'Medical-Surgical Nursing', sub:'Emergency'},
  {kw:['steriliz','hand wash','ppe','bmw'], subject:'Fundamentals of Nursing', sub:'Infection Control'},
  {kw:['vital sign','pulse','blood pressure','temperature'], subject:'Fundamentals of Nursing', sub:'Vital Signs'},
  {kw:['cpr','bls','rescuer'], subject:'Fundamentals of Nursing', sub:'CPR/BLS'},
  {kw:['pregnan','labour','postpartum','pph','apgar','newborn'], subject:'Obstetrics & Gynaecology', sub:'Complications'},
  {kw:['neonatal','infant','child'], subject:'Pediatric Nursing', sub:'Neonatal'},
  {kw:['immunization','vaccine'], subject:'Pediatric Nursing', sub:'Immunization'},
  {kw:['epidemiology','national program','anganwadi','prevention'], subject:'Community Health Nursing', sub:'National Programs'},
  {kw:['schizophrenia','delirium','anorexia nervosa','mental'], subject:'Psychiatric Nursing', sub:'Disorders'},
  {kw:['dose','drug','antibiotic','heparin','warfarin','insulin'], subject:'Pharmacology', sub:'Calculations'},
  {kw:['reasoning','number series','quant','gk'], subject:'General Aptitude', sub:'Reasoning'},
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const clean = (s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, ' ').replace(/\s+/g, ' ').trim();
const normalize = (s) => clean(s).toLowerCase();

function hasCorruption(value) {
  if (!value) return true;
  if (value.includes('�')) return true;
  const cleanText = clean(value);
  if (cleanText.length < 2) return true;
  const badCharRatio = (cleanText.match(/[^\x20-\x7E]/g) || []).length / cleanText.length;
  return badCharRatio > 0.3;
}

function infer(question, fallbackSubject) {
  const q = normalize(question);
  for (const rule of keywordRules) {
    if (rule.kw.some((k) => q.includes(k))) {
      return { subject: rule.subject, subCategory: rule.sub, topic: topicFromQuestion(question) };
    }
  }
  return { subject: fallbackSubject, subCategory: (subCategoryMap[fallbackSubject] || ['General'])[0], topic: topicFromQuestion(question) };
}

function topicFromQuestion(question) {
  const head = clean(question).split('?')[0].trim();
  return head.length > 52 ? head.slice(0, 52).trim() : head;
}

function decodeOneNote(filePath) {
  const b = fs.readFileSync(filePath);
  const utf8 = b.toString('utf8');
  const utf16 = b.toString('utf16le');
  return `${utf8}\n${utf16}`
    .replace(/\r/g, '\n')
    .replace(/\u0000/g, ' ')
    .replace(/[\t\f\v]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n');
}

function getQuestionAnchors(text) {
  const re = /(\d{1,4})[\.)]\s+([\s\S]{8,220}?\?)/g;
  const anchors = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    anchors.push({ start: m.index, end: re.lastIndex, serial: m[1], question: clean(m[2]) });
  }
  return anchors;
}

function extractOptions(block) {
  const options = [];
  const letterRe = /(?:^|\n|\s)([A-D])[\)\.\:\-]\s*([^\n]{1,220}?)(?=(?:\s+[A-D][\)\.\:\-]\s*)|(?:\n\s*[A-D][\)\.\:\-]\s*)|$)/gmi;
  let m;
  while ((m = letterRe.exec(block)) !== null) options.push({ key: m[1].toUpperCase(), value: clean(m[2]) });

  if (options.length < 4) {
    const numberRe = /(?:^|\n|\s)([1-4])[\)\.\:\-]\s*([^\n]{1,220}?)(?=(?:\s+[1-4][\)\.\:\-]\s*)|(?:\n\s*[1-4][\)\.\:\-]\s*)|$)/gmi;
    const temp = [];
    while ((m = numberRe.exec(block)) !== null) temp.push({ key: String.fromCharCode(64 + Number(m[1])), value: clean(m[2]) });
    if (temp.length >= options.length) options.splice(0, options.length, ...temp);
  }

  const byKey = { A: '', B: '', C: '', D: '' };
  for (const o of options) {
    if (!o.value || hasCorruption(o.value)) continue;
    if (byKey[o.key] !== undefined && !byKey[o.key]) byKey[o.key] = o.value;
  }

  const ordered = [byKey.A, byKey.B, byKey.C, byKey.D].filter(Boolean);
  return ordered.length === 4 ? ordered : ordered.slice(0, 4);
}

function answerFromMarker(block, options) {
  const explicitPatterns = [
    /(?:ans(?:wer)?|correct\s*(?:option|answer)?|right\s*answer|final\s*answer)\s*[:\-]?\s*([A-D]|[1-4])\b/i,
    /(?:ans(?:wer)?|correct\s*(?:option|answer)?)\s*[:\-]?\s*\(?\s*([A-D]|[1-4])\s*\)?/i,
  ];

  for (const re of explicitPatterns) {
    const m = re.exec(block);
    if (!m) continue;
    const raw = m[1].toUpperCase();
    const idx = /[1-4]/.test(raw) ? Number(raw) - 1 : raw.charCodeAt(0) - 65;
    const ans = options[idx] || '';
    if (ans) return { answer: ans, source: 'explicit', verified: true };
  }

  const inferredPatterns = [
    /\[\s*([A-D]|[1-4])\s*\](?!\s*[A-Za-z])/i,
    /\((\s*[1-4]\s*)\)(?!\s*[A-Za-z])/i,
    /(?:^|\n)\s*([A-D]|[1-4])\s*$/im,
  ];

  for (const re of inferredPatterns) {
    const m = re.exec(block);
    if (!m) continue;
    const raw = clean(m[1]).toUpperCase();
    const idx = /[1-4]/.test(raw) ? Number(raw) - 1 : raw.charCodeAt(0) - 65;
    const ans = options[idx] || '';
    if (ans) return { answer: ans, source: 'inferred', verified: false };
  }

  return { answer: '', source: 'missing', verified: false };
}

function extractExplanation(block) {
  const expRegex = /(?:^|\n)\s*(?:explanation|rationale|reason|solution)\s*[:\-]\s*([\s\S]{0,380})/i;
  const m = expRegex.exec(block);
  if (!m) return '';
  const text = clean(m[1]).replace(/\b(?:ans(?:wer)?|correct\s*answer)\s*[:\-].*$/i, '').trim();
  return hasCorruption(text) ? '' : text;
}

function parseOneFile(fileName) {
  const filePath = path.join(RAW_DIR, fileName);
  const text = decodeOneNote(filePath);
  const anchors = getQuestionAnchors(text);
  const records = [];

  for (let i = 0; i < anchors.length; i++) {
    const curr = anchors[i];
    const nextStart = i + 1 < anchors.length ? anchors[i + 1].start : text.length;
    const block = text.slice(curr.end, nextStart);
    const question = clean(curr.question);
    if (question.length < 12 || hasCorruption(question)) continue;

    const options = extractOptions(block);
    const answerMeta = answerFromMarker(block, options);
    const explanation = extractExplanation(block);
    const inferredTax = infer(question, subjectByFile[fileName] || 'General Aptitude');

    records.push({
      id: `${slug(fileName)}-${curr.serial}`,
      exam: 'NORCET',
      year: null,
      subject: inferredTax.subject,
      subCategory: inferredTax.subCategory,
      topic: inferredTax.topic || inferredTax.subCategory,
      question,
      options,
      answer: answerMeta.answer,
      explanation,
      source: fileName,
      verified: answerMeta.verified,
      answerSource: answerMeta.source,
      tags: [inferredTax.subject, inferredTax.subCategory],
    });
  }

  return records;
}

function dedupe(records) {
  const seen = new Set();
  const out = [];
  for (const r of records) {
    const key = normalize(r.question);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

function integrityFlags(r) {
  const flags = [];
  if (!r.question || hasCorruption(r.question)) flags.push('bad_question');
  if (!Array.isArray(r.options) || r.options.length !== 4) flags.push('options_count_mismatch');
  if (Array.isArray(r.options) && r.options.some((o) => !o || hasCorruption(String(o)))) flags.push('bad_options');
  if (!r.answer || !r.options.some((o) => normalize(o) === normalize(r.answer))) flags.push('answer_mismatch');
  return flags;
}

function isQuizReady(r) {
  return integrityFlags(r).length === 0;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const files = fs.readdirSync(RAW_DIR).filter((f) => f.endsWith('.one'));
let all = [];
for (const f of files) all = all.concat(parseOneFile(f));
all = dedupe(all);

const withFlags = all.map((r) => ({ ...r, integrityFlags: integrityFlags(r) }));
const bySubject = new Map();
for (const r of withFlags) {
  if (!bySubject.has(r.subject)) bySubject.set(r.subject, []);
  bySubject.get(r.subject).push(r);
}

const chunks = [];
for (const [subject, list] of bySubject) {
  const file = `${slug(subject)}.json`;
  fs.writeFileSync(path.join(OUT_DIR, file), JSON.stringify(list, null, 2));
  chunks.push({ subject, file, count: list.length });
}

const quizReady = withFlags.filter(isQuizReady);
const quarantined = withFlags.filter((r) => !isQuizReady(r));
const verifiedCount = withFlags.filter((r) => r.answerSource === 'explicit').length;
const inferredCount = withFlags.filter((r) => r.answerSource === 'inferred').length;

fs.writeFileSync(MANIFEST_PATH, JSON.stringify({ total: withFlags.length, chunks }, null, 2));
fs.writeFileSync(REPORT_PATH, JSON.stringify({
  totalExtracted: withFlags.length,
  safeQuizRecords: quizReady.length,
  quarantinedRecords: quarantined.length,
  verifiedAnswers: verifiedCount,
  inferredAnswers: inferredCount,
}, null, 2));

console.log(JSON.stringify({
  total: withFlags.length,
  safeQuizRecords: quizReady.length,
  quarantinedRecords: quarantined.length,
  verifiedAnswers: verifiedCount,
  inferredAnswers: inferredCount,
}, null, 2));
