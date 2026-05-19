-- Promote existing ADMIN(s) → SUPER_ADMIN.
-- Runs in a separate migration because Postgres forbids using a newly-added
-- enum value within the same transaction that adds it.
UPDATE "users" SET "role" = 'SUPER_ADMIN' WHERE "role" = 'ADMIN';
