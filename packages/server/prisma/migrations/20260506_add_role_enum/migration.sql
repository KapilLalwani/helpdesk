CREATE TYPE "Role" AS ENUM ('admin', 'agent', 'user');

ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role" USING "role"::"Role";
