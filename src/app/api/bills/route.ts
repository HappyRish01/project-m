import {NextResponse} from "next/server";

import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("selectedDate");

    if(!dateParam) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }

    // const targetDate = new Date(dateParam + "T00:00:00.000"); // Ensure the date is in UTC

    // console.log("Fetching bills for date:", targetDate);
    
    // const startOfDay = new Date(targetDate)
    // const endOfDay = new Date(targetDate)
    //     endOfDay.setHours(23, 59, 59, 999);


    // const startOfDay = new Date(  
    //   targetDate.getFullYear(),
    //   targetDate.getMonth(),
    //   targetDate.getDate(),
    //   0, 0, 0, 0
    // );

    // const endOfDay = new Date(
    //   targetDate.getFullYear(),
    //   targetDate.getMonth(),
    //   targetDate.getDate(),
    //   23, 59, 59, 999
    // );

    // const [year, month, day] = dateParam.split("-").map(Number);

    // // Create times in IST
    // const startOfDayIST = new Date(year, month - 1, day, 0, 0, 0, 0);
    // const endOfDayIST = new Date(year, month - 1, day, 23, 59, 59, 999);

    // // Convert IST to UTC for database query
    // const startOfDayUTC = new Date(startOfDayIST.getTime() - (5.5 * 60 * 60 * 1000));
    // const endOfDayUTC = new Date(endOfDayIST.getTime() - (5.5 * 60 * 60 * 1000));

    // console.log("Fetching bills for date:", startOfDayUTC.toISOString(), "to", endOfDayUTC.toISOString());



    const bills = await prisma.bill.findMany({
  where: {
    date: {
      gte: new Date(`${dateParam}T00:00:00+05:30`), // India timezone
      lte: new Date(`${dateParam}T23:59:59.999+05:30`),
    }
  },
  orderBy: {
    createdAt: "desc",
  },
});

    // const bills = await prisma.bill.findMany({
    //   where: {
    //     date: {
    //       gte: startOfDay,
    //       lte: endOfDay,
    //     }
    //   },
    //   orderBy: {
    //     createdAt: "desc",  
    //   },
    // });

    return NextResponse.json({bills});
  } catch (error) {
    console.error("Error fetching bills:", error);
    return NextResponse.json({ error: "Failed to fetch bills" }, { status: 500 });
  }
}