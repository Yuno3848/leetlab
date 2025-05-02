/*
  Warnings:

  - You are about to drop the column `tag` on the `Problem` table. All the data in the column will be lost.
  - Added the required column `description` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "tag",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[];
