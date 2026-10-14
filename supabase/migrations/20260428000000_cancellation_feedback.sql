-- ============================================================
-- Cancellation feedback: captured up front, before the Stripe Billing
-- Portal redirect, since this app has no webhook that distinguishes
-- "opened the portal to update a card" from "opened it to cancel" --
-- this is the closest it can get to retention-flow feedback without
-- owning the cancellation UI itself. Service-role access only (no
-- installer-facing read/write policy needed; the feedback form posts
-- through a backend route, not directly from the client).
-- ============================================================

CREATE TABLE IF NOT EXISTS cancellation_feedback (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  installer_id  TEXT        DEFAULT NULL,
  reason        TEXT        DEFAULT NULL,
  note          TEXT        DEFAULT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cancellation_feedback_installer_id ON cancellation_feedback(installer_id);

ALTER TABLE cancellation_feedback ENABLE ROW LEVEL SECURITY;
-- No policies defined on purpose -- only the service-role key (used by the
-- backend route) can read/write this table.
