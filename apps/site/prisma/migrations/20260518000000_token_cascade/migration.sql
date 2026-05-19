-- Add ON DELETE CASCADE to password_reset_tokens and email_verification_tokens
-- so orphan tokens don't accumulate when a user is deleted.
-- Detected during smoke-test 2026-05-18: deleting a user left a verification
-- token row pointing to a non-existent userId.

-- Clean up any pre-existing orphans first so the FK can be created safely.
DELETE FROM "password_reset_tokens" WHERE "userId" NOT IN (SELECT "id" FROM "users");
DELETE FROM "email_verification_tokens" WHERE "userId" NOT IN (SELECT "id" FROM "users");

-- Add the missing FK constraints.
ALTER TABLE "password_reset_tokens"
  ADD CONSTRAINT "password_reset_tokens_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "email_verification_tokens"
  ADD CONSTRAINT "email_verification_tokens_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
