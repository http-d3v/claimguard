"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Copy, RefreshCw, Send } from "lucide-react";
import { demoClaims, ClaimData } from "@/lib/demoData";
import { generateAppeal } from "@/lib/engine";

export default function AppealsPage() {
  const [claim, setClaim] = useState<ClaimData>(demoClaims["demo-denied"]);
  const [appealText, setAppealText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleDraft = async () => {
    setIsGenerating(true);
    const result = await generateAppeal(claim);
    setAppealText(result);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(appealText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Automated Appeals</h1>
          <p className="opacity-80">Generate evidence-backed appeal letters for denied claims instantly.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Claim Details */}
        <div className="col-span-1 space-y-4">
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5" /> Denied Claim</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/20 pb-2">
                <span className="opacity-70">ID</span>
                <span className="font-medium">{claim.id}</span>
              </div>
              <div className="flex justify-between border-b border-white/20 pb-2">
                <span className="opacity-70">Patient</span>
                <span className="font-medium">{claim.patientName}</span>
              </div>
              <div className="flex justify-between border-b border-white/20 pb-2">
                <span className="opacity-70">Insurer</span>
                <span className="font-medium">{claim.insurer}</span>
              </div>
              <div className="flex justify-between border-b border-white/20 pb-2">
                <span className="opacity-70">Amount</span>
                <span className="font-medium text-error">₹{claim.totalAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="opacity-70 block mb-1">Denial Reason</span>
                <p className="bg-error/10 text-error p-3 rounded-xl border border-error/20">
                  Not medically necessary in inpatient setting.
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleDraft}
              disabled={isGenerating}
              className="w-full mt-6 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
              {isGenerating ? "Drafting..." : "Draft Appeal"}
            </button>
          </div>
        </div>

        {/* Appeal Editor */}
        <div className="col-span-2">
          <div className="glass-card p-6 rounded-3xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Appeal Letter</h3>
              {appealText && (
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors tooltip relative group">
                    {isCopied ? <span className="text-success text-sm font-medium px-2">Copied!</span> : <Copy className="w-5 h-5 opacity-70 group-hover:opacity-100" />}
                  </button>
                  <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors tooltip group">
                    <Download className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                  </button>
                </div>
              )}
            </div>
            
            {appealText ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-grow flex flex-col gap-4">
                <textarea 
                  value={appealText}
                  onChange={(e) => setAppealText(e.target.value)}
                  className="flex-grow w-full bg-white/40 dark:bg-black/20 rounded-2xl p-4 border border-white/30 dark:border-white/10 outline-none focus:border-primary font-mono text-sm resize-none"
                />
                <button className="bg-success hover:bg-green-500 text-white py-3 px-6 rounded-full font-bold self-end flex items-center gap-2 shadow-lg transition-colors">
                  <Send className="w-4 h-4" /> Submit Appeal to {claim.insurer}
                </button>
              </motion.div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center opacity-50 border-2 border-dashed border-white/20 rounded-2xl p-8">
                <FileText className="w-12 h-12 mb-4" />
                <p>Click "Draft Appeal" to generate a letter based on the claim evidence.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
