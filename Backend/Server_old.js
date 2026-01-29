import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.HF_API_KEY) {
  console.error("❌ Missing HF_API_KEY in .env file");
  process.exit(1);
}

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ reply: "Error: message is required." });
  }

  try {
    const response = await fetch(
  "https://router.huggingface.co/hf-inference/HuggingFaceTB/SmolLM3-3B",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: message }),
  }
);

   

    const data = await response.json();

    if (!response.ok) {
      console.error("Hugging Face API error:", data);
      return res
        .status(response.status)
        .json({ reply: `Error: ${data.error || "Unknown error"}` });
    }

    const reply = data[0]?.generated_text || "No response from model.";
    res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ reply: "Server error: Unable to fetch response." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});