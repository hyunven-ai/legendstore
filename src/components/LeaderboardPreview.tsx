"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, ChevronRight, Crown, Medal, ArrowUpRight } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  display_name: string;
  total_purchase: number;
  games: string[];
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

function Avatar({ name, rank }: { name: string, rank: number }) {
  const char = name?.charAt(0)?.toUpperCase() ?? "?";
  
  // Custom glowing rings based on rank
  const ringStyle = rank === 1 
    ? "conic-gradient(from 0deg, #FFD700, #FDB931, #FFD700)" 
    : rank === 2 
    ? "conic-gradient(from 0deg, #E0E0E0, #9E9E9E, #E0E0E0)"
    : "conic-gradient(from 0deg, #CD7F32, #A0522D, #CD7F32)";
    
  return (
    <div className="relative flex items-center justify-center" style={{ width: 64, height: 64 }}>
      {/* Spinning glow ring */}
      <div 
        className="absolute inset-0 rounded-full animate-spin-slow opacity-80" 
        style={{ background: ringStyle, animationDuration: '4s' }} 
      />
      {/* Inner background */}
      <div className="absolute inset-[3px] rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
        <span className="relative text-2xl font-black text-white drop-shadow-md z-10">{char}</span>
      </div>
    </div>
  );
}

export default function LeaderboardPreview() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard?period=daily")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const top3 = data?.leaderboard.slice(0, 3) ?? [];

  return (
    <section className="max-w-6xl mx-auto px-4 relative mt-12 mb-24" style={{ contain: "layout" }}>
      <div className="flex flex-col items-center justify-center text-center mb-14 relative z-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5 border border-[rgba(251,191,36,0.3)] bg-gradient-to-r from-[rgba(251,191,36,0.1)] to-[rgba(251,191,36,0.02)] backdrop-blur-md shadow-[0_0_20px_rgba(251,191,36,0.15)]">
          <Trophy size={16} className="text-[#fbbf24] animate-pulse" />
          <span className="text-[13px] font-extrabold text-[#fbbf24] uppercase tracking-[0.2em]">
            Top Spender Hari Ini
          </span>
        </div>
        <h2
          className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
          style={{ fontFamily: "var(--font-outfit)", color: "#ffffff" }}
        >
          Leaderboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] drop-shadow-[0_0_25px_rgba(251,191,36,0.4)]">Harian</span>
        </h2>
        <p className="text-[16px] max-w-lg mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
          Para Sultan yang telah mendominasi transaksi hari ini. Tingkatkan transaksi Anda dan jadilah yang terbaik!
        </p>
      </div>

      <div className="relative">
        {/* Deep ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(251,191,36,0.06) 0%, rgba(251,191,36,0.01) 40%, transparent 70%)",
            filter: "blur(40px)",
            zIndex: -1,
          }}
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto items-end h-[320px]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-[32px] bg-white/[0.02] border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : top3.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto items-end">
            {/* Reorder to show 2nd, 1st, 3rd visually on desktop */}
            {[top3[1], top3[0], top3[2]].filter(Boolean).map((entry, visualIdx) => {
              const isFirst = entry.rank === 1;
              const medal = entry.rank === 1
                ? { bg: "linear-gradient(135deg, #FFD700, #F89C0E)", glow: "rgba(255, 215, 0, 0.5)", label: "Juara 1", icon: <Crown className="w-4 h-4 sm:w-5 sm:h-5" color="#4A2500" strokeWidth={2.5} />, textGlow: "#FFD700" }
                : entry.rank === 2
                ? { bg: "linear-gradient(135deg, #E0E0E0, #808080)", glow: "rgba(224, 224, 224, 0.2)", label: "Juara 2", icon: <Medal className="w-4 h-4 sm:w-5 sm:h-5" color="#1C1C1C" strokeWidth={2.5} />, textGlow: "#E0E0E0" }
                : { bg: "linear-gradient(135deg, #CD7F32, #8B4513)", glow: "rgba(205, 127, 50, 0.2)", label: "Juara 3", icon: <Medal className="w-4 h-4 sm:w-5 sm:h-5" color="#FFF" strokeWidth={2.5} />, textGlow: "#CD7F32" };

              return (
                <div 
                  key={entry.rank} 
                  className={`group relative rounded-[24px] sm:rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-3 ${isFirst ? 'col-span-2 sm:col-span-1' : 'col-span-1'}`}
                  style={{
                    background: "linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: isFirst ? "1px solid rgba(255, 215, 0, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: isFirst 
                      ? `0 20px 40px -10px rgba(0,0,0,0.5), 0 0 30px ${medal.glow}, inset 0 1px 0 rgba(255,255,255,0.2)` 
                      : "0 20px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                    textAlign: "center",
                    order: visualIdx === 0 ? 0 : visualIdx === 1 ? -1 : 1,
                    zIndex: isFirst ? 10 : 1,
                  }}
                >
                  {/* Padding wrapper to handle responsive padding nicely */}
                  <div className={`w-full h-full ${isFirst ? 'px-4 py-8 sm:px-6 sm:py-10' : 'px-3 py-6 sm:px-6 sm:py-8'}`}>
                    {/* Subtle inner top highlight */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    
                    {isFirst && (
                      <div 
                        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" 
                        style={{ background: "radial-gradient(circle at top, rgba(255, 215, 0, 0.15) 0%, transparent 60%)" }}
                      />
                    )}

                    <div className="relative flex justify-center mb-4 sm:mb-6">
                      <div className={isFirst ? "scale-100 sm:scale-110" : "scale-90 sm:scale-100"}>
                        <Avatar name={entry.display_name} rank={entry.rank} />
                      </div>
                      {/* Floating Medal */}
                      <div 
                        className="absolute -bottom-2 -right-1 sm:-bottom-3 sm:-right-2 flex items-center justify-center rounded-full shadow-lg"
                        style={{
                          width: isFirst ? 32 : 28, height: isFirst ? 32 : 28,
                          background: medal.bg,
                          boxShadow: `0 4px 15px ${medal.glow}, inset 0 2px 4px rgba(255,255,255,0.4)`,
                          border: "2px solid #0f172a"
                        }}
                      >
                        {medal.icon}
                      </div>
                    </div>
                    
                    <div className="text-[9px] sm:text-[11px] font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-1.5 sm:mb-2" style={{ color: medal.textGlow }}>
                      {medal.label}
                    </div>
                    
                    <div className="text-base sm:text-xl font-black text-white mb-4 sm:mb-6 truncate px-1 sm:px-2 drop-shadow-sm">
                      {entry.display_name}
                    </div>
                    
                    <div className="pt-4 sm:pt-5 mt-auto relative">
                      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      <div className="text-[8px] sm:text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1 sm:mb-1.5">
                        Total Transaksi
                      </div>
                      <div 
                        className="text-lg sm:text-2xl font-black drop-shadow-md"
                        style={{ 
                          color: medal.textGlow,
                          fontFamily: "var(--font-outfit)" 
                        }}
                      >
                        {formatRupiah(entry.total_purchase)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-white/40 py-16 bg-white/[0.02] backdrop-blur-md rounded-[32px] border border-white/5 max-w-4xl mx-auto shadow-2xl">
            <Trophy size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">Belum ada sultan yang mendominasi hari ini.</p>
          </div>
        )}

        <div className="flex justify-center mt-14 relative z-10">
          <Link
            href="/leaderboard"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm transition-all overflow-hidden"
          >
            {/* Button Glass Background */}
            <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl transition-all group-hover:bg-white/[0.08] group-hover:border-white/20" />
            
            {/* Animated Hover Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-[rgba(251,191,36,0.15)] to-transparent -translate-x-full group-hover:animate-shimmer" />

            <span className="relative z-10 text-white tracking-wide">Lihat Klasemen Lengkap</span>
            <div className="relative z-10 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
              <ArrowUpRight size={16} className="text-white group-hover:rotate-12 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
