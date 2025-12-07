import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize Gemini only if API key exists to prevent crashes
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateItemDescription = async (title: string, category: string, location: string): Promise<string> => {
  if (!ai) {
    return "API Key not configured. Please fill description manually.";
  }

  try {
    const prompt = `
      You are an assistant for a rental marketplace called 'SewaLokal' in Malaysia.
      Write a short, attractive, and professional listing description (in Bahasa Melayu) for an item being rented out.
      
      Item: ${title}
      Category: ${category}
      Location: ${location}
      
      Keep it under 50 words. Focus on utility and condition. Do not invent specific defects, just say it is in good condition.
      Tone: Friendly and trustworthy.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Failed to generate description.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating description. Please try again or write manually.";
  }
};