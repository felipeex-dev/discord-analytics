/*
  Warnings:

  - You are about to drop the column `origin` on the `members` table. All the data in the column will be lost.
  - Added the required column `invite_code` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invite_id` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "origin",
ADD COLUMN     "invite_code" TEXT NOT NULL,
ADD COLUMN     "invite_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "invites" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invites_id_code_key" ON "invites"("id", "code");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_invite_id_invite_code_fkey" FOREIGN KEY ("invite_id", "invite_code") REFERENCES "invites"("id", "code") ON DELETE RESTRICT ON UPDATE CASCADE;
