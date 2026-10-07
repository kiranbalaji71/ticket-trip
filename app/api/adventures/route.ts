import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import type { AdventureCityDocument } from "@/types/ticket-trip";

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

    const client = await clientPromise;
    const db = client.db("tickettrip");

    const cityData = await db
      .collection<AdventureCityDocument>("adventures")
      .findOne({
        id: city.toLowerCase(),
      });

    if (!cityData) {
      return NextResponse.json(
        {
          message: `Adventures not found for ${city}`,
        },
        { status: 404 },
      );
    }

    const allAdventures = cityData.adventures ?? [];

    // Get unique categories
    const categories = [
      ...new Set(
        allAdventures.map((adventure) => adventure.category).filter(Boolean),
      ),
    ].sort();

    // Get unique durations
    const durations = [
      ...new Set(
        allAdventures
          .map((adventure) => adventure.duration)
          .filter((duration) => duration !== null && duration !== undefined),
      ),
    ].sort((a, b) => Number(a) - Number(b));

    // Apply filters
    let adventures = allAdventures;

    if (category && category !== "all") {
      adventures = adventures.filter(
        (adventure) =>
          adventure.category?.toLowerCase() === category.toLowerCase(),
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
    console.error("Failed to fetch adventures:", error);

    return NextResponse.json(
      { message: "Failed to fetch adventures" },
      { status: 500 },
    );
  }
}
