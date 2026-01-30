import { INITIAL_TEAM, TeamMember } from '@/lib/talent-data';
import { Customer } from './data';

export interface TalentSuggestion {
  member: TeamMember;
  reason: string;
  matchScore: number;
}

// Helper to check if a member has a specific domain/skill
const hasDomain = (member: TeamMember, domain: string) => 
  member.domains.some(d => d.toLowerCase().includes(domain.toLowerCase()));

export function getTalentSuggestions(customer: Customer): TalentSuggestion[] {
  const suggestions: TalentSuggestion[] = [];

  // 1. Identify Needed Skills based on Customer Context
  const neededSkills: { domain: string; reason: string; weight: number }[] = [];

  // -- Blockers (High Priority) --
  if (customer.blocker === "Technical Debt in Legacy System") {
    neededSkills.push({ domain: "App Mod", reason: "Modernize legacy systems", weight: 3 });
    neededSkills.push({ domain: "Kubernetes", reason: "Containerize legacy apps", weight: 2 });
  }
  if (customer.blocker === "Security Compliance Review") {
    neededSkills.push({ domain: "IAM Security", reason: "Address security compliance blockers", weight: 3 });
    neededSkills.push({ domain: "Enterprise Arch", reason: "Design secure compliant architecture", weight: 2 });
  }
  if (customer.blocker === "Data Sovereignty Concerns") {
    neededSkills.push({ domain: "IAM Security", reason: "Ensure data sovereignty and access control", weight: 3 });
    neededSkills.push({ domain: "BigQuery", reason: "Data governance and locality", weight: 2 });
  }
  if (customer.blocker === "Lack of Trained Personnel") {
    neededSkills.push({ domain: "Generative AI", reason: "Enable team with AI tools", weight: 2 });
    neededSkills.push({ domain: "Vertex AI", reason: "Upskill team on Vertex AI", weight: 2 });
  }
  if (customer.blocker === "Executive Sponsorship Gap" || customer.blocker === "Budget Approval Pending") {
    neededSkills.push({ domain: "Enterprise Arch", reason: "Build business value case", weight: 3 });
    neededSkills.push({ domain: "Strategy", reason: "Strategic alignment", weight: 2 });
  }

  // -- Milestones (Medium Priority) --
  if (customer.milestone === "Discovery") {
    neededSkills.push({ domain: "Enterprise Arch", reason: "Discovery and solution definition", weight: 2 });
    neededSkills.push({ domain: "Data Analytics", reason: "Assess data readiness", weight: 1 });
  }
  if (customer.milestone === "Pilot") {
    neededSkills.push({ domain: "Generative AI", reason: "Launch AI pilot", weight: 2 });
    neededSkills.push({ domain: "Cloud Run", reason: "Rapid prototyping", weight: 2 });
  }
  if (customer.milestone === "Migration") {
    neededSkills.push({ domain: "Terraform", reason: "Infrastructure as Code for migration", weight: 2 });
    neededSkills.push({ domain: "Kubernetes", reason: "Workload migration", weight: 2 });
  }
  if (customer.milestone === "Optimization") {
    neededSkills.push({ domain: "GKE", reason: "Cluster optimization", weight: 2 });
    neededSkills.push({ domain: "BigQuery", reason: "Query performance tuning", weight: 2 });
  }
  if (customer.milestone === "Expansion") {
    neededSkills.push({ domain: "Vertex AI", reason: "Scale AI workloads", weight: 2 });
    neededSkills.push({ domain: "Looker", reason: "Expand business intelligence", weight: 1 });
  }

  // -- Risk (Booster) --
  const riskMultiplier = customer.risk === "High" ? 1.5 : customer.risk === "Medium" ? 1.2 : 1.0;

  // 2. Score Team Members
  INITIAL_TEAM.forEach(member => {
    let score = 0;
    const reasons: string[] = [];

    neededSkills.forEach(req => {
      // Check if member has this exact domain or if it's a broad category match
      // We map "App Mod" to known App Mod skills if needed, but for now we rely on string search in domains
      // "App Mod" isn't explicitly in domains usually (it's "GKE", "Cloud Run"), so we might need better mapping.
      // Let's refine the "hasDomain" check or the neededSkills to be more specific to member domains.
      
      // Member Domains from lib/talent-data: 
      // "BigQuery", "Looker", "Data Analytics", "Enterprise Arch", "Kubernetes", "Vertex AI", 
      // "Generative AI", "IAM Security", "Terraform", "GKE", "Cloud Run"
      
      let match = false;
      if (req.domain === "App Mod") {
        match = hasDomain(member, "GKE") || hasDomain(member, "Cloud Run") || hasDomain(member, "Kubernetes");
      } else if (req.domain === "Strategy") {
        match = hasDomain(member, "Enterprise Arch");
      } else {
        match = hasDomain(member, req.domain);
      }

      if (match) {
        score += req.weight * riskMultiplier;
        if (!reasons.includes(req.reason)) {
          reasons.push(req.reason);
        }
      }
    });

    if (score > 0) {
      suggestions.push({
        member,
        matchScore: score,
        reason: reasons.join(", "),
      });
    }
  });

  // 3. Sort and Return
  return suggestions.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
}
