import { GoogleGenAI } from "@google/genai";
import { Manga } from '../types';

// Initialize Gemini Client
const apiKey = process.env.API_KEY || ''; 
// In a real app, we handle the missing key gracefully. 
// Here we assume it might be missing and return mock responses if so.

const ai = new GoogleGenAI({ apiKey });

export const getMangaRecommendations = async (query: string, availableManga: Manga[]): Promise<string> => {
  if (!apiKey) {
    return "AI features require an API Key. Please configure it to get smart recommendations.";
  }

  try {
    const mangaListString = availableManga.map(m => `- ${m.title} (${m.genres.join(', ')})`).join('\n');
    
    const prompt = `
      You are an expert manga librarian for "OneStop Manga Reader".
      User Query: "${query}"
      
      Available Manga Library:
      ${mangaListString}
      
      Task: Recommend the best match from the library based on the user's query. 
      If nothing fits perfectly, recommend the closest match.
      Provide a brief, exciting 1-sentence reason why.
      Format: "I recommend [Manga Title] because [Reason]."
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "I couldn't find a specific recommendation, but try exploring our Top Rated section!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The AI librarian is currently taking a nap. Please try again later.";
  }
};

export const summarizeManga = async (title: string, description: string): Promise<string> => {
   if (!apiKey) {
    return description;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize this manga description into a catchy 10-word tagline for a banner ad:\n\nTitle: ${title}\nDescription: ${description}`,
    });
    return response.text || description;
  } catch (e) {
    return description;
  }
}