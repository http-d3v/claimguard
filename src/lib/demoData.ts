export type Issue = {
  id: string;
  type: "Missing Info" | "Code Conflict" | "Date Error" | "Policy Violation";
  severity: "High" | "Medium" | "Low";
  evidence: string;
  fix: string;
  rupeesAtRisk: number;
};

export type ClaimData = {
  id: string;
  patientName: string;
  insurer: string;
  admissionDate: string;
  dischargeDate: string;
  diagnosisCode: string; // e.g. ICD-10
  procedureCode: string; // e.g. CPT
  procedureDate: string;
  preAuthObtained: boolean;
  totalAmount: number;
  documentsText: string;
};

export const demoClaims: Record<string, ClaimData> = {
  "demo-error": {
    id: "CLM-84920",
    patientName: "Aarav Sharma",
    insurer: "HealthCare Plus",
    admissionDate: "2023-10-15",
    dischargeDate: "2023-10-18",
    diagnosisCode: "J01.90", // Acute sinusitis
    procedureCode: "44140", // Colectomy (Mismatch!)
    procedureDate: "2023-10-14", // Before admission!
    preAuthObtained: false, // Missing pre-auth for major procedure
    totalAmount: 420000,
    documentsText: "Patient admitted on Oct 15. Procedure 44140 performed on Oct 14. Diagnosis: Acute sinusitis. No pre-auth note found.",
  },
  "demo-clean": {
    id: "CLM-99123",
    patientName: "Priya Patel",
    insurer: "LifeShield",
    admissionDate: "2023-11-01",
    dischargeDate: "2023-11-03",
    diagnosisCode: "K35.80", // Appendicitis
    procedureCode: "44950", // Appendectomy
    procedureDate: "2023-11-01",
    preAuthObtained: true,
    totalAmount: 150000,
    documentsText: "Emergency appendectomy performed. Pre-authorization approved.",
  },
  "demo-denied": {
    id: "CLM-77341",
    patientName: "Rahul Verma",
    insurer: "SecureMed",
    admissionDate: "2023-09-10",
    dischargeDate: "2023-09-12",
    diagnosisCode: "E11.9", // Type 2 diabetes
    procedureCode: "99214", // Office visit
    procedureDate: "2023-09-11",
    preAuthObtained: true,
    totalAmount: 25000,
    documentsText: "Routine checkup for diabetes management. Denied due to 'not medically necessary in inpatient setting'.",
  }
};

// Rules mapping
export const icdCptMapping: Record<string, string[]> = {
  "J01.90": ["31256", "31267"], // Sinus procedures
  "K35.80": ["44950", "44970"], // Appendectomy
  "E11.9": ["99213", "99214"], // Office visits
};

export const requiredDocsByInsurer: Record<string, string[]> = {
  "HealthCare Plus": ["discharge summary", "bill", "policy"],
  "LifeShield": ["discharge summary", "bill"],
  "SecureMed": ["discharge summary", "bill", "pre-auth note"],
};
