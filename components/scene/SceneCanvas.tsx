"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useScrollState } from "@/components/ScrollProvider";
import SceneProps from "@/components/scene/SceneProps";
import { CAMERA_START_Z } from "@/components/scene/sceneConfig";

function CameraRig() {
  const { cameraZMv } = useScrollState();

  useFrame((state) => {
    state.camera.position.z = cameraZMv.get();
  });

  return null;
}

export default function SceneCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, CAMERA_START_Z], near: 0.1, far: 300, fov: 50 }}
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 30, 130]} />
        <ambientLight intensity={0.6} />
        <CameraRig />
        <SceneProps />
      </Canvas>
    </div>
  );
}
