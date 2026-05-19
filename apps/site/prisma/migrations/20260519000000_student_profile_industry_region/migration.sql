-- Add «Сфера деятельности» (industry) and «Регион» (region) to student profile.
-- The existing `role` field is now «Роль в бизнесе» (renamed in UI only).
ALTER TABLE "students"
  ADD COLUMN "industry" TEXT,
  ADD COLUMN "region" TEXT;
