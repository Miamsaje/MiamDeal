import { ImageResponse } from "next/og";
import { offreParId } from "@/lib/donnees";

// Image d'aperçu affichée quand on partage une offre (WhatsApp, Instagram, X…).
export const alt = "Bon plan MiamDeal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const offre = await offreParId((await params).id);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffc800",
          color: "#1f1a0e",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", fontSize: 44, fontWeight: 700 }}>MiamDeal</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>
            {offre?.titre ?? "Les bons plans restos à Paris"}
          </div>
          {offre && (
            <div style={{ display: "flex", fontSize: 40, marginTop: 20 }}>
              {offre.restaurant.nom} · {offre.restaurant.quartier}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {offre?.prix ? (
            <div
              style={{
                display: "flex",
                background: "#1f1a0e",
                color: "#ffc800",
                fontSize: 64,
                fontWeight: 700,
                padding: "12px 36px",
                borderRadius: 28,
              }}
            >
              {offre.prix}
            </div>
          ) : (
            <div />
          )}
          <div style={{ display: "flex", fontSize: 32 }}>Manger bien, payer moins.</div>
        </div>
      </div>
    ),
    size,
  );
}
