/**
 * NurseAI Product B — Knowledge Backbone Repository DAO
 *
 * Provides typed data access to Subjects, Topics, Concepts, and Mnemonics.
 *
 * Governance:
 * No Learn screen should directly consume legacy PYQ structures.
 * All access flows through this typed repository.
 */

import type { Subject, Topic, Concept, Mnemonic } from "../types/knowledge";

// Import pre-seeded typed JSON collections
import subjectsData from "./subjects.json";
import topicsData from "./topics.json";
import conceptsData from "./concepts.json";
import mnemonicsData from "./mnemonics.json";

const subjects: Subject[] = subjectsData as Subject[];
const topics: Topic[] = topicsData as Topic[];
const concepts: Concept[] = conceptsData as Concept[];
const mnemonics: Mnemonic[] = mnemonicsData as Mnemonic[];

export const knowledgeRepository = {
  /** Get all Subjects */
  getAllSubjects(): Subject[] {
    return subjects;
  },

  /** Get a Subject by ID */
  getSubjectById(id: string): Subject | undefined {
    return subjects.find((s) => s.id === id);
  },

  /** Get all Topics belonging to a Subject */
  getTopicsForSubject(subjectId: string): Topic[] {
    return topics.filter((t) => t.subjectId === subjectId);
  },

  /** Get a Topic by ID */
  getTopicById(id: string): Topic | undefined {
    return topics.find((t) => t.id === id);
  },

  /** Get all Concepts belonging to a Topic */
  getConceptsForTopic(topicId: string): Concept[] {
    return concepts.filter((c) => c.topicId === topicId);
  },

  /** Get a Concept by ID */
  getConceptById(id: string): Concept | undefined {
    return concepts.find((c) => c.id === id);
  },

  /** Get all Mnemonics for a Topic */
  getMnemonicsForTopic(topicId: string): Mnemonic[] {
    return mnemonics.filter((m) => m.topicId === topicId);
  },

  /** Get a Mnemonic by ID */
  getMnemonicById(id: string): Mnemonic | undefined {
    return mnemonics.find((m) => m.id === id);
  },
};
