-- Add custom_answers JSONB column to leads table
-- Stores answers to installer-defined custom steps keyed by step ID

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS custom_answers JSONB DEFAULT NULL;
