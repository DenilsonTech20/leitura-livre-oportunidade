
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function askGemini(question: string, context: string) {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
    You are an educational assistant helping with questions about a book.
    Here's some context about the book: ${context}
    
    The user's question is: ${question}
    
    Please provide a helpful, informative response based on the context provided.
    If you cannot answer the question based on the given context, please indicate that.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    return "I'm sorry, I encountered an error processing your question. Please try again later.";
  }
}
