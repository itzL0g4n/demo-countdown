import { GoogleGenAI } from "@google/genai";
import { PredictionType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFuturePrediction = async (type: PredictionType): Promise<string> => {
  try {
    let prompt = "";
    
    switch(type) {
      case PredictionType.MOTIVATION:
        prompt = "Give me a short, inspiring New Year's wish for someone entering 2026. Focus on hope, success, and new beginnings. Keep it poetic and under 30 words.";
        break;
      case PredictionType.FORTUNE:
        prompt = "Act as a mystical fortune teller. Predict a positive, lucky event that will happen to the user in 2026. Be whimsical and magical. Keep it under 35 words.";
        break;
      case PredictionType.RESOLUTION:
        prompt = "Suggest a sophisticated and meaningful New Year's Resolution for 2026. Focus on personal growth, elegance, or mindfulness. Keep it under 25 words.";
        break;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, 
        temperature: 1.1, 
      }
    });

    return response.text || "The stars are aligning for you.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The future is bright, try again in a moment.";
  }
};