/*
  Warnings:

  - You are about to drop the column `userID` on the `Problem` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_userID_fkey";

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "userID",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "editorial" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
