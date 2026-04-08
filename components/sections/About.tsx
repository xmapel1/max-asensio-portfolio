"use client";

import { motion, useTransform } from "motion/react";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { PARALLAX } from "@/components/scene/sceneConfig";

const interests = ["Cinematic art", "Climbing / Hiking", "Films", "Music"];

const techStack = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Supabase",
  "Payload CMS",
  "Three.js",
  "React Three Fiber",
  "Unity 3D",
  "Blender",
];

function About() {
  const { entryProgress, exitProgress } = useSectionProgress("about");
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
      id="about"
      className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center px-4 py-20"
    >
      <motion.div
        style={{ scale, opacity, willChange: "transform, opacity" }}
        className="transform-gpu w-full max-w-[900px] rounded-lg border border-white/10 bg-[rgba(10,10,10,0.85)] p-[clamp(2rem,5vw,4rem)] backdrop-blur-lg"
      >
        <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/40">
          About
        </p>

        <p className="max-w-[70ch] text-[clamp(1.05rem,1.2vw,1.2rem)] leading-[1.7] text-white/90">
          I&apos;m a full-stack developer with a background in XR and immersive
          media. I transitioned from building VR/AR experiences to developing
          modern web applications, combining technical problem-solving with a
          strong eye for interactive design.
        </p>

        <p className="max-w-[70ch] mt-6 text-[clamp(1.05rem,1.2vw,1.2rem)] leading-[1.7] text-white/90">
          Today, I focus on building scalable, user-centered web applications
          using modern frameworks and clean design principles. My experience
          spans project management in XR production, full-stack development, and
          creative work in film, game development, and photography — giving me a
          multidisciplinary perspective when designing digital products.
        </p>

        <p className="mt-6 text-sm text-white/70 font-mono">
          Currently building Smorgasbord @ Partnersense
        </p>

        <div className="my-10 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

        <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/40">
          Interests
        </p>
        <div className="flex flex-wrap gap-2">
          {interests.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="my-10 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

        <div className="mt-10">
          <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/40">
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-xs text-white/70 transition-colors duration-300 hover:border-white/30 hover:text-white/90"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default About;
