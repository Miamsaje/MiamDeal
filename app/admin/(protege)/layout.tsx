import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import { supabaseConfigure } from "@/lib/supabase/config";
import { adminConnecte } from "@/lib/supabase/serveur";
import { seDeconnecter } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!supabaseConfigure) redirect("/admin/connexion");
  const { supabase, user, admin } = await adminConnecte();
  if (!user) redirect("/admin/connexion");

  const { count } = admin
    ? await supabase
        .from("signalements")
        .select("id", { count: "exact", head: true })
        .eq("traite", false)
    : { count: 0 };

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2">
        <Link href="/admin" className="titre text-xl">
          🛠️ Admin
        </Link>
        <div className="flex gap-2">
          <Link href="/" className="bouton-discret">
            Voir le site
          </Link>
          <form action={seDeconnecter}>
            <button className="bouton-discret">Déconnexion</button>
          </form>
        </div>
      </div>
      {admin ? (
        <>
          <NavAdmin signalements={count ?? 0} />
          {children}
        </>
      ) : (
        <p role="alert" className="rounded-xl bg-red-100 p-4 font-semibold text-red-800">
          Le compte {user.email} n&apos;a pas les droits d&apos;équipe. Lance le script{" "}
          <code>supabase/admin.sql</code> avec cet e-mail (voir le README).
        </p>
      )}
    </>
  );
}
