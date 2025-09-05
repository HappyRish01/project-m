-- DropForeignKey
ALTER TABLE "public"."BillItem" DROP CONSTRAINT "BillItem_billId_fkey";

-- AddForeignKey
ALTER TABLE "public"."BillItem" ADD CONSTRAINT "BillItem_billId_fkey" FOREIGN KEY ("billId") REFERENCES "public"."Bill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
