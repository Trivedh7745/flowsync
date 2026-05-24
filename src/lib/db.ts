import fs from "fs/promises";
import path from "path";

// Define Database File Path
const DB_FILE = path.join(process.cwd(), "database.json");

export interface Workspace {
  id: string;
  name: string;
  email: string;
  company: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  createdAt: string;
}

interface DatabaseSchema {
  workspaces: Workspace[];
  bookings: Booking[];
}

// Initialize database file if it doesn't exist
async function ensureDb() {
  try {
    await fs.access(DB_FILE);
  } catch {
    const initialData: DatabaseSchema = { workspaces: [], bookings: [] };
    await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
  }
}

// Read database contents
export async function readDb(): Promise<DatabaseSchema> {
  await ensureDb();
  const data = await fs.readFile(DB_FILE, "utf-8");
  return JSON.parse(data) as DatabaseSchema;
}

// Write to database
async function writeDb(data: DatabaseSchema) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Workspace actions
export async function addWorkspace(name: string, email: string, company: string): Promise<Workspace> {
  const db = await readDb();
  const newWorkspace: Workspace = {
    id: Math.random().toString(36).substring(2, 9),
    name,
    email,
    company,
    createdAt: new Date().toISOString(),
  };
  db.workspaces.push(newWorkspace);
  await writeDb(db);
  return newWorkspace;
}

// Booking actions
export async function addBooking(name: string, email: string, date: string, time: string): Promise<Booking> {
  const db = await readDb();
  const newBooking: Booking = {
    id: Math.random().toString(36).substring(2, 9),
    name,
    email,
    date,
    time,
    createdAt: new Date().toISOString(),
  };
  db.bookings.push(newBooking);
  await writeDb(db);
  return newBooking;
}
