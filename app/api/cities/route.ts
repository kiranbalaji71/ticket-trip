import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("tickettrip");

    const citiesCollection = db.collection("cities");
    const cities = await citiesCollection.find().toArray();

    return NextResponse.json(cities);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch cities" },
      { status: 500 },
    );
  }
}
