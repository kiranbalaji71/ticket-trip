import type { City } from "@/types/ticket-trip";
import CityCard from "./CityCard";

interface CityGridProps {
  cities: City[];
}

export default function CityGrid({ cities }: CityGridProps) {
  return (
    <section id="cities" className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
            Destinations
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Where do you want to go?
          </h2>

          <p className="mt-3 max-w-2xl text-gray-300">
            Pick a destination and discover experiences waiting for you.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </div>
    </section>
  );
}
