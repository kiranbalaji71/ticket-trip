"use client";

import { useEffect, useState } from "react";

import Hero from "@/components/home/Hero";
import CityGrid from "@/components/home/CityGrid";

import { fetchCities } from "@/lib/api";

import type { City } from "@/types/ticket-trip";

export default function HomePage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    async function loadCities() {
      try {
        const data = await fetchCities();
        setCities(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingCities(false);
      }
    }

    loadCities();
  }, []);

  return (
    <>
      <Hero />

      <main>
        {loadingCities ? (
          <div className="mx-auto max-w-7xl px-4 py-20 text-center">
            Loading destinations...
          </div>
        ) : (
          <CityGrid cities={cities} />
        )}
      </main>
    </>
  );
}
