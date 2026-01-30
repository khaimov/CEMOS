"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <div className="flex">
      {!isLoginPage && <Sidebar />}
      <main className={cn(
        "flex-1 min-h-screen transition-all duration-300",
        !isLoginPage ? "pl-24 pr-8 py-8" : "p-0"
      )}>
        {children}
      </main>
    </div>
  );
}
