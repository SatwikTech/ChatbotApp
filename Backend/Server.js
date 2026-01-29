import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fetch from "node-fetch";

dotenv.config();

console.log("Mongo URI:", process.env.MONGO_URI);
console.log("OpenAI Key:", process.env.OPENAI_API_KEY ? "Loaded" : "Missing")

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err));

mongoose.connection.on("error", err => {
  console.error("❌ MongoDB connection error:", err);
});

mongoose.connection.once("open", () => {
  console.log(" Connected to MongoDB");
});

//  Schema & Model
const chatSchema = new mongoose.Schema({
  username: { type: String, default: "Anonymous" },
  question: { type: String, required: true },
  response: { type: String },
  timestamp: { type: Date, default: Date.now },
}, { collection: "chathistory" });

const Chat = mongoose.model("Chat", chatSchema);

//  Endpoint: Chat with OpenAI and Save
app.post("/chat", async (req, res) => {
  const { username, message } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ success: false, error: "Message is required." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, //  corrected
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return res.status(response.status).json({
        success: false,
        error: data.error?.message || "Unknown error",
      });
    }

    const reply = data.choices?.[0]?.message?.content || "No response from model.";

    const chatEntry = new Chat({
      username: username || "Anonymous",
      question: message,
      response: reply,
    });
    await chatEntry.save();

    res.json({ success: true, data: chatEntry });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ success: false, error: "Server error: Unable to fetch response." });
  }
});

app.post("/savechat", async (req, res) => {
  const { username, question, response } = req.body;
  try {
    const chatEntry = new Chat({ username, question, response });
    await chatEntry.save();
    res.status(201).json({ success: true, data: chatEntry });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to save chat" });
  }
});

app.get("/chathistory", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20; // default: last 20
    const chats = await Chat.find({}, "username question response timestamp")
      .sort({ timestamp: -1 }) // newest first
      .limit(limit);

    res.json({ success: true, data: chats.reverse() }); // oldest → newest
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch chat history" });
  }
});

//  Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});