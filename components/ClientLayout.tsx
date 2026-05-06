"use client";

import { ScrollProvider } from "@/components/ScrollProvider";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import SceneCanvas from "@/components/scene/SceneCanvas";
import { getDynamicScrollDistancePx } from "@/components/scene/sceneConfig";
import type { Gallery as GalleryDoc, Project as ProjectDoc } from "@/payload-types";

type ClientLayoutProps = {
  galleryItems: GalleryDoc[];
  projectItems: ProjectDoc[];
};


export default function ClientLayout({ galleryItems, projectItems }: ClientLayoutProps) {
  const scrollDistancePx = getDynamicScrollDistancePx(galleryItems.length);
  return (
    <ScrollProvider galleryPlaneCount={galleryItems.length}>
      <SceneCanvas galleryItems={galleryItems} />
      <Hero />
      <About />
      <Projects projectItems={projectItems} />
      <Contact />
      <Gallery />
      <div
        aria-hidden="true"
        className="pointer-events-none relative z-20"
        style={{ height: `calc(100vh + ${scrollDistancePx}px)` }}
      />
    </ScrollProvider>
  );
}
