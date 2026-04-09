"use client";

import { useState } from "react";
import { useMotionValueEvent } from "motion/react";
import { useScrollState } from "@/components/ScrollProvider";

export default function DebugCameraZOverlay() {
  const { cameraZMv } = useScrollState();
  const [cameraZ, setCameraZ] = useState(cameraZMv.get());

  useMotionValueEvent(cameraZMv, "change", (value) => {
    setCameraZ(value);
  });

  return (
    <div className="fixed left-3 top-3 z-9999 font-mono text-sm text-white">
      cameraZ: {cameraZ.toFixed(2)}
    </div>
  );
}
