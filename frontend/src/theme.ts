import { createTheme, alpha } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#6366f1", // Indigo 500
            light: "#818cf8",
            dark: "#4f46e5",
            contrastText: "#fff",
        },
        secondary: {
            main: "#ec4899", // Pink 500
            light: "#f472b6",
            dark: "#db2777",
            contrastText: "#fff",
        },
        background: {
            default: "#020617", // Slate 950
            paper: "#0f172a", // Slate 900
        },
        text: {
            primary: "#f8fafc", // Slate 50
            secondary: "#94a3b8", // Slate 400
        },
        divider: "rgba(255, 255, 255, 0.08)",
    },
    shape: {
        borderRadius: 16,
    },
    typography: {
        fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 800, letterSpacing: "-0.02em" },
        h2: { fontWeight: 800, letterSpacing: "-0.02em" },
        h3: { fontWeight: 700, letterSpacing: "-0.01em" },
        h4: { fontWeight: 700, letterSpacing: "-0.01em" },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: {
            textTransform: "none",
            fontWeight: 600,
            letterSpacing: "0.01em",
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarWidth: "thin",
                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(99, 102, 241, 0.2)",
                        borderRadius: "10px",
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: "10px 24px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 20px -10px rgba(99, 102, 241, 0.4)",
                    },
                },
                containedPrimary: {
                    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    backgroundColor: alpha("#0f172a", 0.7),
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
                fullWidth: true,
            },
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: alpha("#1e293b", 0.4),
                        transition: "all 0.2s ease-in-out",
                        "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.1)",
                        },
                        "&:hover fieldset": {
                            borderColor: "rgba(252, 165, 165, 0.2)", // Subtle glow on hover
                        },
                        "&.Mui-focused": {
                            backgroundColor: alpha("#1e293b", 0.6),
                            "& fieldset": {
                                borderWidth: "1px",
                                borderColor: "#6366f1",
                                boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.1)",
                            },
                        },
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha("#020617", 0.7),
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "none",
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: alpha("#020617", 0.8),
                    backdropFilter: "blur(16px)",
                    borderRight: "1px solid rgba(255, 255, 255, 0.08)",
                },
            },
        },
    },
});

