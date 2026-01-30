"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function LoginPage() {
  const { user, loading, error, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-cyan-400" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050505]">
      <GlassCard className="max-w-md w-full text-center space-y-8 p-12 relative overflow-hidden border border-white/5">

        {/* Decorative Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-5xl font-display font-bold text-white mb-2 tracking-tighter">
            CEMOS
          </h1>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-[0.2em]">Restricted CE Operating System</p>
        </div>

        {error && (
          <div className="relative z-10 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        <button
          onClick={signInWithGoogle}
          className="relative z-10 w-full py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold flex items-center justify-center gap-3 transition-all group"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="group-hover:text-cyan-400 transition-colors">Sign in with Google</span>
        </button>

        <p className="text-xs text-gray-500 max-w-xs mx-auto">
          Authorized personnel only. Access is logged and monitored.
        </p>
      </GlassCard>
    </div>
  );
}
