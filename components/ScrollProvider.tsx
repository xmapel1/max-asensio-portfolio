"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useMotionValue, type MotionValue } from "motion/react";
import {
  CAMERA_START_Z,
  progressToCameraZ,
} from "@/components/scene/sceneConfig";

export type ScrollContextValue = {
  scrollProgressMv: MotionValue<number>;
  cameraZMv: MotionValue<number>;
  scrollVelocityMv: MotionValue<number>;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
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
        currentCameraZRef.current + (targetCameraZRef.current - currentCameraZRef.current) * 0.1;
      currentCameraZRef.current = nextCameraZ;

      if (Math.abs(cameraZMv.get() - nextCameraZ) > 0.0001) {
        cameraZMv.set(nextCameraZ);
      }

      if (Math.abs(targetCameraZRef.current - currentCameraZRef.current) > 0.001) {
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

    const syncFromWindowScroll = () => {
      const doc = document.documentElement;
      const maxScrollable = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const nextProgress = Math.min(Math.max(window.scrollY / maxScrollable, 0), 1);

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
  }, [cameraZMv, scrollProgressMv, scrollVelocityMv]);

  const value = useMemo(() => ({ scrollProgressMv, cameraZMv, scrollVelocityMv }), [
    cameraZMv,
    scrollProgressMv,
    scrollVelocityMv,
  ]);

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

export function useScrollState() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollState must be used within ScrollProvider");
  }
  return context;
}
