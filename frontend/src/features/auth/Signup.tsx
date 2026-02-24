import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "./auth.api";
import { useAuth } from "./auth.context";
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
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const signupSchema = z
    .object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type SignupInput = z.infer<typeof signupSchema>;

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

export function Signup() {
    const navigate = useNavigate();
    const theme = useTheme();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupInput) => {
        try {
            const res = await registerUser({
                email: data.email,
                password: data.password,
            });
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
                top: "-15%",
                left: "-10%",
                width: "700px",
                height: "700px",
                background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.12)} 0%, transparent 70%)`,
                zIndex: -1,
            }} />
            <Box sx={{
                position: "absolute",
                bottom: "-15%",
                right: "-10%",
                width: "600px",
                height: "600px",
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
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
                            backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                            mb: 4,
                        }}
                    >
                        <RocketLaunchIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
                    </MotionBox>

                    <MotionTypography variant="h3" sx={{
                        fontWeight: 900,
                        mb: 1,
                        letterSpacing: "-1.5px",
                        background: "linear-gradient(135deg, #fff 0%, #cbd5e1 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                        Create Account
                    </MotionTypography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 5, fontSize: "1.1rem" }}>
                        Join AuthStream AI and experience the future of chat
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
                            placeholder="Min 6 characters"
                            {...register("password")}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />

                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            placeholder="Repeat your password"
                            {...register("confirmPassword")}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
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
                                background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
                                boxShadow: `0 8px 25px -8px ${alpha(theme.palette.secondary.main, 0.5)}`,
                                "&:hover": {
                                    boxShadow: `0 12px 30px -10px ${alpha(theme.palette.secondary.main, 0.7)}`,
                                }
                            }}
                        >
                            {isSubmitting ? "Creating account..." : "Get Started"}
                        </Button>
                    </Stack>

                    <Box sx={{ mt: 5 }}>
                        <Typography variant="body2" color="text.secondary">
                            Already have an account?{" "}
                            <MuiLink component={Link} to="/login" sx={{
                                color: theme.palette.secondary.light,
                                fontWeight: 700,
                                textDecoration: "none",
                                transition: "all 0.2s",
                                "&:hover": { color: "#fff" }
                            }}>
                                Sign in here
                            </MuiLink>
                        </Typography>
                    </Box>
                </MotionBox>
            </Container>
        </Box>
    );
}

