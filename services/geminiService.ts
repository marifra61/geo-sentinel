
import { GoogleGenAI } from "@google/genai";
import { SeoReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeUrl = async (url: string): Promise<SeoReport> => {
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
    - Machine Readability (How easily can a scraper/parser digest the content?)
    - Answer Engine Optimization (Is the content structured as direct answers to complex prompts?)
    - Entity Authority (Is the brand recognized as a trusted topical expert?)
    - Semantic Coverage (Does the content cover the 'why' and 'how' or just keywords?)
    - Citation Potential (Formatting for extraction + outbound sourcing quality)
    - Factual Accuracy Signals (Presence of original data, expert credentials, and citations)

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

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  const startIndex = text.indexOf('{');
  const endIndex = text.lastIndexOf('}');

  if (startIndex === -1 || endIndex === -1) {
    throw new Error("AI response did not contain a valid JSON object");
  }

  const jsonString = text.substring(startIndex, endIndex + 1);
  
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch (e) {
    throw new Error("AI response contained invalid JSON syntax");
  }

  return {
    ...data,
    url,
    timestamp: new Date().toISOString()
  };
};
