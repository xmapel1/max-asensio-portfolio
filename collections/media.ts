import { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: () => true,
  },
  upload: true,
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
