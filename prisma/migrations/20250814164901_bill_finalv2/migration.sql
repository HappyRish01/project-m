-- CreateTable
CREATE TABLE "public"."BillItem" (
    "id" SERIAL NOT NULL,
    "billId" INTEGER NOT NULL,
    "productId" TEXT,
    "name" TEXT NOT NULL,
    "hsnCode" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "gst" INTEGER NOT NULL,

    CONSTRAINT "BillItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."BillItem" ADD CONSTRAINT "BillItem_billId_fkey" FOREIGN KEY ("billId") REFERENCES "public"."Bill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BillItem" ADD CONSTRAINT "BillItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
