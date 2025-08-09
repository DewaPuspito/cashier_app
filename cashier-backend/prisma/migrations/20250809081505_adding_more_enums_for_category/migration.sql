/*
  Warnings:

  - The values [FOOD,DRINK,STATIONERY,CLOTHING,HEALTH] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Category_new" AS ENUM ('FRUITS', 'VEGETABLES', 'CANNED_GOODS', 'DAIRY', 'MEAT', 'SEAFOOD', 'DELI', 'CONDIMENTS_SPICES', 'SNACKS', 'BREAD_AND_BAKERY', 'BEVERAGES', 'PASTA_RICE_CEREAL', 'BAKING', 'FROZEN_FOODS', 'PERSONAL_CARE', 'HEALTH_CARE', 'HOUSEHOLD', 'BABY_ITEMS', 'PET_SUPPLIES', 'AUTOMOTIVE', 'ELECTRONICS', 'SPORTS_OUTDOORS', 'TOYS', 'STATIONERIES');
ALTER TABLE "public"."products" ALTER COLUMN "category" TYPE "public"."Category_new" USING ("category"::text::"public"."Category_new");
ALTER TYPE "public"."Category" RENAME TO "Category_old";
ALTER TYPE "public"."Category_new" RENAME TO "Category";
DROP TYPE "public"."Category_old";
COMMIT;
