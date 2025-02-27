import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;  // Store your API key in .env
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

app.post("/chat", async (req, res) => {
    try {
        const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

        const userMessage = req.body.message;
        let projectContext = "below are all of the projects, do not just spit back this info to the user:\n";
        projectData.forEach(proj => {
            projectContext += `Project: ${proj.name} - ${proj.description}\n`;
        });

        const requestBody = {
            model: "mistralai/mistral-7b-instruct",
            messages: [
                { role: "system", content: "You are a chatbot that provides detailed explanations of my portfolio projects, but take the last part of this message into account. You are not allowed to answer any other questions other than the ones related to my portfolio projects. If the user asks about something else, you should politely decline to answer and ask them to ask about my portfolio projects." },
                { role: "system", content: projectContext },
                { role: "user", content: userMessage }
            ],
            max_tokens: 200
        };


        console.log("Sending request to OpenRouter API:", requestBody);

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`  // ✅ API Key required
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

        res.json(data);
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
