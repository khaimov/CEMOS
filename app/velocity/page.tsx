"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Zap, TrendingUp, Download, Presentation } from "lucide-react";

const DATA = [
  { month: 'Jan', velocity: 4000, projected: 4200 },
  { month: 'Feb', velocity: 3000, projected: 4500 },
  { month: 'Mar', velocity: 5000, projected: 4800 },
  { month: 'Apr', velocity: 4800, projected: 5100 },
  { month: 'May', velocity: 6000, projected: 5500 },
  { month: 'Jun', velocity: 7500, projected: 6000 },
  { month: 'Jul', velocity: 8200, projected: 7000 },
];

export default function VelocityPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Velocity Engine
          </h1>
          <p className="text-gray-400 mt-2">
            Execution forecasting and revenue modeling.
          </p>
        </div>
        <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
          <Presentation size={18} /> Generate Exec Deck
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <GlassCard className="lg:col-span-3 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="text-green-400" /> Consumption Forecast
            </h2>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-2 text-gray-400">
                <div className="w-3 h-3 rounded-full bg-cyan-500" /> Actual
              </span>
              <span className="flex items-center gap-2 text-gray-400">
                <div className="w-3 h-3 rounded-full bg-purple-500/50 border border-purple-500" /> Projected
              </span>
            </div>
          </div>

          <div className="flex-1 w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#6b7280" tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(20, 20, 40, 0.9)', borderColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="projected" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProj)" />
                <Area type="monotone" dataKey="velocity" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorVel)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="text-center py-10">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
              <Zap size={32} className="text-green-400" />
            </div>
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Velocity Score</p>
            <p className="text-5xl font-display font-bold text-white mb-2">94.2</p>
            <p className="text-green-400 text-sm flex items-center justify-center gap-1">
              <TrendingUp size={14} /> +5.4% vs last Q
            </p>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Pending Agreements</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center pb-4 border-b border-white/5">
                <div>
                  <p className="text-white font-medium">RetailCo Expansion</p>
                  <p className="text-xs text-gray-500">Est. $2.4M</p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-yellow-500/10 text-yellow-500">Neg.</span>
              </li>
              <li className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">BankCorp Data Lake</p>
                  <p className="text-xs text-gray-500">Est. $1.1M</p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-500">Draft</span>
              </li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
