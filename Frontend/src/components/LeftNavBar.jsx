// src/components/LeftNavbar.jsx
import React from "react";
import { Box } from "@mui/material";
import QuestionHistory from "./QuestionHistory";

function LeftNavbar({ history }) {
  return (
    <Box
      sx={{
        width: 250,
        bgcolor: "grey.100",
        borderRight: "1px solid #ddd",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <QuestionHistory history={history} />
    </Box>
  );
}

export default LeftNavbar;