import type { MetadataRoute } from "next";
import { listerRestaurants, offresActives } from "@/lib/donnees";
import { URL_SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [offres, restaurants] = await Promise.all([offresActives(), listerRestaurants()]);
  return [
    { url: `${URL_SITE}/`, changeFrequency: "daily", priority: 1 },
    { url: `${URL_SITE}/restaurants`, changeFrequency: "weekly", priority: 0.7 },
    ...offres.map((o) => ({
      url: `${URL_SITE}/offres/${o.id}`,
      lastModified: o.verifiee_le ?? o.created_at,
      priority: 0.8,
    })),
    ...restaurants.map((r) => ({ url: `${URL_SITE}/restaurants/${r.id}`, priority: 0.6 })),
    { url: `${URL_SITE}/mentions-legales`, priority: 0.1 },
    { url: `${URL_SITE}/confidentialite`, priority: 0.1 },
  ];
}
