export type PyqRecord = {
  id: string;
  exam: string;
  year: number | null;
  subject: string;
  subCategory: string;
  topic: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  source: string;
  verified: boolean;
  tags: string[];
  answerSource?: string;
};

export type SubjectChunkIndex = {
  subject: string;
  file: string;
  count: number;
};
