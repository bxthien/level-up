import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LevelUp",
    short_name: "LevelUp",
    description: "Daily tasks, habits, and personal progress tracking.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/logo.png",
        sizes: "2048x2048",
        type: "image/png",
      },
    ],
  };
}
