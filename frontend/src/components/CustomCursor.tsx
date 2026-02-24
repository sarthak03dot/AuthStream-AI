import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Box, alpha, useTheme } from "@mui/material";

export function CustomCursor() {
    const theme = useTheme();
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Mouse position motion values
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Spring animations for a smooth "lag" effect
    const springConfig = { damping: 25, stiffness: 200 };
    const smoothX = useSpring(cursorX, springConfig);
    const smoothY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                window.getComputedStyle(target).cursor === 'pointer';

            setIsHovering(!!isInteractive);
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [cursorX, cursorY, isVisible]);

    if (!isVisible) return null;

    return (
        <>
            {/* Main Dot */}
            <motion.div
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    zIndex: 9999,
                    pointerEvents: "none",
                }}
            >
                <Box
                    sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        boxShadow: `0 0 10px #fff`,
                    }}
                />
            </motion.div>

            {/* Trailing Ring / Glow */}
            <motion.div
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    x: smoothX,
                    y: smoothY,
                    translateX: "-50%",
                    translateY: "-50%",
                    zIndex: 9998,
                    pointerEvents: "none",
                }}
                animate={{
                    scale: isClicking ? 0.8 : isHovering ? 2.5 : 1,
                    opacity: isHovering ? 0.6 : 0.3,
                }}
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: `1.5px solid ${theme.palette.primary.main}`,
                        backgroundColor: isHovering ? alpha(theme.palette.primary.main, 0.1) : "transparent",
                        boxShadow: isHovering ? `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}` : "none",
                        transition: "all 0.2s ease-out",
                    }}
                />
            </motion.div>
        </>
    );
}
