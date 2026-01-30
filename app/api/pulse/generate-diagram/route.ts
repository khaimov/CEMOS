import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { brief, customer } = await req.json();

    if (!brief || !customer) {
      return NextResponse.json({ error: "Missing brief or customer data" }, { status: 400 });
    }

    // Using gemini-3 for high quality code/SVG generation
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
    You are an expert Cloud Architect and System Designer.
    Create a technical architecture diagram for the customer "${customer.name}" based on the following intelligence brief:
    
    Headline: ${brief.headline}
    Context: ${brief.context}
    Strategy: ${brief.strategy}
    Actions: ${brief.actions.join(", ")}
    
    The diagram should visually represent the proposed solution/strategy.
    
    CRITICAL OUTPUT INSTRUCTION:
    - Generate ONLY the raw SVG code for the diagram.
    - Do NOT include any markdown code blocks (no \`\`\`xml or \`\`\`svg).
    - Start directly with <svg ... and end with </svg>.
    - Ensure the SVG is responsive (use viewBox, set width="100%" height="auto" or similar).
    - Use a professional, clean, modern color scheme (blues, grays, teals, white text on dark backgrounds if appropriate for a dark mode UI, or neutral).
    - The SVG background should be transparent or match a glassmorphic dark theme (so use white/light strokes and text).
    - Include boxes for key components (e.g., "Legacy System", "AI Model", "Cloud Infrastructure", "Data Pipeline").
    - Use arrows to show data flow or relationships.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let svg = response.text().trim();

    // Cleanup if model adds markdown
    if (svg.startsWith("```")) {
      svg = svg.replace(/^```(xml|svg)?\n?/, "").replace(/```$/, "").trim();
    }

    // Find the first <svg and last </svg> to ensure we only get the code
    const startIndex = svg.indexOf("<svg");
    const endIndex = svg.lastIndexOf("</svg>");
    if (startIndex !== -1 && endIndex !== -1) {
      svg = svg.substring(startIndex, endIndex + 6);
    }

    return NextResponse.json({ svg });
  } catch (error: any) {
    console.error("Diagram Gen Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
