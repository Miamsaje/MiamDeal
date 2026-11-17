import { iconeCuisine } from "@/lib/cuisines";
import type { Restaurant } from "@/lib/types";

/** Photo du resto, ou une vignette jaune clair avec l'icône de sa cuisine. */
export default function PhotoResto({
  restaurant,
  className = "",
  grande = false,
}: {
  restaurant: Pick<Restaurant, "nom" | "photo_url" | "cuisine">;
  className?: string;
  grande?: boolean;
}) {
  if (restaurant.photo_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={restaurant.photo_url}
        alt={`Photo de ${restaurant.nom}`}
        loading="lazy"
        className={`bg-miam-pale object-cover ${className}`}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center bg-gradient-to-br from-miam-clair to-miam-pale ${
        grande ? "text-7xl" : "text-5xl"
      } ${className}`}
    >
      <span className="drop-shadow-sm">{iconeCuisine(restaurant.cuisine)}</span>
    </div>
  );
}
