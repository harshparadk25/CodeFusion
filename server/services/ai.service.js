import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_AI_KEY
}); 

export const generateResult = async (prompt) => {
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    systemInstructions: "You are a helpful assistant."
  });

  return response.text;
};
