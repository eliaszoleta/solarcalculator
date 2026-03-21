-- ============================================================
-- Leads table: full setup including RLS policies
-- This is idempotent — safe to run on an existing table.
-- ============================================================

-- 1. Create the leads table if it doesn't already exist
CREATE TABLE IF NOT EXISTS leads (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  installer_id    TEXT        DEFAULT NULL,
  name            TEXT        DEFAULT NULL,
  email           TEXT        DEFAULT NULL,
  phone           TEXT        DEFAULT NULL,
  timeline        TEXT        DEFAULT NULL,
  payment_method  TEXT        DEFAULT NULL,
  monthly_bill    NUMERIC     DEFAULT NULL,
  state           TEXT        DEFAULT NULL,
  zip             TEXT        DEFAULT NULL,
  home_type       TEXT        DEFAULT NULL,
  owns_home       BOOLEAN     DEFAULT NULL,
  sun_exposure    TEXT        DEFAULT NULL,
  roof_type       TEXT        DEFAULT NULL,
  battery         TEXT        DEFAULT NULL,
  system_size_kw  NUMERIC     DEFAULT NULL,
  annual_savings  NUMERIC     DEFAULT NULL,
  total_cost      NUMERIC     DEFAULT NULL,
  custom_answers  JSONB       DEFAULT NULL,
  deleted_at      TIMESTAMPTZ DEFAULT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Add any missing columns to an existing table (safe with IF NOT EXISTS)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS home_type      TEXT        DEFAULT NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS owns_home      BOOLEAN     DEFAULT NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sun_exposure   TEXT        DEFAULT NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS roof_type      TEXT        DEFAULT NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS custom_answers JSONB       DEFAULT NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS deleted_at     TIMESTAMPTZ DEFAULT NULL;

-- 3. Fix battery column: must be TEXT (not BOOLEAN) to store 'none'|'one'|'two'
--    If it's already TEXT this is a no-op; if BOOLEAN, convert safely.
DO $$
BEGIN
  IF (SELECT data_type FROM information_schema.columns
      WHERE table_name = 'leads' AND column_name = 'battery') = 'boolean' THEN
    ALTER TABLE leads ALTER COLUMN battery TYPE TEXT USING
      CASE WHEN battery IS NULL THEN NULL WHEN battery = true THEN 'one' ELSE 'none' END;
  END IF;
  -- Ensure column exists as TEXT if missing entirely
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'leads' AND column_name = 'battery') THEN
    ALTER TABLE leads ADD COLUMN battery TEXT DEFAULT NULL;
  END IF;
END $$;

-- 4. Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies so we can recreate them cleanly
DROP POLICY IF EXISTS "Anyone can insert leads"          ON leads;
DROP POLICY IF EXISTS "Installers can read own leads"    ON leads;
DROP POLICY IF EXISTS "Installers can update own leads"  ON leads;
DROP POLICY IF EXISTS "Installers can delete own leads"  ON leads;

-- 6. INSERT: anyone (including anonymous widget visitors) can submit a lead
CREATE POLICY "Anyone can insert leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- 7. SELECT: authenticated installer sees only their own leads
CREATE POLICY "Installers can read own leads"
  ON leads FOR SELECT
  USING (auth.uid()::text = installer_id);

-- 8. UPDATE: authenticated installer can edit their own leads
CREATE POLICY "Installers can update own leads"
  ON leads FOR UPDATE
  USING (auth.uid()::text = installer_id);

-- 9. DELETE: authenticated installer can delete their own leads
CREATE POLICY "Installers can delete own leads"
  ON leads FOR DELETE
  USING (auth.uid()::text = installer_id);
