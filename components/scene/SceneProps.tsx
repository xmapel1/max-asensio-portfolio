import { Suspense } from "react";
import GalleryPlanes from "@/components/scene/GalleryPlanes";
import type { Gallery } from "@/payload-types";

type ScenePropsProps = {
  galleryItems: Gallery[];
};

export default function SceneProps({ galleryItems }: ScenePropsProps) {
  return (
    <Suspense fallback={null}>
      <GalleryPlanes items={galleryItems} />
    </Suspense>
  );
}
