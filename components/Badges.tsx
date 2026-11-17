import { formaterDate } from "@/lib/dates";

export function BadgeVerifie({ date }: { date: string | null }) {
  if (!date) return null;
  return (
    <span className="badge bg-emerald-50 text-emerald-700">
      <svg aria-hidden viewBox="0 0 16 16" className="h-3 w-3 fill-current">
        <path d="M6.4 11.2 3.2 8l1.1-1.1 2.1 2.1 5.3-5.3L12.8 4.8z" />
      </svg>
      Vérifié le {formaterDate(date)}
    </span>
  );
}

export function BadgePrix({ prix, grand = false }: { prix: string | null; grand?: boolean }) {
  if (!prix) return null;
  return (
    <span
      className={`titre inline-block shrink-0 rounded-2xl bg-miam text-encre ${
        grand ? "px-4 py-2 text-3xl" : "px-3 py-1.5 text-2xl"
      }`}
    >
      {prix}
    </span>
  );
}
