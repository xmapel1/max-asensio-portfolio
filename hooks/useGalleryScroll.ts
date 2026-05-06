"use client";

import { useEffect, useState } from "react";
import { useMotionValueEvent } from "motion/react";
import { useScrollState } from "@/components/ScrollProvider";
import {
  CAMERA_END_Z,
  GALLERY_PLANE_GAP,
  SECTION_Z_RANGES,
  clamp01,
  zRangeToProgressRangeWithCameraEnd,
} from "@/components/scene/sceneConfig";

export function useGalleryScroll(planeCount: number) {
  const { scrollProgressMv } = useScrollState();
  const [localProgress, setLocalProgress] = useState(0);
  const [cameraZOffset, setCameraZOffset] = useState(0);

  const galleryRange = zRangeToProgressRangeWithCameraEnd(
    SECTION_Z_RANGES.gallery.start,
    SECTION_Z_RANGES.gallery.end,
    CAMERA_END_Z,
  );
  const rangeSpan = galleryRange.end - galleryRange.start || 1;

  const updateFromProgress = (progress: number) => {
    const nextLocalProgress = clamp01(
      (progress - galleryRange.start) / rangeSpan,
    );
    setLocalProgress(nextLocalProgress);
    setCameraZOffset(
      nextLocalProgress * Math.max(planeCount - 1, 0) * GALLERY_PLANE_GAP,
    );
  };

  useEffect(() => {
    updateFromProgress(scrollProgressMv.get());
    // Only run on mount to seed initial values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planeCount]);

  useMotionValueEvent(scrollProgressMv, "change", (progress) => {
    updateFromProgress(progress);
  });

  return { localProgress, cameraZOffset };
}
