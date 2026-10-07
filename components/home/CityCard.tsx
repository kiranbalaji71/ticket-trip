import Link from "next/link";
import type { City } from "@/types/ticket-trip";

interface CityCardProps {
  city: City;
}

export default function CityCard({ city }: CityCardProps) {
  return (
    <Link
      href={`adventures?city=${encodeURIComponent(city.id)}`}
      className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-xl"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={city.image}
          alt={city.city}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white p-2">
          <h3 className=" text-2xl font-bold ">{city.city}</h3>
          <p className="atext-sm leading-6 ">{city.description}</p>
        </div>
      </div>
    </Link>
  );
}
