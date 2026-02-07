import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Avatar,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import LeftNavbar from "../components/LeftNavbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "../components/Header";

function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialQuestion = location.state?.question || localStorage.getItem("lastQuestion") || "";

  const API_BASE = "http://localhost:3000"; // adjust if deployed or use proxy
  const messagesEndRef = useRef(null); // if required for auto-scroll will use later 

  const [messages, setMessages] = useState(
    initialQuestion
      ? [{ from: "user", text: initialQuestion }]
      : [{ from: "bot", text: "Hello! How can I help you today?" }]
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const username = localStorage.getItem("username") || "Anonymous";
  const [pendingResponse, setPendingResponse] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/chathistory?limit=20`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const formattedHistory = data.data
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

          setHistory(formattedHistory);  // each item has {id, question, response, timestamp}
        }
      })
      .catch(err => console.error("Failed to load history", err));
  }, []);

  useEffect(() => {
    if (!initialQuestion) return;
    setLoading(true);

    fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, message: initialQuestion }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const botresponse = Array.isArray(data.data.response)
            ? data.data.response.join("\n")
            : data.data.response;

          // update messages
          setMessages([
            { from: "user", text: initialQuestion },
            { from: "bot", text: botresponse }
          ]);

          // build new chat entry
          const newChat = {
            id: data.data.id || Date.now(),
            question: initialQuestion,
            response: botresponse,
            timestamp: data.data.timestamp,
            username: "FrontendUser"
          };

          // update history with deduplication
          setHistory(prev => {
            const exists = prev.some(item => item.id === newChat.id);
            return exists ? prev : [newChat, ...prev];
          });
        } else {
          setMessages(prev => [
            ...prev,
            { from: "bot", text: "Error: " + data.error }
          ]);
        }
      })
      .catch(() =>
        setMessages(prev => [
          ...prev,
          { from: "bot", text: "Error: Unable to fetch response." }
        ])
      )
      .finally(() => setLoading(false));
  }, [initialQuestion]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "FrontendUser", message: userMessage }),
      });
      const data = await res.json();

      if (data.success) {
        const fullResponse = Array.isArray(data.data.response)
          ? data.data.response.join("\n")
          : data.data.response;
        const newChat = {
          id: data.data.id || Date.now(),
          question: userMessage,
          response: data.data.response,
          timestamp: data.data.timestamp,
          username: "FrontendUser"
        };

        //Update sidebar history with the latest question
        setHistory(prev => {
          const exists = prev.some(item => item.id === newChat.id);
          return exists ? prev : [newChat, ...prev];
        });

        //If you want only the latest Q&A in the chat window:
        setMessages([
          { from: "user", text: userMessage },
          { from: "bot", text: data.data.response }
        ]);

      } else {
        setMessages([{ from: "bot", text: "Error: " + data.error }]);
      }
    } catch {
      setMessages([{ from: "bot", text: "Error: Unable to fetch response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ display: "flex" }}>

        {/* Left Sidebar */}
        <LeftNavbar
          history={history}
          onSelect={(chat) => {
            setMessages([
              { from: "user", text: chat.question },
              { from: "bot", text: chat.response }
            ]);
          }}
        />
        <Box sx={{ flex: 1, ml: "300px", p: 3, position: "relative" }}>
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={() => navigate("/")}
          >
            X
          </IconButton>

          <Typography variant="h4" gutterBottom>
            Answers
          </Typography>

          <Paper
            sx={{
              p: 2,
              height: "70vh",
              overflowY: "auto",
              mb: 2,
              borderRadius: 3,
              backgroundColor: "#f9f9f9",
            }}
          >
            <Stack spacing={2}>
              {messages.map((msg, index) => {
                const cleanText = msg.text.replace(/\n{3,}/g, "\n\n");

                return (
                  <Stack
                    key={index}
                    direction={msg.from === "user" ? "row-reverse" : "row"}
                    spacing={1}
                    alignItems="flex-start"
                  >
                    <Avatar sx={{ bgcolor: msg.from === "user" ? "primary.main" : "grey.500" }}>
                      {msg.from === "user" ? "👤" : "🤖"}
                    </Avatar>
                    <Box
                      sx={{
                        bgcolor: msg.from === "user" ? "primary.main" : "grey.200",
                        color: msg.from === "user" ? "white" : "black",
                        px: 2,
                        py: 1,
                        borderRadius:
                          msg.from === "user"
                            ? "16px 16px 0 16px"
                            : "16px 16px 16px 0",
                        boxShadow: 2,
                        maxWidth: "70%",
                        fontSize: "0.95rem",
                        lineHeight: 1.5,
                        whiteSpace: "normal",
                      }}
                    >
                      {msg.from === "bot" ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            table: ({ node, ...props }) => (
                              <table
                                style={{
                                  borderCollapse: "collapse",
                                  width: "100%",
                                  marginTop: "8px",
                                  marginBottom: "8px",
                                }}
                                {...props}
                              />
                            ),
                            th: ({ node, ...props }) => (
                              <th
                                style={{
                                  border: "1px solid #ccc",
                                  padding: "6px",
                                  background: "#f0f0f0",
                                  textAlign: "left",
                                }}
                                {...props}
                              />
                            ),
                            td: ({ node, ...props }) => (
                              <td
                                style={{
                                  border: "1px solid #ccc",
                                  padding: "6px",
                                }}
                                {...props}
                              />
                            ),
                          }}
                        >
                          {cleanText}
                        </ReactMarkdown>
                      ) : (
                        cleanText
                      )}
                    </Box>
                  </Stack>
                );
              })}

              {loading && (
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Bot is typing...
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <Button variant="contained" onClick={handleSend} disabled={loading}>
              Send
            </Button>
          </Stack>
        </Box>
      </Box>
    </>
  );
}

export default ChatPage;