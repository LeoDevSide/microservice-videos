-- CreateEnum
CREATE TYPE "CastMemberType" AS ENUM ('ACTOR', 'DIRECTOR');

-- CreateTable
CREATE TABLE "cast_members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CastMemberType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cast_members_pkey" PRIMARY KEY ("id")
);
