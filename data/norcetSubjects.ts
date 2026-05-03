export type SubCategory = {
  id: string;
  name: string;
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

const sub = (id: string, name: string): SubCategory => ({ id, name });

export const norcetSubjectGroups: SubjectGroup[] = [
  {
    title: "High Weightage Subjects",
    type: "high_weightage",
    subjects: [
      { id: "medical-surgical-nursing", name: "Medical-Surgical Nursing", weightage: "30-45%", subCategories: [sub("ms-cardiovascular", "Cardiovascular"), sub("ms-respiratory", "Respiratory"), sub("ms-renal", "Renal"), sub("ms-neurology", "Neurology"), sub("ms-endocrine", "Endocrine"), sub("ms-gi", "GI"), sub("ms-emergency", "Emergency"), sub("ms-oncology", "Oncology")] },
      { id: "fundamentals-of-nursing", name: "Fundamentals of Nursing", weightage: "15-25%", subCategories: [sub("fn-infection-control", "Infection Control"), sub("fn-nursing-procedures", "Nursing Procedures"), sub("fn-patient-safety", "Patient Safety"), sub("fn-vital-signs", "Vital Signs"), sub("fn-cpr-bls", "CPR/BLS"), sub("fn-communication", "Communication")] },
      { id: "obstetrics-gynaecology", name: "Obstetrics & Gynaecology", weightage: "12-20%", subCategories: [sub("obg-antenatal", "Antenatal"), sub("obg-labour", "Labour"), sub("obg-complications", "Complications"), sub("obg-newborn-care", "Newborn Care"), sub("obg-family-planning", "Family Planning")] },
      { id: "pediatric-nursing", name: "Pediatric Nursing", weightage: "8-12%", subCategories: [sub("ped-growth-development", "Growth Development"), sub("ped-neonatal", "Neonatal"), sub("ped-diseases", "Diseases"), sub("ped-immunization", "Immunization")] },
      { id: "community-health-nursing", name: "Community Health Nursing", weightage: "10-12%", subCategories: [sub("chn-epidemiology", "Epidemiology"), sub("chn-national-programs", "National Programs"), sub("chn-prevention", "Prevention"), sub("chn-demography", "Demography")] },
    ],
  },
  {
    title: "Supporting Subjects",
    type: "supporting",
    subjects: [
      { id: "pharmacology", name: "Pharmacology", weightage: "6-10%", subCategories: [sub("ph-emergency-drugs", "Emergency Drugs"), sub("ph-antibiotics", "Antibiotics"), sub("ph-endocrine-drugs", "Endocrine Drugs"), sub("ph-cvs-drugs", "CVS Drugs"), sub("ph-calculations", "Calculations"), sub("ph-antidotes", "Antidotes")] },
      { id: "psychiatric-nursing", name: "Psychiatric Nursing", weightage: "4-6%", subCategories: [sub("psy-disorders", "Disorders"), sub("psy-communication", "Communication"), sub("psy-therapies", "Therapies"), sub("psy-mental-health-acts", "Mental Health Acts")] },
      { id: "nursing-management", name: "Nursing Management", weightage: "3-5%", subCategories: [sub("nm-leadership", "Leadership"), sub("nm-administration", "Administration"), sub("nm-budgeting", "Budgeting"), sub("nm-research", "Research"), sub("nm-statistics", "Statistics")] },
      { id: "anatomy", name: "Anatomy", weightage: "2-4%", subCategories: [sub("an-bones", "Bones"), sub("an-cns", "CNS"), sub("an-cvs", "CVS"), sub("an-respiratory", "Respiratory"), sub("an-abdomen", "Abdomen")] },
      { id: "physiology", name: "Physiology", weightage: "2-4%", subCategories: [sub("phy-blood", "Blood"), sub("phy-renal", "Renal"), sub("phy-endocrine", "Endocrine"), sub("phy-neuro", "Neuro"), sub("phy-reproductive", "Reproductive")] },
      { id: "nutrition", name: "Nutrition", weightage: "2-4%", subCategories: [sub("nu-vitamins", "Vitamins"), sub("nu-deficiency", "Deficiency"), sub("nu-therapeutic-diet", "Therapeutic Diet"), sub("nu-macronutrients", "Macronutrients")] },
      { id: "microbiology", name: "Microbiology", weightage: "2-4%", subCategories: [sub("mb-organisms", "Organisms"), sub("mb-sterilization", "Sterilization"), sub("mb-immunology", "Immunology"), sub("mb-infections", "Infections")] },
      { id: "general-aptitude", name: "General Aptitude", weightage: "Varies", subCategories: [sub("ga-reasoning", "Reasoning"), sub("ga-quant", "Quant"), sub("ga-gk", "GK"), sub("ga-current-affairs", "Current Affairs")] },
    ],
  },
];

export type NorcetSubjectName = (typeof norcetSubjectGroups)[number]["subjects"][number]["name"];
