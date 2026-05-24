import { NextResponse } from "next/server";
import { addBooking, readDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, date, time } = await request.json();
    if (!name || !email || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const booking = await addBooking(name, email, date, time);
    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await readDb();
    return NextResponse.json(db.bookings);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
