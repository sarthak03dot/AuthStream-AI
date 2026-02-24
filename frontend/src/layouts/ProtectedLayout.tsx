import { useState } from "react";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/auth.context";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { motion, AnimatePresence } from "framer-motion";
import { ChatSidebar } from "../features/chat/ChatSidebar";
import { CustomCursor } from "../components/CustomCursor";

const drawerWidth = 300;

export function ProtectedLayout() {
  const { token, logout, expiresIn } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSelectChat = (chatId: string) => {
    navigate(`/chat?id=${chatId}`);
    if (isMobile) setMobileOpen(false);
  };

  const handleNewChat = () => {
    navigate("/chat");
    if (isMobile) setMobileOpen(false);
  };

  const selectedChatId = new URLSearchParams(location.search).get("id") || undefined;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "transparent" }}>
      <CustomCursor />
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: alpha(theme.palette.background.default, 0.7),
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 4 } }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{
              fontWeight: 900,
              letterSpacing: "-0.5px",
              background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              AuthStream AI
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {expiresIn !== null && (
              <Box sx={{
                px: 2,
                py: 0.5,
                borderRadius: 2,
                backgroundColor: alpha(expiresIn < 60 ? theme.palette.error.main : theme.palette.primary.main, 0.1),
                border: `1px solid ${alpha(expiresIn < 60 ? theme.palette.error.main : theme.palette.primary.main, 0.2)}`,
                display: { xs: 'none', md: 'block' }
              }}>
                <Typography variant="caption" sx={{
                  color: expiresIn < 60 ? 'error.main' : 'primary.light',
                  fontWeight: 700,
                  fontFamily: 'monospace'
                }}>
                  SESSION: {Math.floor(expiresIn / 60)}:{String(expiresIn % 60).padStart(2, '0')}
                </Typography>
              </Box>
            )}
            <Button
              variant="outlined"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={{
                borderRadius: 2,
                borderColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": { borderColor: "rgba(255, 255, 255, 0.3)" }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: alpha(theme.palette.background.default, 0.9),
              backdropFilter: "blur(20px)",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          <Toolbar />
          <ChatSidebar
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            selectedChatId={selectedChatId}
          />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: alpha(theme.palette.background.default, 0.5),
              backdropFilter: "blur(12px)",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
              backgroundImage: "none",
            },
          }}
          open
        >
          <Toolbar />
          <ChatSidebar
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            selectedChatId={selectedChatId}
          />
        </Drawer>
      </Box>

      <Box component="main" sx={{
        flexGrow: 1,
        p: { xs: 2, sm: 4 },
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        position: "relative"
      }}>
        <Toolbar />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname + location.search}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ height: "100%" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}

