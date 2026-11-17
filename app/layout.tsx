import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { URL_SITE } from "@/lib/site";
import { supabaseConfigure } from "@/lib/supabase/config";
import "./globals.css";

// Titres : Archivo extra-gras italique, proche de la typo fournie.
// Pour utiliser la vraie typo (si tu as la licence), voir le README.
const titre = Archivo({
  variable: "--font-titre",
  subsets: ["latin"],
  style: ["italic", "normal"],
  axes: ["wdth"],
});
const corps = Inter({ variable: "--font-corps", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITE),
  applicationName: "MiamDeal",
  openGraph: { siteName: "MiamDeal", locale: "fr_FR", type: "website" },
  title: { default: "MiamDeal — Les bons plans restos à Paris", template: "%s — MiamDeal" },
  description:
    "Menus midi, formules étudiantes, happy hours et offres du moment : les meilleurs bons plans restaurants à Paris, vérifiés par l'équipe MiamDeal.",
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${titre.variable} ${corps.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <header className="sticky top-0 z-20 border-b border-trait bg-white">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-2">
            <Link href="/" aria-label="MiamDeal, accueil" className="transition hover:scale-[1.03]">
              <Image
                src="/logo.png"
                alt="MiamDeal"
                width={640}
                height={457}
                priority
                className="h-14 w-auto"
              />
            </Link>
            <p className="ml-auto text-right text-xs font-semibold leading-tight text-doux sm:hidden">
              Les bons plans restos
              <br /> à Paris 🔥
            </p>
            <Navigation />
          </div>
        </header>

        {!supabaseConfigure && (
          <p className="bg-miam-clair px-4 py-1.5 text-center text-xs font-medium">
            Mode démo : offres fictives pour découvrir le site.
          </p>
        )}

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-5">{children}</main>

        <footer className="border-t border-trait bg-miam-pale pb-20 sm:pb-0">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-5 text-sm">
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Image src="/icon-192.png" alt="" width={36} height={36} className="rounded-xl" />
              <span className="font-semibold">© {new Date().getFullYear()} MiamDeal</span>
            </div>
            <Link href="/mentions-legales" className="text-doux hover:text-encre hover:underline">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="text-doux hover:text-encre hover:underline">
              Confidentialité
            </Link>
            <Link href="/admin" className="ml-auto text-doux/60 hover:text-encre">
              Équipe
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
