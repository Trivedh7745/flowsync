import { NextResponse } from "next/server";
import { addWorkspace, readDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, company } = await request.json();
    if (!name || !email || !company) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const workspace = await addWorkspace(name, email, company);
    return NextResponse.json({ success: true, workspace });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await readDb();
    return NextResponse.json(db.workspaces);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
