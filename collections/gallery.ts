import { CollectionConfig } from "payload";

export const Gallery: CollectionConfig = {
  slug: "gallery",
  access: { read: () => true },
  admin: { defaultColumns: ["title", "order"] },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "image", type: "upload", relationTo: "media", required: true },
    { name: "order", type: "number" },
    { name: "xOffset", type: "number", defaultValue: 0 },
    {
      name: "mood",
      type: "group",
      fields: [
        { name: "background", type: "text", defaultValue: "#000000" },
        { name: "blob1", type: "text", defaultValue: "#000000" },
        { name: "blob2", type: "text", defaultValue: "#000000" },
      ],
    },
  ],
};
