const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
}, { 
  collection: 'chatapphistory'
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);