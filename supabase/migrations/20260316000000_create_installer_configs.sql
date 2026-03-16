-- Installer configuration table
-- Stores all per-installer settings: pricing, service states, branding, CTA, etc.
-- Keyed by the installer's Supabase user UUID.

CREATE TABLE IF NOT EXISTS installer_configs (
  installer_id  TEXT        PRIMARY KEY,
  config        JSONB       NOT NULL DEFAULT '{}',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only the backend (service role) should read/write this table.
ALTER TABLE installer_configs ENABLE ROW LEVEL SECURITY;

-- No public policies — service role key bypasses RLS entirely.
-- Authenticated installers can read their own row (for future direct-client use).
CREATE POLICY "Installers can read own config"
  ON installer_configs FOR SELECT
  USING (auth.uid()::text = installer_id);

CREATE POLICY "Installers can upsert own config"
  ON installer_configs FOR ALL
  USING (auth.uid()::text = installer_id);
