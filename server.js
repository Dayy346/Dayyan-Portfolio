import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const projectData = [
    {
        name: "LeNet5Tool",
        description: "A personal project using a modified version of the LeNet-5 structure to develop machine learning models for any labeled datasets."
    },
    {
        name: "AI_final",
        description: "Comparison between Perceptron and Naïve Bayes algorithms, analyzing their performance on classification tasks."
    },
    {
        name: "Price Tracker Extension",
        description: "A Chrome extension that tracks product prices and notifies users when a price drop occurs. Uses React for the frontend, Puppeteer for web scraping, and Node.js for the backend."
    },
    {
        name: "NFC Attendance System",
        description: "An NFC tag reader connected via USB to track attendance. When an NFC tag is scanned, the system records attendance and stores the data in a spreadsheet. Built in Java."
    },
    {
        name: "EmailSpamChecker",
        description: "A machine learning-based email spam checker that classifies emails as 'spam' or 'ham' (legitimate). Provides an automated solution for spam detection."
    },
    {
        name: "DiscordMusicBot",
        description: "A simple Discord bot that joins voice channels, plays audio from YouTube URLs, and controls playback. Uses `discord.py` and `yt-dlp` for streaming."
    },
    {
        name: "Portfolio Website",
        description: "A personal portfolio showcasing projects, GitHub activity, and problem-solving skills. Features an interactive chatbot, GitHub contributions, LeetCode statistics, and a powerlifting section."
    }
];

// Build static project context text
let projectContext = "Project Context:\n";
projectData.forEach(proj => {
    projectContext += `Project: ${proj.name} - ${proj.description}\n`;
});

// Updated conversation history with refined instructions
let conversationHistory = [
    {
        role: "system",
        content: "You are an expert assistant with deep knowledge of the user's projects. When the user issues a command like 'explain [project name]' or 'describe [project name]', do the following:\n" +
                 "- Extract the intended project name from the command, ignoring case and allowing partial matches. For instance, 'explain price tracker' should match 'Price Tracker Extension' and 'explain discord music bot' should match 'DiscordMusicBot'.\n" +
                 "- If a match is found, provide a direct, concise explanation using the provided project context.\n" +
                 "- If no match is found, list the available projects without asking for clarification.\n" +
                 "Do not ask clarifying questions. Directly respond based on the context provided below."
    },
    {
        role: "system",
        content: projectContext
    }
];

app.post("/chat", async (req, res) => {
    try {
        const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
        const userMessage = req.body.message;
        
        // Append the user's message to the conversation history.
        conversationHistory.push({ role: "user", content: userMessage });

        const requestBody = {
            model: "meta-llama/llama-3-8b-instruct",
            messages: conversationHistory,
            max_tokens: 150, // Adjusted for concise responses.
            temperature: 0.7   // Moderate creativity.
        };

        console.log("Sending request to OpenRouter API:", requestBody);

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        console.log("Received response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error Response:", errorText);
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("OpenRouter API Response:", data);

        // Append the assistant's response to the conversation history.
        if (data.choices && data.choices.length > 0) {
            conversationHistory.push({
                role: "assistant",
                content: data.choices[0].message.content
            });
        }

        res.json(data);
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
