"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useScrollState } from "@/components/ScrollProvider";
import DebugCameraZOverlay from "@/components/scene/DebugCameraZOverlay";
import SceneProps from "@/components/scene/SceneProps";
import { CAMERA_START_Z } from "@/components/scene/sceneConfig";
import type { Gallery } from "@/payload-types";

function CameraRig() {
  const { cameraZMv } = useScrollState();

  useFrame((state) => {
    state.camera.rotation.y = Math.PI;
    state.camera.position.z = cameraZMv.get();
  });

  return null;
}

type SceneCanvasProps = {
  galleryItems: Gallery[];
};

export default function SceneCanvas({ galleryItems }: SceneCanvasProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* TODO: remove debug overlay */}
      <DebugCameraZOverlay />
      <Canvas
        camera={{
          position: [0, 0, CAMERA_START_Z],
          near: 0.1,
          far: 300,
          fov: 50,
        }}
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#000000"]} />
        <fogExp2 attach="fog" args={["#000000", 0.08]} />
        <ambientLight intensity={0.6} />
        <CameraRig />
        <SceneProps galleryItems={galleryItems} />
      </Canvas>
    </div>
  );
}
