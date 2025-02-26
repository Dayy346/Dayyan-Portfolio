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

app.post("/chat", async (req, res) => {
    try {
        const apiUrl = "https://openrouter.ai/api/v1/chat/completions";

        const requestBody = {
            model: "mistralai/mistral-7b-instruct", 
            messages: [{ role: "user", content: req.body.message }],
            max_tokens: 100
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
