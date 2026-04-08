"use client";

import { useTransform, type MotionValue } from "motion/react";
import { useScrollState } from "@/components/ScrollProvider";
import {
  SECTION_Z_RANGES,
  type SectionKey,
  zRangeToProgressRange,
} from "@/components/scene/sceneConfig";

export function useSectionProgress(section: SectionKey): {
  entryProgress: MotionValue<number>;
  exitProgress: MotionValue<number>;
} {
  const { scrollProgressMv } = useScrollState();

  const zone = SECTION_Z_RANGES[section];
  const range = zRangeToProgressRange(zone.start, zone.end);
  const midpoint = (range.start + range.end) / 2;

  const entrySpan = midpoint - range.start || 1;
  const exitSpan = range.end - midpoint || 1;
  const entryProgress = useTransform(scrollProgressMv, (value) => {
    return clamp((value - range.start) / entrySpan);
  });
  const exitProgress = useTransform(scrollProgressMv, (value) => {
    return clamp((value - midpoint) / exitSpan);
  });

  return { entryProgress, exitProgress };
}

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1);
}
