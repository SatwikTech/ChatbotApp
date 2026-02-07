// src/components/LeftNavbar.jsx
import React from "react";
import { Box } from "@mui/material";
import QuestionHistory from "./QuestionHistory";

function LeftNavbar({ history ,onSelect}) {
  return (
    <Box
      sx={{
        width: 300,
        bgcolor: "grey.100",
        borderRight: "1px solid #ddd",
        height: "100vh",
        position: "absolute",
        left: 0,
        top: 81,
        overflowY: "auto",
        maxHeight: "calc(100vh - 81px)",
      }}
    >
      <QuestionHistory history={history} onSelect={onSelect}/>
    </Box>
  );
}

export default LeftNavbar;