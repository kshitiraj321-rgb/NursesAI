// Simple, fast string hash function (cyrb53)
// Generates a stable 53-bit integer hash from a string, which we then convert to a base36 string.
// This is perfect for stable document IDs that won't collide for the same question text.

export const cyrb53 = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const generateMistakeId = (topic: string, question: string) => {
  const safeTopic = (topic || "general").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const hash = cyrb53(question).toString(36);
  return `${safeTopic}_${hash}`;
};
