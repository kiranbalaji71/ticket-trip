import fs from "node:fs";
import path from "node:path";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({
  path: path.join(process.cwd(), ".env.local"),
});

const uri = process.env.MONGODB_URI;
console.log("MONGODB_URI:", uri);

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

const filePath = path.join(process.cwd(), "data", "db.json");

const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const client = new MongoClient(uri);

async function migrate() {
  try {
    await client.connect();

    console.log("Connected to MongoDB");

    const db = client.db("tickettrip");

    if (json.detail?.length) {
      await db.collection("details").deleteMany({});
      await db.collection("details").insertMany(json.detail);

      console.log(`✓ Migrated ${json.detail.length} details`);
    }

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

migrate();
