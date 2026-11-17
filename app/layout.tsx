import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { URL_SITE } from "@/lib/site";
import { supabaseConfigure } from "@/lib/supabase/config";
import "./globals.css";

const titre = Baloo_2({ variable: "--font-titre", subsets: ["latin"] });
const corps = Nunito({ variable: "--font-corps", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITE),
  applicationName: "MiamDeal",
  openGraph: { siteName: "MiamDeal", locale: "fr_FR", type: "website" },
  title: { default: "MiamDeal — Les bons plans restos à Paris", template: "%s — MiamDeal" },
  description:
    "Menus midi, formules étudiantes, happy hours et offres du moment : les meilleurs bons plans restaurants à Paris, vérifiés par l'équipe MiamDeal.",
};

export const viewport: Viewport = { themeColor: "#ffc800" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${titre.variable} ${corps.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <header className="sticky top-0 z-10 bg-miam shadow-sm">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-2.5">
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="" width={40} height={40} className="h-10 w-10" />
              <span className="font-titre text-2xl font-extrabold leading-none">MiamDeal</span>
            </Link>
            <span className="ml-auto text-right text-xs font-semibold leading-tight sm:hidden">
              Les bons plans restos
              <br /> à Paris
            </span>
            <Navigation />
          </div>
        </header>

        {!supabaseConfigure && (
          <p className="bg-encre px-4 py-2 text-center text-xs text-white">
            Mode démo : offres fictives. Configure Supabase (voir README) pour afficher les vraies.
          </p>
        )}

        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-5">{children}</main>

        <footer className="border-t border-black/10 bg-white pb-16 sm:pb-0">
          <div className="mx-auto flex max-w-2xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-4 text-sm">
            <span className="font-semibold">© {new Date().getFullYear()} MiamDeal</span>
            <Link href="/mentions-legales" className="underline">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="underline">
              Confidentialité
            </Link>
            <Link href="/admin" className="ml-auto text-black/40">
              Équipe
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
