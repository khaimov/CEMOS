
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { getStockData, StockInfo } from "./stock-service";
import { CUSTOMERS } from "./data";

export function StockTicker() {
  const [stocks, setStocks] = useState<StockInfo[]>([]);

  useEffect(() => {
    async function loadData() {
      // Get unique company names from customers
      const companyNames = CUSTOMERS.map(c => c.name);

      // Simulate fetch delay slightly for realism
      setTimeout(async () => {
        const data = await getStockData(companyNames);
        setStocks([...data, ...data]); // Duplicate for seamless loop if needed, though we can just loop the render
      }, 500);
    }
    loadData();
  }, []);

  if (stocks.length === 0) {
    return (
      <div className="h-12 w-full bg-slate-900/50 flex items-center justify-center">
        <div className="animate-pulse w-32 h-2 bg-slate-700 rounded" />
      </div>
    );
  }

  // Duration Logic based on items
  // 20 sec per loop roughly

  return (
    <div className="w-full max-w-full overflow-hidden relative bg-black/40 border-y border-white/10 backdrop-blur-md h-12 flex items-center">
      {/* Fixed Branding Label */}
      <div className="shrink-0 px-6 h-full flex items-center bg-gradient-to-r from-cyan-500/10 to-transparent border-r border-white/5 relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">OutcomeOS | Pulse</span>
        </div>
      </div>

      <div className="relative flex-1 h-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-[#030712] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-[#030712] to-transparent pointer-events-none" />

        <motion.div
          className="absolute top-0 left-0 h-full flex items-center whitespace-nowrap gap-8"
          animate={{ x: [0, -100 * stocks.length] }} // Rough approximation for seamlessness needs careful calculation or just repeat
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: stocks.length * 3, // 3 seconds per item
              ease: "linear",
            },
          }}
        // We render duplicate list to ensure continuity
        >
          {/* Triplicate the list for smoother boundaries */}
          {[...stocks, ...stocks, ...stocks].map((stock, i) => (
            <div key={`${stock.symbol}-${i}`} className="flex items-center gap-2 text-sm">
              <span className="font-bold text-slate-200">{stock.symbol}</span>
              <span
                className={`flex items-center gap-0.5 text-xs font-medium ${stock.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {stock.change >= 0 ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                {stock.price.toFixed(2)}
                <span className="opacity-75 ml-1">
                  ({stock.change >= 0 ? "+" : ""}{stock.changePercent}%)
                </span>
              </span>
              <span className="text-slate-800 mx-2">|</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
