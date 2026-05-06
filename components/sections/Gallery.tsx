"use client";

import { motion, useTransform } from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { PARALLAX } from "@/components/scene/sceneConfig";

function Gallery() {
  const { entryProgress, exitProgress } = useSectionProgress("gallery");
  const entryScale = useTransform(
    entryProgress,
    [0, 1],
    [PARALLAX.entryScale, 1],
  );
  const exitScale = useTransform(exitProgress, [0, 1], [1, PARALLAX.exitScale]);
  const scale = useTransform(
    [exitProgress, entryScale, exitScale],
    (values: number[]) => {
      const [exitPhase, entry, exit] = values;
      return exitPhase > 0 ? exit : entry;
    },
  );
  const entryOpacity = useTransform(
    entryProgress,
    [0, 1],
    [PARALLAX.entryOpacity, 1],
  );
  const exitOpacity = useTransform(
    exitProgress,
    [0, 1],
    [1, PARALLAX.exitOpacity],
  );
  const opacity = useTransform(
    [exitProgress, entryOpacity, exitOpacity],
    (values: number[]) => {
      const [exitPhase, enterOpacity, leaveOpacity] = values;
      return exitPhase > 0 ? leaveOpacity : enterOpacity;
    },
  );

  return (
    <section
      id="gallery"
      className="pointer-events-none fixed inset-0 z-10 flex items-center justify-end pr-[25vw] pl-8"
    >
      <motion.div
        style={{ scale, opacity, willChange: "transform, opacity" }}
        className="transform-gpu w-full max-w-4xl rounded-xl border border-white/10 bg-white/3 p-8 backdrop-blur-sm text-center"
      >
        <h2 className="text-[clamp(4rem,10vw,8rem)] font-shatoze text-white">
          Visual Experiments
        </h2>
        <p className="font-bebas-neue text-[clamp(1.5rem,2.5vw,2.5rem)] mt-3 text-white/70">
          Please enjoy this interactive gallery of some of my photography work.
        </p>
      </motion.div>
    </section>
  );
}

export default Gallery;
