import { GoogleGenerativeAI } from "@google/generative-ai"; // Updated import name
import dotenv from "dotenv";
dotenv.config();

// Initialize the API with your key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testDrive() {
  try {
    // Correct method to get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = "Give me a 1-sentence fun fact about Munich.";
    const result = await model.generateContent(prompt);
    
    console.log("Gemini says:", result.response.text());
  } catch (error) {
    console.error("Connection Error:", error.message);
  }
}

testDrive();