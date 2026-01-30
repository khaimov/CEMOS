import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
// Imports moved to function scope for better error handling

// 1. Initialize Gemini
// NOTE: Make sure GOOGLE_API_KEY is in your .env.local
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 2. Extract Text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // pdf-parse might fail on some malformed PDFs, wrap in try/catch
    let text = "";
    try {
      // @ts-ignore
      const { PDFParse } = require("pdf-parse");
      // pdf-parse v2 uses a class-based API
      const parser = new PDFParse({ data: buffer });
      const data = await parser.getText();
      text = data.text;
      await parser.destroy();
    } catch (e: any) {
      console.error("PDF Parse Error:", e);
      return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
    }

    // 3. Analyze with Gemini
    // Upgrade to Gemini 3 for reasoning + Search Grounding
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      // @ts-ignore - Tools might not be fully typed in all SDK versions yet, but supported by API
      tools: [{ google_search: {} }]
    });
    console.log("Analyze Profile: Initialized gemini-3-flash-preview with Google Search");

    const prompt = `
    You are an expert Technical Recruiter and AI Architect. 
    Analyze the following resume/profile text and extract structured data for a "Talent Matrix".
    
    CRITICAL: Use Google Search to ENRICH the profile. 
    1. If the LinkedIn URL is missing in the text, SEARCH for "<Name> LinkedIn" to find it.
    2. specific skills, certifications, or "Outside Interests" are sparse, use Search to find public details about this person (e.g. from their public LinkedIn or GitHub).
    
    Text:
    """
    ${text.substring(0, 30000)} 
    """
    
    Return a STRICT JSON object (no markdown formatting) with this structure:
    {
      "name": "Full Name",
      "role": "One of: CE_L1, CE_L2, SPECIALIST, ARCHITECT",
      "skills": { 
        "Skill Name": Integrity (1-5), 
        "Another Skill": Integrity (1-5) 
      },
      "languages": ["Language 1", "Language 2"],
      "education": ["Degree - School"],
      "experience": ["Role - Company (Year)"],
      "certifications": ["Cert Name"],
      "outsideInterests": ["Interest 1", "Interest 2"],
      "assessmentSummary": "Brief strategic assessment of this candidate's fit for a high-performance cloud/AI team.",
      "linkedInUrl": "extracted or searched url"
    }

    - For 'skills', infer the proficiency (1=Awareness, 5=Thought Leader) based on context.
    - Map skills specifically to modern cloud/AI tech (Kubernetes, Vertex AI, React, Next.js, TensorFlow, etc.).
    - For 'role', infer based on seniority.
    - 'outsideInterests' should capture hobbies or non-technical traits (The Human Factor).
    - 'assessmentSummary' should be 2-3 sentences max.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text().replace(/```json/g, "").replace(/```/g, "").trim();

    const parsedData = JSON.parse(jsonString);

    return NextResponse.json({ success: true, data: parsedData });

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
