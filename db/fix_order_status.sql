-- One-time fix for existing databases when adding orders.status
-- 1) Add the column as NULLABLE (if it doesn't exist yet)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(20);

-- 2) Backfill existing rows. Choose the status you want for historical orders:
-- If these orders were created before payments existed, set them to PAID or CREATED.
UPDATE orders
SET status = 'PAID'
WHERE status IS NULL;

-- 3) Enforce NOT NULL (optional, after backfill is done)
ALTER TABLE orders ALTER COLUMN status SET NOT NULL;

-- Optional: add a simple CHECK constraint for allowed values
-- ALTER TABLE orders
--   ADD CONSTRAINT chk_orders_status
--   CHECK (status IN ('CREATED', 'PAID', 'FAILED'));

