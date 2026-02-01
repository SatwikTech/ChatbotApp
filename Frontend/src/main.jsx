import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from "./App";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#add8e6", // Light Blue
    },
    secondary: {
      main: "#87ceeb", // Sky Blue
    },
    background: {
      default: "#f0f8ff", // AliceBlue
      paper: "#ffffff",
    },
    text: {
      primary: "#003366", // Dark Blue
      secondary: "#005599",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});


ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);