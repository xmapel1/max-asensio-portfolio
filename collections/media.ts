import { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: () => true,
  },
  upload: {
  mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'],
  },
  fields: [
    {
      name: "caption",
      type: "text",
    },
    {
      name: "order",
      type: "number",
    },
  ],
};
