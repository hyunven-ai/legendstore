import Link  from "next/link";
import Image from "next/image";
import type { Game } from "@/lib/games";

interface Props {
  games: Game[];
}


export default function GamesGrid({ games }: Props) {
  if (games.length === 0) {
    return (
      <div className="col-span-full text-center py-16" style={{ color: "var(--text-muted)" }}>
        <span className="text-4xl block mb-3">🎮</span>
        <p>Belum ada game tersedia</p>
      </div>
    );
  }

  return (
    <>
      {games.map((game) => (
        <Link
          key={game.slug}
          href={`/games/${game.slug}`}
          id={`game-card-${game.slug}`}
          className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[#c8961a] hover:shadow-[0_0_30px_rgba(200,150,26,0.3)]"
          style={{
            background: "linear-gradient(145deg, rgba(25,25,35,0.6) 0%, rgba(10,10,20,0.95) 100%)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(200,150,26,0.15)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
            willChange: "transform, box-shadow, border-color",
            contain: "layout",
            transform: "translateZ(0)",
          }}
        >
          {/* Cover image — aspect-square */}
          <div className="relative w-full overflow-hidden" style={{ paddingBottom: "100%" }}>
            <Image
              src={game.cover}
              alt={game.name}
              fill
              unoptimized
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              priority={false}
            />
            {/* Dark gradient overlay for text legibility */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(10,10,20,0.95) 0%, rgba(10,10,20,0.1) 60%, transparent 100%)" }}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {game.isHot && (
                <span
                  className="text-[11px] font-extrabold px-3 py-1 rounded-full shadow-lg tracking-wider"
                  style={{ background: "linear-gradient(135deg, #ef4444, #991b1b)", color: "#fff", border: "1px solid rgba(239, 68, 68, 0.4)" }}
                >
                  🔥 HOT
                </span>
              )}
              {game.isNew && (
                <span
                  className="text-[11px] font-extrabold px-3 py-1 rounded-full shadow-lg tracking-wider"
                  style={{ background: "linear-gradient(135deg, #10b981, #047857)", color: "#fff", border: "1px solid rgba(16, 185, 129, 0.4)" }}
                >
                  ✨ NEW
                </span>
              )}
            </div>

            {/* Currency badge */}
            <div className="absolute bottom-3 right-3 z-10">
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md shadow-lg transition-colors group-hover:border-[rgba(200,150,26,0.6)]"
                style={{
                  background: "rgba(10, 10, 20, 0.8)",
                  border: `1px solid ${game.color}40`,
                  color: game.color,
                }}
              >
                {game.currencyIcon} {game.currency}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 relative z-10" style={{ background: "transparent" }}>
            <div
              className="font-black text-[15px] leading-snug truncate transition-colors duration-300 group-hover:text-[#f5c842]"
              style={{ color: "#ffffff", fontFamily: "var(--font-outfit)" }}
            >
              {game.name}
            </div>
            <div className="text-xs mt-1 truncate font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
              {game.publisher}
            </div>

            {/* CTA button */}
            <div
              className="mt-4 text-[13px] font-bold text-center py-2.5 rounded-xl transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(200,150,26,0.4)] group-hover:bg-[rgba(200,150,26,0.15)]"
              style={{
                background: "rgba(200,150,26,0.05)",
                color: "#f5c842",
                border: "1px solid rgba(200,150,26,0.25)",
              }}
            >
              Top Up Sekarang
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
