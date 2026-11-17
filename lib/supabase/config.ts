export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_CLE = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Faux tant que .env.local n'est pas rempli : le site tourne alors en mode démo. */
export const supabaseConfigure = Boolean(SUPABASE_URL && SUPABASE_CLE);
