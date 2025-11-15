import express from 'express';

const router = express.Router();

import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

const PORT = process.env.PORT || 3000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// // Workout coach AI route
// app.post("/api/chat", async (req, res) => {
//   try {
//     const { message } = req.body;

//     const prompt = `
// You are a friendly workout coach. Give simple, helpful workout advice.
// The user says: "${message}"
// `;

//     const result = await chatModel.generateContent(prompt);
//     const reply = result.response.text().trim();

//     return res.json({ reply });
//   } catch (err) {
//     console.error("AI Error:", err);
//     return res.json({ reply: "Error generating response." });
//   }
// });


export default router;