-- Apply once to existing databases that already have payments and applications.
-- Fresh databases get this column from schema.sql and must not run this migration.
ALTER TABLE payments
  ADD COLUMN application_claimed INTEGER NOT NULL DEFAULT 0
  CHECK (application_claimed IN (0, 1));

-- Existing application batches already consumed their payment.
UPDATE payments
SET application_claimed = 1
WHERE EXISTS (
  SELECT 1 FROM applications a WHERE a.payment_id = payments.id
);

CREATE INDEX IF NOT EXISTS idx_applications_payment ON applications(payment_id);
