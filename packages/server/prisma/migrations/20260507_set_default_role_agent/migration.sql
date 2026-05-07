UPDATE "User" SET "role" = 'agent'::"Role" WHERE "role" IS NULL;
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'agent'::"Role";
ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL;
