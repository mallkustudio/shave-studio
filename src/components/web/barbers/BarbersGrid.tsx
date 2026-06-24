export function BarbersGrid() {
  const placeholders = Array.from({ length: 6 });

  return (
    <section className="bg-zinc-950 text-white py-24 px-[10%]">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">

        <div className="w-10 h-0.5 bg-[var(--color-accent)]" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {placeholders.map((_, i) => (
            <div
              key={i}
              className="bg-zinc-800 aspect-square w-full"
            />
          ))}
        </div>

      </div>
    </section>
  );
}
