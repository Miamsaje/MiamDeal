import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { offreParId } from "@/lib/donnees";

// Image d'aperçu affichée quand on partage une offre (WhatsApp, Instagram, X…).
export const alt = "Bon plan MiamDeal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logo = `data:image/png;base64,${await readFile(join(process.cwd(), "assets/logo-og.png"), "base64")}`;

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const offre = await offreParId((await params).id);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#ffffff",
          color: "#2b1a10",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, flex: 1 }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#7a6a5d" }}>
            {offre ? `${offre.restaurant.nom} · ${offre.restaurant.quartier}` : "Paris"}
          </div>
          <div style={{ display: "flex", fontSize: 74, fontWeight: 800, lineHeight: 1.08 }}>
            {offre?.titre ?? "Les bons plans restos à Paris"}
          </div>
          {offre?.prix ? (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                background: "#ffc800",
                fontSize: 64,
                fontWeight: 800,
                padding: "10px 34px",
                borderRadius: 28,
              }}
            >
              {offre.prix}
            </div>
          ) : (
            <div style={{ display: "flex", fontSize: 34 }}>Manger bien, payer moins.</div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 420, background: "#fff4c7" }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img src={logo} width={340} height={243} />
        </div>
      </div>
    ),
    size,
  );
}
