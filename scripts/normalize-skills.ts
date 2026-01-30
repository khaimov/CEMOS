
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// --- DEFINITIONS ---

interface SkillDefinition {
  name: string;
  category: "AI" | "Infra" | "Data" | "AppMod" | "Security" | "Strategy" | "Industry";
  description?: string;
  iconName?: string;
}

const MASTER_SKILLS_DEF: SkillDefinition[] = [
  // --- AI & Machine Learning ---
  { name: "Generative AI", category: "AI", description: "LLMs, Prompt Engineering, Agents (Gemini/GPT/Claude)", iconName: "Sparkles" },
  { name: "Vertex AI", category: "AI", description: "Google Cloud Vertex AI Platform", iconName: "BrainCircuit" },
  { name: "Enterprise AI", category: "AI", description: "AI Strategy, Adoption, Governance", iconName: "Briefcase" },
  { name: "AI/ML Architecture", category: "AI", description: "Designing scalable AI systems", iconName: "Network" },
  { name: "Machine Learning", category: "AI", description: "Classic ML, Predictive Modeling, TensorFlow/PyTorch", iconName: "Brain" },
  
  // --- Cloud Infrastructure ---
  { name: "AWS", category: "Infra", description: "Amazon Web Services Ecology", iconName: "Cloud" },
  { name: "Azure", category: "Infra", description: "Microsoft Azure Ecology", iconName: "Cloud" },
  { name: "Google Cloud Platform", category: "Infra", description: "Core GCP Infrastructure & Services", iconName: "CloudFog" },
  { name: "Multi-Cloud Strategy", category: "Infra", description: "Hybrid/Multi-cloud architecture & governance", iconName: "Globe" },
  { name: "SRE & DevOps", category: "Infra", description: "Reliability, CI/CD, Automation, Observability", iconName: "Infinity" },
  { name: "Infrastructure as Code", category: "Infra", description: "Terraform, Ansible, Pulumi", iconName: "Code2" },
  { name: "Linux & OS", category: "Infra", description: "Kernel tuning, Shell scripting, OS management", iconName: "Terminal" },
  { name: "Virtualization", category: "Infra", description: "VMware, Hyper-V, HCI", iconName: "Layers" },
  { name: "Networking", category: "Infra", description: "SDN, VPC, DNS, CDN, Interconnects", iconName: "Network" },

  // --- Application Modernization ---
  { name: "Kubernetes", category: "AppMod", description: "K8s, GKE, EKS, AKS", iconName: "Container" }, // Container/Ship
  { name: "OpenShift", category: "AppMod", description: "Red Hat OpenShift Platform", iconName: "RedHat" }, 
  { name: "Serverless", category: "AppMod", description: "Lambda, Cloud Run, Functions", iconName: "Zap" },
  { name: "Service Mesh", category: "AppMod", description: "Istio, Anthos Service Mesh", iconName: "Network" },
  { name: "Microservices Architecture", category: "AppMod", description: "Distributed systems design", iconName: "Boxes" },
  { name: "Java", category: "AppMod", description: "Spring Boot, JEE, JVM tuning", iconName: "Coffee" },
  { name: "Python", category: "AppMod", description: "Django, Flask, Scripting", iconName: "Snake" }, // generic python/code
  { name: "Go", category: "AppMod", description: "Golang systems programming", iconName: "Code" },
  { name: "JavaScript/TypeScript", category: "AppMod", description: "React, Node.js, Frontend/Backend", iconName: "Code" },

  // --- Data & Analytics ---
  { name: "Data Strategy", category: "Data", description: "Governance, Data Mesh, Monetization", iconName: "LineChart" },
  { name: "Data Engineering", category: "Data", description: "Pipelines, ETL, Spark, DBT", iconName: "Database" },
  { name: "Data Analytics/BI", category: "Data", description: "Warehousing, Visualization, Tableau, Looker", iconName: "BarChart" },
  { name: "Database Management", category: "Data", description: "SQL, NoSQL, Migration, Optimization", iconName: "Database" },
  { name: "Event Streaming", category: "Data", description: "Kafka, Pub/Sub", iconName: "Activity" },

  // --- Security ---
  { name: "Identity & Access Management", category: "Security", description: "OAuth, OIDC, Active Directory, IAM", iconName: "ShieldCheck" },
  { name: "Cybersecurity", category: "Security", description: "Threat detection, Compliance, SecOps", iconName: "Lock" },

  // --- Strategy & Leadership ---
  { name: "Digital Transformation", category: "Strategy", description: "Modernization roadmaps, C-Level advisory", iconName: "Compass" },
  { name: "Product Strategy", category: "Strategy", description: "Product Management, GTM, Roadmap", iconName: "Target" },
  { name: "Technical Leadership", category: "Strategy", description: "Mentoring, Team Building, Pre-sales", iconName: "Users" },
  { name: "Sales Engineering", category: "Strategy", description: "Discovery, Protoyping, Value Engineering", iconName: "Presentation" },

  // --- Industry ---
  { name: "Financial Services", category: "Industry", description: "Trading, Banking, Insurance Tech", iconName: "DollarSign" },
  { name: "Telecommunications", category: "Industry", description: "5G, Telco Cloud, NFV", iconName: "RadioTower" },
  { name: "IoT & Edge", category: "Industry", description: "Embedded, Edge Compute, IoT Platforms", iconName: "Cpu" },
  { name: "Healthcare", category: "Industry", description: "HIPAA, HL7, MedTech", iconName: "HeartPulse" },
  { name: "Media & Entertainment", category: "Industry", description: "Streaming, Content Supply Chain", iconName: "Film" },
];

const SKILL_MAPPING: Record<string, string> = {
    // --- AI ---
    "generative ai": "Generative AI",
    "generative ai & llms": "Generative AI",
    "generative ai & prompt engineering": "Generative AI",
    "generative ai (gemini/claude/gpt)": "Generative AI",
    "generative ai & machine learning": "Generative AI",
    "vertex ai / generative ai": "Generative AI", // Merging primarily to GenAI for simplicity, or split? Let's check Split list.
    
    "vertex ai": "Vertex AI",
    "vertex ai / strategic ai": "Vertex AI",
    "vertex ai & machine learning inferences": "Vertex AI",
    "vertex ai & machine learning": "Vertex AI",

    "enterprise ai solutioning": "Enterprise AI",
    "enterprise ai": "Enterprise AI",
    "enterprise arch": "Enterprise AI",

    "ai/ml integration patterning": "AI/ML Architecture",
    "ai/ml architecture": "AI/ML Architecture",
    
    "machine learning & mlops": "Machine Learning",
    "predictive modeling": "Machine Learning",
    "ai/machine learning (vertex ai/tensorflow)": "Machine Learning",

    // --- INFRA ---
    "aws": "AWS",
    "amazon web services (aws)": "AWS",
    
    "microsoft azure": "Azure",
    
    "google cloud platform": "Google Cloud Platform",
    "google cloud platform (gcp)": "Google Cloud Platform",
    "gcp": "Google Cloud Platform",
    "cloud infrastructure (gcp)": "Google Cloud Platform",
    "cloud infrastructure (gcp/aws)": "Google Cloud Platform", // Or Multi
    
    "multi-cloud solutions": "Multi-Cloud Strategy",
    "multi-cloud strategy": "Multi-Cloud Strategy",
    "public cloud (aws/azure/gcp)": "Multi-Cloud Strategy",
    "cloud architecture (gcp/aws)": "Multi-Cloud Strategy",
    "cloud architecture (gcp/aws/azure)": "Multi-Cloud Strategy",
    "cloud architecture & strategy": "Multi-Cloud Strategy",
    "cloud solutions architecture": "Multi-Cloud Strategy",
    "cloud architecture": "Multi-Cloud Strategy", // Generic -> Strategy
    
    "site reliability engineering (sre)": "SRE & DevOps",
    "devops & ci/cd": "SRE & DevOps",
    "devops & platform engineering": "SRE & DevOps",
    "ci/cd / jenkins": "SRE & DevOps",
    "ci/cd pipelines": "SRE & DevOps",
    "gitops": "SRE & DevOps",
    "python & automation": "SRE & DevOps", // Often implies DevOps context
    
    "terraform": "Infrastructure as Code",
    "infrastructure as code (iac)": "Infrastructure as Code",
    "infrastructure as code (terraform)": "Infrastructure as Code",
    "infrastructure as code (terraform/puppet)": "Infrastructure as Code",
    "terraform/iac": "Infrastructure as Code",
    
    "linux (ubuntu/centos/redhat)": "Linux & OS",
    "unix/linux systems programming": "Linux & OS",
    
    "vmware & virtualization": "Virtualization",
    "virtualization (vmware/vsphere)": "Virtualization",
    "hyper-converged infrastructure (hci)": "Virtualization",
    "vmware / data center virtualization": "Virtualization",
    "compute infrastructure (arm/axion)": "Virtualization", // Close enough to infra hardware

    "network engineering": "Networking",
    "network engineering (cisco)": "Networking",
    "network infrastructure (sdn/voip)": "Networking",
    "sd-wan & network security": "Networking",
    "enterprise network design": "Networking",
    
    // --- APP MOD ---
    "kubernetes": "Kubernetes",
    "kubernetes & docker": "Kubernetes",
    "kubernetes & gke": "Kubernetes",
    "google kubernetes engine (gke)": "Kubernetes",
    "gke": "Kubernetes",
    "gke (google kubernetes engine)": "Kubernetes",
    "kubernetes (gke)": "Kubernetes",
    "kubernetes & cloud native apps": "Kubernetes",
    
    "openshift": "OpenShift",
    "red hat openshift": "OpenShift",
    
    "kubernetes & containerization": "Kubernetes", // Map to k8s defaults
    
    "serverless computing": "Serverless",
    "cloud run": "Serverless",
    
    "service mesh": "Service Mesh",
    "service mesh (istio)": "Service Mesh",
    
    "distributed systems": "Microservices Architecture",
    "enterprise integration (mulesoft/soa)": "Microservices Architecture",
    "enterprise system architecture": "Microservices Architecture",
    "enterprise technical architecture": "Microservices Architecture",
    "enterprise systems architecture": "Microservices Architecture",
    
    "java": "Java",
    "java enterprise edition": "Java",
    "java & elasticsearch": "Java",
    
    "python": "Python",
    "python & bot development": "Python",
    
    "go (golang)": "Go",
    
    "javascript": "JavaScript/TypeScript",
    "next.js": "JavaScript/TypeScript",
    "full-stack development (react/nodejs)": "JavaScript/TypeScript",
    "full-stack development": "JavaScript/TypeScript",
    "mobile app development": "JavaScript/TypeScript", // Usually React Native in this context, or assumption
    
    // --- DATA ---
    "big data strategy": "Data Strategy",
    
    "data engineering": "Data Engineering",
    "data engineering & etl pipelines": "Data Engineering",
    "etl/data pipelines": "Data Engineering",
    "pyspark": "Data Engineering",
    "hadoop/hive": "Data Engineering",
    "big data architecture (hadoop, kafka, hbase)": "Data Engineering",
    "etl architecture": "Data Engineering",
    
    "data analytics": "Data Analytics/BI",
    "tableau": "Data Analytics/BI",
    "looker": "Data Analytics/BI",
    "business intelligence": "Data Analytics/BI",
    "data science & analytics": "Data Analytics/BI",
    
    "sql": "Database Management",
    "sql/dbt": "Database Management",
    "google bigquery": "Database Management",
    "bigquery": "Database Management",
    "storage & data management": "Database Management",
    "data modeling": "Database Management",
    "data architecture": "Database Management",

    "apache kafka & event streaming": "Event Streaming",
    
    // --- SECURITY ---
    "identity & access management (iam)": "Identity & Access Management",
    "iam security": "Identity & Access Management",
    
    "disaster recovery & business continuity": "Cybersecurity", // imperfect, but fits security/risk
    
    // --- STRATEGY ---
    "strategic business alignment": "Digital Transformation",
    "enterprise migrations": "Digital Transformation",
    "infrastructure modernization": "Digital Transformation",
    "cloud-native architecture": "Digital Transformation", // High level
    
    "product management": "Product Strategy",
    "product management/founding": "Product Strategy",
    "gtm strategy": "Product Strategy",
    "solution strategy & gtm": "Product Strategy",
    
    "technical leadership": "Technical Leadership",
    "technical mentorship": "Technical Leadership",
    "solution design & pre-sales": "Technical Leadership",
    "solutions architecture & sales engineering": "Technical Leadership",
    
    "sales engineering": "Sales Engineering",
    "strategic account management": "Sales Engineering",
    "vendor negotiation & budget management": "Sales Engineering",
    
    // --- INDUSTRY ---
    "electronic trading systems": "Financial Services",
    "market data infrastructure": "Financial Services",
    "ultra-low latency performance tuning": "Financial Services",
    
    "telecommunications / nfvi": "Telecommunications",
    "iot & 5g systems": "Telecommunications",
    
    "iot & edge computing": "IoT & Edge",
    "iot & smart home automation": "IoT & Edge",
    "embedded systems & can bus": "IoT & Edge",
    "robotics & autonomous services": "IoT & Edge",
    
    "healthcare informatics": "Healthcare",
    
    "ott & media streaming (cdn/drm)": "Media & Entertainment",
    
    // --- MISC / REMAPPING ---
    "agile methodologies (scrum/devops)": "SRE & DevOps",
    "content management systems (cms)": "JavaScript/TypeScript", // Fallback
    "e-commerce strategy & personalization": "Digital Transformation",
    "six sigma": "Digital Transformation",
    "salesforce crm": "Digital Transformation", // Or Industry? Default strategy.
    "smart grid & energy systems": "Industry", // Fallback if we had Energy
    "itsm / itil framework": "SRE & DevOps",
};

// Skills that split into multiple
const SPLIT_SKILLS: Record<string, string[]> = {
  "generative ai / vertex ai": ["Generative AI", "Vertex AI"],
  "generative ai & vertex ai": ["Generative AI", "Vertex AI"],
};

async function normalizeSkills() {
  console.log("🚀 Starting Comprehensive Skill Normalization...");

  try {
    const skillsCollection = adminDb.collection("skills");
    const membersCollection = adminDb.collection("team_members");
    const batch = adminDb.batch();

    // 1. Get ALL current skills
    const skillsSnap = await skillsCollection.get();
    const existingSkillsMap = new Map<string, any>(); // ID -> Data
    const nameToIdMap = new Map<string, string>(); // Name(Lower) -> ID

    skillsSnap.docs.forEach((doc) => {
      const data = doc.data();
      existingSkillsMap.set(doc.id, data);
      nameToIdMap.set(data.name.toLowerCase().trim(), doc.id);
    });

    console.log(`Found ${skillsSnap.size} existing skills.`);

    // 2. Get or Create Target Master Skills
    const masterSkillIds: Record<string, string> = {};

    for (const def of MASTER_SKILLS_DEF) {
      const lowerName = def.name.toLowerCase();
      let masterId = nameToIdMap.get(lowerName);

      if (!masterId) {
        console.log(`Creating missing master skill: ${def.name}`);
        const newDocRef = skillsCollection.doc();
        masterId = newDocRef.id;
        
        batch.set(newDocRef, {
          id: masterId,
          ...def,
          demand: 1.0, // default
        });
        nameToIdMap.set(lowerName, masterId);
      } else {
         // Update description/category/icon if exists
         batch.set(skillsCollection.doc(masterId), { ...def }, { merge: true });
      }
      masterSkillIds[def.name] = masterId;
    }

    // 3. Update Team Members
    const membersSnap = await membersCollection.get();
    let updatedMembersCount = 0;

    for (const doc of membersSnap.docs) {
      const member = doc.data();
      const memberSkills = member.skills || {};
      let needsUpdate = false;
      const newSkills: Record<string, number> = { ...memberSkills };

      // Helper to set new score with high-water mark
      const mergeScore = (targetName: string, score: number) => {
        const tId = masterSkillIds[targetName];
        if (!tId) return; // Should not happen if master skills created correctly
        const existing = newSkills[tId] || 0;
        if (score > existing) {
            newSkills[tId] = score;
        }
      };

      for (const [skillId, rating] of Object.entries(memberSkills)) {
        const originalSkill = existingSkillsMap.get(skillId);
        if (!originalSkill) continue;

        const lowerName = originalSkill.name.toLowerCase().trim();
        const currentRating = Number(rating);

        // A. Direct Mapping
        if (SKILL_MAPPING[lowerName]) {
          const targetName = SKILL_MAPPING[lowerName];
          mergeScore(targetName, currentRating);
          
          if (masterSkillIds[targetName] !== skillId) {
              delete newSkills[skillId];
              needsUpdate = true;
          }
        }
        
        // B. Split Mapping
        else if (SPLIT_SKILLS[lowerName]) {
          const targets = SPLIT_SKILLS[lowerName];
          targets.forEach(tName => mergeScore(tName, currentRating));
          delete newSkills[skillId];
          needsUpdate = true;
        }
        
        // C. Clean up "Unknowns" or those destined for deletion that aren't mapped?
        // If it isn't in MAPPING and isn't a Master Skill, it is "Uncategorized" or "Other".
        // For now, we only delete if we explicitly mapped it away.
      }

      if (needsUpdate) {
        batch.update(doc.ref, { skills: newSkills });
        updatedMembersCount++;
      }
    }

    // 4. Cleanup Obsolete Skills
    // Delete any skill that is a key in our MAPPING or SPLIT lists (unless it is a Master Skill itself, which shouldn't happen by definition usually)
    const skillsToDelete = new Set<string>();
    
    Object.keys(SKILL_MAPPING).forEach(k => {
       const targetName = SKILL_MAPPING[k];
       // Only delete if name is effectively different
       if (k !== targetName.toLowerCase()) {
         const id = nameToIdMap.get(k);
         if (id) skillsToDelete.add(id);
       }
    });

    Object.keys(SPLIT_SKILLS).forEach(k => {
       const id = nameToIdMap.get(k);
       if (id) skillsToDelete.add(id);
    });

    console.log(`Identify ${skillsToDelete.size} obsolete skills to delete.`);
    
    skillsToDelete.forEach(id => {
      const isMaster = Object.values(masterSkillIds).includes(id);
      if (!isMaster) {
        batch.delete(skillsCollection.doc(id));
      }
    });

    await batch.commit();

    console.log("✅ Comprehensive Normalization Complete!");
    console.log(`- Updated ${updatedMembersCount} team members.`);
    console.log(`- Established ${MASTER_SKILLS_DEF.length} master skills.`);

    return { success: true };

  } catch (error) {
    console.error("Scale Normalization Failed:", error);
    return { success: false, error };
  }
}

export { normalizeSkills };
