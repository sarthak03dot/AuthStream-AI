import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth.context";
import { loginUser } from "./auth.api";
import {
  Box,
  Typography,
  TextField,
  Button,
  useTheme,
  Link as MuiLink,
  alpha,
  Stack,
  Container,
} from "@mui/material";
import { motion } from "framer-motion";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginInput = z.infer<typeof loginSchema>;

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput): Promise<void> => {
    try {
      const res = await loginUser(data);
      login(res);
      navigate("/chat");
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      background: "transparent"
    }}>
      {/* Background Decorative Elements */}
      <Box sx={{
        position: "absolute",
        top: "-10%",
        right: "-10%",
        width: "600px",
        height: "600px",
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
        zIndex: -1,
      }} />
      <Box sx={{
        position: "absolute",
        bottom: "-10%",
        left: "-10%",
        width: "500px",
        height: "500px",
        background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
        zIndex: -1,
      }} />

      <Container maxWidth="sm">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 6,
            backgroundColor: alpha(theme.palette.background.paper, 0.6),
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            textAlign: "center",
          }}
        >
          <MotionBox
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            sx={{
              display: "inline-flex",
              p: 2,
              borderRadius: "30%",
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              mb: 4,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
          </MotionBox>

          <MotionTypography variant="h3" sx={{
            fontWeight: 900,
            mb: 1,
            letterSpacing: "-1.5px",
            background: "linear-gradient(135deg, #fff 0%, #cbd5e1 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Welcome Back
          </MotionTypography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 5, fontSize: "1.1rem" }}>
            Sign in to continue your journey with AuthStream AI
          </Typography>

          <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={3} noValidate>
            <TextField
              fullWidth
              label="Email"
              placeholder="name@example.com"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{
                py: 2,
                mt: 2,
                fontSize: "1.1rem",
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 800,
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                boxShadow: `0 8px 25px -8px ${alpha(theme.palette.primary.main, 0.5)}`,
                "&:hover": {
                  boxShadow: `0 12px 30px -10px ${alpha(theme.palette.primary.main, 0.7)}`,
                }
              }}
            >
              {isSubmitting ? "Authenticating..." : "Sign In"}
            </Button>
          </Stack>

          <Box sx={{ mt: 5 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <MuiLink component={Link} to="/signup" sx={{
                color: theme.palette.primary.light,
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.2s",
                "&:hover": { color: "#fff" }
              }}>
                Create one now
              </MuiLink>
            </Typography>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}

