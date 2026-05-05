"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 600;
const X_MIN = -4;
const X_MAX = 4;
const Y_MIN = -3;
const Y_MAX = 3;
const Z_MIN = -120;
const Z_MAX = 0;

const DRIFT_SPEED = 0.2;
const DRIFT_AMOUNT = 0.0008;

function pseudoRandom(index: number, seed: number) {
  const value = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export default function FloatingParticles() {
  const pointsRef = useRef<THREE.Points | null>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const i3 = i * 3;
      array[i3] = X_MIN + pseudoRandom(i, 1) * (X_MAX - X_MIN);
      array[i3 + 1] = Y_MIN + pseudoRandom(i, 2) * (Y_MAX - Y_MIN);
      array[i3 + 2] = Z_MIN + pseudoRandom(i, 3) * (Z_MAX - Z_MIN);
    }

    return array;
  }, []);

  const phases = useMemo(() => {
    const array = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      array[i] = pseudoRandom(i, 4) * Math.PI * 2;
    }
    return array;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#a8c5a0",
        size: 0.015,
        transparent: true,
        opacity: 0.4,
        sizeAttenuation: true,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;

    const attribute = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const array = attribute.array as Float32Array;
    const elapsed = clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const i3 = i * 3;
      array[i3 + 1] += Math.sin(elapsed * DRIFT_SPEED + phases[i]) * DRIFT_AMOUNT;

      if (array[i3 + 1] > Y_MAX) array[i3 + 1] = Y_MIN;
      else if (array[i3 + 1] < Y_MIN) array[i3 + 1] = Y_MAX;
    }

    attribute.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
