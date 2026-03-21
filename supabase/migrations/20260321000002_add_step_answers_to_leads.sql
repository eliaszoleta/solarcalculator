-- Add missing builtin step answer columns to leads table

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS home_type    TEXT    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS owns_home    BOOLEAN DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS sun_exposure TEXT    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS roof_type    TEXT    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS battery      BOOLEAN DEFAULT NULL;
