import { ClaimData, icdCptMapping, Issue } from "./demoData";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock");

export async function processClaim(claim: ClaimData): Promise<{ issues: Issue[], riskScore: number }> {
  // In a real scenario, LLM would extract fields from text first.
  // We simulate the Engine layers here.
  
  const issues: Issue[] = [];
  
  // 1. Rules Engine: Pre-auth check
  if (!claim.preAuthObtained && claim.totalAmount > 100000) {
    issues.push({
      id: "err-preauth",
      type: "Missing Info",
      severity: "High",
      evidence: "No pre-authorization document found for procedure > ₹1L.",
      fix: "Attach Pre-Auth Approval",
      rupeesAtRisk: claim.totalAmount
    });
  }

  // 2. Rules Engine: Date logic
  if (new Date(claim.procedureDate) < new Date(claim.admissionDate)) {
    issues.push({
      id: "err-date",
      type: "Date Error",
      severity: "High",
      evidence: `Procedure date (${claim.procedureDate}) is before admission date (${claim.admissionDate}).`,
      fix: "Correct Procedure Date to match hospital records",
      rupeesAtRisk: claim.totalAmount * 0.5 // Partial risk
    });
  }

  // 3. Rules Engine: Code compatibility
  const validCptCodes = icdCptMapping[claim.diagnosisCode] || [];
  if (validCptCodes.length > 0 && !validCptCodes.includes(claim.procedureCode)) {
    issues.push({
      id: "err-code",
      type: "Code Conflict",
      severity: "High",
      evidence: `Procedure CPT ${claim.procedureCode} does not match Diagnosis ICD-10 ${claim.diagnosisCode}.`,
      fix: "Update CPT to match Diagnosis (e.g. 31256)",
      rupeesAtRisk: claim.totalAmount * 0.8
    });
  }

  // Calculate Risk Score
  let riskScore = 0;
  issues.forEach(i => {
    if (i.severity === "High") riskScore += 30;
    if (i.severity === "Medium") riskScore += 15;
    if (i.severity === "Low") riskScore += 5;
  });
  
  riskScore = Math.min(100, riskScore + (issues.length > 0 ? 10 : 0)); // base risk if issues

  return { issues, riskScore };
}

export async function generateAppeal(claim: ClaimData): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return `[DRAFT APPEAL]
Date: ${new Date().toLocaleDateString()}
To: ${claim.insurer} Appeals Department
Subject: Appeal for Denied Claim ${claim.id} - Patient: ${claim.patientName}

Dear Claims Reviewer,

I am writing to formally appeal the denial of claim ${claim.id}. The claim was denied stating "not medically necessary".
However, based on the attached medical records and discharge summary, the procedure ${claim.procedureCode} was clinically indicated for diagnosis ${claim.diagnosisCode}.

Please review the attached evidence. We request a prompt reprocessing and payment of ₹${claim.totalAmount}.

Sincerely,
ClaimGuard Automated Appeal System`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Write a formal appeal letter for a denied insurance claim.
    Claim ID: ${claim.id}
    Patient: ${claim.patientName}
    Insurer: ${claim.insurer}
    Diagnosis: ${claim.diagnosisCode}
    Procedure: ${claim.procedureCode}
    Amount: ₹${claim.totalAmount}
    Reason for denial from notes: ${claim.documentsText}
    Make it professional, cite the evidence, and request reprocessing. Output plain text.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    // Fallback if API fails
    return `[FALLBACK DRAFT APPEAL]
Date: ${new Date().toLocaleDateString()}
To: ${claim.insurer} Appeals Department
Subject: Appeal for Denied Claim ${claim.id} - Patient: ${claim.patientName}

Dear Claims Reviewer,

I am writing to formally appeal the denial of claim ${claim.id}. The claim was denied.
However, based on the attached medical records and discharge summary, the procedure ${claim.procedureCode} was clinically indicated for diagnosis ${claim.diagnosisCode}.

Please review the attached evidence. We request a prompt reprocessing and payment of ₹${claim.totalAmount}.

Sincerely,
ClaimGuard Automated Appeal System`;
  }
}
