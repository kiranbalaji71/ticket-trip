import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { getDb } from "@/lib/db";

dayjs.extend(utc);
dayjs.extend(timezone);

const nanoid = customAlphabet("1234567890abcdef", 16);

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

    const database = await getDb();

    const adventureDetail = database.data.detail.find(
      (item) => item.id === adventure,
    );

    if (!adventureDetail) {
      return NextResponse.json(
        {
          message: `Adventure details not found for ${adventure}!`,
        },
        { status: 404 },
      );
    }

    const reqDate = dayjs(date);
    const currentDate = dayjs();

    if (!reqDate.isAfter(currentDate)) {
      return NextResponse.json(
        {
          message: "Date of booking is incorrect. Can't book for a past date!",
        },
        { status: 400 },
      );
    }

    adventureDetail.reserved = true;
    adventureDetail.available = false;

    const formattedName = name
      .trim()
      .toLowerCase()
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const reservation = {
      name: formattedName,
      date,
      person,
      adventure,
      adventureName: adventureDetail.name,
      price: Number(person) * adventureDetail.costPerHead,
      id: nanoid(),
      time: dayjs().tz("Asia/Kolkata").format(),
    };

    database.data.reservations.push(reservation);

    await database.write();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to create reservation",
      },
      { status: 500 },
    );
  }
}
