
import { Customer } from "./data";
import { INITIAL_TEAM, TeamMember } from "../../lib/talent-data";

export interface TalentMatch {
  member: TeamMember;
  reason: string;
}

interface NewsData {
  headline: string;
  category: string;
  relevance: string;
  sentiment: "positive" | "neutral" | "negative";
  link?: string;
}

export interface IntelligenceBrief {
  headline: string;
  context: string; // WHAT
  matches: TalentMatch[]; // WHO
  strategy: string; // WHY
  actions: string[]; // HOW
}

export function getTalentSuggestions(customer: Customer, pulse: NewsData | null, team: TeamMember[] = INITIAL_TEAM): IntelligenceBrief {
  // 1. Identify Key Keywords from Customer Context
  const contextTokens = [
    ...(customer.name.toLowerCase().split(" ") || []),
    ...(customer.blocker?.toLowerCase().split(" ") || []),
    ...(customer.milestone?.toLowerCase().split(" ") || []),
    ...(pulse?.headline?.toLowerCase().split(" ") || []),
    ...(pulse?.category?.toLowerCase().split(" ") || [])
  ];

  // 2. Define Skill Mappings - Expanded for specific blockers
  const skillMap: Record<string, string[]> = {
    // Security & Compliance
    "security": ["IAM Security", "Enterprise Arch"],
    "access": ["IAM Security"],
    "identity": ["IAM Security"],
    "compliance": ["IAM Security", "Enterprise Arch"],
    "sovereignty": ["IAM Security", "Data Analytics", "Enterprise Arch"],
    "governance": ["Enterprise Arch", "IAM Security"],

    // AI & Innovation
    "ai": ["Generative AI", "Vertex AI", "AI/ML Architecture", "Enterprise AI"],
    "genai": ["Generative AI", "Vertex AI"],
    "learning": ["Generative AI", "Vertex AI"],
    "model": ["Vertex AI", "AI/ML Architecture"],

    // Data
    "data": ["BigQuery", "Looker", "Data Analytics"],
    "analytics": ["BigQuery", "Looker", "Data Analytics"],
    "warehouse": ["BigQuery"],
    "dashboard": ["Looker"],

    // Infrastructure & Modernization
    "kubernetes": ["Kubernetes", "GKE"],
    "container": ["Kubernetes", "GKE", "Cloud Run"],
    "scaling": ["Kubernetes", "GKE", "Cloud Run", "Terraform"],
    "infrastructure": ["Kubernetes", "Terraform", "Infra Mod"],
    "migration": ["Terraform", "Enterprise Arch", "Infra Mod"],
    "cloud": ["Enterprise Arch", "Terraform"],
    "legacy": ["App Mod", "GKE", "Cloud Run", "Enterprise Arch"], // For "Technical Debt"
    "debt": ["App Mod", "GKE", "Enterprise Arch"],
    "modernization": ["App Mod", "GKE"],

    // Strategy & Business
    "sponsorship": ["Enterprise Arch", "Enterprise AI"],
    "executive": ["Enterprise Arch", "Enterprise AI"],
    "budget": ["Enterprise Arch", "Terraform"], // Terraform for cost control
    "personnel": ["Enterprise Arch", "Generative AI"],

    // Performance & Optimization
    "optimization": ["Kubernetes", "BigQuery", "Terraform"],
    "performance": ["BigQuery", "GKE", "Cloud Run"],
    "latency": ["GKE", "BigQuery"],
    "spanner": ["BigQuery", "Data Analytics"], // Proxy for DB expertise
    "kafka": ["Data Analytics", "GKE"],
    "scale": ["GKE", "Cloud Run", "BigQuery"],
  };

  // 3. Score All Team Members
  let candidates: { member: TeamMember; score: number; reason: string; skills: string[] }[] = [];
  const isCritical = customer.risk === "High" || !!customer.blocker;

  for (const member of team) {
    let score = 0;
    const matchedSkills: string[] = [];

    // Check for skill matches
    contextTokens.forEach(token => {
      const mappedSkills = skillMap[token];
      if (mappedSkills) {
        mappedSkills.forEach(reqSkill => {
          if (member.domains.some(d => d.includes(reqSkill) || reqSkill.includes(d)) ||
            member.role.toLowerCase().includes(reqSkill.toLowerCase())) {
            score += 2;
            if (!matchedSkills.includes(reqSkill)) matchedSkills.push(reqSkill);
          }
        });
      }
    });

    // Boost for seniority if critical
    if (isCritical && (member.role.includes("Principal") || member.role.includes("Lead") || member.role.includes("III") || member.role.includes("Specialist"))) {
      score += 3;
    }

    if (score > 0) {
      // Construct individual reason
      const skillString = matchedSkills.slice(0, 2).join(" & ");
      let description = "";
      if (customer.blocker && matchedSkills.length > 0) {
        description = `Can resolve "${customer.blocker}" using ${skillString} expertise.`;
      } else if (matchedSkills.length > 0) {
        description = `Deep knowledge in ${skillString} to accelerate ${customer.milestone}.`;
      } else {
        description = `General coverage and ${member.domains[0]} leadership.`;
      }

      candidates.push({ member, score, reason: description, skills: matchedSkills });
    }
  }

  // Sort by score descending
  candidates.sort((a, b) => b.score - a.score);

  // Pick top 2 matches
  let topMatches = candidates.slice(0, 2).map(c => ({
    member: c.member,
    reason: c.reason
  }));

  // Fallback if no specific match found
  if (topMatches.length === 0) {
    const fallback = team.find(m => m.role.includes("Principal")) || team[0];
    topMatches.push({
      member: fallback,
      reason: `Senior Architect deployed to assess ${customer.risk} Risk state.`
    });
  }

  // 4. Generate Strategy (WHY) and Actions (HOW)
  // These would ideally come from an LLM, but we'll simulate intelligent composition
  const primaryMatch = topMatches[0];
  const technicalDomain = primaryMatch.member.domains[0] || "Cloud Architecture";

  const strategy = `To address the ${customer.risk.toLowerCase()} risk and ${customer.blocker ? `remove the "${customer.blocker}" blocker` : `achieve the ${customer.milestone} milestone`}, we are deploying a specialized squad led by ${primaryMatch.member.name}. The strategy focuses on ${technicalDomain} best practices to ensure rapid value realization.`;

  const actions = [
    `Schedule immediate architectural deep-dive with ${customer.name}'s technical leads.`,
    `Audit current ${technicalDomain} implementation against OutcomeOS Golden Paths.`,
    `Establish weekly "Blocker Destroyer" working sessions.`,
    ...(customer.risk === 'High' ? [`Escalate technical blockers to Product Engineering via ${primaryMatch.member.name}.`] : [])
  ];

  return {
    headline: pulse?.headline || `Strategic Optimization for ${customer.name}`,
    context: pulse ? `Based on recent signal: "${pulse.headline}" (${pulse.category})` : `Based on current ${customer.milestone} milestone trajectory.`,
    matches: topMatches,
    strategy,
    actions
  };
}
