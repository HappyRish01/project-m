-- AlterTable
ALTER TABLE "public"."Bill" ADD COLUMN     "gstBreakdown" JSONB,
ADD COLUMN     "subTotal" DOUBLE PRECISION,
ADD COLUMN     "totalGst" DOUBLE PRECISION;
