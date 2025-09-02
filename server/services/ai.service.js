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
   contents: [
      {
        role: "user",
        parts: [
          {
            text: `Return ONLY raw code. 
Do not explain. 
Do not add examples. 
Do not add "Output", "Explanation", or anything else. 
Just return clean C++ code inside triple backticks.

Question: ${prompt}`,
          },
        ],
      },
    ],
    systemInstruction: `You are an expert MERN developer. Always return only raw code (no explanations). 
Write clean, modular, and maintainable code with comments inside the code itself. 
Never return anything outside of code blocks.`

  });

  return response.text;
};
