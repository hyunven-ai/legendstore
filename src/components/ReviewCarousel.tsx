"use client";

import { Star, ShieldCheck, CheckCircle2, MessageSquareQuote, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Review {
  id: number;
  name: string;
  phone: string;
  rating: number;
  comment: string;
  game: string;
  timeAgo: string;
  verified: boolean;
}

/* ── Baris 1 (kiri) — Testimoni Autentik & Profesional ── */
const REVIEWS_A: Review[] = [
  {
    id: 1,
    name: "Rian S.",
    phone: "0812****910",
    rating: 5,
    comment: "Proses cepat hitungan detik, diamond langsung masuk ke akun tanpa kendala sama sekali.",
    game: "Royal Dream",
    timeAgo: "5 mnt lalu",
    verified: true,
  },
  {
    id: 2,
    name: "Dimas K.",
    phone: "0813****414",
    rating: 5,
    comment: "Harga paling terjangkau dibanding toko lain, admin sangat responsif dan ramah.",
    game: "Higgs Domino",
    timeAgo: "12 mnt lalu",
    verified: true,
  },
  {
    id: 3,
    name: "Bayu Pratama",
    phone: "0821****772",
    rating: 5,
    comment: "Mantap transaksi jam 2 pagi tetap diproses otomatis. Recommended seller!",
    game: "Mobile Legends",
    timeAgo: "18 mnt lalu",
    verified: true,
  },
  {
    id: 4,
    name: "Alif H.",
    phone: "0838****321",
    rating: 5,
    comment: "Amanah 100%, sistem invoice QRIS nya rapi dan langsung verified otomatis.",
    game: "Free Fire",
    timeAgo: "25 mnt lalu",
    verified: true,
  },
  {
    id: 5,
    name: "Fajar N.",
    phone: "0819****889",
    rating: 5,
    comment: "Bongkar chip cair super cepat ke rekening BCA. Senang langganan di Legend Store.",
    game: "Royal Dream",
    timeAgo: "34 mnt lalu",
    verified: true,
  },
  {
    id: 6,
    name: "Wahyu E.",
    phone: "0877****055",
    rating: 5,
    comment: "Pelayanan sangat profesional, tidak pernah mengecewakan sejak pertama kali order.",
    game: "PUBG Mobile",
    timeAgo: "42 mnt lalu",
    verified: true,
  },
];

/* ── Baris 2 (kanan) — Testimoni Autentik & Profesional ── */
const REVIEWS_B: Review[] = [
  {
    id: 7,
    name: "Yoga Saputra",
    phone: "0852****217",
    rating: 5,
    comment: "Top up instan aman terpercaya. Cek transaksi di web juga sangat transparan dan akurat.",
    game: "Honor of Kings",
    timeAgo: "1 jam lalu",
    verified: true,
  },
  {
    id: 8,
    name: "Hendrik T.",
    phone: "0896****334",
    rating: 5,
    comment: "Bagus banget layanannya, harga hemat dan legal resmi 100%. Teruskan kualitasnya!",
    game: "Royal Dream",
    timeAgo: "1 jam lalu",
    verified: true,
  },
  {
    id: 9,
    name: "Satria M.",
    phone: "0823****601",
    rating: 5,
    comment: "Proses kilat, tidak ribet sama sekali. Langsung masuk notif di game tanpa nunggu lama.",
    game: "Higgs Games Island",
    timeAgo: "2 jam lalu",
    verified: true,
  },
  {
    id: 10,
    name: "Ilham F.",
    phone: "0831****778",
    rating: 5,
    comment: "Sudah order lebih dari 10 kali di sini, selalu lancar dan terpercaya tanpa kendala.",
    game: "Mobile Legends",
    timeAgo: "2 jam lalu",
    verified: true,
  },
  {
    id: 11,
    name: "Reza Aditya",
    phone: "0878****092",
    rating: 5,
    comment: "Metode bayar QRIS praktis banget, pembayaran langsung terkonfirmasi seketika.",
    game: "Royal Dream",
    timeAgo: "3 jam lalu",
    verified: true,
  },
  {
    id: 12,
    name: "Agus Santoso",
    phone: "0815****556",
    rating: 5,
    comment: "Seller terpercaya, transaksi aman dan privasi akun benar-benar terlindungi.",
    game: "Genshin Impact",
    timeAgo: "3 jam lalu",
    verified: true,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          fill={i < count ? "var(--gold-light)" : "transparent"}
          style={{ color: i < count ? "var(--gold-light)" : "rgba(255,255,255,0.15)" }}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div
      className="review-premium-card inline-flex flex-col justify-between flex-shrink-0 transition-all duration-300"
      style={{
        width: "320px",
        background: "linear-gradient(145deg, rgba(21, 20, 34, 0.85) 0%, rgba(13, 12, 22, 0.95) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "18px",
        padding: "18px 20px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        willChange: "transform",
      }}
    >
      <div>
        {/* Card Header: User avatar + info + rating */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar initial badge */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(245, 200, 66, 0.2), rgba(99, 102, 241, 0.2))",
                border: "1px solid rgba(245, 200, 66, 0.3)",
                color: "#ffffff",
              }}
            >
              {review.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold truncate text-white">
                  {review.name}
                </span>
                {review.verified && (
                  <span title="Pembeli Terverifikasi" className="flex items-center">
                    <CheckCircle2
                      size={12}
                      className="text-emerald-400 flex-shrink-0"
                    />
                  </span>
                )}
              </div>
              <span className="text-[11px] block text-slate-400 font-mono truncate">
                {review.phone}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end flex-shrink-0">
            <Stars count={review.rating} />
            <span className="text-[10px] text-slate-400 mt-1 font-medium">{review.timeAgo}</span>
          </div>
        </div>

        {/* Comment quote */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-3 font-normal">
          &ldquo;{review.comment}&rdquo;
        </p>
      </div>

      {/* Card Footer: Game tag + Verified Pill */}
      <div className="pt-2.5 flex items-center justify-between border-t border-white/[0.06] text-[11px]">
        <span
          className="px-2.5 py-0.5 rounded-md font-semibold text-[10.5px]"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            color: "var(--gold-light)",
            border: "1px solid rgba(245, 200, 66, 0.15)",
          }}
        >
          {review.game}
        </span>
        <span className="text-emerald-400 text-[10.5px] font-medium flex items-center gap-1">
          <ShieldCheck size={12} /> Transaksi Sukses
        </span>
      </div>
    </div>
  );
}

function MarqueeRow({
  reviews,
  reverse = false,
  duration = 36,
}: {
  reviews: Review[];
  reverse?: boolean;
  duration?: number;
}) {
  /* 4× clone untuk seamless infinite animation tanpa jeda */
  const quad = [...reviews, ...reviews, ...reviews, ...reviews];
  return (
    <div
      className="overflow-hidden py-1"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <div
        className="flex gap-4 hover:[animation-play-state:paused]"
        style={{
          width: "max-content",
          animation: `${reverse ? "marquee-right" : "marquee-left"} ${duration}s linear infinite`,
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        {quad.map((r, i) => (
          <ReviewCard key={`${r.id}-${i}`} review={r} />
        ))}
      </div>
    </div>
  );
}

export default function ReviewCarousel() {
  return (
    <section
      className="overflow-hidden relative py-16"
      style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(16, 16, 26, 0.6) 50%, transparent 100%)",
      }}
    >
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "650px",
          height: "280px",
          background: "radial-gradient(ellipse, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 relative z-10 mb-10">
        {/* Section Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
              style={{
                background: "rgba(245, 200, 66, 0.08)",
                border: "1px solid rgba(245, 200, 66, 0.25)",
                color: "var(--gold-light)",
              }}
            >
              <MessageSquareQuote size={13} />
              Testimoni Asli
            </div>
            <h2
              className="text-2xl md:text-3xl font-black text-white"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Kepuasan Pelanggan <span className="gradient-text-gold">Prioritas Kami</span>
            </h2>
            <p className="text-sm mt-1.5 text-slate-400 max-w-lg">
              Ulasan nyata dari ribuan gamers yang telah mempercayakan transaksi top-up mereka di Legend Store.
            </p>
          </div>

          {/* Social Proof Metric Badge */}
          <div className="flex items-center gap-5 p-3.5 px-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-outfit)" }}>4.9</span>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">Rating Rata-rata dari 10.000+ Pesanan</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="text-xl font-black text-emerald-400" style={{ fontFamily: "var(--font-outfit)" }}>99.8%</div>
              <span className="text-[11px] text-slate-400 block mt-0.5">Transaksi Berhasil</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Row 1 */}
      <div className="mb-4">
        <MarqueeRow reviews={REVIEWS_A} reverse={false} duration={38} />
      </div>

      {/* Marquee Row 2 */}
      <div>
        <MarqueeRow reviews={REVIEWS_B} reverse={true} duration={42} />
      </div>

      {/* Bottom Action / Trust Prompt */}
      <div className="max-w-6xl mx-auto px-4 mt-10 flex items-center justify-center">
        <Link
          href="/cek-transaksi"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors py-2 px-4 rounded-xl border border-white/[0.08] hover:border-white/20 bg-white/[0.02]"
        >
          Lacak status pesanan kamu di Cek Transaksi <ArrowRight size={13} />
        </Link>
      </div>
    </section>
  );
}
