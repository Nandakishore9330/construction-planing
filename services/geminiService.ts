import { GoogleGenAI, Type } from "@google/genai";
import { ProjectDetails, AIAnalysisResult, BlueprintAnalysis } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey });

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateProjectPlan = async (details: ProjectDetails): Promise<AIAnalysisResult> => {
  const prompt = `
    Act as a senior construction project manager and estimator.
    Generate a detailed construction plan for the following project:
    
    Name: ${details.projectName}
    Type: ${details.projectType}
    Location: ${details.location}
    Area: ${details.areaSqFt} sq ft
    Budget: $${details.budget}
    Duration: ${details.durationMonths} months
    Description: ${details.description}

    Provide:
    1. A cost breakdown by category.
    2. A resource list with quantities.
    3. A project schedule with phases and milestones.
    4. Optimization suggestions to save time/money.
    5. A risk score (0-100).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          costBreakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                estimatedCost: { type: Type.NUMBER },
                details: { type: Type.STRING },
              }
            }
          },
          resources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                resourceName: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                unit: { type: Type.STRING },
                estimatedCost: { type: Type.NUMBER },
              }
            }
          },
          schedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING },
                durationWeeks: { type: Type.NUMBER },
                milestone: { type: Type.STRING },
                riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
              }
            }
          },
          optimizationSuggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          totalEstimatedCost: { type: Type.NUMBER },
          riskScore: { type: Type.NUMBER },
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate project plan");
  }

  return JSON.parse(response.text) as AIAnalysisResult;
};

export const analyzeBlueprintImage = async (base64Image: string, mimeType: string): Promise<BlueprintAnalysis> => {
  const prompt = `
    Analyze this construction blueprint/image. 
    Identify key architectural elements, potential safety risks, design suggestions, and compliance notes.
    
    Output strictly valid JSON with the following structure:
    {
      "identifiedObjects": ["string"],
      "safetyRisks": ["string"],
      "designSuggestions": ["string"],
      "complianceCheck": "string"
    }
    DO NOT include markdown formatting like \`\`\`json. Return raw JSON only.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Image
          }
        },
        { text: prompt }
      ]
    }
  });

  if (!response.text) {
     throw new Error("Failed to analyze blueprint");
  }

  // Clean up potential markdown code blocks just in case
  const cleanedText = response.text.replace(/```json\n?|\n?```/g, "").trim();

  try {
    return JSON.parse(cleanedText) as BlueprintAnalysis;
  } catch (error) {
    console.error("JSON Parse Error:", error);
    throw new Error("Failed to parse blueprint analysis results.");
  }
};
