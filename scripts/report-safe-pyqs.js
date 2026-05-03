const fs = require('fs');
const path = require('path');

const chunksDir = path.join(__dirname, '../data/pyq/chunks');
const reportJsonPath = path.join(__dirname, '../data/pyq/safe-report.json');
const reportMdPath = path.join(__dirname, '../data/pyq/safe-report.md');

const isQuizReadyPyq = (record) => {
  if (record.integrityFlags && Array.isArray(record.integrityFlags) && record.integrityFlags.length > 0) return false;
  if (!record.question || record.question.trim().length < 12) return false;
  if (!/[a-zA-Z]/.test(record.question)) return false;
  if (!Array.isArray(record.options) || record.options.length !== 4) return false;
  if (!record.options.every(opt => typeof opt === 'string' && opt.trim().length > 0)) return false;
  if (!record.answer || record.answer.trim().length === 0) return false;
  if (!record.options.some(opt => opt.trim().toLowerCase() === record.answer.trim().toLowerCase())) return false;
  return true;
};

const run = () => {
  if (!fs.existsSync(chunksDir)) {
    console.error("Chunks directory not found");
    return;
  }

  const files = fs.readdirSync(chunksDir).filter(f => f.endsWith('.json'));
  const stats = {};
  let totalAll = 0;
  let safeAll = 0;
  
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(chunksDir, file), 'utf-8'));
    let subjectTotal = data.length;
    let subjectSafe = 0;
    
    let subjectName = file.replace('.json', '');
    
    for (const record of data) {
      if (isQuizReadyPyq(record)) {
        subjectSafe++;
      }
      subjectName = record.subject || subjectName; // capture real subject name
    }
    
    stats[subjectName] = {
      total: subjectTotal,
      safe: subjectSafe,
      quarantined: subjectTotal - subjectSafe,
      safePercentage: subjectTotal > 0 ? ((subjectSafe / subjectTotal) * 100).toFixed(2) + '%' : '0%'
    };
    
    totalAll += subjectTotal;
    safeAll += subjectSafe;
  }
  
  const finalReport = {
    overview: {
      totalRecords: totalAll,
      totalSafe: safeAll,
      totalQuarantined: totalAll - safeAll,
      safePercentage: totalAll > 0 ? ((safeAll / totalAll) * 100).toFixed(2) + '%' : '0%',
      quarantinedPercentage: totalAll > 0 ? (((totalAll - safeAll) / totalAll) * 100).toFixed(2) + '%' : '0%'
    },
    bySubject: stats
  };
  
  fs.writeFileSync(reportJsonPath, JSON.stringify(finalReport, null, 2));
  
  let md = `# PYQ Safety Report\n\n`;
  md += `## Overview\n`;
  md += `- **Total Records:** ${finalReport.overview.totalRecords}\n`;
  md += `- **Total Safe:** ${finalReport.overview.totalSafe} (${finalReport.overview.safePercentage})\n`;
  md += `- **Total Quarantined:** ${finalReport.overview.totalQuarantined} (${finalReport.overview.quarantinedPercentage})\n\n`;
  
  md += `## Breakdown by Subject\n\n`;
  md += `| Subject | Total | Safe | Quarantined | Safe % |\n`;
  md += `|---|---|---|---|---|\n`;
  
  for (const [subj, data] of Object.entries(stats)) {
    md += `| ${subj} | ${data.total} | ${data.safe} | ${data.quarantined} | ${data.safePercentage} |\n`;
  }
  
  fs.writeFileSync(reportMdPath, md);
  console.log('✅ Generated report in data/pyq/safe-report.md and .json');
  console.log(JSON.stringify(finalReport.overview, null, 2));
};

run();
