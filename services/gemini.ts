
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generatePolicyDraft(clientName: string, policyType: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Draft a professional ${policyType} policy for a company named ${clientName}. 
      Focus on compliance, clarity for employees, and strict attendance tracking. 
      Use a structured format with headings.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate policy. Please try again later.";
  }
}
