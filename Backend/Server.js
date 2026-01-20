import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/chatapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on("error", err => {
    console.error("❌ MongoDB connection error:", err);
});

mongoose.connection.once("open", () => {
    console.log("✅ Connected to MongoDB");
});


const chatSchema = new mongoose.Schema({
    username: String,
    question: String,
    response: String,
    timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);

app.post("/chat", async (req, res) => {
    const { username, message } = req.body;

    if (!message || message.trim() === "") {
        return res.status(400).json({ reply: "Error: message is required." });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // or whichever model you use
                messages: [{ role: "user", content: message }],
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenAI API error:", data);
            return res
                .status(response.status)
                .json({ reply: `Error: ${data.error?.message || "Unknown error"}` });
        }

        const reply = data.choices?.[0]?.message?.content || "No response from model.";

        const chatEntry = new Chat({
            username: username || "Anonymous",
            question: message,
            response: reply,
        });
        await chatEntry.save();

        res.json({ reply });
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ reply: "Server error: Unable to fetch response." });
    }
});

app.get("/chathistory", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20; // default: last 20
        const chats = await Chat.find({}, "username question response")
            .sort({ timestamp: -1 }) // newest first
            .limit(limit);
        res.json(chats.reverse()); // reverse so oldest → newest
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
});

app.post("/savechat", async (req, res) => {
    const { username, question, response } = req.body;
    try {
        const chatEntry = new Chat({ username, question, response });
        await chatEntry.save();
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to save chat" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});