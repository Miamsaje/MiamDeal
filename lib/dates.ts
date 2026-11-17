// Toutes les dates sont affichées et saisies à l'heure de Paris.
const TZ = "Europe/Paris";

export function formaterDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TZ,
  }).format(new Date(iso));
}

export function formaterDateHeure(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  }).format(new Date(iso));
}

function decalageParis(date: Date) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    })
      .formatToParts(date)
      .map((x) => [x.type, Number(x.value)]),
  );
  const commeUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return commeUTC - Math.floor(date.getTime() / 1000) * 1000;
}

/** "2026-11-16T12:30" (heure de Paris, champ datetime-local) -> ISO UTC */
export function parisVersISO(local: string): string | null {
  if (!local) return null;
  const naif = new Date(local + (local.length === 16 ? ":00" : "") + "Z");
  if (isNaN(naif.getTime())) return null;
  const utc = new Date(naif.getTime() - decalageParis(naif));
  // 2e passe pour les changements d'heure
  return new Date(naif.getTime() - decalageParis(utc)).toISOString();
}

/** ISO UTC -> valeur d'un champ datetime-local à l'heure de Paris */
export function isoVersParis(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() + decalageParis(d)).toISOString().slice(0, 16);
}

export function aujourdhuiParis() {
  return isoVersParis(new Date().toISOString()).slice(0, 10);
}

/** La date est-elle dans le futur ? */
export const estFuture = (iso: string) => new Date(iso).getTime() > Date.now();

/** La date remonte-t-elle à moins de `jours` jours ? */
export const estRecente = (iso: string, jours: number) =>
  Date.now() - new Date(iso).getTime() < jours * 86400_000;

/** Jour (AAAA-MM-JJ) d'il y a `jours` jours. */
export const jourIlYA = (jours: number) =>
  new Date(Date.now() - jours * 86400_000).toISOString().slice(0, 10);
