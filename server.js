import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.post("/chat", async (req, res) => {
    try {
        const mistralUrl = "https://api.mistral.ai/v1/chat/completions";  

        const requestBody = {
            model: "mistral-7b-instruct",
            messages: [{ role: "user", content: req.body.message }]
        };

        console.log("Sending request to Mistral API:", requestBody);

        const response = await fetch(mistralUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
        console.log("Mistral API Response:", data);

        res.json(data);
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
