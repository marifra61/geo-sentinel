

import { GoogleGenAI } from "@google/genai";
import { SeoReport } from "../types";

// Always use { apiKey: process.env.API_KEY } as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeUrl = async (url: string): Promise<SeoReport> => {
  // Use gemini-3-pro-preview for complex reasoning and search grounding tasks
  const modelId = "gemini-3-pro-preview"; 
  
  const prompt = `
    You are GEO Sentinel, an elite enterprise-grade Generative Engine Optimization (GEO) forensic auditor. 
    Your mission is to perform an exhaustive analysis of the following URL to determine how "visible" and "citable" it is to LLMs like Gemini, Claude, and ChatGPT.
    
    Target URL: ${url}

    OPERATIONAL GUIDELINES:
    1. **Google Search Grounding**: You MUST use Google Search to investigate the site's footprint, mentions across the web, and competitor landscape.
    2. **Neural Authority**: Evaluate not just keywords, but how the brand exists as an "Entity" in the knowledge graph.
    3. **The Citation Metric**: This is the most important score. Can an LLM extract a fact from this site and confidently link to it?
    4. **Competitor Forensics**: Research 3-5 top competitors. Provide actual data points on why they might be outranking the target site in LLM responses.

    METRICS TO EVALUATE:
    - Machine Readability
    - Answer Engine Optimization
    - Entity Authority
    - Semantic Coverage
    - Citation Potential
    - Factual Accuracy Signals

    Return a strictly structured JSON response. 
    ENSURE the output is valid JSON. 
    
    {
      "overallScore": number (0-100),
      "summary": string (Professional, strategic executive summary),
      "metrics": [
        {
          "name": "Machine Readability" | "Answer Engine Optimization" | "Entity Authority" | "Semantic Coverage" | "Citation Potential" | "Factual Accuracy Signals",
          "score": number,
          "description": string,
          "status": "Critical" | "Warning" | "Good" | "Excellent"
        }
      ],
      "benchmarks": {
        "industryAverage": number,
        "topCompetitor": {
          "name": string,
          "score": number,
          "strengths": string
        },
        "marketPosition": "Leader" | "Competitive" | "Behind" | "At Risk"
      },
      "googleVsAiComparison": {
        "googleFocus": string[],
        "aiFocus": string[]
      },
      "contentGaps": [
        {
          "topic": string,
          "searchVolume": "High" | "Medium" | "Low",
          "competitorsCovering": string[],
          "aiFrequency": "Often" | "Sometimes" | "Rarely"
        }
      ],
      "technicalIssues": [
        {
          "issue": string,
          "severity": "Critical" | "Major" | "Minor",
          "aiImpact": string
        }
      ],
      "aiInsights": [
        {
          "platform": "Gemini" | "ChatGPT" | "Perplexity" | "Claude",
          "visibility": "High" | "Medium" | "Low" | "Unknown",
          "suggestion": string
        }
      ],
      "recommendations": [
        {
          "title": string,
          "impact": "High" | "Medium" | "Low",
          "description": string,
          "actionItem": string,
          "estimatedLift": string 
        }
      ]
    }
  `;

  // Use ai.models.generateContent with both model name and prompt in parameters object
  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      // Help model output JSON while grounded
      responseMimeType: "application/json",
    }
  });

  // Extract text using property access, not function call
  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  // Extract grounding sources as required by guidelines when using googleSearch
  const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title,
    uri: chunk.web?.uri
  })).filter((source: any) => source.uri) || [];

  let data;
  try {
    // Attempt to parse text directly first as JSON mode was requested
    data = JSON.parse(text);
  } catch (e) {
    // Extract JSON substring if conversational text exists
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1) {
      try {
        data = JSON.parse(text.substring(startIndex, endIndex + 1));
      } catch (innerError) {
        throw new Error("AI response contained invalid JSON syntax.");
      }
    } else {
      throw new Error("AI response did not contain a valid JSON object.");
    }
  }

  return {
    ...data,
    url,
    timestamp: new Date().toISOString(),
    groundingSources
  };
};