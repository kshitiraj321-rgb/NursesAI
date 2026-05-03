const fs = require('fs');
const path = require('path');

const chunksDir = path.join(__dirname, '../data/pyq/chunks');
const manifestPath = path.join(__dirname, '../data/pyq/manifest.json');
const reportPath = path.join(__dirname, '../data/pyq/quality-report.json');

const hasCorruptedOptions = (record) => {
  if (!Array.isArray(record.options)) return true;
  
  for (const opt of record.options) {
    if (!opt) continue;
    const str = String(opt);
    
    // Check for question bleeding into options
    if (str.includes('?')) return true;
    
    // Check for page number bleeding
    if (/Page \d+/i.test(str)) return true;
    
    // Check for extremely long options which usually indicate parsing failure
    if (str.length > 200) return true;
  }
  
  return false;
};

try {
  let totalCorruptedFound = 0;
  let totalRecords = 0;
  let safeRecords = 0;
  
  const files = fs.readdirSync(chunksDir).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const filePath = path.join(chunksDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    let modified = false;
    
    for (const record of data) {
      totalRecords++;
      
      const isCorrupt = hasCorruptedOptions(record);
      
      if (!record.integrityFlags) {
        record.integrityFlags = [];
        modified = true;
      }
      
      if (isCorrupt && !record.integrityFlags.includes('corrupted_options')) {
        record.integrityFlags.push('corrupted_options');
        totalCorruptedFound++;
        modified = true;
      }
      
      // Calculate safe records (mirroring the UI logic)
      if (record.integrityFlags.length === 0 && 
          record.question.trim().length >= 12 &&
          Array.isArray(record.options) && record.options.length === 4 &&
          record.answer.trim().length > 0 &&
          record.options.some(opt => opt.trim().toLowerCase() === record.answer.trim().toLowerCase())) {
        safeRecords++;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Sanitized ${file}`);
    }
  }
  
  console.log(`\nSanitization Complete!`);
  console.log(`Total Records Processed: ${totalRecords}`);
  console.log(`New Corrupted Records Quarantined: ${totalCorruptedFound}`);
  console.log(`Remaining Safe Records for UI: ${safeRecords}`);
  
  // Update the quality report
  if (fs.existsSync(reportPath)) {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    report.safeQuizRecords = safeRecords;
    report.quarantinedRecords = totalRecords - safeRecords;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`✅ Updated quality-report.json`);
  }
  
} catch (e) {
  console.error('Error during sanitization:', e);
}
