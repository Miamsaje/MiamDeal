export default function Chargement() {
  return (
    <div role="status" aria-label="Chargement" className="flex flex-col items-center gap-3 py-16">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icon-192.png" alt="" className="anim-croque h-20 w-20 rounded-3xl" />
      <p className="text-sm font-semibold text-doux">Le dragon cherche les bons plans…</p>
    </div>
  );
}
