import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "CEMOS",
  description: "The Outcome CE Operating System",
};

import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-[#0a0a1f] text-white selection:bg-cyan-500 selection:text-black`}>
        <AuthProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 pl-24 pr-8 py-8 min-h-screen">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
