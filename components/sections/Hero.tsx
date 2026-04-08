"use client";

import { motion, useTransform } from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { PARALLAX } from "@/components/scene/sceneConfig";

function Hero() {
  const { exitProgress } = useSectionProgress("hero");
  const scale = useTransform(exitProgress, [0, 1], [1, PARALLAX.exitScale]);
  const opacity = useTransform(exitProgress, [0, 1], [1, PARALLAX.exitOpacity]);

  return (
    <section
      id="hero"
      className="pointer-events-none fixed inset-0 z-10 flex items-center px-8"
    >
      <motion.div
        style={{ scale, opacity, willChange: "transform, opacity" }}
        className="transform-gpu"
      >
        <h1 className="font-funeraks-demo text-[clamp(3rem,10vw,9rem)] leading-[0.9] text-white">
          Max Asensio
        </h1>
        <h2 className="font-mono text-[clamp(1rem,2vw,2rem)] uppercase tracking-[0.18em] text-white/60">
          Fullstack | XR dev
        </h2>
      </motion.div>
    </section>
  );
}

export default Hero;
