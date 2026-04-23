"use client";

import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { MathUtils, type Mesh, type MeshStandardMaterial, type SpotLight } from "three";
import { SECTION_Z_RANGES } from "@/components/scene/sceneConfig";

const ABOUT_CENTER_Z =
  (SECTION_Z_RANGES.about.start + SECTION_Z_RANGES.about.end) / 2;
const CREDENTIAL_Z = -63.5;
const FADE_RANGE = 16;
const MAX_PLANE_OPACITY = 0.65;
const FLOAT_AMPLITUDE = 0.12;
const FLOAT_SPEED = 0.45;
const ROTATION_SWAY_AMPLITUDE = 0.08;
const ROTATION_SWAY_SPEED = 0.2;

const LEFT_X = -1.7;
const RIGHT_X = 1.7;
const BASE_Y = 0.1;
const BASE_ROTATION_Y = MathUtils.degToRad(15);
const PLANE_HEIGHT = 1.3;

type PlaneRefs = Array<Mesh | null>;
type MaterialRefs = Array<MeshStandardMaterial | null>;
type LightRefs = Array<SpotLight | null>;

export default function CredentialPlanes() {
  const { scene } = useThree();
  const textures = useTexture(["/iths.png", "/chngemaker.png"]);
  const meshRefs = useRef<PlaneRefs>([]);
  const materialRefs = useRef<MaterialRefs>([]);
  const lightRefs = useRef<LightRefs>([]);

  useEffect(() => {
    const lights = lightRefs.current;
    for (let index = 0; index < lights.length; index += 1) {
      const light = lights[index];
      if (!light) continue;

      const x = index === 0 ? LEFT_X : RIGHT_X;
      scene.add(light.target);
      light.target.position.set(x, BASE_Y, CREDENTIAL_Z);
      light.target.updateMatrixWorld();
    }

    return () => {
      for (let index = 0; index < lights.length; index += 1) {
        const light = lights[index];
        if (!light) continue;
        scene.remove(light.target);
      }
    };
  }, [scene]);

  useFrame((state) => {
    const cameraZ = state.camera.position.z;
    const rawOpacity = 1 - Math.abs(cameraZ - ABOUT_CENTER_Z) / FADE_RANGE;
    const opacity = MathUtils.clamp(rawOpacity, 0, 1);
    const elapsed = state.clock.getElapsedTime();

    for (let index = 0; index < meshRefs.current.length; index += 1) {
      const mesh = meshRefs.current[index];
      const material = materialRefs.current[index];
      if (!mesh || !material) continue;

      const phase = index === 0 ? 0 : Math.PI * 0.7;
      mesh.position.y = BASE_Y + Math.sin(elapsed * FLOAT_SPEED + phase) * FLOAT_AMPLITUDE;

      const direction = index === 0 ? 1 : -1;
      mesh.rotation.y =
        direction * BASE_ROTATION_Y +
        Math.sin(elapsed * ROTATION_SWAY_SPEED + phase) * ROTATION_SWAY_AMPLITUDE;

      const targetOpacity = opacity * MAX_PLANE_OPACITY;
      material.opacity += (targetOpacity - material.opacity) * 0.12;
    }
  });

  

  return (
    <group>
      <ambientLight intensity={0.3} />
      {textures.map((texture, index) => {
        const image = texture.image as { width?: number; height?: number } | undefined;
        const aspect = image?.width && image?.height ? image.width / image.height : 2;
        const width = PLANE_HEIGHT * aspect;
        const x = index === 0 ? LEFT_X : RIGHT_X;

        return (
          <group key={index}>
            <mesh
              ref={(mesh) => {
                meshRefs.current[index] = mesh;
              }}
              position={[x, BASE_Y, CREDENTIAL_Z]}
              rotation={[0, (index === 0 ? 1 : -1) * BASE_ROTATION_Y, 0]}
            >
              <planeGeometry args={[width, PLANE_HEIGHT]} />
              <meshStandardMaterial
                ref={(material) => {
                  materialRefs.current[index] = material;
                }}
                map={texture}
                color="#ffffff"
                roughness={0.7}
                metalness={0.05}
                transparent
                opacity={0}
              />
            </mesh>

            <spotLight
              ref={(light) => {
                lightRefs.current[index] = light;
              }}
              position={[x, BASE_Y + 0.75, CREDENTIAL_Z + 0.9]}
              intensity={4}
              color="#fff6ed"
              angle={0.45}
              penumbra={0.5}
              distance={8}
              decay={1}
              castShadow={false}
            />
          </group>
        );
      })}
    </group>
  );
}
