import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";

import randomData from "@/data/random_data";
import clientPromise from "@/lib/mongodb";
import { AdventureCityDocument, AdventureDetail } from "@/types/ticket-trip";

const categories = ["Beaches", "Cycling", "Hillside", "Party"];

const nanoid = customAlphabet("1234567890", 10);

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const city = body.city;

    if (!city) {
      return NextResponse.json(
        {
          message: "City is required",
        },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("tickettrip");

    const cityData = await db.collection("adventures").findOne({
      id: city.toLowerCase(),
    });

    if (!cityData) {
      return NextResponse.json(
        {
          message: `City not found: ${city}`,
        },
        { status: 404 },
      );
    }

    const images: string[] = [];

    for (let i = 0; i < 3; i++) {
      const index = randomInteger(0, randomData.images.length - 1);

      images.push(randomData.images[index]);
    }

    const id = nanoid();

    const name =
      randomData.places[Math.floor(Math.random() * randomData.places.length)];

    const price = randomInteger(500, 5000);

    const adventureDetail = {
      id,
      name,
      subtitle: "This is a mind-blowing randomly generated adventure!",
      images,
      content:
        "A random paragraph can also be an excellent way for a writer to tackle writers' block.",
      available: true,
      reserved: false,
      costPerHead: price,
    };

    const adventure = {
      id,
      name,
      costPerHead: price,
      currency: "INR",
      image: images[Math.floor(Math.random() * images.length)],
      duration: randomInteger(1, 20),
      category: categories[Math.floor(Math.random() * categories.length)],
    };

    // Insert adventure details
    await db.collection<AdventureDetail>("detail").insertOne(adventureDetail);

    // Add adventure to city's adventures array
    const result = await db
      .collection<AdventureCityDocument>("adventures")
      .updateOne(
        {
          id: city.toLowerCase(),
        },
        {
          $push: {
            adventures: adventure,
          },
        },
      );

    if (result.modifiedCount === 0) {
      await db.collection("detail").deleteOne({
        id,
      });

      return NextResponse.json(
        {
          message: `Failed to add adventure to ${city}`,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        adventure,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create adventure:", error);

    return NextResponse.json(
      {
        message: "Failed to create adventure",
      },
      { status: 500 },
    );
  }
}
