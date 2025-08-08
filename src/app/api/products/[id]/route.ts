// @ts-nocheck

import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";
import { AwardIcon } from "lucide-react";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } =  await params;

  try {
    const productData = await request.json();

    const validated = productSchema.parse(productData);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json(updatedProduct);
  } catch (error:any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  try {
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error:any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}