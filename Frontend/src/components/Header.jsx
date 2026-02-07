import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import Logout from "../pages/Logout";
import logo from '../assets/react.svg';
import '../App.css';

function Header() {
  const username = localStorage.getItem("username") || "Guest";

  return (
    <AppBar position="static" className="header">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <img src={logo} className="logo" />

        <Typography variant="h6">
          Chatbot App
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body1">Hello, {username}</Typography>
          <Logout />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;