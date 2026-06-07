import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// CREATE BOOKING
export async function POST(request: Request) {
  try {
    const { name, email, date, time } = await request.json();

    if (!name || !email || !date || !time ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        date,
        time,
      } as any,
    });

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}

// GET BOOKINGS
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany();

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}