import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const adventureId = request.nextUrl.searchParams.get("adventure");

    if (!adventureId) {
      return NextResponse.json(
        { message: "Adventure ID is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("tickettrip");

    const adventure = await db
      .collection("details")
      .findOne({ id: adventureId });

    if (!adventure) {
      return NextResponse.json(
        {
          message: `Adventure details not found for ${adventureId}!`,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(adventure);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch adventure details" },
      { status: 500 },
    );
  }
}
