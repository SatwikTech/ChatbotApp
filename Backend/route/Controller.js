const express = require('express');
const ChatHistory = require('./models/ChatHistory');
const router = express.Router();

// Save a new chat message
router.post('/chat', async (req, res) => {
  try {
    const chat = new ChatHistory({
      userId: req.body.userId,
      message: req.body.message,
    });
    const savedChat = await chat.save();
    res.json(savedChat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;