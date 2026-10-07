import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("tickettrip");

    const reservations = await db.collection("reservations").find().toArray();

    return NextResponse.json(reservations);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch reservations" },
      { status: 500 },
    );
  }
}
