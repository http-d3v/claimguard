"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { UploadCloud, AlertCircle, CheckCircle2, ChevronRight, Check } from "lucide-react";
import Mascot from "@/components/Mascot";
import { demoClaims, ClaimData, Issue } from "@/lib/demoData";
import { processClaim } from "@/lib/engine";

export default function CheckClaimPage() {
  const [claim, setClaim] = useState<ClaimData | null>(null);
  const [status, setStatus] = useState<"idle" | "scanning" | "results" | "success">("idle");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [riskScore, setRiskScore] = useState(0);

  const handleLoadDemo = async () => {
    setClaim(demoClaims["demo-error"]);
    setStatus("scanning");
    
    // Simulate scanning delay
    setTimeout(async () => {
      const result = await processClaim(demoClaims["demo-error"]);
      setIssues(result.issues);
      setRiskScore(result.riskScore);
      setStatus("results");
    }, 2500);
  };

  const applyFix = (id: string) => {
    const updatedIssues = issues.filter(i => i.id !== id);
    setIssues(updatedIssues);
    
    // Recalculate risk
    let newRisk = 0;
    updatedIssues.forEach(i => {
      if (i.severity === "High") newRisk += 30;
      if (i.severity === "Medium") newRisk += 15;
      if (i.severity === "Low") newRisk += 5;
    });
    newRisk = Math.min(100, newRisk + (updatedIssues.length > 0 ? 10 : 0));
    setRiskScore(newRisk);

    if (updatedIssues.length === 0) {
      setStatus("success");
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center py-10">
      
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full text-center">
            <Mascot state="idle" className="mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4 text-primary-dark dark:text-primary-light">Verify claims before submission</h1>
            <p className="text-lg opacity-80 mb-8 max-w-lg mx-auto">Drop your discharge summary, bill, and policy docs to let Clay sniff out errors.</p>
            
            <div className="glass-card p-12 rounded-3xl border-dashed border-2 border-primary-light hover:border-primary transition-colors cursor-pointer group">
              <UploadCloud className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <p className="font-medium mb-2">Drag & drop files here</p>
              <p className="text-sm opacity-60 mb-6">PDF, JPG, PNG up to 10MB</p>
              <button 
                onClick={handleLoadDemo}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-medium transition-colors shadow-lg"
              >
                Load demo claim
              </button>
            </div>
          </motion.div>
        )}

        {status === "scanning" && (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
            <Mascot state="scanning" className="mx-auto mb-8" />
            <h2 className="text-2xl font-bold animate-pulse text-primary-dark">Clay is reading the documents...</h2>
            <div className="flex gap-2 mt-4">
              <span className="w-3 h-3 bg-primary rounded-full animate-bounce"></span>
              <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
              <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
            </div>
          </motion.div>
        )}

        {(status === "results" || status === "success") && claim && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
            <div className="flex items-center gap-6 mb-8">
              <Mascot state={status === "success" ? "success" : "error"} className="w-24 h-24" />
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {status === "success" ? "All clean! Ready to submit." : `Found ${issues.length} sneaky errors 🔍`}
                </h2>
                <p className="opacity-80">Claim {claim.id} • {claim.patientName} • {claim.insurer}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center col-span-1">
                <p className="text-sm font-medium mb-2 opacity-80">Risk Score</p>
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="12" className="opacity-10" />
                    <motion.circle 
                      cx="64" cy="64" r="56" fill="none" 
                      stroke={riskScore > 60 ? "#FF8A8A" : riskScore > 30 ? "#FFC8A2" : "#76E5B1"} 
                      strokeWidth="12" strokeDasharray="351.8" 
                      initial={{ strokeDashoffset: 351.8 }}
                      animate={{ strokeDashoffset: 351.8 - (351.8 * riskScore) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute text-4xl font-bold">{Math.round(riskScore)}</div>
                </div>
              </div>

              <div className="col-span-2 space-y-4">
                <AnimatePresence>
                  {issues.map((issue) => (
                    <motion.div 
                      key={issue.id}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="glass-card p-4 rounded-2xl flex items-start gap-4 border-l-4"
                      style={{ borderLeftColor: issue.severity === "High" ? "#FF8A8A" : "#FFC8A2" }}
                    >
                      <AlertCircle className="w-6 h-6 shrink-0" style={{ color: issue.severity === "High" ? "#FF8A8A" : "#FFC8A2" }} />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">{issue.type}</span>
                        </div>
                        <p className="font-medium mb-1">{issue.evidence}</p>
                        <p className="text-sm opacity-70 mb-3 text-red-500 font-semibold">₹{(issue.rupeesAtRisk).toLocaleString('en-IN')} at risk</p>
                        <button 
                          onClick={() => applyFix(issue.id)}
                          className="flex items-center gap-1 text-sm bg-primary/10 hover:bg-primary/20 text-primary-dark dark:text-primary-light px-3 py-1.5 rounded-lg transition-colors font-medium"
                        >
                          <Check className="w-4 h-4" /> Apply fix: {issue.fix}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {status === "success" && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 rounded-3xl bg-success/10 border-success/30 text-center col-span-2 h-full flex flex-col items-center justify-center">
                      <CheckCircle2 className="w-16 h-16 text-success mb-4" />
                      <h3 className="text-2xl font-bold text-success mb-2">₹4.2 lakh saved!</h3>
                      <p className="opacity-80">Risk dropped to {riskScore}. This claim is now optimized for approval.</p>
                      <button className="mt-6 bg-success hover:bg-green-500 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg transition-colors">
                        Submit Claim <ChevronRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
