export default function Chargement() {
  return (
    <div role="status" aria-label="Chargement" className="flex animate-pulse flex-col gap-3">
      <div className="h-9 w-3/4 rounded-xl bg-black/10" />
      <div className="h-11 rounded-full bg-black/10" />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-[122px] rounded-2xl bg-black/10" />
      ))}
    </div>
  );
}
