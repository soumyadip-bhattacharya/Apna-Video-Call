import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import {
  Button,
  IconButton,
  TextField,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Drawer,
  Grid,
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { AuthContext } from "../contexts/AuthContext";
import {
  createTheme,
  ThemeProvider,
  keyframes,
} from "@mui/material/styles";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const hoverScale = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
`;

const emojiDrift = keyframes`
  0% { transform: translate(0, -50px) rotate(0deg); opacity: 0; }
  30% { opacity: 0.6; }
  100% { transform: translate(-200px, 400px) rotate(60deg); opacity: 0; }
`;

const theme = createTheme({
  typography: { fontFamily: '"Roboto", sans-serif' },
  palette: {
    primary: { main: "#7B1FA2" }, // purple
    secondary: { main: "#FFFFFF" },
    text: { primary: "#1E1E1E", secondary: "#5F6368" },
  },
});

function HomeComponent() {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const { addToUserHistory } = useContext(AuthContext);

  let handleJoinVideoCall = async () => {
    if (!meetingCode.trim()) return;
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  // Example images (Unsplash random people)
  const people = [
    "https://i.postimg.cc/ZYgnCntX/Whats-App-Image-2025-09-27-at-21-08-07-5b9d16d6.jpg",
    "https://i.postimg.cc/vBVjh0DR/Whats-App-Image-2025-09-27-at-21-10-46-6d8431e2.jpg",
    "https://i.postimg.cc/d3XY3hhb/newimg.jpg",
    "https://randomuser.me/api/portraits/men/75.jpg",
    "https://i.postimg.cc/CLkh544k/ariji.jpg",
    "https://randomuser.me/api/portraits/men/22.jpg",
    "https://i.postimg.cc/xTtsKwg8/Whats-App-Image-2025-09-27-at-21-10-45-46b39571.jpg",
    "https://randomuser.me/api/portraits/men/65.jpg",
  ];

  const emojis = ["🎉", "👋", "💡", "❤️", "😊", "💬"];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "row" }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: 72,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 72,
              bgcolor: "#1E1E1E",
              color: "secondary.main",
              borderRight: "none",
              display: "flex",
              alignItems: "center",
              py: 2,
            },
          }}
        >
          <IconButton
            onClick={() => navigate("/history")}
            sx={{
              color: "secondary.main",
              mb: 2,
              "&:hover": {
                color: "primary.main",
                animation: `${hoverScale} 0.3s ease`,
              },
            }}
          >
            <RestoreIcon />
          </IconButton>
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Top Nav */}
          <AppBar
            position="static"
            sx={{
              bgcolor: "#FFFFFF",
              boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
              zIndex: 2,
            }}
          >
            <Toolbar
              sx={{ display: "flex", justifyContent: "space-between", px: 3 }}
            >
              <Typography
                variant="h6"
                sx={{ color: "text.primary", fontWeight: 700 }}
              >
                Apna Video Call
              </Typography>
              <Button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/auth");
                }}
                sx={{
                  textTransform: "none",
                  color: "text.secondary",
                  "&:hover": {
                    color: "primary.main",
                    bgcolor: "rgba(25,118,210,0.05)",
                  },
                }}
              >
                <ExitToAppIcon sx={{ mr: 1 }} /> Logout
              </Button>
            </Toolbar>
          </AppBar>

          {/* Hero Section */}
          <Grid
            container
            sx={{
              flex: 1,
              px: { xs: 3, md: 8 },
              py: { xs: 4, md: 6 },
              animation: `${fadeIn} 0.8s ease-out`,
              background:
                "linear-gradient(135deg, #F3E5F5 0%, #E1F5FE 50%, #FFF9C4 100%)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Floating emojis */}
            {emojis.map((emoji, i) => (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  fontSize: "2rem",
                  right: `${10 + i * 50}px`,
                  top: `${i * 40}px`,
                  animation: `${emojiDrift} ${6 + i * 2}s ease-in-out infinite`,
                  zIndex: 1,
                }}
              >
                {emoji}
              </Box>
            ))}

            {/* Left Column */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                pr: { md: 6 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  lineHeight: 1.2,
                  fontSize: { xs: "2rem", sm: "3rem" },
                }}
              >
                Let’s{" "}
                <span style={{ color: "#FF5722" }}>build</span>{" "}
                your <span style={{ color: "#7B1FA2" }}>neighbour</span>{" "}
                <span style={{ color: "#0288D1" }}>community</span>
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  color: "text.secondary",
                  mb: 4,
                  lineHeight: 1.4,
                }}
              >
                Join or start meetings with one click, powered by simplicity and
                crystal-clear quality.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <TextField
                  fullWidth
                  id="meeting-code"
                  label="Enter Meeting Code"
                  variant="outlined"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={handleJoinVideoCall}
                  sx={{ px: 4, textTransform: "none", fontWeight: 600 }}
                >
                  Join
                </Button>
              </Box>

              <Button
                variant="outlined"
                onClick={() => navigate("/new-meeting")}
                sx={{ px: 4, textTransform: "none", fontWeight: 600 }}
              >
                <VideoCallIcon sx={{ mr: 1 }} /> New Meeting
              </Button>
            </Grid>

            {/* Right Column */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                alignContent: "center",
                justifyItems: "center",
                zIndex: 2,
              }}
            >
              {people.map((url, idx) => (
                <Box
                  key={idx}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    width: "100px",
                    height: "100px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src={url}
                    alt="person"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              ))}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default withAuth(HomeComponent);
