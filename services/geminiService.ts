
import { GoogleGenAI } from "@google/genai";
import { SeoReport } from "../types";

export const analyzeUrl = async (url: string): Promise<SeoReport> => {
  // Use gemini-3-flash-preview for the most stable Search Grounding experience
  const modelId = "gemini-3-flash-preview"; 
  
  // Use the environment key directly without manual selection
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are GEO Sentinel, an elite Generative Engine Optimization (GEO) forensic auditor. 
    Evaluate the provided URL to determine its visibility within AI-driven search synthesis.

    OPERATIONAL PROTOCOLS:
    1. Use Google Search grounding to investigate the brand's web authority and competitor visibility.
    2. Assess Citation Potential (formatting) and Semantic Coverage.
    3. Return your final analysis strictly as a JSON object inside your response. 
    
    IMPORTANT: You must include the JSON block in your response. Even if the search tool provides citations, your final answer text must contain the valid JSON structured like this:
    {
      "overallScore": number,
      "summary": "...",
      "metrics": [{ "name": "...", "score": number, "description": "...", "status": "Good" }],
      "benchmarks": { "industryAverage": 65, "topCompetitor": { "name": "...", "score": 80, "strengths": "..." }, "marketPosition": "Competitive" },
      "googleVsAiComparison": { "googleFocus": ["..."], "aiFocus": ["..."] },
      "contentGaps": [{ "topic": "...", "searchVolume": "High", "competitorsCovering": ["..."], "aiFrequency": "Often" }],
      "technicalIssues": [{ "issue": "...", "severity": "Minor", "aiImpact": "..." }],
      "aiInsights": [{ "platform": "Gemini", "visibility": "High", "suggestion": "..." }],
      "recommendations": [{ "title": "...", "impact": "High", "description": "...", "actionItem": "..." }]
    }
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: `Run a full forensic GEO audit for domain: ${url}. Use grounding to find real competitive context.`,
    config: {
      systemInstruction: systemInstruction,
      tools: [{ googleSearch: {} }],
      temperature: 0.1 // Low temperature ensures more reliable formatting
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("Neural response was empty. The node may be temporarily saturated.");
  }

  // Mandatory source extraction for attribution
  const candidate = response.candidates?.[0];
  const groundingChunks = candidate?.groundingMetadata?.groundingChunks;
  const groundingSources = groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Neural Citation',
    uri: chunk.web?.uri || ''
  })).filter((s: any) => s.uri) || [];

  // Robust "JSON Carving" to extract data from any conversational text
  const startIndex = text.indexOf('{');
  const endIndex = text.lastIndexOf('}');

  if (startIndex === -1 || endIndex === -1) {
    console.error("Raw response failed to contain JSON:", text);
    throw new Error("Packet Corruption: The AI engine failed to format the report data correctly. Please try once more.");
  }

  const jsonString = text.substring(startIndex, endIndex + 1);
  
  try {
    const data = JSON.parse(jsonString);
    return {
      ...data,
      url,
      timestamp: new Date().toISOString(),
      groundingSources
    };
  } catch (e) {
    throw new Error("Neural data corruption. The engine returned malformed data.");
  }
};
