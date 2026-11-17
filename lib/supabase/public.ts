import { createClient } from "@supabase/supabase-js";
import { SUPABASE_CLE, SUPABASE_URL } from "./config";

/** Client anonyme pour les pages publiques : ne voit que ce que la RLS autorise. */
export function clientPublic() {
  return createClient(SUPABASE_URL, SUPABASE_CLE, {
    auth: { persistSession: false },
  });
}
