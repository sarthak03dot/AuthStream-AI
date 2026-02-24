import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField({ count = 5000, color = "#a855f7", size = 0.005, opacity = 0.4, speed = 1 }) {
    const ref = useRef<THREE.Points>(null!);

    const sphere = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const r = 1.5 + Math.random() * 2.5;
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = r * Math.cos(phi);
        }
        return positions;
    }, [count]);

    useFrame((state, delta) => {
        ref.current.rotation.x -= (delta / 10) * speed;
        ref.current.rotation.y -= (delta / 15) * speed;

        const { x, y } = state.mouse;
        ref.current.rotation.x += y * 0.03 * delta;
        ref.current.rotation.y += x * 0.03 * delta;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={color}
                    size={size}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={opacity}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
}

export function Background3D() {
    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -2,
            pointerEvents: "none",
            background: "#020617",
        }}>
            <Canvas camera={{ position: [0, 0, 1] }}>
                {/* Layer 1: Dense, fine particles */}
                <ParticleField count={3000} color="#6366f1" size={0.004} opacity={0.3} speed={0.8} />
                {/* Layer 2: Larger, soft bokeh particles for depth */}
                <ParticleField count={800} color="#ec4899" size={0.015} opacity={0.15} speed={1.2} />
                {/* Layer 3: Occasional bright highlights */}
                <ParticleField count={200} color="#fff" size={0.006} opacity={0.2} speed={1.5} />
            </Canvas>
        </div>
    );
}
