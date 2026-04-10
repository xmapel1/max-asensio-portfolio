"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DoubleSide, MathUtils } from "three";
import type { MeshBasicMaterial } from "three";
import { useScrollState } from "@/components/ScrollProvider";
import type { MoodColors } from "@/components/scene/GalleryBackground";
import {
  GALLERY_BG_FADE_WINDOW,
  GALLERY_FADE_SWEETSPOT_OFFSET_Z,
  GALLERY_MESH_ENTRY_OFFSET_Z,
  SECTION_Z_RANGES,
} from "@/components/scene/sceneConfig";
import { PLANE_GAP } from "@/hooks/useGalleryScroll";
import type { Gallery } from "@/payload-types";

const FADE_SMOOTHING = 0.14;
const ENTRY_MOOD: MoodColors = {
  background: "#5f81ab",
  blob1: "#f88b8d",
  blob2: "#cfbbdd",
};

type GalleryPlanesProps = {
  items: Gallery[];
  onBackgroundChange: (data: {
    currentMood: MoodColors;
    nextMood: MoodColors;
    blend: number;
    velocity: number;
    opacity: number;
  }) => void;
};

export default function GalleryPlanes({ items, onBackgroundChange }: GalleryPlanesProps) {
  const materialsRef = useRef<Array<MeshBasicMaterial | null>>([]);
  const { scrollVelocityMv } = useScrollState();
  const urls = items.map((item) => {
    const path = typeof item.image === "object" ? (item.image.url ?? "") : "";
    if (!path) return "";
    return path.startsWith("http")
      ? path
      : `${process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000"}${path}`;
  });
  const textures = useTexture(urls);

  useFrame((state) => {
    const planeCount = items.length;
    if (planeCount === 0) return;

    const cameraZ = state.camera.position.z;
    const galleryStartZ =
      SECTION_Z_RANGES.gallery.start + GALLERY_MESH_ENTRY_OFFSET_Z;
    const fadeSweetspotStartZ = galleryStartZ + GALLERY_FADE_SWEETSPOT_OFFSET_Z;
    const rawIndex = (cameraZ - fadeSweetspotStartZ) / PLANE_GAP;
    const currentIndex = Math.min(
      Math.max(Math.round(rawIndex), 0),
      planeCount - 1,
    );
    const currentSweetspotZ = fadeSweetspotStartZ + currentIndex * PLANE_GAP;
    const movingTowardPositiveZ = cameraZ >= currentSweetspotZ;
    const nextIndex = movingTowardPositiveZ
      ? Math.min(currentIndex + 1, planeCount - 1)
      : Math.max(currentIndex - 1, 0);
    const directionalDistance = movingTowardPositiveZ
      ? cameraZ - currentSweetspotZ
      : currentSweetspotZ - cameraZ;
    const isAtLastPlane = currentIndex === planeCount - 1;
    const blend = isAtLastPlane
      ? 0
      : Math.min(Math.max(directionalDistance / PLANE_GAP, 0), 1);
    const clampedNextIndex = Math.min(currentIndex + 1, planeCount - 1);
    const currentItem = items[currentIndex];
    const nextItem = items[clampedNextIndex];
    const isBeforeFirstPlane = cameraZ < galleryStartZ;
    const lastPlaneZ =
      SECTION_Z_RANGES.gallery.start +
      GALLERY_MESH_ENTRY_OFFSET_Z +
      (planeCount - 1) * PLANE_GAP;
    const rawOpacity = Math.min(
      (cameraZ - SECTION_Z_RANGES.gallery.start) / GALLERY_BG_FADE_WINDOW,
      (lastPlaneZ + GALLERY_BG_FADE_WINDOW - cameraZ) / GALLERY_BG_FADE_WINDOW,
    );
    const opacity = MathUtils.clamp(rawOpacity, 0, 1);

    onBackgroundChange({
      currentMood: isBeforeFirstPlane
        ? ENTRY_MOOD
        : {
            background: currentItem.mood?.background ?? "#000000",
            blob1: currentItem.mood?.blob1 ?? "#000000",
            blob2: currentItem.mood?.blob2 ?? "#000000",
          },
      nextMood: isBeforeFirstPlane
        ? ENTRY_MOOD
        : {
            background: nextItem.mood?.background ?? "#000000",
            blob1: nextItem.mood?.blob1 ?? "#000000",
            blob2: nextItem.mood?.blob2 ?? "#000000",
          },
      blend: isBeforeFirstPlane ? 0 : blend,
      velocity: scrollVelocityMv.get(),
      opacity,
    });

    for (let index = 0; index < planeCount; index += 1) {
      const material = materialsRef.current[index];
      if (!material) continue;

      let targetOpacity = 0;
      if (index === currentIndex) targetOpacity = 1 - blend;
      else if (index === nextIndex && nextIndex !== currentIndex) {
        targetOpacity = blend;
      }

      material.opacity += (targetOpacity - material.opacity) * FADE_SMOOTHING;
    }
  });

  return (
    <group>
      {items.map((item, index) => {
        const width =
          typeof item.image === "object" ? (item.image.width ?? 800) : 800;
        const height =
          typeof item.image === "object" ? (item.image.height ?? 1000) : 1000;
        const aspect = width / height;
        const planeHeight = 2.2;
        const planeWidth = planeHeight * aspect;
        const x = index % 2 === 0 ? -1.2 : 1.2;

        return (
          <mesh
            key={item.id}
            position={[
              x,
              0,
              SECTION_Z_RANGES.gallery.start +
                GALLERY_MESH_ENTRY_OFFSET_Z +
                index * PLANE_GAP,
            ]}
          >
            <planeGeometry args={[planeWidth, planeHeight]} />
            <meshBasicMaterial
              ref={(material) => {
                materialsRef.current[index] = material;
              }}
              map={textures[index]}
              color={textures[index] ? "#ffffff" : "#666666"}
              side={DoubleSide}
              transparent
              opacity={0}
            />
          </mesh>
        );
      })}
    </group>
  );
}
