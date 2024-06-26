/*
  Warnings:

  - You are about to drop the column `invite_id` on the `members` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `invites` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_invite_id_invite_code_fkey";

-- DropIndex
DROP INDEX "invites_id_code_key";

-- AlterTable
ALTER TABLE "members" DROP COLUMN "invite_id";

-- CreateIndex
CREATE UNIQUE INDEX "invites_code_key" ON "invites"("code");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_invite_code_fkey" FOREIGN KEY ("invite_code") REFERENCES "invites"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
