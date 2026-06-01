import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import type { Mesh, Group } from "three";

type HeroDriveSceneProps = {
  onComplete: () => void;
};

const LowPolyCar = () => {
  const group = useRef<Group>(null);
  const finished = useRef(false);

  useFrame((_, delta) => {
    if (!group.current || finished.current) return;
    group.current.position.z += delta * 6;
    group.current.position.x = Math.sin(group.current.position.z * 0.12) * 0.4;
    if (group.current.position.z > 2.2) {
      finished.current = true;
      window.dispatchEvent(new Event("hero-drive-finished"));
    }
  });

  return (
    <group ref={group} position={[0, 0, -24]}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[2.8, 0.6, 5]} />
        <meshStandardMaterial color="#d62828" flatShading />
      </mesh>
      <mesh position={[0, 0.8, -0.3]}>
        <boxGeometry args={[1.8, 0.5, 2.2]} />
        <meshStandardMaterial color="#8ecae6" flatShading />
      </mesh>
      {[-1, 1].flatMap((x) =>
        [-1.5, 1.5].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.05, z]}>
            <cylinderGeometry args={[0.42, 0.42, 0.35, 14]} />
            <meshStandardMaterial color="#222" flatShading />
          </mesh>
        ))
      )}
    </group>
  );
};

const Road = () => {
  const lane = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!lane.current) return;
    lane.current.position.z += delta * 6;
    if (lane.current.position.z > 10) lane.current.position.z = 0;
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, -5]}>
        <planeGeometry args={[12, 90]} />
        <meshStandardMaterial color="#2d3436" />
      </mesh>
      <mesh ref={lane} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.29, -5]}>
        <planeGeometry args={[0.45, 30]} />
        <meshStandardMaterial color="#fefefe" />
      </mesh>
    </group>
  );
};

export const HeroDriveScene = ({ onComplete }: HeroDriveSceneProps) => {
  useEffect(() => {
    window.addEventListener("hero-drive-finished", onComplete, { once: true });
    return () => window.removeEventListener("hero-drive-finished", onComplete);
  }, [onComplete]);

  return (
    <div className="h-[100vh] w-full overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700">
      <Canvas camera={{ position: [0, 2.2, 8], fov: 46 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.4} />
        <Road />
        <LowPolyCar />
        <Environment preset="city" />
        <OrbitControls enablePan={false} enableRotate={false} enableZoom={false} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-16">
        <p className="rounded-full bg-black/45 px-5 py-2 font-heading text-sm text-white">
          Smart automotive advisor loading
        </p>
      </div>
    </div>
  );
};
