"use client";

import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { useMotionValue, type MotionValue } from "motion/react";
import {
  CAMERA_START_Z,
  GALLERY_FADE_SWEETSPOT_OFFSET_Z,
  GALLERY_MESH_ENTRY_OFFSET_Z,
  SECTION_Z_RANGES,
  progressToCameraZ,
} from "@/components/scene/sceneConfig";

export type ScrollContextValue = {
  scrollProgressMv: MotionValue<number>;
  cameraZMv: MotionValue<number>;
  scrollVelocityMv: MotionValue<number>;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

const GALLERY_PLANE_GAP = 4;
const SNAP_CAPTURE_DISTANCE = GALLERY_PLANE_GAP * 0.2;
const FIRST_SNAP_CAPTURE_DISTANCE = GALLERY_PLANE_GAP * 0.1;

export function ScrollProvider({
  children,
  galleryPlaneCount,
}: {
  children: React.ReactNode;
  galleryPlaneCount: number;
}) {
  const scrollProgressMv = useMotionValue(0);
  const cameraZMv = useMotionValue(CAMERA_START_Z);
  const scrollVelocityMv = useMotionValue(0);

  const targetCameraZRef = useRef(CAMERA_START_Z);
  const currentCameraZRef = useRef(CAMERA_START_Z);
  const frameRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);
  const lastTimestampRef = useRef(0);
  const velocityResetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const stopFrame = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    const animateCamera = () => {
      const nextCameraZ =
        currentCameraZRef.current +
        (targetCameraZRef.current - currentCameraZRef.current) * 0.1;
      currentCameraZRef.current = nextCameraZ;

      if (Math.abs(cameraZMv.get() - nextCameraZ) > 0.0001) {
        cameraZMv.set(nextCameraZ);
      }

      if (
        Math.abs(targetCameraZRef.current - currentCameraZRef.current) > 0.001
      ) {
        frameRef.current = window.requestAnimationFrame(animateCamera);
      } else {
        currentCameraZRef.current = targetCameraZRef.current;
        cameraZMv.set(targetCameraZRef.current);
        stopFrame();
      }
    };

    const startFrame = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(animateCamera);
      }
    };

    const snapToNearestGallerySweetspot = () => {
      if (galleryPlaneCount <= 0) return;

      const cameraZ = currentCameraZRef.current;
      const isInGalleryRange =
        cameraZ >= SECTION_Z_RANGES.gallery.start &&
        cameraZ <= SECTION_Z_RANGES.gallery.end;
      if (!isInGalleryRange) return;

      const sweetspotStartZ =
        SECTION_Z_RANGES.gallery.start +
        GALLERY_MESH_ENTRY_OFFSET_Z +
        GALLERY_FADE_SWEETSPOT_OFFSET_Z;
      const rawIndex = (cameraZ - sweetspotStartZ) / GALLERY_PLANE_GAP;
      const nearestIndex = Math.min(
        Math.max(Math.round(rawIndex), 0),
        galleryPlaneCount - 1,
      );
      const snappedSweetspotZ =
        sweetspotStartZ + nearestIndex * GALLERY_PLANE_GAP;
      const captureDistance =
        nearestIndex === 0
          ? FIRST_SNAP_CAPTURE_DISTANCE
          : SNAP_CAPTURE_DISTANCE;
      const distanceToSweetspot = Math.abs(cameraZ - snappedSweetspotZ);
      if (distanceToSweetspot > captureDistance) return;

      targetCameraZRef.current = snappedSweetspotZ;
      startFrame();
    };

    const syncFromWindowScroll = () => {
      const doc = document.documentElement;
      const maxScrollable = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const nextProgress = Math.min(
        Math.max(window.scrollY / maxScrollable, 0),
        1,
      );

      const now = performance.now();
      const deltaY = window.scrollY - lastScrollYRef.current;
      const deltaTime = now - lastTimestampRef.current || 16.67;
      const nextVelocity = deltaY / deltaTime;

      lastScrollYRef.current = window.scrollY;
      lastTimestampRef.current = now;

      if (Math.abs(nextProgress - scrollProgressMv.get()) > 0.0001) {
        scrollProgressMv.set(nextProgress);
      }
      if (Math.abs(nextVelocity - scrollVelocityMv.get()) > 0.0001) {
        scrollVelocityMv.set(nextVelocity);
      }
      targetCameraZRef.current = progressToCameraZ(nextProgress);
      startFrame();

      if (velocityResetTimerRef.current !== null) {
        window.clearTimeout(velocityResetTimerRef.current);
      }
      velocityResetTimerRef.current = window.setTimeout(() => {
        scrollVelocityMv.set(0);
        snapToNearestGallerySweetspot();
      }, 80);
    };

    // Sync initial values on mount.
    lastScrollYRef.current = window.scrollY;
    lastTimestampRef.current = performance.now();
    syncFromWindowScroll();

    const onScroll = () => {
      syncFromWindowScroll();
    };
    const onResize = () => {
      syncFromWindowScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      if (velocityResetTimerRef.current !== null) {
        window.clearTimeout(velocityResetTimerRef.current);
      }
      stopFrame();
    };
  }, [cameraZMv, galleryPlaneCount, scrollProgressMv, scrollVelocityMv]);

  const value = useMemo(
    () => ({ scrollProgressMv, cameraZMv, scrollVelocityMv }),
    [cameraZMv, scrollProgressMv, scrollVelocityMv],
  );

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
}

export function useScrollState() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollState must be used within ScrollProvider");
  }
  return context;
}
