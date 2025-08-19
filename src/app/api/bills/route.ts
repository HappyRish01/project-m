import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("selectedDate");
    let searchQuery = searchParams.get("search");

    if (searchQuery) {
      searchQuery = decodeURIComponent(searchQuery.replace(/\+/g, " "));
      const where: any = {};
      where.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { id: isNaN(Number(searchQuery)) ? undefined : Number(searchQuery) },
        {
          totalAmount: isNaN(Number(searchQuery))
            ? undefined
            : Number(searchQuery),
        },
      ];

      const bills = await prisma.bill.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json({ bills });
    }

    if (!dateParam) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    const bills = await prisma.bill.findMany({
      where: {
        date: {
          gte: new Date(`${dateParam}T00:00:00+05:30`), // India timezone
          lte: new Date(`${dateParam}T23:59:59.999+05:30`),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ bills });
  } catch (error) {
    console.error("Error fetching bills:", error);
    return NextResponse.json(
      { error: "Failed to fetch bills" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { items, billingDetails, subTotal, gstBreakdown, totalGst , totalAmount } = body;

  const productIds = items.map((item: any) => item.id);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  try {
    const bill = await prisma.bill.create({
      data: {
        date: new Date(billingDetails.date),
        name: billingDetails.customerName,
        address: billingDetails.address,
        city: billingDetails.city,
        panNumber: billingDetails.panNumber,
        GSTINumber: billingDetails.gstinNumber,
        vehicleNumber: billingDetails.vehicleNumber,
        totalAmount,
        subTotal,
        gstBreakdown,
        totalGst,
        state: billingDetails.state,
        stateCode: billingDetails.stateCode,
        items: {
          create: items.map((cartItem: any) => {
            const product = products.find((p) => p.id === cartItem.id);
            if (!product) throw new Error(`Product not found: ${cartItem.id}`);
            return {
              productId: product.id,
              name: product.name,
              hsnCode: product.hsnCode,
              quantity: cartItem.quantity,
              price: product.price,
              gst: product.gst,
              kgpunit: product.kgpunit,
              unit: product.unit,
            };
          }),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({bill}) 
  } catch (err) {
    console.error(err);

    return NextResponse.json({
      error: "Internal server error failed to create bill",
      status: 500
    })
  }
}
