"use client";

import { useTexture } from "@react-three/drei";
import { DoubleSide } from "three";
import { SECTION_Z_RANGES } from "@/components/scene/sceneConfig";
import { PLANE_GAP } from "@/hooks/useGalleryScroll";
import type { Gallery } from "@/payload-types";

const PLANE_ENTRY_DELAY_Z = 10;
const MAX_ABS_X_OFFSET = 1.8;

type GalleryPlanesProps = {
  items: Gallery[];
};

export default function GalleryPlanes({ items }: GalleryPlanesProps) {
  const urls = items.map((item) => {
    const path = typeof item.image === "object" ? item.image.url ?? "" : "";
    if (!path) return "";
    return path.startsWith("http")
      ? path
      : `${process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000"}${path}`;
  });
  const textures = useTexture(urls);

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
        const xOffset = Math.max(
          -MAX_ABS_X_OFFSET,
          Math.min(item.xOffset ?? 0, MAX_ABS_X_OFFSET),
        );

        return (
          <mesh
            key={item.id}
            position={[
              xOffset,
              0,
              SECTION_Z_RANGES.gallery.start +
                PLANE_ENTRY_DELAY_Z +
                index * PLANE_GAP,
            ]}
          >
            <planeGeometry args={[planeWidth, planeHeight]} />
            <meshBasicMaterial
              map={textures[index]}
              color={textures[index] ? "#ffffff" : "#666666"}
              side={DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}
