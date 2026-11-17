"use client";

// Favoris enregistrés dans le navigateur du visiteur (pas de compte nécessaire).
import { useSyncExternalStore } from "react";

const CLE = "miamdeal-favoris";
const EVENEMENT = "miamdeal-favoris-change";
const VIDE: string[] = [];
let memo: { brut: string | null; liste: string[] } = { brut: null, liste: VIDE };

function lire(): string[] {
  let brut: string | null = null;
  try {
    brut = localStorage.getItem(CLE);
  } catch {
    return VIDE; // navigation privée, stockage bloqué…
  }
  if (brut === memo.brut) return memo.liste;
  let liste = VIDE;
  try {
    const valeur = JSON.parse(brut ?? "[]");
    if (Array.isArray(valeur)) liste = valeur.filter((x) => typeof x === "string");
  } catch {}
  memo = { brut, liste };
  return liste;
}

function abonner(rappel: () => void) {
  window.addEventListener(EVENEMENT, rappel);
  window.addEventListener("storage", rappel);
  return () => {
    window.removeEventListener(EVENEMENT, rappel);
    window.removeEventListener("storage", rappel);
  };
}

export function useFavoris() {
  const favoris = useSyncExternalStore(abonner, lire, () => VIDE);
  const basculer = (id: string) => {
    const suivants = favoris.includes(id) ? favoris.filter((f) => f !== id) : [...favoris, id];
    try {
      localStorage.setItem(CLE, JSON.stringify(suivants));
    } catch {}
    window.dispatchEvent(new Event(EVENEMENT));
  };
  return { favoris, basculer };
}
