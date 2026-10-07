import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const city = searchParams.get("city");
    const category = searchParams.get("category");
    const duration = searchParams.get("duration");

    if (!city) {
      return NextResponse.json(
        { message: "City is required" },
        { status: 400 },
      );
    }

    const database = await getDb();

    const cityData = database.data.adventures.find(
      (item) => item.id.toLowerCase() === city.toLowerCase(),
    );

    if (!cityData) {
      return NextResponse.json(
        {
          message: `Adventures not found for ${city}`,
        },
        { status: 404 },
      );
    }

    const allAdventures = cityData.adventures;

    // Get unique categories
    const categories = [
      ...new Set(
        allAdventures.map((adventure) => adventure.category).filter(Boolean),
      ),
    ];

    // Get unique durations
    const durations = [
      ...new Set(
        allAdventures.map((adventure) => adventure.duration).filter(Boolean),
      ),
    ].sort((a, b) => a - b);

    // Apply filters
    let adventures = allAdventures;

    if (category && category !== "all") {
      adventures = adventures.filter(
        (adventure) =>
          adventure.category.toLowerCase() === category.toLowerCase(),
      );
    }

    if (duration && duration !== "all") {
      adventures = adventures.filter(
        (adventure) => adventure.duration === Number(duration),
      );
    }

    return NextResponse.json({
      adventures,
      filters: {
        categories,
        durations,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch adventures" },
      { status: 500 },
    );
  }
}
