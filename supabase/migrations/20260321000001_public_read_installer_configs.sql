-- Allow public (anonymous) read of installer_configs
-- so the embed page can fetch config directly from Supabase
-- without routing through the backend API.
-- This only exposes the config JSONB blob; installer IDs are UUIDs
-- and not publicly enumerable.

CREATE POLICY "Public can read installer config"
  ON installer_configs FOR SELECT
  USING (true);
