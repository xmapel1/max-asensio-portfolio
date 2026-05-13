import { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: () => true,
  },
  upload: {
    formatOptions: {
      format: "webp",
      options: {
        quality: 90,
      },
    },
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
      },
      {
        name: "horizontal",
        width: 1280,
      },
      {
        name: "vertical",
        width: 800,
        height: 1000,
      },
    ],
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
    ],
    resizeOptions: undefined,
    focalPoint: true,
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
