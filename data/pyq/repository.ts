import type { PyqRecord, SubjectChunkIndex } from "./types";
import { norcetSubjectGroups } from "../norcetSubjects";

type Manifest = { total: number; chunks: SubjectChunkIndex[] };
let manifestCache: Manifest | null = null;
const chunkCache = new Map<string, PyqRecord[]>();
const chunkLoaders: Record<string, () => Promise<{ default: PyqRecord[] }>> = {
  "community-health-nursing.json": () => import("./chunks/community-health-nursing.json"),
  "fundamentals-of-nursing.json": () => import("./chunks/fundamentals-of-nursing.json"),
  "general-aptitude.json": () => import("./chunks/general-aptitude.json"),
  "medical-surgical-nursing.json": () => import("./chunks/medical-surgical-nursing.json"),
  "obstetrics-gynaecology.json": () => import("./chunks/obstetrics-gynaecology.json"),
  "pediatric-nursing.json": () => import("./chunks/pediatric-nursing.json"),
  "pharmacology.json": () => import("./chunks/pharmacology.json"),
  "psychiatric-nursing.json": () => import("./chunks/psychiatric-nursing.json"),
};

const readManifest = async (): Promise<Manifest> => {
  if (manifestCache) return manifestCache;
  const m = (await import("./manifest.json")).default as Manifest;
  manifestCache = m;
  return m;
};

const toChunkFileName = (subject: string) =>
  `${subject.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`;

const validSubjects = new Set<string>();
const validCategories = new Set<string>();

norcetSubjectGroups.forEach((group) => {
  group.subjects.forEach((subject) => {
    validSubjects.add(subject.name.toLowerCase());
    subject.subCategories.forEach((cat) => {
      validCategories.add(cat.name.toLowerCase());
    });
  });
});

export const normalizeSubjectAlias = (subject: string): string => {
  const s = subject.toLowerCase().trim();
  if (validSubjects.has(s)) {
    for (const group of norcetSubjectGroups) {
      for (const sub of group.subjects) {
        if (sub.name.toLowerCase() === s) return sub.name;
      }
    }
  }
  
  if (["med surg", "med-surg", "medical surgical"].includes(s)) return "Medical-Surgical Nursing";
  if (["pediatric", "child health", "pediatrics"].includes(s)) return "Pediatric Nursing";
  if (["community", "community health"].includes(s)) return "Community Health Nursing";
  if (["psychiatry", "psychiatric"].includes(s)) return "Psychiatric Nursing";
  if (["management"].includes(s)) return "Nursing Management";
  if (["gk", "aptitude"].includes(s)) return "General Aptitude";
  return subject;
};

export const loadPyqBySubject = async (subject: string): Promise<PyqRecord[]> => {
  const normalized = normalizeSubjectAlias(subject);
  if (chunkCache.has(normalized)) return chunkCache.get(normalized) ?? [];

  const manifest = await readManifest();
  const entry = manifest.chunks.find((c) => c.subject === normalized);
  if (!entry) return [];

  const file = entry.file || toChunkFileName(normalized);
  const loader = chunkLoaders[file];
  if (!loader) return [];
  const records = (await loader()).default as PyqRecord[];
  chunkCache.set(normalized, records);
  return records;
};

export const loadAllPyq = async (): Promise<PyqRecord[]> => {
  const manifest = await readManifest();
  const all = await Promise.all(manifest.chunks.map((chunk) => loadPyqBySubject(chunk.subject)));
  return all.flat();
};

export const searchPyq = async (query: string): Promise<PyqRecord[]> => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const all = await loadAllPyq();
  return all.filter((r) =>
    [r.subject, r.subCategory, r.topic, r.question, r.tags.join(" ")].join(" ").toLowerCase().includes(q)
  );
};

export const getManifest = readManifest;

const normalizeText = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

export const mapRecordToCategory = (record: PyqRecord): string => {
  const cat = (record.subCategory || "").trim().toLowerCase();
  if (validCategories.has(cat)) {
    for (const group of norcetSubjectGroups) {
      for (const sub of group.subjects) {
        for (const c of sub.subCategories) {
          if (c.name.toLowerCase() === cat) return c.name;
        }
      }
    }
  }
  return record.subCategory || "General";
};

export const isQuizReadyPyq = (record: PyqRecord): boolean =>
  (!("integrityFlags" in (record as Record<string, unknown>)) ||
    !Array.isArray((record as Record<string, unknown>).integrityFlags) ||
    ((record as Record<string, unknown>).integrityFlags as unknown[]).length === 0) &&
  record.question.trim().length >= 12 &&
  /[a-zA-Z]/.test(record.question) &&
  Array.isArray(record.options) &&
  record.options.length === 4 &&
  record.options.every((opt) => opt.trim().length > 0) &&
  record.answer.trim().length > 0 &&
  record.options.some((opt) => opt.trim().toLowerCase() === record.answer.trim().toLowerCase());
