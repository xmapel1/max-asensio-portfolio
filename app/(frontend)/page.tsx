import type { Media } from "@/payload-types";

async function getMedia() {
  const res = await fetch("http://localhost:3000/api/media", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch media");
  return res.json();
}

export default async function TestPage() {
  const data = await getMedia();
  const media: Media[] = data.docs;

  return (
    <div>
      <h1>Media</h1>
      {media.map((item) => (
        <img
          key={item.id}
          src={`http://localhost:3000${item.url}`}
          alt={item.caption || ""}
          style={{ maxWidth: 300 }}
        />
      ))}
    </div>
  );
}
