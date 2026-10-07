import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const database = await getDb();

    return NextResponse.json(database.data.cities);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch cities" },
      { status: 500 },
    );
  }
}
