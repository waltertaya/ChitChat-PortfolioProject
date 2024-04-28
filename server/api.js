const api = require('express').Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const firstMessage = "Hello there! 👋 I'm ChitChat, your personal AI companion. It's great to meet you! How are you feeling today?";
const rules = [
    `First message should be "${firstMessage}"`,
    "Should be informal and use emojis where possible",
    "Replies should be short and concise to keep the conversation flowing",
    "Replies should be maximum 1-2 sentences long",
    "Directly address the user",
    "Read the rules and previus chats to generate a response",
    "Use the user's name where possible and keep the conversations going either by asking questions or making statements or compliments"
]
let previousChats = {};

api.post('/', async (req, res) => {

    const api_key = process.env.API_KEY;
    const username = req.session.user.username;

    // console.log(req.body);
    const userMessage = req.body.userMessage;
    let messages = {};
    messages.userMessage = userMessage;
    messages.rules = rules;
    messages.previousChats = previousChats;
    messages.username = username;
    const genAI = new GoogleGenerativeAI(api_key);
  
    async function run() {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = messages;
            // convert the prompt to a string
            promptStr = JSON.stringify(prompt);
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

module.exports = api;