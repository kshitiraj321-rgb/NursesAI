const fs = require('fs');
const path = require('path');

const notesPath = path.join(__dirname, '../data/quickLearnNotes.json');
const indexPath = path.join(__dirname, '../data/quickLearnIndex.json');

try {
  const data = JSON.parse(fs.readFileSync(notesPath, 'utf-8'));
  const index = {};
  
  if (data.subjects && Array.isArray(data.subjects)) {
    for (const s of data.subjects) {
      if (s.subject && Array.isArray(s.topics)) {
        for (const t of s.topics) {
          if (t.topic) {
            const count = Array.isArray(t.notes) ? t.notes.length : 0;
            // Store by Subject|Category for accurate lookup
            index[`${s.subject}|${t.topic.toLowerCase()}`] = count;
          }
        }
      }
    }
  }

  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log('✅ Generated quickLearnIndex.json successfully.');
} catch (e) {
  console.error('Error generating notes index:', e);
}
