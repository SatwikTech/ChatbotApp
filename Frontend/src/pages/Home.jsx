import React, { useState } from "react";
import { Box, Typography, TextField, Button, Stack, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import logo from '../assets/react.svg';
import '../App.css';

function Home() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  let username = localStorage.getItem("username") || "Guest";

  const handleSend = () => {
    if (input.trim() === "") return;
    // navigate("/chat", { state: { question: input } });
    localStorage.setItem("lastQuestion", input);
    navigate("/chat");

  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      <Header />

      <Container className="chatDiv">
        <Box sx={{ p: 3 }} className="innerDiv">
          <Typography variant="h4" gutterBottom align="left">
            Chat with our AI Bot
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button variant="contained" onClick={handleSend}>
              Send
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
}

export default Home;