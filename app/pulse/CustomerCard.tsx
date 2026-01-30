import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Building2, Cpu, TrendingUp, AlertTriangle, DollarSign, Users, RefreshCw, Activity, Zap, ShieldAlert, BarChart3, TrendingDown, Minus, Search, Brain, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useState, useEffect } from "react";
import { Customer } from "./data";
import { getTalentSuggestions, IntelligenceBrief } from "./talent-utils";

interface NewsData {
  headline: string;
  category: string;
  relevance: string;
  sentiment: "positive" | "neutral" | "negative";
  link?: string;
}

type WorkflowStep = 'idle' | 'generating_brief' | 'analyzing_needs' | 'matching_talent' | 'complete';

export function CustomerCard({ customer }: { customer: Customer }) {
  const [pulse, setPulse] = useState<NewsData | null>(null);
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>('idle');
  const [brief, setBrief] = useState<IntelligenceBrief | null>(null);
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);

  const [diagramSvg, setDiagramSvg] = useState<string | null>(null);

  const handleGenerateDiagram = async () => {
    setIsGeneratingDiagram(true);
    try {
      const response = await fetch("/api/pulse/generate-diagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, customer }),
      });

      const data = await response.json();
      if (data.svg) {
        setDiagramSvg(data.svg);
        setShowDiagram(true);
      }
    } catch (error) {
      // console.error("Diagram generation failed:", error); // Removed debugging console log
    } finally {
      setIsGeneratingDiagram(false);
    }
  };

  const runIntelligenceWorkflow = async () => {
    // Step 1: Generate Brief
    setWorkflowStep('generating_brief');

    try {
      // Call the comprehensive analysis API
      const res = await fetch("/api/pulse/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer }),
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();

      // Artificial delay for "Reading" effect
      await new Promise(resolve => setTimeout(resolve, 800));
      setPulse({
        headline: data.headline,
        category: data.category,
        relevance: data.strategy,
        sentiment: data.sentiment,
        link: data.link
      });

      // Step 2: Analyze Needs
      setWorkflowStep('analyzing_needs');
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: Match Talent
      setWorkflowStep('matching_talent');
      await new Promise(resolve => setTimeout(resolve, 600));

      setBrief(data); // The new API returns the full brief structure

      // Step 4: Complete
      setWorkflowStep('complete');

    } catch (e) {
      // console.error(e); // Removed debugging console log
      setWorkflowStep('idle'); // Reset on error
    }
  };

  // Determine icon based on category
  const getCategoryIcon = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case "funding": return <DollarSign size={14} />;
      case "leadership": return <Users size={14} />;
      case "risk": return <AlertTriangle size={14} />;
      case "expansion": return <TrendingUp size={14} />;
      default: return <Cpu size={14} />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "negative": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default: return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    }
  };

  const getStatusMessage = () => {
    switch (workflowStep) {
      case 'generating_brief': return "Generating Strategic Brief...";
      case 'analyzing_needs': return "Analyzing Key Requirements...";
      case 'matching_talent': return "Querying Talent Matrix...";
      default: return "Processing...";
    }
  };

  const getStatusIcon = () => {
    switch (workflowStep) {
      case 'generating_brief': return <Activity size={14} className="animate-pulse" />;
      case 'analyzing_needs': return <Search size={14} className="animate-bounce" />;
      case 'matching_talent': return <Brain size={14} className="animate-pulse" />;
      default: return <RefreshCw size={14} className="animate-spin" />;
    }
  };

  return (
    <GlassCard className="p-0 overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
      <div className="flex flex-col md:flex-row h-full">
        {/* Left Side: Account Info */}
        <div className="p-5 md:w-5/12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 bg-white/[0.02] relative overflow-hidden">
          {/* Subtle Branded Background */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1">
                <div className="text-[8px] font-black text-cyan-500/50 uppercase tracking-[0.3em] mb-1">OutcomeOS</div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-500 shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
                  <Building2 size={24} />
                </div>
              </div>

              {/* Risk Badge */}
              <div className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border flex items-center gap-1 ${customer.risk === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                customer.risk === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                {customer.risk === 'High' && <ShieldAlert size={10} />}
                {customer.risk} Risk
              </div>
            </div>

            <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors truncate">
              {customer.name}
            </h3>

            <p className="text-[10px] text-gray-500 font-mono mb-2 flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
              ID:
              <a
                href={`https://vector.lightning.force.com/lightning/r/Account/${customer.id}/view`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 hover:underline transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {customer.id}
              </a>
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Milestone</div>
                <div className="text-xs font-medium text-cyan-100">{customer.milestone}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Velocity</div>
                <div className={`text-xs font-medium flex items-center gap-1 ${customer.velocity === 'Increasing' ? 'text-green-400' :
                  customer.velocity === 'Decreasing' ? 'text-red-400' :
                    'text-gray-300'
                  }`}>
                  {customer.velocity === 'Increasing' && <TrendingUp size={12} />}
                  {customer.velocity === 'Decreasing' && <TrendingDown size={12} />}
                  {customer.velocity === 'Stable' && <Minus size={12} />}
                  {customer.velocity}
                </div>
              </div>
            </div>

            {/* Consumption Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Consumption Target</span>
                <span>{customer.consumption}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${customer.consumption > 80 ? 'bg-green-500' :
                    customer.consumption > 40 ? 'bg-cyan-500' : 'bg-amber-500'
                    }`}
                  style={{ width: `${customer.consumption}%` }}
                />
              </div>
            </div>

            {/* Blocker Alert */}
            {customer.blocker && (
              <div className="mt-4 p-2 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs text-red-200">
                  <span className="font-bold text-red-400">Blocker:</span> {customer.blocker}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Intelligence & Talent */}
        <div className="p-5 md:w-7/12 relative flex flex-col justify-between">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-l from-cyan-900/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Pulse Section */}
          <div className="relative z-10 mb-4 h-full flex flex-col">


            <div className="flex items-center justify-between mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                  <Activity size={14} className="text-cyan-500" />
                  <span>Intelligence Pulse</span>
                </div>
                {/* Live Indicator inside Pulse Header */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">OutcomeOS Engine</span>
                </div>
              </div>

              {/* Generate Brief Button - Relocated to Header */}
              {workflowStep === 'idle' && (
                <button
                  onClick={runIntelligenceWorkflow}
                  className="group relative px-4 py-1.5 rounded-full overflow-hidden transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 group-hover:from-cyan-500 group-hover:to-blue-500 transition-colors" />
                  <div className="relative flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                    <Zap size={12} className="fill-current" />
                    <span>Generate Brief</span>
                  </div>
                </button>
              )}
            </div>

            {/* Content Area */}
            <div className="grow relative min-h-[200px] flex flex-col">
              {workflowStep === 'idle' && (
                <div className="absolute inset-0 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center p-8 text-center group-hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-500 group-hover:text-cyan-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl">
                      <Brain size={32} className="stroke-[1.5]" />
                    </div>
                    {/* Animated rings around the icon */}
                    <div className="absolute -inset-2 rounded-2xl border border-cyan-500/20 animate-[ping_3s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" />
                  </div>

                  <span className="relative text-sm font-bold text-gray-300 tracking-tight mb-2">Knowledge Gap Detected</span>
                  <p className="relative text-[11px] text-gray-500 leading-relaxed max-w-[240px]">
                    Harness OutcomeOS Intelligence to synthesize signals and deploy specialized talent for <span className="text-cyan-400/80">{customer.name}</span>.
                  </p>
                </div>
              )}

              {workflowStep !== 'idle' && workflowStep !== 'complete' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-2 border-cyan-500/20 flex items-center justify-center">
                      <div className="text-cyan-400">
                        {getStatusIcon()}
                      </div>
                    </div>
                    {/* Spinning outer ring */}
                    <div className="absolute inset-0 rounded-full border-t-2 border-cyan-500 animate-spin" />
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest animate-pulse">
                      {getStatusMessage()}
                    </span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-cyan-500"
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {workflowStep === 'complete' && brief && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col h-full space-y-4"
                >
                  <div className="grow overflow-y-auto pr-2 custom-scrollbar space-y-5">
                    {/* WHAT Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">
                          <Activity size={12} />
                          <span>Strategic Intelligence</span>
                        </div>
                        {pulse && (
                          <div className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${getSentimentColor(pulse.sentiment)}`}>
                            {pulse.category}
                          </div>
                        )}
                      </div>
                      <div className="relative group/brief">
                        <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/20 to-transparent rounded-xl opacity-0 group-hover/brief:opacity-100 transition-opacity" />
                        <div className="relative bg-white/[0.03] border border-white/10 rounded-xl p-4 transition-all">
                          <h4 className="text-sm font-bold text-white mb-2 leading-tight">
                            {pulse?.link ? (
                              <a href={pulse.link} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                                {brief.headline}
                                <ArrowUpRight size={14} className="opacity-50" />
                              </a>
                            ) : brief.headline}
                          </h4>
                          <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                            {brief.context}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Talent Recommendation Section - HIGH IMPACT */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">
                          <Users size={12} />
                          <span>Recommended Talent</span>
                        </div>
                        <span className="text-[9px] font-bold text-purple-500/60 uppercase">Optimal Match Found</span>
                      </div>

                      <div className="space-y-3">
                        {brief.matches.map((match, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group/talent relative p-3 rounded-xl bg-gradient-to-r from-purple-500/[0.07] to-transparent border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300"
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative shrink-0">
                                {match.member.imageUrl ? (
                                  <img
                                    src={match.member.imageUrl}
                                    alt={match.member.name}
                                    className="w-10 h-10 rounded-full border-2 border-purple-500/20 object-cover group-hover/talent:border-purple-500/50 transition-colors"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-purple-900/30 border-2 border-purple-500/20 flex items-center justify-center text-purple-300 text-xs font-black">
                                    {match.member.name.charAt(0)}
                                  </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-black border border-purple-500/30 flex items-center justify-center">
                                  <CheckCircle2 size={10} className="text-purple-400" />
                                </div>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-xs font-bold text-white truncate">{match.member.name}</span>
                                  <span className="px-1 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[8px] font-black uppercase tracking-tighter border border-purple-500/20">
                                    {match.member.role.split(',')[0]}
                                  </span>
                                </div>
                                <p className="text-[10px] text-gray-400 leading-snug line-clamp-2 italic italic-purple-text">
                                  "{match.reason}"
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* WHY Section */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">
                        <Brain size={12} />
                        <span>Outcome Alignment Strategy</span>
                      </div>
                      <div className="p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/10 text-[11px] text-amber-100/70 leading-relaxed font-serif italic text-center">
                        "{brief.strategy}"
                      </div>
                    </div>

                    {/* HOW Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">
                        <CheckCircle2 size={12} />
                        <span>Deployment Roadmap</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {brief.actions.map((action, i) => (
                          <div key={i} className="flex gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/5 items-start">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500/40 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                            <span className="text-[10px] text-gray-400 font-medium leading-tight">{action}</span>
                          </div>
                        ))}
                      </div>

                      {/* Diagram Section */}
                      {!showDiagram ? (
                        <button
                          onClick={handleGenerateDiagram}
                          disabled={isGeneratingDiagram}
                          className="w-full mt-4 group/diagram relative px-4 py-3 rounded-xl overflow-hidden transition-all duration-300 active:scale-[0.98] border border-yellow-500/20 border-dashed hover:border-solid hover:border-yellow-500/40"
                        >
                          <div className="absolute inset-0 bg-yellow-500/[0.02] group-hover/diagram:bg-yellow-500/[0.05] transition-colors" />
                          <div className="relative flex items-center justify-center gap-3">
                            {isGeneratingDiagram ? (
                              <RefreshCw size={16} className="text-yellow-500 animate-spin" />
                            ) : (
                              <BarChart3 size={16} className="text-yellow-500 group-hover/diagram:scale-110 transition-transform" />
                            )}
                            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500/90">
                              {isGeneratingDiagram ? "Synthesizing Architecture..." : "Synthesize Architecture"}
                            </span>
                          </div>
                        </button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 space-y-3"
                        >
                          <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Architectural Overlay</span>
                            <button
                              onClick={() => setShowDiagram(false)}
                              className="text-[9px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-tighter"
                            >
                              Dismiss
                            </button>
                          </div>
                          <div className="relative rounded-2xl overflow-hidden border border-yellow-500/20 bg-black/60 p-6 shadow-2xl">
                            <div className="absolute top-0 right-0 p-3">
                              <Activity size={12} className="text-yellow-500/20 animate-pulse" />
                            </div>
                            {diagramSvg ? (
                              <div
                                className="w-full h-auto [&>svg]:w-full [&>svg]:h-auto transition-all"
                                dangerouslySetInnerHTML={{ __html: diagramSvg }}
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Activity className="w-8 h-8 text-yellow-500/30 mb-3 animate-pulse" />
                                <span className="text-[10px] text-yellow-500/40 font-bold uppercase tracking-widest">Rendering Logic...</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
