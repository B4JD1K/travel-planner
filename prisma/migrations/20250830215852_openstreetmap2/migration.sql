/*
  Warnings:

  - Added the required column `lng` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Location" ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL;
