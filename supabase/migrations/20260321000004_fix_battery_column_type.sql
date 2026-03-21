-- Fix battery column: was incorrectly defined as BOOLEAN.
-- The form sends 'none' | 'one' | 'two' so it must be TEXT.
ALTER TABLE leads
  ALTER COLUMN battery TYPE TEXT USING CASE
    WHEN battery IS NULL THEN NULL
    WHEN battery = true  THEN 'one'
    WHEN battery = false THEN 'none'
  END;
