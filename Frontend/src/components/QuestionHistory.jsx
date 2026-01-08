// src/components/QuestionHistory.jsx
import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";

function QuestionHistory({ history }) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Question History
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        {history.map((q, index) => (
          <ListItem key={index} sx={{ py: 0.5 }}>
            <ListItemText primary={q} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default QuestionHistory;