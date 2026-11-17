import { formaterDate } from "@/lib/dates";

export function BadgeVerifie({ date }: { date: string | null }) {
  if (!date) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800">
      ✓ Vérifié le {formaterDate(date)}
    </span>
  );
}

export function BadgePrix({ prix, grand = false }: { prix: string | null; grand?: boolean }) {
  if (!prix) return null;
  return (
    <span
      className={`inline-block shrink-0 rounded-xl bg-miam font-titre font-extrabold leading-none ${
        grand ? "px-4 py-2 text-3xl" : "px-2.5 py-1.5 text-lg"
      }`}
    >
      {prix}
    </span>
  );
}
