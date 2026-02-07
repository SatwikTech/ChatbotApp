import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import '../App.css';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("username"); // clear login info
    navigate("/login"); // redirect to login page
  };

  return (
    <Button className="logOutButton" onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default Logout;