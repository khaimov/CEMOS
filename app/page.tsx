import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] relative z-10">
      <div className="text-center space-y-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
            Now Live v1.0
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
            CEMOS
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            The Outcome CE Operating System. Unifying customer intelligence, talent capabilities, and execution velocity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
          <Card
            title="Strategic Pulse"
            desc="Real-time news & sentiment engine."
            href="/pulse"
            color="cyan"
          />
          <Card
            title="Talent Matrix"
            desc="Dynamic skills mapping & gap analysis."
            href="/talent"
            color="purple"
          />
          <Card
            title="Velocity Engine"
            desc="Execution forecasting & modeling."
            href="/velocity"
            color="green"
          />
        </div>
      </div>

      {/* Decorative background elements can stay in layout or here if specific */}
    </main>
  );
}

function Card({ title, desc, href, color }: { title: string, desc: string, href: string, color: string }) {
  const colorClasses = {
    cyan: "group-hover:text-cyan-400 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]",
    purple: "group-hover:text-purple-400 group-hover:border-purple-500/30 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
    green: "group-hover:text-green-400 group-hover:border-green-500/30 group-hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]",
  };

  return (
    <Link
      href={href}
      className={`group relative p-8 rounded-3xl bg-white/5 border border-white/10 text-left transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <div className="mb-4 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
        <ArrowRight size={24} className="opacity-50 group-hover:opacity-100 transition-opacity" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-white">{title}</h2>
      <p className="text-sm text-gray-400 leading-relaxed opacity-80 group-hover:opacity-100">{desc}</p>
    </Link>
  );
}
