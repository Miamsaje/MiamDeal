import type { MetadataRoute } from "next";

// Permet d'« installer » MiamDeal sur l'écran d'accueil du téléphone.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MiamDeal — Les bons plans restos à Paris",
    short_name: "MiamDeal",
    description: "Menus midi, formules étudiantes, happy hours et offres du moment à Paris.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffbea",
    theme_color: "#ffc800",
    lang: "fr",
    icons: [{ src: "/logo.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
