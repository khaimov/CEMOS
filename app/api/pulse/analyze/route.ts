import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { INITIAL_TEAM } from "@/lib/talent-data";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { customer } = await req.json();

    if (!customer) {
      return NextResponse.json({ error: "Customer data is required" }, { status: 400 });
    }

    // 1. Fetch News from RSS
    const formattedCompany = encodeURIComponent(customer.name).replace(/%20/g, "+");
    const rssUrl = `https://news.google.com/rss/search?q=${formattedCompany}&hl=en-US&gl=US&ceid=US:en&scoring=n`;
    const rssRes = await fetch(rssUrl);
    const rssText = await rssRes.text();

    const itemMatch = rssText.match(/<item>([\s\S]*?)<\/item>/);
    let articleTitle = "";
    let articleLink = "";

    if (itemMatch) {
      const itemContent = itemMatch[1];
      const titleMatch = itemContent.match(/<title>(.*?)<\/title>/);
      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
      articleTitle = titleMatch ? titleMatch[1].replace("<![CDATA[", "").replace("]]>", "") : "";
      articleLink = linkMatch ? linkMatch[1] : "";
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // 2. Fetch Talent Pool from Firestore (Live Data)
    const { adminDb } = await import("@/lib/firebase-admin");
    const teamSnapshot = await adminDb.collection("team_members").get();
    let members: any[] = [];

    if (!teamSnapshot.empty) {
      members = teamSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } else {
      console.warn("Firestore team_members collection is empty. Falling back to INITIAL_TEAM.");
      members = INITIAL_TEAM;
    }

    // Prepare talent pool summary for the LLM
    const talentPool = members.map(m => ({
      name: m.name,
      role: m.role,
      domains: m.domains || [],
      ldap: m.ldap
    }));

    const prompt = `
      You are the OutcomeOS Intelligence Engine. Your goal is to synthesize customer signals and deploy the perfect squad.
      
      CUSTOMER:
      Name: ${customer.name}
      Milestone: ${customer.milestone}
      Risk: ${customer.risk}
      Current Blocker: ${customer.blocker || "None"}
      Consumption: ${customer.consumption}%
      
      SIGNAL (NEWS):
      Headline: ${articleTitle || "No specific recent news found."}
      Link: ${articleLink}
      
      TALENT POOL:
      ${JSON.stringify(talentPool, null, 2)}
      
      TASK:
      Generate a comprehensive Intelligence Brief. Match exactly 2 team members from the pool who are best suited to help the customer.
      
      JSON FORMAT:
      {
        "headline": "...",
        "category": "One of [Expansion, AI/ML Launch, Funding, Leadership, Partnership, Risk, General]",
        "sentiment": "positive | neutral | negative",
        "context": "A 2-sentence summary of the situation (WHAT)",
        "strategy": "A high-level executive strategy to address the situation (WHY)",
        "actions": ["Action 1", "Action 2", "Action 3"],
        "matches": [
          {
            "ldap": "ldap_of_member_1",
            "reason": "Why this person? Be specific about their domains vs the customer needs."
          },
          {
            "ldap": "ldap_of_member_2",
            "reason": "Why this person?"
          }
        ],
        "link": "${articleLink}"
      }
      
      Ensure 'matches' contains the ldap of the chosen members from the talent pool.
      Return ONLY valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(responseText);

    // Hydrate the matches with full member data
    const fullMatches = parsed.matches.map((m: any) => {
      const member = members.find(t => t.ldap === m.ldap);
      return {
        member: member || members[0],
        reason: m.reason
      };
    });

    return NextResponse.json({
      ...parsed,
      matches: fullMatches
    });

  } catch (error: any) {
    console.error("Analyze API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
