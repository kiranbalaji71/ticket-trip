import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import clientPromise from "@/lib/mongodb";
import type {
  Adventure,
  AdventureDetail,
  Reservation,
} from "@/types/ticket-trip";

dayjs.extend(utc);
dayjs.extend(timezone);

const nanoid = customAlphabet("1234567890abcdef", 16);

interface AdventureCityDocument {
  id: string;
  adventures: Adventure[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, date, person, adventure } = body;

    if (!name || !date || !person || !adventure) {
      return NextResponse.json(
        {
          message: "Invalid data received",
        },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("tickettrip");

    const adventureDocument = await db
      .collection<AdventureCityDocument>("adventures")
      .findOne({
        adventures: {
          $elemMatch: {
            id: adventure,
          },
        },
      });

    if (!adventureDocument) {
      return NextResponse.json(
        {
          message: `Adventure details not found for ${adventure}!`,
        },
        { status: 404 },
      );
    }

    const adventureData = adventureDocument.adventures.find(
      (item) => item.id === adventure,
    );

    if (!adventureData) {
      return NextResponse.json(
        {
          message: `Adventure details not found for ${adventure}!`,
        },
        { status: 404 },
      );
    }

    const reqDate = dayjs(date);
    const currentDate = dayjs();

    if (!reqDate.isValid() || !reqDate.isAfter(currentDate)) {
      return NextResponse.json(
        {
          message: "Date of booking is incorrect. Can't book for a past date!",
        },
        { status: 400 },
      );
    }

    const formattedName = String(name)
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const reservation: Reservation = {
      name: formattedName,
      date,
      person,
      adventure,
      adventureName: adventureData.name,
      price: Number(person) * adventureData.costPerHead,
      id: nanoid(),
      time: dayjs().tz("Asia/Kolkata").format(),
    };

    await db.collection<Reservation>("reservations").insertOne(reservation);

    await db.collection<AdventureDetail>("details").updateOne(
      {
        id: adventure,
      },
      {
        $set: {
          reserved: true,
          available: false,
        },
      },
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Failed to create reservation:", error);

    return NextResponse.json(
      {
        message: "Failed to create reservation",
      },
      { status: 500 },
    );
  }
}
