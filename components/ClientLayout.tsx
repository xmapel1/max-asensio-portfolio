"use client";

import { ScrollProvider } from "@/components/ScrollProvider";
import About from "@/components/sections/About";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import SceneCanvas from "@/components/scene/SceneCanvas";
import { SCROLL_DISTANCE_PX } from "@/components/scene/sceneConfig";
import type { Gallery as GalleryDoc, Project as ProjectDoc } from "@/payload-types";

type ClientLayoutProps = {
  galleryItems: GalleryDoc[];
  projectItems: ProjectDoc[];
};

export default function ClientLayout({ galleryItems, projectItems }: ClientLayoutProps) {
  return (
    <ScrollProvider galleryPlaneCount={galleryItems.length}>
      <SceneCanvas galleryItems={galleryItems} />
      <Hero />
      <About />
      <Projects projectItems={projectItems} />
      <Gallery />
      <div
        aria-hidden="true"
        className="relative z-20"
        style={{ height: `calc(100vh + ${SCROLL_DISTANCE_PX}px)` }}
      />
    </ScrollProvider>
  );
}
