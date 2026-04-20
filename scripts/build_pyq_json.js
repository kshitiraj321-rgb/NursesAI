const fs = require('fs');
const path = require('path');

const extractedPath = path.join(__dirname, '../scratch/extracted_pyqs.json');
const outputPath = path.join(__dirname, '../data/pyqData.json');

// Existing manual data
const manualData = [
  {
    id: "n20_q1",
    question: "A nurse is preparing to give a bath to an admitted patient with a perineal problem. Which of the following will help the patient?",
    options: ["Bed bath", "Therapeutic bath", "Self-bath with minimal help", "None of the above"],
    answer: "Therapeutic bath",
    subject: "Fundamentals of Nursing",
    topic: "Hygiene and Patient Care",
    year: 2020,
    type: "PYQ"
  },
  {
    id: "n20_q2",
    question: "In the absence of a nurse on the floor, a patient falls from the bed. This type of injury belongs to:",
    options: ["Battery", "Negligence", "Tort", "None of the above"],
    answer: "Negligence",
    subject: "Nursing Ethics and Law",
    topic: "Legal Issues in Nursing",
    year: 2020,
    type: "PYQ"
  },
  {
    id: "n20_q3",
    question: "The responsibility of maintaining a patient & medical record lies with:",
    options: ["Patient", "Director", "Treating doctor", "Medical superintendent"],
    answer: "Medical superintendent",
    subject: "Nursing Administration",
    topic: "Medical Records Management",
    year: 2020,
    type: "PYQ"
  },
  {
    id: "n20_q4",
    question: "Postpartum bleeding after 24 hours of delivery is known as:",
    options: ["Primary PPH", "Secondary PPH", "Third stage hemorrhage", "True postpartum hemorrhage"],
    answer: "Secondary PPH",
    subject: "Obstetrics and Gynecological Nursing",
    topic: "Postpartum Complications",
    year: 2020,
    type: "PYQ"
  },
  {
    id: "n20_q5",
    question: "A woman with 3rd-day postpartum complains of breast engorgement. What is the cutoff temperature for fever in postpartum women?",
    options: ["37°C", "38°C", "39°C", "34°C"],
    answer: "38°C",
    subject: "Obstetrics and Gycategories ynecological Nursing",
    topic: "Postpartum Care",
    year: 2020,
    type: "PYQ"
  }
];

function categorize(questionText, optionsText, solutionText) {
  const text = (questionText + " " + optionsText + " " + solutionText).toLowerCase();
  
  // Categorization Rules
  if (text.includes("cardiology") || text.includes("ecg") || text.includes("myocardial infarction") || text.includes("heart")) {
    return { subject: "Medical-Surgical Nursing", topic: "Cardiology" };
  }
  if (text.includes("vital signs") || text.includes("blood pressure") || text.includes("temperature") || text.includes("pulse")) {
    return { subject: "Fundamentals of Nursing", topic: "Vital Signs" };
  }
  if (text.includes("pph") || text.includes("postpartum") || text.includes("pregnancy") || text.includes("uterus") || text.includes("placenta")) {
    return { subject: "Obstetrics and Gynecological Nursing", topic: "Postpartum/Obstetrics" };
  }
  if (text.includes("drug") || text.includes("dose") || text.includes("pharmacology") || text.includes("injection") || text.includes("mg ")) {
    return { subject: "Pharmacology", topic: "Drugs" };
  }
  if (text.includes("child") || text.includes("infant") || text.includes("pediatric") || text.includes("toddler") || text.includes("neonate")) {
    return { subject: "Pediatric Nursing", topic: "Child Care" };
  }
  if (text.includes("psychiatric") || text.includes("schizophrenia") || text.includes("depression") || text.includes("mental")) {
    return { subject: "Psychiatric and Mental Health Nursing", topic: "Mental Health" };
  }
  if (text.includes("community") || text.includes("vaccine") || text.includes("immunization") || text.includes("epidemiology")) {
    return { subject: "Community Health Nursing", topic: "Community Health" };
  }
  if (text.includes("anatomy") || text.includes("bone") || text.includes("muscle") || text.includes("nerve") || text.includes("physiology")) {
    return { subject: "Anatomy and Physiology", topic: "Anatomy" };
  }
  
  return { subject: "General Nursing", topic: "General" };
}

function run() {
  if (!fs.existsSync(extractedPath)) {
    console.error("Extracted PYQs file not found");
    return;
  }
  const extracted = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));
  
  const finalDataMap = new Map();
  
  // Add extracted data
  extracted.forEach(item => {
    // apply categorization
    const cats = categorize(item.question, item.options.join(" "), item.solution || "");
    const processedItem = {
      id: item.id,
      question: item.question,
      options: item.options,
      answer: item.answer,
      subject: cats.subject,
      topic: cats.topic,
      year: item.year,
      type: "PYQ", // Must be PYQ format
      explanation: item.solution || ""
    };
    finalDataMap.set(processedItem.question, processedItem); // use question as key to prevent duplicates
  });
  
  // Add manual data (overwrites if duplicate question exists)
  manualData.forEach(item => {
    finalDataMap.set(item.question, {
      ...item,
      // Normalize to ensure same standard structure if needed
      type: "PYQ"
    });
  });
  
  const finalArray = Array.from(finalDataMap.values());
  // Sort by year, descending, then id
  finalArray.sort((a, b) => b.year - a.year || a.id.localeCompare(b.id));

  // Write to data/pyqData.json
  fs.writeFileSync(outputPath, JSON.stringify(finalArray, null, 2));
  console.log(`Successfully generated pyqData.json with ${finalArray.length} items`);
}

run();
