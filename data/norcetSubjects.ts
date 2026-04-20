export type Topic = {
  id: string;
  name: string;
};

export type SubCategory = {
  id: string;
  name: string;
  topics: Topic[];
};

export type Subject = {
  id: string;
  name: string;
  weightage: string;
  subCategories: SubCategory[];
};

export type SubjectGroup = {
  title: string;
  type: "high_weightage" | "supporting";
  subjects: Subject[];
};

export const norcetSubjectGroups: SubjectGroup[] = [
  {
    title: "🔥 High Weightage Subjects",
    type: "high_weightage",
    subjects: [
      {
        id: "msn",
        name: "Medical-Surgical Nursing",
        weightage: "30–45%",
        subCategories: [
          {
            id: "cardio",
            name: "Cardiovascular",
            topics: [
              { id: "ecg", name: "ECG" },
              { id: "mi", name: "Myocardial Infarction (MI)" },
              { id: "hf", name: "Heart Failure" },
            ],
          },
          {
            id: "resp",
            name: "Respiratory",
            topics: [
              { id: "abg", name: "ABG Analysis" },
              { id: "vent", name: "Ventilator Settings" },
              { id: "copd", name: "COPD" },
            ],
          },
          {
            id: "renal",
            name: "Renal",
            topics: [
              { id: "dialysis", name: "Dialysis" },
              { id: "fluid", name: "Fluid & Electrolyte Balance" },
            ],
          },
          {
            id: "neuro",
            name: "Neurology",
            topics: [
              { id: "gcs", name: "GCS" },
              { id: "stroke", name: "Stroke" },
              { id: "icp", name: "Increased ICP" },
            ],
          },
        ],
      },
      {
        id: "fundamentals",
        name: "Fundamentals of Nursing",
        weightage: "15–25%",
        subCategories: [
          {
            id: "infection",
            name: "Infection Control",
            topics: [
              { id: "bmw", name: "BMW (Bio-Medical Waste)" },
              { id: "hw", name: "Handwashing" },
              { id: "ppe", name: "PPE" },
            ],
          },
          {
            id: "general_fundamentals",
            name: "General",
            topics: [
              { id: "vitals", name: "Vital Signs Interpretation" },
              { id: "adpie", name: "Nursing Process (ADPIE)" },
              { id: "position", name: "Patient Positioning" },
              { id: "cpr", name: "CPR / BLS" },
            ],
          },
        ],
      },
      {
        id: "obgyn",
        name: "Obstetrics & Gynaecology",
        weightage: "12–20%",
        subCategories: [
          {
            id: "general_obgyn",
            name: "General",
            topics: [
              { id: "labour", name: "Stages of Labour" },
              { id: "family_planning", name: "Family Planning Methods" },
            ],
          },
          {
            id: "complications",
            name: "Complications",
            topics: [
              { id: "pph", name: "PPH" },
              { id: "eclampsia", name: "Eclampsia" },
              { id: "abruptio", name: "Abruptio Placentae" },
            ],
          },
          {
            id: "newborn",
            name: "Newborn Care",
            topics: [
              { id: "apgar", name: "APGAR Score" },
              { id: "np_resuscitation", name: "Resuscitation" },
            ],
          },
        ],
      },
      {
        id: "pediatric",
        name: "Pediatric Nursing",
        weightage: "8–12%",
        subCategories: [
          {
            id: "gen_pediatrics",
            name: "General",
            topics: [
              { id: "growth", name: "Growth & Development" },
              { id: "immunization", name: "Immunization Schedule" },
              { id: "neo_emergencies", name: "Neonatal Emergencies" },
            ],
          },
          {
            id: "diseases",
            name: "Diseases",
            topics: [
              { id: "diarrhea", name: "Diarrhea (ORS/Dehydration)" },
              { id: "pneumonia", name: "Pneumonia" },
            ],
          },
        ],
      },
      {
        id: "community",
        name: "Community Health Nursing",
        weightage: "10–12%",
        subCategories: [
          {
            id: "gen_community",
            name: "General",
            topics: [
              { id: "national", name: "National Health Programs" },
              { id: "epi", name: "Epidemiology Basics" },
              { id: "prevention", name: "Levels of Prevention" },
              { id: "indicators", name: "Health Indicators (IMR, MMR)" },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "⚡ Supporting Subjects",
    type: "supporting",
    subjects: [
      {
        id: "pharma",
        name: "Pharmacology",
        weightage: "8–10%",
        subCategories: [
          {
            id: "emergency",
            name: "Emergency Drugs",
            topics: [
              { id: "adrenaline", name: "Adrenaline" },
              { id: "atropine", name: "Atropine" },
              { id: "digoxin", name: "Digoxin" },
            ],
          },
          {
            id: "antidotes",
            name: "Antidotes",
            topics: [
              { id: "heparin", name: "Heparin / Warfarin" },
              { id: "insulin", name: "Insulin" },
            ],
          },
          {
            id: "math",
            name: "Calculations",
            topics: [
              { id: "dose", name: "Drug Dose Calculations" },
            ],
          },
        ],
      },
      {
        id: "psych",
        name: "Psychiatric Nursing",
        weightage: "4–6%",
        subCategories: [
          {
            id: "gen_psych",
            name: "General",
            topics: [
              { id: "comm", name: "Therapeutic Communication" },
              { id: "schizo", name: "Schizophrenia" },
              { id: "mood", name: "Mood Disorders" },
              { id: "acts", name: "Mental Health Acts" },
            ],
          },
        ],
      },
      {
        id: "aptitude",
        name: "General Aptitude",
        weightage: "Varies",
        subCategories: [
          {
            id: "gen_aptitude",
            name: "General Category",
            topics: [
              { id: "news", name: "Health News (AIIMS/WHO)" },
              { id: "logical", name: "Logical Reasoning" },
              { id: "quant", name: "Quantitative Aptitude" },
            ],
          },
        ],
      },
    ],
  },
];
