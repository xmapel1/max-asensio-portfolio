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
        <h1 className="font-shatoze text-[clamp(6rem,14vw,16rem)] leading-[0.9] text-white">
          mAX aSENsiO
        </h1>
        <h2 className="font-bebas-neue text-[clamp(1.5rem,2.5vw,2.5rem)] tracking-[0.12em] text-white/50">
          Fullstack / XR dev
      </h2>
      </motion.div>
    </section>
  );
}

export default Hero;
