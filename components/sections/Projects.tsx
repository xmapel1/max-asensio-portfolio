"use client";

import { useState } from "react";
import { AnimatePresence, motion, useTransform } from "motion/react";
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
  const [openProjectId, setOpenProjectId] = useState<number | null>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [direction, setDirection] = useState(1);
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
  const activeProject =
    projectItems.length > 0 ? projectItems[activeProjectIndex % projectItems.length] : null;
  const thumbnail =
    activeProject?.thumbnail && typeof activeProject.thumbnail !== "number"
      ? (activeProject.thumbnail as Media)
      : null;
  const videoMedia =
    activeProject?.video && typeof activeProject.video !== "number"
      ? (activeProject.video as Media)
      : null;
  const imageUrl = thumbnail?.url ?? null;
  const videoUrl = videoMedia?.url ?? null;
  const tagList =
    activeProject?.tags
      ?.map((item) => item.tag?.trim())
      .filter((value): value is string => Boolean(value)) ?? [];
  const isOpen = activeProject ? openProjectId === activeProject.id : false;
  const drawerId = activeProject ? `project-drawer-${activeProject.id}` : "project-drawer";

  const showProject = (step: number) => {
    if (projectItems.length === 0) return;
    const normalizedIndex =
      (activeProjectIndex + step + projectItems.length) % projectItems.length;
    setDirection(step >= 0 ? 1 : -1);
    setOpenProjectId(null);
    setActiveProjectIndex(normalizedIndex);
  };

  return (
    <section
      id="projects"
      className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center px-6 py-12"
    >
      <motion.div
        style={{ scale, opacity, willChange: "transform, opacity" }}
        className="pointer-events-auto transform-gpu w-full max-w-7xl bg-transparent p-10 backdrop-blur-sm xl:max-w-384"
      >
        {projectItems.length === 0 ? (
          <p className="max-w-2xl text-white/70">
            Add your first project in the admin panel to populate this section.
          </p>
        ) : (
          activeProject && (
            <div className="pointer-events-auto relative px-14">
              <button
                type="button"
                onClick={() => showProject(-1)}
                className="absolute top-1/2 left-0 z-50 -translate-y-1/2 text-4xl text-white/70 transition-colors hover:text-white"
                aria-label="Show previous project"
              >
                ‹
              </button>

              <AnimatePresence initial={false} mode="wait" custom={direction}>
                <motion.article
                  key={activeProject.id}
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({
                      x: dir > 0 ? 80 : -80,
                      opacity: 0,
                      scale: 0.985,
                    }),
                    center: { x: 0, opacity: 1, scale: 1 },
                    exit: (dir: number) => ({
                      x: dir > 0 ? -80 : 80,
                      opacity: 0,
                      scale: 0.985,
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-auto bg-transparent"
                >
                  <div className="pointer-events-auto relative overflow-hidden border border-white/10">
                    <>
                      <div className="relative w-full aspect-video">
                        <motion.div
                          animate={{ opacity: isOpen && videoUrl ? 0 : 1 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full w-full"
                        >
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={activeProject.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex min-h-96 w-full items-center justify-center bg-white/5 text-sm text-white/50">
                              No project image
                            </div>
                          )}
                        </motion.div>
                        {videoUrl && (
                          <motion.video
                            src={videoUrl}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            aria-hidden="true"
                            animate={{ opacity: isOpen ? 0.55 : 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                          />
                        )}
                      </div>

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/55 to-transparent" />

                      <motion.div
                        animate={{ y: isOpen ? -300 : 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-x-0 bottom-0 z-20 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-4 px-8 pb-4"
                      >
                        <h3 className="min-w-0 self-end font-bebas-neue font-normal text-[4.25rem] leading-none text-white sm:text-[8rem] lg:text-[10rem]">
                          {activeProject.title}
                        </h3>

                        {tagList.length > 0 && (
                          <p className="self-end text-right font-mono mb-6 text-[0.75rem] leading-none uppercase tracking-[0.08em] text-white/60 sm:text-[0.8rem]">
                            {tagList.join(" / ")}
                          </p>
                        )}
                      </motion.div>

                      <button
                        type="button"
                        onClick={() =>
                          setOpenProjectId((current) =>
                            current === activeProject.id ? null : activeProject.id,
                          )
                        }
                        className="group absolute inset-x-0 bottom-0 z-40 h-16 cursor-pointer pointer-events-auto"
                        aria-expanded={isOpen}
                        aria-controls={drawerId}
                      >
                        {!isOpen && (
                          <motion.svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            animate={{ y: [0, -3, 0] }}
                            transition={{
                              duration: 1.2,
                              ease: "easeInOut",
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                            className="pointer-events-none absolute bottom-1 left-1/2 h-18 w-18 -translate-x-1/2 text-white/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                          >
                            <path
                              d="M6 15L12 9L18 15"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </motion.svg>
                        )}
                      </button>

                      <motion.div
                        id={drawerId}
                        initial={false}
                        animate={{
                          y: isOpen ? 0 : "100%",
                          opacity: isOpen ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={{ position: "absolute" }}
                        className="inset-x-0 bottom-0 z-30 pointer-events-none bg-black/78 p-5 backdrop-blur-sm sm:p-6"
                      >
                        <div className="space-y-3">
                          {activeProject.description?.root?.children?.map((node, index) => {
                            const text = extractText(node).trim();
                            if (!text) return null;

                            return (
                              <p
                                key={`${activeProject.id}-description-${index}`}
                                className="pointer-events-auto cursor-text font-inter text-[1.15rem] leading-relaxed text-white"
                              >
                                {text}
                              </p>
                            );
                          })}
                        </div>
                      </motion.div>
                    </>
                  </div>
                </motion.article>
              </AnimatePresence>

              <button
                type="button"
                onClick={() => showProject(1)}
                className="absolute top-1/2 right-0 z-50 -translate-y-1/2 text-4xl text-white/70 transition-colors hover:text-white"
                aria-label="Show next project"
              >
                ›
              </button>
            </div>
          )
        )}
      </motion.div>
    </section>
  );
}

export default Projects;
