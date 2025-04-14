import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

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

function findMatchingProject(query) {
    query = query.toLowerCase();
    
    // Handle "explain" or "describe" commands
    const searchTerms = query.replace(/explain|describe|tell me about|what is/gi, '').trim();
    
    // Find best matching project
    return projectData.find(project => 
        project.name.toLowerCase().includes(searchTerms) ||
        project.description.toLowerCase().includes(searchTerms)
    );
}

function generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // List all projects command
    if (message.includes("list") && message.includes("project")) {
        return "Here are my projects:\n" + projectData.map(p => `- ${p.name}`).join("\n");
    }
    
    // Find specific project
    const project = findMatchingProject(message);
    if (project) {
        return `${project.name}: ${project.description}`;
    }
    
    // Default responses
    if (message.includes("hello") || message.includes("hi ")) {
        return "Hello! I can tell you about my projects. Try asking about a specific project or say 'list projects' to see all of them.";
    }
    
    return "I can help you learn about my projects. Try asking about a specific project or say 'list projects' to see what I've worked on.";
}

app.post("/chat", (req, res) => {
    const userMessage = req.body.message;
    const response = generateResponse(userMessage);
    
    res.json({
        choices: [{
            message: {
                content: response
            }
        }]
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
