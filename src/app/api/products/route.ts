import { NextResponse } from "next/server";
// import { Product } from "@/types/product";
import prisma from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
} 

export async function POST(request: Request) {
  try {
    const productData = await request.json();

    console.log("Creating product:", productData);

    // Validate required fields
        const validated = productSchema.parse(productData)


    const newProduct = await prisma.product.create({
      data: validated,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Internal server error" , error: error.message},
      { status: 500 }
    );
  }
}