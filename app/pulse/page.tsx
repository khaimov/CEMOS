"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, AlertTriangle, CheckCircle2, Activity, Search, Building2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { format } from "date-fns";
import { clsx } from "clsx";
import { useState } from "react";
import { CustomerCard } from "./CustomerCard";
import { StockTicker } from "./StockTicker";
import { SalesforceHolodeck } from "./SalesforceHolodeck";
import { PulseProvider, usePulse } from "./PulseContext";
import { INITIAL_TEAM } from "@/lib/talent-data";

function PulseDashboard() {
  const { customers, loading, error } = usePulse();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <SalesforceHolodeck />

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Activity size={18} className="text-white" />
            </div>
            <span className="text-cyan-400 text-xs font-black uppercase tracking-[0.2em]">Outcome Intelligence</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60">
            OutcomeOS Pulse Dashboard
          </h1>
          <p className="text-gray-400 mt-2 font-medium">
            {format(new Date(), "EEEE, MMMM do, yyyy")}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className={clsx(
            "px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-3 transition-all duration-500 glass-panel",
            loading ? "border-cyan-500/20 text-cyan-400" :
              error ? "border-red-500/20 text-red-400" :
                "border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          )}>
            <div className="relative">
              <div className={clsx(
                "w-2 h-2 rounded-full",
                loading ? "bg-cyan-400 animate-pulse" :
                  error ? "bg-red-400" :
                    "bg-emerald-400"
              )} />
              {(!loading && !error) && (
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-40" />
              )}
            </div>
            {loading ? "Connecting..." : error ? "Offline Mode" : "Live Wire Active"}
          </div>
        </div>
      </div>

      {/* Ticker / Summary */}
      <StockTicker />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Accounts List (Left - 66%) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-300 flex items-center gap-2">
              <Activity className="text-cyan-400" /> Active Accounts
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredCustomers.length})
              </span>
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                autoFocus
              />
            </div>
          </div>

          <div className="grid gap-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, idx) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                >
                  <CustomerCard customer={customer} />
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                No accounts found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Operational Health (Right - 33%) */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-300 flex items-center gap-2">
            <AlertTriangle className="text-amber-400" /> Operational Health
          </h2>

          <GlassCard className="space-y-6 bg-red-500/5 border-red-500/20">
            <h3 className="text-sm font-bold text-red-200 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle size={16} /> Critical Blockers
            </h3>
            <div className="space-y-4">
              {customers
                .filter(c => c.risk === "High" && c.blocker)
                .slice(0, 3)
                .map((customer) => (
                  <div key={customer.id} className="flex gap-3 items-start group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                    <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] group-hover:scale-125 transition-transform" />
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-red-300 transition-colors">
                        {customer.name}
                      </p>
                      <p className="text-xs text-red-300/80 mt-1">
                        {customer.blocker}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
            <button className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-xs font-bold uppercase transition-all flex items-center justify-center gap-2">
              View War Room <ArrowUpRight size={12} />
            </button>
          </GlassCard>

          <GlassCard className="space-y-6">
            <h3 className="text-sm font-bold text-cyan-200 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={16} /> Team Highlights
            </h3>
            <div className="flex items-center gap-4">
              <img
                src={INITIAL_TEAM[1].imageUrl}
                alt={INITIAL_TEAM[1].name}
                className="w-10 h-10 rounded-full border border-purple-500/30"
              />
              <div>
                <p className="text-sm text-white">{INITIAL_TEAM[1].name}</p>
                <p className="text-xs text-gray-400">Certified in Gemini Pro</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <img
                src={INITIAL_TEAM[4].imageUrl}
                alt={INITIAL_TEAM[4].name}
                className="w-10 h-10 rounded-full border border-cyan-500/30"
              />
              <div>
                <p className="text-sm text-white">{INITIAL_TEAM[4].name}</p>
                <p className="text-xs text-gray-400">Deployed Multi-Region GKE</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div >
  );
}

export default function PulsePage() {
  return (
    <PulseProvider>
      <PulseDashboard />
    </PulseProvider>
  );
}
