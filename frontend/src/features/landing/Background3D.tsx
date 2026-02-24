import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

interface ParticleFieldProps {
    count?: number;
    color?: string;
    size?: number;
    opacity?: number;
    speed?: number;
}

function ParticleField({
    count = 5000,
    color = "#a855f7",
    size = 0.005,
    opacity = 0.4,
    speed = 1
}: ParticleFieldProps) {
    const ref = useRef<THREE.Points>(null!);
    // Track the continuous rotation separately from the mouse offset
    const baseRotation = useRef({ x: 0, y: 0 });

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
        if (!ref.current) return;

        // 1. Advance the continuous base rotation
        baseRotation.current.x -= (delta / 10) * speed;
        baseRotation.current.y -= (delta / 15) * speed;

        // 2. Calculate the target rotation (base + mouse influence)
        // Adjust the multiplier (0.3) to change how strongly the mouse affects the field
        const targetX = baseRotation.current.x + (state.mouse.y * 0.3);
        const targetY = baseRotation.current.y + (state.mouse.x * 0.3);

        // 3. Smoothly damp the actual rotation toward the target
        ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, targetX, 4, delta);
        ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, targetY, 4, delta);
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
            background: "radial-gradient(circle at center, #0f172a 0%, #020617 100%)", // Upgraded to a subtle gradient
        }}>
            <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>

                <ParticleField count={3000} color="#6366f1" size={0.004} opacity={0.3} speed={0.8} />

                <ParticleField count={800} color="#ec4899" size={0.015} opacity={0.15} speed={1.2} />

                <ParticleField count={200} color="#ffffff" size={0.008} opacity={0.4} speed={1.5} />

                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.1}
                        mipmapBlur
                        intensity={1.5}
                    />
                </EffectComposer>

            </Canvas>
        </div>
    );
}