"use client";

import { useEffect, useState } from "react";
import { useMotionValueEvent } from "motion/react";
import { useScrollState } from "@/components/ScrollProvider";
import {
  SECTION_Z_RANGES,
  clamp01,
  zRangeToProgressRange,
} from "@/components/scene/sceneConfig";

export const PLANE_COUNT = 6;
export const PLANE_GAP = 4;

export function useGalleryScroll() {
  const { scrollProgressMv } = useScrollState();
  const [localProgress, setLocalProgress] = useState(0);
  const [cameraZOffset, setCameraZOffset] = useState(0);

  const galleryRange = zRangeToProgressRange(
    SECTION_Z_RANGES.gallery.start,
    SECTION_Z_RANGES.gallery.end,
  );
  const rangeSpan = galleryRange.end - galleryRange.start || 1;

  const updateFromProgress = (progress: number) => {
    const nextLocalProgress = clamp01(
      (progress - galleryRange.start) / rangeSpan,
    );
    setLocalProgress(nextLocalProgress);
    setCameraZOffset(nextLocalProgress * (PLANE_COUNT - 1) * PLANE_GAP);
  };

  useEffect(() => {
    updateFromProgress(scrollProgressMv.get());
    // Only run on mount to seed initial values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(scrollProgressMv, "change", (progress) => {
    updateFromProgress(progress);
  });

  return { localProgress, cameraZOffset };
}
