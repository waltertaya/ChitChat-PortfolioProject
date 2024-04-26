const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();

app.use(express.json());
const port = 5000;

const firstMessage = "Hello there! 👋 I'm ChitChat, your personal AI companion. It's great to meet you! How are you feeling today?";
const rules = [
    `First message should be "${firstMessage}"`,
    "Should be informal and use emojis where possible",
    "Replies should be short and concise",
    "Directly address the user",
    "Use the user's name where possible and keep the conversations going"
]
let previousChats = {};

app.all('/', async (req, res) => {

    const api_key = process.env.API_KEY;

    console.log(req.body);
    const userMessage = req.body.userMessage;
    console.log(userMessage);
    let messages = {};
    messages.userMessage = userMessage;
    messages.rules = rules;
    messages.previousChats = previousChats;
    const genAI = new GoogleGenerativeAI(api_key);
  
    async function run() {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = messages;
            // convert the prompt to a string
            promptStr = JSON.stringify(prompt);
            console.log(promptStr);
            const results = await model.generateContent(promptStr);

            const response = await results.response.text();

            previousChats.userMessage = userMessage;
            previousChats.botResponse = response;

            return response;

        } catch (error) {
            console.error(error);
        }
    }

    try {
        const text = await run();
        const data = { AI: text };
        res.json(data);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});