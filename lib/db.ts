import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";

export type City = {
  id: string;
  city: string;
  description: string;
  image: string;
};

export type Adventure = {
  id: string;
  name: string;
  costPerHead: number;
  currency: string;
  image: string;
  duration: number;
  category: string;
};

export type AdventureDetail = {
  id: string;
  name: string;
  subtitle: string;
  images: string[];
  content: string;
  available: boolean;
  reserved: boolean;
  costPerHead: number;
};

export type Reservation = {
  name: string;
  date: string;
  person: string | number;
  adventure: string;
  adventureName: string;
  price: number;
  id: string;
  time: string;
};

export type Database = {
  cities: City[];
  adventures: {
    id: string;
    adventures: Adventure[];
  }[];
  detail: AdventureDetail[];
  reservations: Reservation[];
};

const file = path.join(process.cwd(), "data", "db.json");

const adapter = new JSONFile<Database>(file);

export const db = new Low<Database>(adapter, {
  cities: [],
  adventures: [],
  detail: [],
  reservations: [],
});

export async function getDb() {
  await db.read();

  if (!db.data) {
    db.data = {
      cities: [],
      adventures: [],
      detail: [],
      reservations: [],
    };
  }

  return db;
}
