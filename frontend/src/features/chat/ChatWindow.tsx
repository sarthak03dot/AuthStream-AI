import { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, useTheme, Fade, IconButton, Badge, alpha } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../auth/auth.context";
import { API_BASE_URL } from "../../lib/config";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SparklesIcon from "@mui/icons-material/AutoAwesome";

const MotionBox = motion(Box);

const TypingIndicator = () => {
    const theme = useTheme();
    return (
        <MotionBox
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            sx={{
                display: "flex",
                gap: 0.8,
                p: 2,
                ml: 1,
                backgroundColor: alpha(theme.palette.background.paper, 0.4),
                backdropFilter: "blur(8px)",
                borderRadius: "16px 16px 16px 4px",
                width: "fit-content",
                border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
        >
            {[0, 1, 2].map((i) => (
                <Box
                    key={i}
                    component={motion.div}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                    }}
                    sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.primary.main,
                    }}
                />
            ))}
        </MotionBox>
    );
};

interface Message {
    role: "user" | "assistant";
    content: string;
    audio?: string;
}

export function ChatWindow() {
    const [searchParams] = useSearchParams();
    const chatId = searchParams.get("id");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();
    const theme = useTheme();
    const scrollRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isAtBottomRef = useRef(true);

    useEffect(() => {
        if (chatId) {
            fetchChat(chatId);
        } else {
            setMessages([]);
        }
    }, [chatId]);

    useEffect(() => {
        const scrollEl = scrollRef.current;
        if (scrollEl) {
            const handleScroll = () => {
                const isAtBottom = scrollEl.scrollHeight - scrollEl.scrollTop <= scrollEl.clientHeight + 100;
                isAtBottomRef.current = isAtBottom;
                setShowScrollButton(!isAtBottom);
                if (isAtBottom) setUnreadCount(0);
            };
            scrollEl.addEventListener("scroll", handleScroll);
            return () => scrollEl.removeEventListener("scroll", handleScroll);
        }
    }, []);

    useEffect(() => {
        if (!isAtBottomRef.current && !isStreaming) {
            setUnreadCount(prev => prev + 1);
        }

        if (scrollRef.current && isAtBottomRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    useEffect(() => {
        if (isStreaming && isAtBottomRef.current) {
            scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "auto",
            });
        }
    }, [messages, isStreaming]);

    const scrollToBottom = () => {
        setUnreadCount(0);
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    };

    const fetchChat = async (id: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/chat/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(response.data.messages);
        } catch (err) {
            console.error("Error fetching chat", err);
            setError("Failed to load chat history. Please try again.");
        }
    };

    const handleStopStreaming = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsStreaming(false);
        }
    };

    const handleSendMessage = async (content: string) => {
        setError(null);
        const userMessage: Message = { role: "user", content };
        setMessages((prev) => [...prev, userMessage]);
        setIsStreaming(true);

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            const response = await fetch(`${API_BASE_URL}/chat/stream`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ chatId, message: content }),
                signal: abortController.signal,
            });

            if (!response.ok) throw new Error("Failed to send message");

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No reader available");

            const decoder = new TextDecoder();
            let assistantContent = "";

            setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.token) {
                                assistantContent += data.token;
                                setMessages((prev) => {
                                    const newMessages = [...prev];
                                    newMessages[newMessages.length - 1].content = assistantContent;
                                    return newMessages;
                                });
                            }

                            if (data.error) {
                                setError(data.error);
                                break;
                            }

                            if (data.done) break;
                        } catch (e) { }
                    }
                }
            }
        } catch (err: any) {
            if (err.name === "AbortError") {
                console.log("Stream aborted by user");
            } else {
                console.error("Streaming error", err);
                setError("Something went wrong while generating response.");
            }
        } finally {
            setIsStreaming(false);
            abortControllerRef.current = null;
        }
    };

    const handleSendAudio = async (audioBlob: Blob) => {
        setError(null);
        setIsStreaming(true);

        const formData = new FormData();
        formData.append("audio", audioBlob);
        if (chatId) formData.append("chatId", chatId);

        try {
            const response = await axios.post(`${API_BASE_URL}/chat/audio`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            const { transcript, response: aiResponse, audio, chatId: newChatId } = response.data;

            setMessages((prev) => [
                ...prev,
                { role: "user", content: transcript },
                { role: "assistant", content: aiResponse, audio }
            ]);

            if (!chatId && newChatId) {
                const newParams = new URLSearchParams(window.location.search);
                newParams.set("id", newChatId);
                window.history.replaceState(null, "", "?" + newParams.toString());
            }

        } catch (err: any) {
            console.error("Audio capture error", err);
            setError("Failed to process voice message.");
        } finally {
            setIsStreaming(false);
        }
    };

    return (
        <Box sx={{
            height: "calc(100vh - 140px)",
            display: "flex",
            flexDirection: "column",
            maxWidth: "1100px",
            margin: "0 auto",
            width: "100%",
            position: "relative",
        }}>
            <AnimatePresence>
                {messages.length > 0 && (
                    <MotionBox
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 2,
                            px: 2,
                            py: 1,
                            borderRadius: 3,
                            backgroundColor: alpha(theme.palette.background.paper, 0.4),
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255, 255, 255, 0.05)",
                            width: "fit-content",
                        }}
                    >
                        <SparklesIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
                            Current Session
                        </Typography>
                    </MotionBox>
                )}
            </AnimatePresence>

            <Box
                ref={scrollRef}
                sx={{
                    flexGrow: 1,
                    mb: 3,
                    p: { xs: 2, sm: 3 },
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                    maskImage: "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
                }}
            >
                {messages.length === 0 && !isStreaming && (
                    <Fade in timeout={1200}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            textAlign: "center",
                            px: 3,
                            opacity: 0.8
                        }}>
                            <Box sx={{
                                width: 80,
                                height: 80,
                                borderRadius: "30%",
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 4,
                                position: "relative"
                            }}>
                                <AutoAwesomeIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                                <Box sx={{
                                    position: "absolute",
                                    top: -4,
                                    right: -4,
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    backgroundColor: theme.palette.secondary.main,
                                    boxShadow: `0 0 10px ${theme.palette.secondary.main}`
                                }} />
                            </Box>
                            <Typography variant="h4" fontWeight={900} gutterBottom sx={{ letterSpacing: "-1px" }}>
                                How can I assist you today?
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 450, fontSize: "1.1rem" }}>
                                Start a fresh conversation or pick up where you left off.
                                I'm ready for complex reasoning, creative tasks, and more.
                            </Typography>
                        </Box>
                    </Fade>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => (
                        <MotionBox
                            key={index}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <MessageBubble message={msg} />
                        </MotionBox>
                    ))}
                </AnimatePresence>

                {isStreaming && messages[messages.length - 1]?.role === "user" && (
                    <TypingIndicator />
                )}

                {error && (
                    <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        sx={{
                            textAlign: "center",
                            my: 3,
                            p: 2,
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                            borderRadius: 4,
                            color: "error.main",
                            fontSize: "0.9rem",
                            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                            maxWidth: "400px",
                            mx: "auto"
                        }}
                    >
                        {error}
                    </MotionBox>
                )}
            </Box>

            <Fade in={showScrollButton}>
                <IconButton
                    onClick={scrollToBottom}
                    sx={{
                        position: "absolute",
                        bottom: 120,
                        right: { xs: 20, sm: 40 },
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                        "&:hover": {
                            backgroundColor: theme.palette.background.paper,
                        },
                        zIndex: 10,
                    }}
                    size="small"
                >
                    <Badge badgeContent={unreadCount} color="error">
                        <KeyboardArrowDownIcon />
                    </Badge>
                </IconButton>
            </Fade>

            <Box sx={{
                position: "relative",
                backgroundColor: alpha(theme.palette.background.paper, 0.4),
                backdropFilter: "blur(16px)",
                borderRadius: 6,
                p: 1.5,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
            }}>
                {isStreaming && (
                    <Box sx={{
                        position: "absolute",
                        top: -50,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 1
                    }}>
                        <Button
                            variant="contained"
                            color="inherit"
                            startIcon={<StopCircleIcon />}
                            onClick={handleStopStreaming}
                            size="small"
                            sx={{
                                borderRadius: 100,
                                px: 3,
                                py: 1,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                }
                            }}
                        >
                            Stop Generation
                        </Button>
                    </Box>
                )}
                <ChatInput onSendMessage={handleSendMessage} onSendAudio={handleSendAudio} disabled={isStreaming} />
            </Box>
        </Box>
    );
}

