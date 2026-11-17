import type { Restaurant } from "@/lib/types";

/** Photo du resto, ou une vignette jaune avec son initiale s'il n'y en a pas. */
export default function PhotoResto({
  restaurant,
  className = "",
}: {
  restaurant: Pick<Restaurant, "nom" | "photo_url">;
  className?: string;
}) {
  if (restaurant.photo_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={restaurant.photo_url}
        alt={`Photo de ${restaurant.nom}`}
        loading="lazy"
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center bg-miam-clair font-titre text-4xl font-extrabold text-miam-fonce ${className}`}
    >
      {restaurant.nom.charAt(0).toUpperCase()}
    </div>
  );
}
