/**
 * HomePage — Server Component
 *
 * Data game di-fetch langsung ke Supabase saat SSR sehingga HTML yang dikirim
 * ke browser sudah berisi konten final. Tidak ada loading → tidak ada CLS.
 *
 * Komponen yang perlu interaktivitas (carousel, dll.) tetap "use client"
 * halaman menjadi Client Component.
 */
export const dynamic = "force-dynamic";

import Link from "next/link";
import { Zap } from "lucide-react";
import BannerCarousel from "@/components/BannerCarousel";
import ReviewCarousel from "@/components/ReviewCarousel";
import RunningText from "@/components/RunningText";
import GamesGrid from "@/components/GamesGrid";
import LeaderboardPreview from "@/components/LeaderboardPreview";
import { createServerSupabase } from "@/lib/supabase";
import type { Game } from "@/lib/games";

/** Fetch games server-side — no client fetch, no CLS */
async function fetchGames(): Promise<Game[]> {
  try {
    const db = createServerSupabase();
    const { data, error } = await db
      .from("games")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return (data ?? []).map((row) => ({
      id: String(row.id),
      slug: String(row.slug),
      name: String(row.name),
      publisher: String(row.publisher ?? ""),
      description: String(row.description ?? ""),
      cover: String(row.cover ?? ""),
      emoji: String(row.emoji ?? "🎮"),
      currency: String(row.currency),
      currencyIcon: String(row.currency_icon ?? "💎"),
      extraCurrencies: (row.extra_currencies ?? []) as Game["extraCurrencies"],
      color: String(row.color ?? "#fbbf24"),
      gradient: String(row.gradient ?? "linear-gradient(135deg,#7c3aed,#4c1d95)"),
      isActive: Boolean(row.is_active ?? true),
      isHot: Boolean(row.is_hot ?? false),
      isNew: Boolean(row.is_new ?? false),
      sortOrder: Number(row.sort_order ?? 0),
    }));
  } catch {
    return [];
  }
}

/** Fetch banners server-side — banner tampil langsung tanpa CLS */
async function fetchBanners() {
  try {
    const db = createServerSupabase();
    const { data, error } = await db
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  // Paralel fetch: games + banners sekaligus agar tidak double waterfall
  const [games, banners] = await Promise.all([fetchGames(), fetchBanners()]);

  return (
    <div>
      {/* ── Banner Carousel — SSR data, zero CLS ────────────── */}
      <div className="w-full">
        <BannerCarousel initialBanners={banners} />
      </div>

      {/* ── Running Text Ticker ────────────────────── */}
      <RunningText />

      {/* ── Game Catalog ─────────────────────────────── */}
      <section
        id="games"
        className="max-w-6xl mx-auto px-4 relative"
        style={{ contain: "layout", paddingTop: "40px", paddingBottom: "60px" }}
      >
        {/* Ambient Glow background for the grid */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(200,150,26,0.08) 0%, rgba(0,0,0,0) 60%)",
            zIndex: -1,
          }}
        />

        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 border border-[rgba(200,150,26,0.3)] bg-[rgba(200,150,26,0.05)]">
            <Zap size={14} className="text-[var(--gold-light)]" />
            <span className="text-xs font-bold text-[var(--gold-light)] uppercase tracking-widest">
              Katalog Premium
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-black mb-3"
            style={{ fontFamily: "var(--font-outfit)", color: "#ffffff" }}
          >
            Pilih <span className="gradient-text-gold drop-shadow-[0_0_15px_rgba(200,150,26,0.5)]">Game</span>
          </h2>
          <p className="text-[15px] max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
            {games.length > 0 ? `Temukan dan top up dari ${games.length} game favorit Anda dengan harga terbaik.` : "Memuat daftar game..."}
          </p>
        </div>

        {/*
          Grid dengan min-height stabil = mencegah shift jika data loading edge case.
          Data datang dari SSR, tidak ada loading phase → CLS = 0.
        */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          style={{ minHeight: games.length > 0 ? undefined : "320px" }}
        >
          <GamesGrid games={games} />
        </div>
      </section>

      {/* ── Leaderboard Preview ────────────────────── */}
      <LeaderboardPreview />

      {/* ── Ulasan Pelanggan ───────────────────────── */}
      <ReviewCarousel />

      {/* ── Keunggulan Kami ───────────────────────────────── */}
      <section
        style={{
          paddingTop: "70px",
          paddingBottom: "30px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle Luxury Ambient Glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "350px",
            background: "radial-gradient(ellipse, rgba(200,150,26,0.12) 0%, rgba(99,102,241,0.06) 50%, transparent 75%)",
            pointerEvents: "none",
          }}
        />

        <div className="max-w-6xl mx-auto px-4" style={{ position: "relative", zIndex: 1 }}>

          {/* Badge */}
          <div className="flex justify-center mb-5">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                border: "1px solid rgba(245,200,66,0.3)",
                borderRadius: "999px",
                padding: "6px 18px",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--gold-light)",
                background: "rgba(245,200,66,0.08)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Keunggulan Kami
            </span>
          </div>

          {/* Heading */}
          <h2
            className="text-center font-black tracking-tight"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(2rem, 5vw, 2.75rem)",
              color: "#ffffff",
              lineHeight: 1.2,
              marginBottom: "16px",
            }}
          >
            Kenapa Harus Pilih{" "}
            <span className="gradient-text-gold">Legend Store?</span>
          </h2>

          {/* Subtitle */}
          <p
            className="text-center"
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "15px",
              maxWidth: "520px",
              margin: "0 auto 48px",
              lineHeight: 1.7,
            }}
          >
            Layanan top-up terpercaya dengan sistem otomatis 24 jam nonstop untuk pengalaman transaksi yang aman, instan, dan bergaransi.
          </p>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Card 1 — 100% Aman */}
            <div className="feature-card group cursor-pointer">
              <div
                className="transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-[0_0_20px_rgba(200,150,26,0.4)]"
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, rgba(200,150,26,0.18), rgba(200,150,26,0.05))",
                  border: "1px solid rgba(200,150,26,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 800,
                  fontSize: "18px",
                  color: "#ffffff",
                  marginBottom: "10px",
                }}
              >
                100% Aman &amp; Bergaransi
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13.5px", lineHeight: 1.7 }}>
                Transaksi terjamin legal dan aman tanpa pernah meminta password akun game Anda.
              </p>
            </div>

            {/* Card 2 — Proses Cepat */}
            <div className="feature-card group cursor-pointer">
              <div
                className="transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(16,185,129,0.05))",
                  border: "1px solid rgba(16,185,129,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 800,
                  fontSize: "18px",
                  color: "#ffffff",
                  marginBottom: "10px",
                }}
              >
                Proses Instan Hitungan Detik
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13.5px", lineHeight: 1.7 }}>
                Sistem otomatis memproses pesanan langsung masuk setelah pembayaran berhasil.
              </p>
            </div>

            {/* Card 3 — Harga Terbaik */}
            <div className="feature-card group cursor-pointer">
              <div
                className="transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(99,102,241,0.05))",
                  border: "1px solid rgba(99,102,241,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontWeight: 800,
                  fontSize: "18px",
                  color: "#ffffff",
                  marginBottom: "10px",
                }}
              >
                Harga Murah &amp; Transparan
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13.5px", lineHeight: 1.7 }}>
                Dapatkan penawaran harga terbaik di kelasnya tanpa potongan tersembunyi.
              </p>
            </div>
          </div>

          {/* Trust footer */}
          <div className="flex justify-center pb-8">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "rgba(255,255,255,0.5)",
                fontSize: "13px",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              Dipercaya oleh ribuan pemain di seluruh Indonesia
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
