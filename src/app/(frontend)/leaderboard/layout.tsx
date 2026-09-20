import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard Top 10 Pembelian | Legend Store",
  description: "Lihat 10 pembeli terbanyak di Legend Store. Leaderboard diperbarui otomatis setiap 10 menit.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
