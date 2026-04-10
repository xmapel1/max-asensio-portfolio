export const CAMERA_START_Z = -100;
export const CAMERA_END_Z = 10;

export const SCROLL_DISTANCE_PX = 8000;
export const GALLERY_MESH_ENTRY_OFFSET_Z = 16;
export const GALLERY_FADE_SWEETSPOT_OFFSET_Z = 2.6;
export const GALLERY_BG_FADE_WINDOW = 8;
export const GALLERY_COLOR_LERP = 0.05;

export const SECTION_Z_RANGES = {
  hero: { start: -100, end: -80 },
  about: { start: -80, end: -55 },
  projects: { start: -55, end: -30 },
  gallery: { start: -25, end: 0 },
} as const;

export type SectionKey = keyof typeof SECTION_Z_RANGES;

export const PARALLAX = {
  entryScale: 1.4,
  exitScale: 0.7,
  entryY: 0,
  exitY: 0,
  entryOpacity: 0,
  exitOpacity: 0,
};

export function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

export function progressToCameraZ(progress: number) {
  const p = clamp01(progress);
  return CAMERA_START_Z + (CAMERA_END_Z - CAMERA_START_Z) * p;
}

export function zRangeToProgressRange(startZ: number, endZ: number) {
  const totalRange = CAMERA_END_Z - CAMERA_START_Z;
  const start = (startZ - CAMERA_START_Z) / totalRange;
  const end = (endZ - CAMERA_START_Z) / totalRange;

  return {
    start: clamp01(start),
    end: clamp01(end),
  };
}
