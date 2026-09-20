import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export interface ColorTheme {
  id: string;
  name: string;
  gold: string;
  goldDark: string;
  goldLight: string;
  purple: string;
  purpleDark: string;
  purpleLight: string;
  amber: string;
  amberLight: string;
  bgPrimaryDark: string;
  bgSecondaryDark: string;
  bgCardDark: string;
}

const DEFAULT_THEME: ColorTheme = {
  id: "royal-gold",
  name: "Royal Gold (Default)",
  gold: "#c8961a",
  goldDark: "#9e720f",
  goldLight: "#f5c842",
  purple: "#6d28d9",
  purpleDark: "#4c1d95",
  purpleLight: "#8b5cf6",
  amber: "#d4780d",
  amberLight: "#ff9f1c",
  bgPrimaryDark: "#0a0a14",
  bgSecondaryDark: "#12111f",
  bgCardDark: "#1a1828",
};

const DATA_FILE = path.join(process.cwd(), ".site-theme.json");
const noStore = { headers: { "Cache-Control": "no-store, max-age=0" } };

function readFile(): ColorTheme {
  try {
    if (!fs.existsSync(DATA_FILE)) return DEFAULT_THEME;
    const str = fs.readFileSync(DATA_FILE, "utf-8");
    return { ...DEFAULT_THEME, ...JSON.parse(str) };
  } catch {
    return DEFAULT_THEME;
  }
}

function writeFile(data: ColorTheme) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), { encoding: "utf-8" });
  } catch (err) {
    console.warn("[THEME] Failed to write theme file:", err);
  }
}

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return url.startsWith("https://") && !url.includes("your-project") && key.length > 20 && !key.includes("your-service");
}

export async function GET() {
  const localData = readFile();
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
      const { data } = await sb.from("site_theme").select("*").eq("id", 1).maybeSingle();
      if (data) {
        const { id: dbId, theme_id, ...rest } = data;
        return NextResponse.json({ theme: { ...DEFAULT_THEME, ...localData, ...rest, id: theme_id } }, noStore);
      }
    } catch { /* fall through */ }
  }
  return NextResponse.json({ theme: localData }, noStore);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const theme: ColorTheme = { ...DEFAULT_THEME, ...body.theme };

    if (isSupabaseConfigured()) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
        
        const { id: themeIdentifier, ...themeData } = theme;
        // Pastikan menyimpan dengan id: 1 untuk Supabase, dan theme_id untuk string identifier
        const { error } = await sb.from("site_theme").upsert({ 
          id: 1, 
          theme_id: themeIdentifier, 
          ...themeData, 
          updated_at: new Date().toISOString() 
        });
        
        if (error) {
          console.warn("[THEME POST] Supabase upsert failed (maybe table missing?):", error.message);
          writeFile(theme);
          return NextResponse.json({ ok: true, storage: "file", warning: "Supabase table 'site_theme' missing. Saved locally." });
        }
        
        writeFile(theme);
        return NextResponse.json({ ok: true, storage: "supabase" });
      } catch (err) {
        console.error("[THEME POST error]", err);
        writeFile(theme);
        return NextResponse.json({ ok: true, storage: "file", warning: "Supabase error. Saved locally." });
      }
    }

    writeFile(theme);
    return NextResponse.json({ ok: true, storage: "file" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
