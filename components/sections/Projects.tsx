"use client";

import { motion, useTransform } from "motion/react";
import Image from "next/image";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { PARALLAX } from "@/components/scene/sceneConfig";
import type { Media, Project as ProjectDoc } from "@/payload-types";

type ProjectsProps = {
  projectItems: ProjectDoc[];
};

function extractText(node: unknown): string {
  if (!node || typeof node !== "object") return "";

  const value = node as { text?: unknown; children?: unknown[] };
  const own = typeof value.text === "string" ? value.text : "";
  const nested = Array.isArray(value.children)
    ? value.children.map(extractText).join(" ")
    : "";

  return `${own} ${nested}`.trim();
}

function Projects({ projectItems }: ProjectsProps) {
  const { entryProgress, exitProgress } = useSectionProgress("projects");
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
      id="projects"
      className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center px-6 py-12"
    >
      <motion.div
        style={{ scale, opacity, willChange: "transform, opacity" }}
        className="pointer-events-auto transform-gpu w-full max-w-7xl bg-transparent p-10 backdrop-blur-sm xl:max-w-[96rem]"
      >
        {projectItems.length === 0 ? (
          <p className="max-w-2xl text-white/70">
            Add your first project in the admin panel to populate this section.
          </p>
        ) : (
          <div className="space-y-10">
            {projectItems.map((project) => {
              const description =
                project.description?.root?.children
                  ?.map(extractText)
                  .join(" ")
                  .trim() || "Description coming soon.";
              const thumbnail =
                project.thumbnail && typeof project.thumbnail !== "number"
                  ? (project.thumbnail as Media)
                  : null;
              const imageUrl = thumbnail?.url ?? null;
              const tagList =
                project.tags
                  ?.map((item) => item.tag?.trim())
                  .filter((value): value is string => Boolean(value)) ?? [];

              return (
                <article key={project.id} className="bg-transparent">
                  <div className="relative overflow-hidden border border-white/10">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={project.title}
                        width={thumbnail?.width ?? 1600}
                        height={thumbnail?.height ?? 900}
                        className="h-auto w-full object-contain"
                      />
                    ) : (
                      <div className="flex min-h-[24rem] w-full items-center justify-center bg-white/5 text-sm text-white/50">
                        No project image
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/55 to-transparent" />

                    <h3 className="absolute bottom-6 left-8 font-bebas-neue font-normal text-[5rem] leading-none text-white sm:text-[10rem]">
                      {project.title}
                    </h3>

                    {tagList.length > 0 && (
                      <p className="absolute right-8 bottom-8 font-mono text-[0.8rem] uppercase tracking-[0.08em] text-white/55">
                        {tagList.join(" / ")}
                      </p>
                    )}
                  </div>

                  <p className="mt-3 truncate text-left pl-10 text-[1rem] italic font-normal text-white/55">
                    {description}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </motion.div>
    </section>
  );
}

export default Projects;
