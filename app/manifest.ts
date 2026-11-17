import type { MetadataRoute } from "next";

// Permet d'« installer » MiamDeal sur l'écran d'accueil du téléphone.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MiamDeal — Les bons plans restos à Paris",
    short_name: "MiamDeal",
    description: "Menus midi, formules étudiantes, happy hours et offres du moment à Paris.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "fr",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
