import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export const revalidate = 0;

function getPeriodRange(period: string): { from: string; to: string } {
  const now = new Date();
  const wibOffset = 7 * 60 * 60 * 1000;
  const wibNow = new Date(now.getTime() + wibOffset);

  let from: Date;
  const to: Date = new Date(wibNow.getTime() - wibOffset);

  if (period === "daily") {
    from = new Date(Date.UTC(wibNow.getUTCFullYear(), wibNow.getUTCMonth(), wibNow.getUTCDate()) - wibOffset);
  } else if (period === "weekly") {
    const wibStart = new Date(wibNow);
    wibStart.setUTCDate(wibNow.getUTCDate() - 6);
    from = new Date(Date.UTC(wibStart.getUTCFullYear(), wibStart.getUTCMonth(), wibStart.getUTCDate()) - wibOffset);
  } else {
    const wibStart = new Date(wibNow);
    wibStart.setUTCDate(wibNow.getUTCDate() - 29);
    from = new Date(Date.UTC(wibStart.getUTCFullYear(), wibStart.getUTCMonth(), wibStart.getUTCDate()) - wibOffset);
  }

  return { from: from.toISOString(), to: to.toISOString() };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") ?? "daily";

    const { from, to } = getPeriodRange(period);
    const db = createServerSupabase();

    // Ambil transaksi sukses — ambil whatsapp, game_name, product_price, notes
    const { data: transactions, error } = await db
      .from("transactions")
      .select("whatsapp, game_name, product_price, notes, created_at")
      .eq("status", "selesai")
      .gte("created_at", from)
      .lte("created_at", to)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const parseNotes = (raw?: string): string => {
      if (!raw) return "";
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "object" && parsed !== null) {
          return parsed.username ?? "";
        }
      } catch { /* not JSON */ }
      if (raw.startsWith("Nama Pengguna: ")) {
        return raw.replace("Nama Pengguna: ", "").split(" | ")[0].trim();
      }
      return "";
    };

    // Agregasi per kontak (whatsapp)
    const map: Record<string, {
      whatsapp: string;
      username: string;
      total: number;
      count: number;
      games: Set<string>;
    }> = {};

    for (const tx of transactions ?? []) {
      const wa = tx.whatsapp?.trim() || "Unknown";
      if (!map[wa]) {
        map[wa] = { whatsapp: wa, username: "", total: 0, count: 0, games: new Set() };
      }
      map[wa].total += Number(tx.product_price ?? 0);
      map[wa].count += 1;
      
      if (!map[wa].username) {
        const extractedUser = parseNotes(tx.notes);
        if (extractedUser) {
          map[wa].username = extractedUser;
        }
      }

      if (tx.game_name) {
        map[wa].games.add(tx.game_name.trim());
      }
    }

    // Urutkan & ambil top 10
    const leaderboard = Object.values(map)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
      .map((entry, i) => {
        let displayName = entry.username;
        if (!displayName) {
          // Fallback: Sensor nomor WhatsApp (081234567890 -> 0812****7890)
          displayName = entry.whatsapp;
          if (displayName !== "Unknown" && displayName.length > 7) {
            const first4 = displayName.substring(0, 4);
            const last4 = displayName.substring(displayName.length - 4);
            displayName = `${first4}****${last4}`;
          }
        } else {
          // Sensor Username/Nickname Game
          // Contoh: "Budi Santoso" -> "Bud********oso"
          // Jika terlalu pendek (misal "Ali"), tampilkan "A**"
          if (displayName.length > 5) {
            const first = displayName.substring(0, 3);
            const last = displayName.substring(displayName.length - 2);
            displayName = `${first}***${last}`;
          } else if (displayName.length > 2) {
            const first = displayName.substring(0, 1);
            displayName = `${first}***`;
          } else {
            displayName = `${displayName}***`;
          }
        }

        return {
          rank: i + 1,
          display_name: displayName,
          total_purchase: entry.total,
          transaction_count: entry.count,
          games: Array.from(entry.games),
        };
      });

    return NextResponse.json({
      period,
      from,
      to,
      updated_at: new Date().toISOString(),
      leaderboard,
    });
  } catch (err) {
    console.error("Leaderboard error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
