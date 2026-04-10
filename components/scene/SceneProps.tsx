"use client";

import { Suspense, useState } from "react";
import GalleryBackground, {
  type MoodColors,
} from "@/components/scene/GalleryBackground";
import GalleryPlanes from "@/components/scene/GalleryPlanes";
import type { Gallery } from "@/payload-types";

type ScenePropsProps = {
  galleryItems: Gallery[];
};

export default function SceneProps({ galleryItems }: ScenePropsProps) {
  const firstMood = galleryItems[0]?.mood;
  const [backgroundState, setBackgroundState] = useState<{
    currentMood: MoodColors;
    nextMood: MoodColors;
    blend: number;
    velocity: number;
    opacity: number;
  }>({
    currentMood: {
      background: firstMood?.background ?? "#5f81ab",
      blob1: firstMood?.blob1 ?? "#f88b8d",
      blob2: firstMood?.blob2 ?? "#cfbbdd",
    },
    nextMood: {
      background: firstMood?.background ?? "#5f81ab",
      blob1: firstMood?.blob1 ?? "#f88b8d",
      blob2: firstMood?.blob2 ?? "#cfbbdd",
    },
    blend: 0,
    velocity: 0,
    opacity: 0,
  });

  return (
    <Suspense fallback={null}>
      <GalleryBackground
        currentMood={backgroundState.currentMood}
        nextMood={backgroundState.nextMood}
        blend={backgroundState.blend}
        velocity={backgroundState.velocity}
        opacity={backgroundState.opacity}
      />
      <GalleryPlanes
        items={galleryItems}
        onBackgroundChange={setBackgroundState}
      />
    </Suspense>
  );
}
