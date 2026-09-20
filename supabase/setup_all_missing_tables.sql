-- ============================================================
-- 0. TAMBAH KOLOM PADA TABEL TRANSACTIONS
-- ============================================================
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS payment_proof TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS processed_by TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;

-- ============================================================
-- 1. TABEL GAMES (Kategori Game)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.games (
  id              TEXT PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  publisher       TEXT DEFAULT '',
  description     TEXT DEFAULT '',
  cover           TEXT DEFAULT '',
  emoji           TEXT DEFAULT '🎮',
  currency        TEXT NOT NULL DEFAULT 'Diamond',
  currency_icon   TEXT DEFAULT '💎',
  currency_image  TEXT DEFAULT '',
  extra_currencies JSONB DEFAULT '[]'::jsonb,
  color           TEXT DEFAULT '#fbbf24',
  gradient        TEXT DEFAULT 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
  is_active       BOOLEAN DEFAULT TRUE,
  is_hot          BOOLEAN DEFAULT FALSE,
  is_new          BOOLEAN DEFAULT FALSE,
  sort_order      INTEGER DEFAULT 0,
  rate_bongkar     TEXT,
  tujuan_id_bongkar TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Games
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active games" ON public.games;
CREATE POLICY "Public can read active games"
  ON public.games FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Service role full access" ON public.games;
CREATE POLICY "Service role full access"
  ON public.games FOR ALL
  USING (auth.role() = 'service_role');

-- Trigger updated_at untuk games
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS games_updated_at ON public.games;
CREATE TRIGGER games_updated_at
  BEFORE UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed Default Games
INSERT INTO public.games (id, slug, name, publisher, description, cover, emoji, currency, currency_icon, extra_currencies, color, gradient, is_active, is_hot, is_new, sort_order)
VALUES
  (
    'royal-dream', 'royal-dream', 'Royal Dream', 'Coin Royal Dream',
    'Top-up Diamond & Koin Royal Dream dengan harga terbaik, proses cepat dan aman.',
    '/games/royal-dream.png', '👑', 'Chip', '🎰',
    '[{"key":"b","label":"B","icon":"🪙"},{"key":"m","label":"M","icon":"🎰"},{"key":"100m","label":"100M","icon":"✨"}]',
    '#ec4899', 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
    true, true, false, 1
  ),
  (
    'higgs-domino', 'higgs-domino', 'Higgs Domino', 'Higgs Games',
    'Top-up Koin & Chip Higgs Domino Island resmi dengan harga termurah.',
    '/games/higgs-domino.png', '🎰', 'Chip', '🎰',
    '[{"key":"b","label":"B","icon":"🪙"},{"key":"m","label":"M","icon":"🎰"}]',
    '#22c55e', 'linear-gradient(135deg, #14532d 0%, #0f172a 100%)',
    true, false, true, 5
  ),
  (
    'boss-party', 'boss-party', 'Boss Party', 'BossGAME',
    'Boss Party menyediakan game lokal Indonesia, mulai dari: QiuQiu, Kamar Biasa, Kamar Bet, Happy Fishing.',
    '/games/boss-party.png', '🎮', 'Chip', '🎰',
    '[{"key":"b","label":"B","icon":"🪙"},{"key":"m","label":"M","icon":"🎰"}]',
    '#a78bfa', 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
    true, false, false, 0
  )
ON CONFLICT (id) DO NOTHING;

-- 2. TABEL BANNERS
CREATE TABLE IF NOT EXISTS public.banners (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title       TEXT NOT NULL,
  subtitle    TEXT,
  image_url   TEXT NOT NULL,
  link_url    TEXT,
  link_label  TEXT,
  badge_text  TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  show_title  BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Banners are viewable by everyone" ON public.banners;
CREATE POLICY "Banners are viewable by everyone"
  ON public.banners FOR SELECT
  USING (is_active = TRUE);

DROP POLICY IF EXISTS "Banners managed by service role" ON public.banners;
CREATE POLICY "Banners managed by service role"
  ON public.banners FOR ALL
  USING (auth.role() = 'service_role');

-- 3. TABEL GALLERY_IMAGES
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name       TEXT NOT NULL,
  file_path  TEXT NOT NULL,
  url        TEXT NOT NULL,
  folder     TEXT NOT NULL DEFAULT 'general',
  alt        TEXT DEFAULT '',
  size       BIGINT DEFAULT 0,
  mime_type  TEXT DEFAULT 'image/jpeg',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Gallery public read" ON public.gallery_images;
CREATE POLICY "Gallery public read"
  ON public.gallery_images FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Gallery service role all" ON public.gallery_images;
CREATE POLICY "Gallery service role all"
  ON public.gallery_images FOR ALL
  USING (auth.role() = 'service_role');

-- 4. TABEL SITE_SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
  id                 INTEGER PRIMARY KEY DEFAULT 1,
  meta_title         TEXT,
  meta_description   TEXT,
  meta_keywords      TEXT,
  ga_script          TEXT,
  pixel_script       TEXT,
  widget_script      TEXT,
  wa_widget_number   TEXT,
  wa_widget_label    TEXT,
  wa_widget_enabled  BOOLEAN,
  tg_widget_username TEXT,
  tg_widget_label    TEXT,
  tg_widget_enabled  BOOLEAN,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Site settings public read" ON public.site_settings;
CREATE POLICY "Site settings public read"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Site settings service role all" ON public.site_settings;
CREATE POLICY "Site settings service role all"
  ON public.site_settings FOR ALL
  USING (auth.role() = 'service_role');

-- 5. TABEL QRIS_SETTINGS
CREATE TABLE IF NOT EXISTS public.qris_settings (
  id         TEXT PRIMARY KEY,
  label      TEXT,
  image_url  TEXT,
  is_active  BOOLEAN,
  sort_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.qris_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "QRIS public read" ON public.qris_settings;
CREATE POLICY "QRIS public read"
  ON public.qris_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "QRIS service role all" ON public.qris_settings;
CREATE POLICY "QRIS service role all"
  ON public.qris_settings FOR ALL
  USING (auth.role() = 'service_role');
