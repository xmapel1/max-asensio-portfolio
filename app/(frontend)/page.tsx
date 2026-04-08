import { getPayload } from "payload";
import config from "@payload-config";
import ClientLayout from "@/components/ClientLayout";
import type { Gallery as GalleryDoc } from "@/payload-types";

export default async function HomePage() {
  const payload = await getPayload({ config });
  const data = await payload.find({
    collection: "gallery",
    sort: "order",
    depth: 1,
  });

  return <ClientLayout galleryItems={data.docs as GalleryDoc[]} />;
}
