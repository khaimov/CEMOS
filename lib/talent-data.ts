export interface Skill {
  id: string;
  name: string;
  category: string;
  iconName: string; // Store icon name as string in DB
  demand: number;
  description?: string; // What we capture in this skill
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  location: string;
  ldap: string;
  skills?: Record<string, number>;
  domains: string[]; // Added this to interface as it is used in the data
  linkedInUrl?: string;
  languages?: string[];
  certifications?: string[];
  education?: string[];
  experience?: string[];
  outsideInterests?: string[];
  imageUrl?: string; // URL for profile photo
  startDate?: string; // Start date at company (e.g., "2020-01-15")
}

// Expanded Skills based on team domains
export const INITIAL_SKILLS = [
  // Infrastructure
  { name: "Kubernetes", category: "Infra", iconName: "Globe", demand: 0.8, description: "Container orchestration, cluster management, GKE." },
  { name: "Terraform", category: "Infra", iconName: "Box", demand: 0.7, description: "IaC, state management, module design." },
  // App Mod
  { name: "Cloud Run", category: "AppMod", iconName: "Zap", demand: 0.8, description: "Serverless container deployment, scaling configuration." },
  { name: "GKE", category: "AppMod", iconName: "Container", demand: 0.9, description: "Advanced Kubernetes networking, security, storage." },
  // Data
  { name: "BigQuery", category: "Data", iconName: "Database", demand: 0.9, description: "Data warehousing, SQL, performance tuning." },
  { name: "Looker", category: "Data", iconName: "BarChart", demand: 0.6, description: "BI semantic modeling, dashboard creation." },
  // AI
  { name: "Vertex AI", category: "AI", iconName: "Brain", demand: 1.0, description: "Technical mastery of Google Cloud AI platform, Agent Builder, Model Garden, and deployment." },
  { name: "Generative AI", category: "AI", iconName: "Sparkles", demand: 1.0, description: "Core proficiency with LLMs (Gemini, GPT, Claude), Prompt Engineering, and Model capability." },
  { name: "Enterprise AI", category: "Strategy", iconName: "Layers", demand: 0.8, description: "Strategy for adopting AI at scale, Governance, Security, and high-value business use cases." },
  { name: "AI/ML Architecture", category: "AI", iconName: "Network", demand: 0.9, description: "Designing end-to-end ML systems, RAG integration patterns, MLOps, and rigorous engineering." },
  // Security
  { name: "IAM Security", category: "Security", iconName: "Shield", demand: 0.85, description: "Identity access management, policy design." },
];

// Mapped Team Data
export const INITIAL_TEAM = [
  {
    name: "Albert Sunwoo",
    role: "CE, Analytics",
    location: "US-SFO-SPE",
    ldap: "asunwoo",
    domains: ["BigQuery", "Looker", "Data Analytics"],
    languages: ["English"],
    linkedInUrl: "https://www.linkedin.com/in/albertsunwoo",
    imageUrl: "/images/team/avatar_male_1.png",
    startDate: "2021-03-15"
  },
  {
    name: "Anabell St Vincent",
    role: "Principal Architect",
    location: "US-SFO-SPE",
    ldap: "astvincent",
    domains: ["Enterprise Arch", "Kubernetes", "Vertex AI"],
    certifications: ["GCP Professional Cloud Architect"],
    languages: ["English"],
    linkedInUrl: "https://www.linkedin.com/in/anabellstvincent",
    imageUrl: "/images/team/avatar_female_1.png",
    startDate: "2019-08-01"
  },
  {
    name: "Anirudh Murali",
    role: "CE, Strategic AI",
    location: "US-SVL-MP4",
    ldap: "anihm",
    domains: ["Vertex AI", "Generative AI"],
    languages: ["English"],
    linkedInUrl: "https://www.linkedin.com/in/anirudhmurali",
    imageUrl: "/images/team/avatar_male_2.png",
    startDate: "2022-05-10"
  },
  {
    name: "Eugene Toh",
    role: "ISV2 CE Team Lead",
    location: "US-SVL-MP4",
    ldap: "eugenetoh",
    domains: ["Kubernetes", "IAM Security"],
    education: ["MS ECE - Carnegie Mellon", "MBA - INSEAD"],
    experience: ["Energy Market Authority", "Enterprise Singapore"],
    outsideInterests: ["Portrait Drawing", "Singing", "Ukulele"],
    languages: ["English"],
    linkedInUrl: "https://www.linkedin.com/in/eugenetoh",
    imageUrl: "/images/team/avatar_male_1.png",
    startDate: "2020-11-01"
  },
  {
    name: "Humberto Rico",
    role: "CE, Infra Mod",
    location: "US-NYC-8510",
    ldap: "humbertorico",
    domains: ["Kubernetes", "Terraform", "Vertex AI"],
    education: ["MS EE - Universidad de Los Andes", "MBA - Kellogg"],
    experience: ["Strata Analytics Group", "Millicom", "Cima Telecom", "Bell Labs"],
    languages: ["English", "Spanish"],
    linkedInUrl: "https://www.linkedin.com/in/humbertorico",
    imageUrl: "/images/team/avatar_male_2.png",
    startDate: "2021-01-15"
  },
  {
    name: "Jason Delosrios",
    role: "CE, Infra Mod",
    location: "US-NYC-8510",
    ldap: "jasondelosrios",
    domains: ["Kubernetes", "IAM Security"],
    languages: ["English"],
    imageUrl: "/images/team/avatar_male_1.png",
    startDate: "2022-02-20"
  },
  {
    name: "Joe Truncale",
    role: "CE, App Mod",
    location: "US-NYC-8510",
    ldap: "joetruncale",
    domains: ["GKE", "Cloud Run"],
    languages: ["English"],
    imageUrl: "/images/team/avatar_male_2.png",
    startDate: "2023-06-01"
  },
  {
    name: "Lola Pushkar",
    role: "CE, App Mod",
    location: "US-SVL-MP4",
    ldap: "lolha",
    domains: ["GKE", "Cloud Run"],
    languages: ["English"],
    imageUrl: "/images/team/avatar_female_2.png",
    startDate: "2021-09-01"
  },
  {
    name: "Marcelo Ventura",
    role: "CE, App Mod",
    location: "US-SFO-SPE",
    ldap: "marceloventura",
    domains: ["GKE", "Cloud Run"],
    languages: ["English"],
    imageUrl: "/images/team/avatar_male_1.png",
    startDate: "2020-05-01"
  },
  {
    name: "Mike Choe",
    role: "CE II, App Mod",
    location: "US-SVL-MP4",
    ldap: "mikechoe",
    domains: ["GKE", "Cloud Run"],
    languages: ["English"],
    imageUrl: "/images/team/avatar_male_2.png",
    startDate: "2022-11-01"
  },
  {
    name: "Paul Min",
    role: "CE, Infra Mod",
    location: "US-NYC-8510",
    ldap: "paulmin",
    domains: ["Kubernetes", "Terraform"],
    languages: ["English"],
    imageUrl: "/images/team/avatar_male_1.png",
    startDate: "2023-01-15"
  },
  {
    name: "Prasad Alle",
    role: "Data Analytics Specialist",
    location: "US-IRV-FAIR",
    ldap: "prasadalle",
    domains: ["BigQuery", "Vertex AI"],
    languages: ["English"],
    imageUrl: "/images/team/avatar_male_2.png",
    startDate: "2021-07-01"
  },
  {
    name: "Priya Kumari",
    role: "CE, Analytics",
    location: "US-SVL-MP4",
    ldap: "kpriyaa",
    domains: ["BigQuery", "Data Analytics"],
    languages: ["English"],
    imageUrl: "/images/team/avatar_female_1.png",
    startDate: "2022-04-01"
  },
  {
    name: "Rachel Yuen",
    role: "CE",
    location: "US-IRV-FAIR",
    ldap: "rachelyuen",
    domains: ["BigQuery", "Data Analytics"],
    languages: ["English"],
    imageUrl: "/images/team/avatar_female_2.png",
    startDate: "2023-03-01"
  },
  {
    name: "S.D. Hines",
    role: "CE, Analytics",
    location: "US-IRV-FAIR",
    ldap: "saritta",
    domains: ["BigQuery", "Looker", "IAM Security"],
    languages: ["English"],
    imageUrl: "/images/team/avatar_male_1.png",
    startDate: "2020-02-01"
  },
  {
    name: "Steven Chung",
    role: "CE, Infra Mod",
    location: "US-NYC-8510",
    ldap: "stevenchung",
    domains: ["Kubernetes", "Terraform"],
    languages: ["English"],
    imageUrl: "/images/team/avatar_male_2.png",
    startDate: "2021-12-01"
  },
  {
    name: "Tema Johnson",
    role: "CE, Data Analytics",
    location: "US-SFO-SPE",
    ldap: "temaj",
    domains: ["Looker", "BigQuery"],
    languages: ["English"],
    imageUrl: "/images/team/avatar_female_1.png",
    startDate: "2022-08-01"
  },
  {
    name: "Thyge Knuhtsen",
    role: "CE III, Infra Mod",
    location: "US-NYC-8510",
    ldap: "thygek",
    domains: ["Kubernetes", "Terraform"],
    languages: ["English"],
    imageUrl: "/images/team/avatar_male_1.png",
    startDate: "2019-11-01"
  },
  {
    name: "Trevor Young",
    role: "CE",
    location: "US-NYC-8510",
    ldap: "trev",
    domains: ["Kubernetes", "GKE"],
    languages: ["English"],
    imageUrl: "/images/team/avatar_male_2.png",
    startDate: "2023-05-01"
  },
  {
    name: "Vineet Agarwal",
    role: "Principal Architect",
    location: "Remote",
    ldap: "vineetagarwal",
    domains: ["Enterprise Arch", "Kubernetes", "IAM Security"],
    languages: ["English"],
    imageUrl: "/images/team/avatar_male_1.png",
    startDate: "2018-06-01"
  },
];
