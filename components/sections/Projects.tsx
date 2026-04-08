"use client";

import { motion, useTransform } from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { PARALLAX } from "@/components/scene/sceneConfig";

function Projects() {
  const { entryProgress, exitProgress } = useSectionProgress("projects");
  const entryScale = useTransform(entryProgress, [0, 1], [PARALLAX.entryScale, 1]);
  const exitScale = useTransform(exitProgress, [0, 1], [1, PARALLAX.exitScale]);
  const scale = useTransform([exitProgress, entryScale, exitScale], (values: number[]) => {
    const [exitPhase, entry, exit] = values;
    return exitPhase > 0 ? exit : entry;
  });
  const entryOpacity = useTransform(entryProgress, [0, 1], [PARALLAX.entryOpacity, 1]);
  const exitOpacity = useTransform(exitProgress, [0, 1], [1, PARALLAX.exitOpacity]);
  const opacity = useTransform(
    [exitProgress, entryOpacity, exitOpacity],
    (values: number[]) => {
      const [exitPhase, enterOpacity, leaveOpacity] = values;
      return exitPhase > 0 ? leaveOpacity : enterOpacity;
    },
  );

  return (
    <section
      id="projects"
      className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center px-8"
    >
      <motion.div
        style={{ scale, opacity, willChange: "transform, opacity" }}
        className="transform-gpu w-full max-w-4xl rounded-xl border border-white/10 bg-white/4 p-8 backdrop-blur-sm"
      >
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-white/50">
          Projects
        </p>
        <h2 className="text-4xl font-semibold text-white">Selected Work</h2>
        <p className="mt-3 max-w-2xl text-white/70">
          Placeholder cards for case studies, experiments, and production builds.
          This zone will become your projects showcase.
        </p>
      </motion.div>
    </section>
  );
}

export default Projects;
