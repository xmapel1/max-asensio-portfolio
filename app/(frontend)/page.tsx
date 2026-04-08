"use client";

import { ScrollProvider } from "@/components/ScrollProvider";
import About from "@/components/sections/About";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import SceneCanvas from "@/components/scene/SceneCanvas";
import { SCROLL_DISTANCE_PX } from "@/components/scene/sceneConfig";

export default function HomePage() {
  return (
    <ScrollProvider>
      <SceneCanvas />
      <Hero />
      <About />
      <Projects />
      <Gallery />
      <div
        aria-hidden="true"
        className="relative z-20"
        style={{ height: `calc(100vh + ${SCROLL_DISTANCE_PX}px)` }}
      />
    </ScrollProvider>
  );
}
