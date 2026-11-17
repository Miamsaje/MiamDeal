import { notFound } from "next/navigation";
import FormulaireRestaurant from "@/components/FormulaireRestaurant";
import { clientServeur } from "@/lib/supabase/serveur";
import type { Restaurant } from "@/lib/types";

// /admin/restaurants/nouveau -> création ; /admin/restaurants/<id> -> modification
export default async function EditionRestaurant({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { id } = await params;
  const { erreur } = await searchParams;
  if (id === "nouveau") return <FormulaireRestaurant erreur={erreur} />;

  const supabase = await clientServeur();
  const { data } = await supabase.from("restaurants").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <FormulaireRestaurant restaurant={data as Restaurant} erreur={erreur} />;
}
