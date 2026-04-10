"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, MathUtils, Mesh, ShaderMaterial } from "three";
import { GALLERY_COLOR_LERP } from "@/components/scene/sceneConfig";

export type MoodColors = {
  background: string;
  blob1: string;
  blob2: string;
};

type GalleryBackgroundProps = {
  currentMood: MoodColors;
  nextMood: MoodColors;
  blend: number;
  velocity: number;
  opacity: number;
};

type GalleryUniforms = {
  uBgColor: { value: Color };
  uBlob1Color: { value: Color };
  uBlob2Color: { value: Color };
  uBlobRadius: { value: number };
  uBlobRadiusSecondary: { value: number };
  uBlobStrength: { value: number };
  uVelocity: { value: number };
  uTime: { value: number };
  uNoiseStrength: { value: number };
  uOpacity: { value: number };
};

const SMOOTHING = 0.14;

export default function GalleryBackground({
  currentMood,
  nextMood,
  blend,
  velocity,
  opacity,
}: GalleryBackgroundProps) {
  const meshRef = useRef<Mesh | null>(null);
  const materialRef = useRef<ShaderMaterial | null>(null);
  const targetBgColor = useMemo(() => new Color(), []);
  const targetBlob1Color = useMemo(() => new Color(), []);
  const targetBlob2Color = useMemo(() => new Color(), []);
  const nextBgColor = useMemo(() => new Color(), []);
  const nextBlob1Color = useMemo(() => new Color(), []);
  const nextBlob2Color = useMemo(() => new Color(), []);
  const smoothedBgColor = useRef(new Color(currentMood.background));
  const smoothedBlob1Color = useRef(new Color(currentMood.blob1));
  const smoothedBlob2Color = useRef(new Color(currentMood.blob2));

  const [uniforms] = useState<GalleryUniforms>(() => ({
      uBgColor: { value: new Color(currentMood.background) },
      uBlob1Color: { value: new Color(currentMood.blob1) },
      uBlob2Color: { value: new Color(currentMood.blob2) },
      uBlobRadius: { value: 0.55 },
      uBlobRadiusSecondary: { value: 0.45 },
      uBlobStrength: { value: 0.85 },
      uVelocity: { value: 0 },
      uTime: { value: 0 },
      uNoiseStrength: { value: 0.02 },
      uOpacity: { value: 0 },
  }));
  useFrame((state, delta) => {
    const material = materialRef.current;
    const mesh = meshRef.current;
    if (!material || !mesh) return;
    const materialUniforms = material.uniforms as GalleryUniforms;

    const clampedBlend = MathUtils.clamp(blend, 0, 1);
    targetBgColor
      .set(currentMood.background)
      .lerp(nextBgColor.set(nextMood.background), clampedBlend);
    targetBlob1Color
      .set(currentMood.blob1)
      .lerp(nextBlob1Color.set(nextMood.blob1), clampedBlend);
    targetBlob2Color
      .set(currentMood.blob2)
      .lerp(nextBlob2Color.set(nextMood.blob2), clampedBlend);

    smoothedBgColor.current.lerp(targetBgColor, GALLERY_COLOR_LERP);
    smoothedBlob1Color.current.lerp(targetBlob1Color, GALLERY_COLOR_LERP);
    smoothedBlob2Color.current.lerp(targetBlob2Color, GALLERY_COLOR_LERP);

    materialUniforms.uBgColor.value.copy(smoothedBgColor.current);
    materialUniforms.uBlob1Color.value.copy(smoothedBlob1Color.current);
    materialUniforms.uBlob2Color.value.copy(smoothedBlob2Color.current);
    materialUniforms.uVelocity.value +=
      (velocity - materialUniforms.uVelocity.value) * SMOOTHING;
    materialUniforms.uOpacity.value +=
      (opacity - materialUniforms.uOpacity.value) * SMOOTHING;
    materialUniforms.uTime.value += delta;

    const planeZ = -31;
    const fovDegrees =
      "fov" in state.camera && typeof state.camera.fov === "number"
        ? state.camera.fov
        : 50;
    const distance = Math.max(Math.abs(state.camera.position.z - planeZ), 0.001);
    const fovRadians = (fovDegrees * Math.PI) / 180;
    const viewportHeight = 2 * Math.tan(fovRadians / 2) * distance;
    const viewportWidth = viewportHeight * (state.size.width / state.size.height);
    const overscan = 1.12;
    mesh.scale.set(viewportWidth * overscan, viewportHeight * overscan, 1);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -31]} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;

          uniform vec3 uBgColor;
          uniform vec3 uBlob1Color;
          uniform vec3 uBlob2Color;
          uniform float uBlobRadius;
          uniform float uBlobRadiusSecondary;
          uniform float uBlobStrength;
          uniform float uVelocity;
          uniform float uTime;
          uniform float uNoiseStrength;
          uniform float uOpacity;

          float random(vec2 st) {
            return fract(sin(dot(st, vec2(127.1, 311.7))) * 43758.5453);
          }

          void main() {
            vec3 color = uBgColor;

            vec2 blob1Center = vec2(
              0.3 + sin(uTime * 0.4) * 0.15,
              0.4 + cos(uTime * 0.3) * 0.12
            );
            vec2 blob2Center = vec2(
              0.7 + cos(uTime * 0.35) * 0.13,
              0.6 + sin(uTime * 0.25) * 0.14
            );

            float blob1 = smoothstep(uBlobRadius, 0.0, distance(vUv, blob1Center));
            float blob2 = smoothstep(uBlobRadiusSecondary, 0.0, distance(vUv, blob2Center));

            vec3 blob1Soft = mix(uBlob1Color, uBgColor, 0.35);
            vec3 blob2Soft = mix(uBlob2Color, uBgColor, 0.35);
            color = mix(color, blob1Soft, blob1 * uBlobStrength);
            color = mix(color, blob2Soft, blob2 * uBlobStrength);

            color += uVelocity * 0.10;

            float grain = random(vUv * vec2(1387.13, 947.91)) - 0.5;
            color += grain * uNoiseStrength;

            gl_FragColor = vec4(color, uOpacity);
          }
        `}
      />
    </mesh>
  );
}
