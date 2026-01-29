// src/components/QuestionHistory.jsx
import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider, ListItemButton } from "@mui/material";

function QuestionHistory({ history }) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Question History
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {/* <List>
        {history.map((q, index) => (
          <ListItem key={index} sx={{ py: 0.5 }}>
            <ListItemText primary={q} />
          </ListItem>
        ))}
      </List> */}
      <List>
        {history.map((chat, index) => (
          <ListItemButton key={chat.id || index} onClick={() => onSelect(chat)}>
            <ListItemText primary={chat.question} />
          </ListItemButton>
        ))}
      </List>

    </Box>
  );
}

export default QuestionHistory;