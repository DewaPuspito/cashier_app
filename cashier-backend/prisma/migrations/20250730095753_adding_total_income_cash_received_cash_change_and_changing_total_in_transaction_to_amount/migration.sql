/*
  Warnings:

  - You are about to drop the column `cashAmount` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `amount` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."shifts" ADD COLUMN     "totalIncome" INTEGER;

-- AlterTable
ALTER TABLE "public"."transactions" DROP COLUMN "cashAmount",
DROP COLUMN "total",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "cashChange" INTEGER,
ADD COLUMN     "cashReceived" INTEGER;
