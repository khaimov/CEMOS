"use client";

import { useState } from "react";
import { usePulse, SimulationEvent } from "./PulseContext";
import { X, Zap, Activity, AlertTriangle, DollarSign, Terminal, Settings, ChevronUp, ChevronDown, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { seedPulseData } from "../actions/pulse";

export function SalesforceHolodeck() {
  const { customers, simulateRealtimeUpdate, loading, error } = usePulse();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || "");
  const [logs, setLogs] = useState<{ time: string; msg: string }[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString(), msg }, ...prev].slice(0, 50));
  };

  const handleSimulate = async (event: SimulationEvent, logMsg: string) => {
    addLog(`Initiating: ${event.type}...`);
    await simulateRealtimeUpdate(event);
    addLog(`Success: ${logMsg}`);
  };

  const handleSync = async () => {
    const { seedPulseData } = await import("@/app/actions/pulse");
    setIsSyncing(true);
    addLog("Syncing local customers to Salesforce Holodeck...");
    const res = await seedPulseData();
    if (res.success) {
      addLog("Uplink synchronized with local records.");
    } else {
      addLog(`Sync error: ${res.error}`);
    }
    setIsSyncing(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 bg-black/90 backdrop-blur-xl border border-cyan-500/20 rounded-xl shadow-[0_0_40px_rgba(6,182,212,0.15)] w-[320px] overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-cyan-400" />
                <span className="text-xs font-bold text-cyan-100 tracking-wider">OUTCOMEOS GATEWAY</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", error ? "bg-red-500" : "bg-green-500")} />
                <span className={clsx("text-[9px] font-mono uppercase", error ? "text-red-400" : "text-green-400")}>
                  {error ? "Offline" : "Live"}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 space-y-4">
              {/* Customer Selector */}
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1.5 block">Target Account</label>
                <div className="flex gap-2">
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                  >
                    {customers.slice(0, 10).map(c => (
                      <option key={c.id} value={c.id} className="bg-gray-900">{c.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-50"
                    title="Force Sync with Local Records"
                  >
                    <Settings size={14} className={isSyncing ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSimulate(
                    { type: 'DEAL_CLOSE', customerId: selectedCustomerId, amount: '$1.2M' },
                    `CLOSED WON: ${customers.find(c => c.id === selectedCustomerId)?.name} ($1.2M)`
                  )}
                  className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 flex flex-col items-center gap-1 transition-all group"
                >
                  <DollarSign size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-bold text-emerald-200">CLOSE DEAL</span>
                </button>

                <button
                  onClick={() => handleSimulate(
                    { type: 'RISK_ALERT', customerId: selectedCustomerId, risk: 'High', reason: 'Security Breach Attempt' },
                    `RISK ALERT: ${customers.find(c => c.id === selectedCustomerId)?.name} (Security)`
                  )}
                  className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 flex flex-col items-center gap-1 transition-all group"
                >
                  <AlertTriangle size={16} className="text-red-400 group-hover:shake transition-transform" />
                  <span className="text-[9px] font-bold text-red-200">FLAG RISK</span>
                </button>

                <button
                  onClick={() => handleSimulate(
                    { type: 'USAGE_SPIKE', customerId: selectedCustomerId, amount: 15 },
                    `USAGE SPIKE: ${customers.find(c => c.id === selectedCustomerId)?.name} (+15%)`
                  )}
                  className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 flex flex-col items-center gap-1 transition-all group"
                >
                  <Zap size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-bold text-cyan-200">SPIKE USAGE</span>
                </button>

                <button
                  onClick={() => addLog("System ping... latency 12ms")}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 flex flex-col items-center gap-1 transition-all group"
                >
                  <Activity size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-[9px] font-bold text-gray-400 group-hover:text-gray-200">PING TEST</span>
                </button>
              </div>

              {/* Logs Console */}
              <div className="bg-black/50 rounded-lg border border-white/10 p-2 h-32 overflow-y-auto font-mono text-[9px] space-y-1">
                {logs.length === 0 && <span className="text-gray-700 italic">Listening for Salesforce events...</span>}
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-gray-600 shrink-0">[{log.time}]</span>
                    <span className="text-green-400/90">{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95 z-50"
      >
        <Terminal size={14} />
        {isOpen ? "Close Gateway" : "OutcomeOS Gateway"}
      </button>
    </div>
  );
}
