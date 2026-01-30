"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  Users,
  Zap,
  LayoutGrid,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: LayoutGrid, label: "Hub" },
  { href: "/pulse", icon: Activity, label: "Pulse" },
  { href: "/talent", icon: Users, label: "Talent" },
  { href: "/velocity", icon: Zap, label: "Velocity" },
];

import { useAuth } from "@/contexts/AuthContext";

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  if (!user && pathname !== "/login") return null; // Hide sidebar if not logged in (optional, or show minimal)

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 z-50 h-screen w-20 flex flex-col items-center py-8 glass-panel border-r border-white/10"
    >
      <div className="mb-12">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <span className="font-bold text-white">C</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-6 w-full px-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative group flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
                isActive
                  ? "bg-white/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />

              {/* Tooltip */}
              <span className="absolute left-14 px-3 py-1.5 rounded-md bg-black/80 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 backdrop-blur-md">
                {item.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 border border-cyan-500/30 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-4 w-full px-4">
        <button className="flex items-center justify-center w-12 h-12 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <Settings size={22} />
        </button>
        <button
          onClick={() => logout()}
          className="flex items-center justify-center w-12 h-12 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          title="Sign Out"
        >
          <LogOut size={22} />
        </button>
      </div>
    </motion.aside>
  );
}
