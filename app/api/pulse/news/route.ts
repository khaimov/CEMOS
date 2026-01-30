import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { company } = await req.json();

    if (!company) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    // 1. Fetch Real News from Google RSS
    // Use + for spaces to match user preferred format: https://news.google.com/rss/search?q=Snorkel+AI...
    // Added &scoring=n to ensure we get the NEWEST articles first
    const formattedCompany = encodeURIComponent(company).replace(/%20/g, "+");
    const rssUrl = `https://news.google.com/rss/search?q=${formattedCompany}&hl=en-US&gl=US&ceid=US:en&scoring=n`;
    const rssRes = await fetch(rssUrl);
    const rssText = await rssRes.text();

    // 2. Simple XML Extraction (Regex for speed/no-deps)
    // Extract first item title and link
    const itemMatch = rssText.match(/<item>([\s\S]*?)<\/item>/);
    let newsContext = "";
    let articleLink = "";
    let articleTitle = "";

    if (itemMatch) {
      const itemContent = itemMatch[1];
      const titleMatch = itemContent.match(/<title>(.*?)<\/title>/);
      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
      const dateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);

      articleTitle = titleMatch ? titleMatch[1].replace("<![CDATA[", "").replace("]]>", "") : "";
      articleLink = linkMatch ? linkMatch[1] : "";
      const date = dateMatch ? dateMatch[1] : "";

      newsContext = articleTitle;
    } else {
      newsContext = "No recent specific news items found in public RSS.";
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.warn("GOOGLE_API_KEY is missing. Returning mock data.");
      return NextResponse.json({
        headline: articleTitle || `${company} continues to innovate in their sector.`,
        category: "General",
        relevance: "API Key missing - Mock strategic insight: Monitor for upcoming earnings.",
        sentiment: "neutral",
        link: articleLink
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
      You are a Senior Strategic Sales Analyst for Google Cloud.
      
      Target Account: "${company}"
      Real-time Update Context: ${newsContext}
      
      Task: Analyze this specific news item (or general company status if no news) for a "Real-time Pulse" update.
      
      Provide a JSON response with:
      1. "headline": The actual news headline (cleaned up) or a summary of the situation.
      2. "category": One of ["Expansion", "AI/ML Launch", "Funding", "Leadership", "Partnership", "Risk", "General"].
      3. "relevance": A brief 1-sentence strategic interpretation for a Google Cloud Sales Rep. (e.g. "Competitor alignment detected - pitch multi-cloud", "New AI division - pitch Vertex").
      4. "sentiment": "positive", "neutral", or "negative".
      5. "link": "${articleLink}" (Pass this through exactly if available).
      
      Keep it professional, concise, and actionable.
      Return ONLY valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();

    // Inject the real link if Gemini drops it or if we want to ensure it's there
    const parsed = JSON.parse(text);
    if (articleLink && !parsed.link) parsed.link = articleLink;

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Pulse API Error:", error);
    return NextResponse.json({
      headline: "Unable to analyze live signal.",
      category: "System",
      relevance: "Real-time feed unavailable.",
      sentiment: "neutral",
      link: ""
    }, { status: 500 });
  }
}
