import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Typography,
    Card,
    CardContent,
    Stack,
    useTheme,
    alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import {
    Chat as ChatIcon,
    Mic as MicIcon,
    Speed as SpeedIcon,
    Security as SecurityIcon,
    AutoAwesome as AutoAwesomeIcon,
    Star as StarIcon,
} from "@mui/icons-material";
import { Background3D } from "./Background3D";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionCard = motion(Card);

export const LandingPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const features = [
        {
            title: "Hugging Face Powered",
            description: "Leverage state-of-the-art open-source LLMs through Hugging Face integration.",
            icon: <AutoAwesomeIcon sx={{ fontSize: 32 }} />,
            color: "#6366f1"
        },
        {
            title: "Voice Interaction",
            description: "Natural-sounding voice synthesis and accurate speech-to-text transcription.",
            icon: <MicIcon sx={{ fontSize: 32 }} />,
            color: "#ec4899"
        },
        {
            title: "Real-time Chat",
            description: "Instant responses with fluid streaming technology for a seamless conversation.",
            icon: <ChatIcon sx={{ fontSize: 32 }} />,
            color: "#8b5cf6"
        },
        {
            title: "Ultra Fast",
            description: "Optimized infrastructure ensuring lightning-fast AI interactions.",
            icon: <SpeedIcon sx={{ fontSize: 32 }} />,
            color: "#f59e0b"
        },
        {
            title: "Private & Secure",
            description: "Your conversations are encrypted and your privacy is our top priority.",
            icon: <SecurityIcon sx={{ fontSize: 32 }} />,
            color: "#10b981"
        },
    ];

    return (
        <Box sx={{
            minHeight: "100vh",
            overflowX: "hidden",
            background: "transparent",
            position: "relative"
        }}>
            {/* Three.js Background Layer */}
            <Background3D />

            {/* Animated Glass Blobs */}
            <MotionBox
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -80, 40, 0],
                    scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                sx={{
                    position: "absolute",
                    top: "15%",
                    left: "10%",
                    width: "300px",
                    height: "300px",
                    background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
                    zIndex: -1,
                    filter: "blur(80px)",
                }}
            />
            <MotionBox
                animate={{
                    x: [0, -120, 60, 0],
                    y: [0, 100, -50, 0],
                    rotate: [0, 45, -45, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                sx={{
                    position: "absolute",
                    bottom: "20%",
                    right: "15%",
                    width: "400px",
                    height: "400px",
                    background: "radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)",
                    zIndex: -1,
                    filter: "blur(100px)",
                }}
            />


            {/* Hero Section */}
            <Container maxWidth="lg" sx={{ pt: { xs: 12, md: 20 }, pb: { xs: 8, md: 12 } }}>
                <Stack spacing={4} alignItems="center" textAlign="center">
                    <MotionBox
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        sx={{
                            px: 2,
                            py: 0.5,
                            borderRadius: "100px",
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <StarIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.primary.main, letterSpacing: 1, textTransform: "uppercase" }}>
                            Powered by Open Source AI
                        </Typography>
                    </MotionBox>

                    <MotionTypography
                        variant="h1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        sx={{
                            fontSize: { xs: "3rem", md: "5rem" },
                            fontWeight: 900,
                            lineHeight: 1,
                        }}
                    >
                        The Future of AI Chat <br />
                        <span style={{
                            background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}>
                            Starts Here
                        </span>
                    </MotionTypography>

                    <MotionTypography
                        variant="h5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        sx={{
                            color: "text.secondary",
                            maxWidth: "700px",
                            fontWeight: 400,
                            lineHeight: 1.6
                        }}
                    >
                        Experience the power of open-source AI with a seamless, voice-enabled interface.
                        Built for speed, privacy, and unparalleled performance.
                    </MotionTypography>

                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate("/signup")}
                                sx={{
                                    px: 5,
                                    py: 2,
                                    fontSize: "1.1rem",
                                    boxShadow: "0 20px 40px -10px rgba(99, 102, 241, 0.5)"
                                }}
                            >
                                Start Chatting Now
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate("/login")}
                                sx={{
                                    px: 5,
                                    py: 2,
                                    fontSize: "1.1rem",
                                    borderColor: "rgba(255,255,255,0.1)",
                                    "&:hover": {
                                        borderColor: "rgba(255,255,255,0.2)",
                                        backgroundColor: "rgba(255,255,255,0.05)"
                                    }
                                }}
                            >
                                Sign In
                            </Button>
                        </Stack>
                    </MotionBox>
                </Stack>
            </Container>

            {/* Features Grid */}
            <Container maxWidth="lg" sx={{ py: 12 }}>
                <MotionTypography
                    variant="h3"
                    textAlign="center"
                    mb={8}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    sx={{ fontWeight: 800 }}
                >
                    Unmatched Capabilities
                </MotionTypography>

                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
                    gap: 3
                }}>
                    {features.map((feature, index) => (
                        <MotionCard
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            sx={{
                                background: "rgba(15, 23, 42, 0.4)",
                                border: "1px solid rgba(255, 255, 255, 0.05)",
                                "&:hover": {
                                    borderColor: alpha(feature.color, 0.3),
                                    boxShadow: `0 20px 40px -20px ${alpha(feature.color, 0.3)}`,
                                }
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 3,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: alpha(feature.color, 0.1),
                                    color: feature.color,
                                    mb: 3
                                }}>
                                    {feature.icon}
                                </Box>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {feature.description}
                                </Typography>
                            </CardContent>
                        </MotionCard>
                    ))}
                </Box>
            </Container>

            {/* CTA Section */}
            <Container maxWidth="md" sx={{ py: 20 }}>
                <MotionBox
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    sx={{
                        p: { xs: 6, md: 10 },
                        borderRadius: 8,
                        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        textAlign: "center",
                        overflow: "hidden",
                        position: "relative",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <Box sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 80%)",
                        zIndex: -1
                    }} />

                    <Typography variant="h3" mb={3} sx={{ fontWeight: 900 }}>
                        Ready to elevate your <br /> conversations?
                    </Typography>
                    <Typography variant="h6" color="text.secondary" mb={5} sx={{ fontWeight: 400 }}>
                        Join the community of explorers using AI to push boundaries.
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={() => navigate("/signup")}
                        sx={{
                            px: 8,
                            py: 2.5,
                            borderRadius: "100px",
                            fontSize: "1.2rem",
                            boxShadow: "0 20px 40px -10px rgba(236, 72, 153, 0.4)",
                            background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)",
                            }
                        }}
                    >
                        Create Your Account
                    </Button>
                </MotionBox>
            </Container>

            {/* Footer */}
            <Box sx={{ py: 6, borderTop: "1px solid rgba(255, 255, 255, 0.05)", textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                    © 2026 AuthStream AI. All rights reserved. Built for the future of open-source.
                </Typography>
            </Box>
        </Box>
    );
};


