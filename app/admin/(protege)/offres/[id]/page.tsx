import { notFound } from "next/navigation";
import FormulaireOffre from "@/components/FormulaireOffre";
import { clientServeur } from "@/lib/supabase/serveur";
import type { Offre } from "@/lib/types";

// /admin/offres/nouvelle -> création ; /admin/offres/<id> -> modification
export default async function EditionOffre({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { id } = await params;
  const { erreur } = await searchParams;
  const supabase = await clientServeur();
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("id, nom, quartier")
    .eq("archive", false)
    .order("nom");

  if (id === "nouvelle")
    return <FormulaireOffre restaurants={restaurants ?? []} erreur={erreur} />;

  const { data } = await supabase.from("offres").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <FormulaireOffre offre={data as Offre} restaurants={restaurants ?? []} erreur={erreur} />;
}
