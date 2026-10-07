"use client";

import AdventureGrid from "@/components/adventure/AdventureGrid";
import { fetchAdventures } from "@/lib/api";
import type { Adventure, AdventureFilters } from "@/types/ticket-trip";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdventuresGridPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedCity = searchParams.get("city") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const selectedDuration = searchParams.get("duration") || "all";

  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [loadingAdventures, setLoadingAdventures] = useState(false);
  const [filters, setFilters] = useState<AdventureFilters>({
    categories: [],
    durations: [],
  });

  useEffect(() => {
    if (!selectedCity) {
      setAdventures([]);
      return;
    }

    async function loadAdventures() {
      try {
        setLoadingAdventures(true);

        const data = await fetchAdventures(
          selectedCity,
          selectedCategory,
          selectedDuration,
        );

        setAdventures(data.adventures);
        setFilters(data.filters);
      } catch (error) {
        console.error(error);
        setAdventures([]);
      } finally {
        setLoadingAdventures(false);
      }
    }

    loadAdventures();
  }, [selectedCity, selectedCategory, selectedDuration]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/adventures?${params.toString()}`);
  };

  return (
    <main>
      <section className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="group inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 dark:bg-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              Go Back
            </Link>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                Adventures
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Experiences in{" "}
                <span className="text-orange-600">{selectedCity}</span>
              </h2>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 rounded-xl border border-gray-600 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Category
                </label>

                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(event) =>
                    updateFilter("category", event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-400 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="all">All categories</option>

                  {filters.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Duration
                </label>

                <select
                  id="duration"
                  value={selectedDuration}
                  onChange={(event) =>
                    updateFilter("duration", event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-400 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="all">Any duration</option>

                  {filters.durations.map((duration) => (
                    <option key={duration} value={duration}>
                      {duration} {duration === 1 ? "hour" : "hours"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Adventures */}
          {loadingAdventures ? (
            <div className="py-20 text-center text-gray-500">
              Loading adventures...
            </div>
          ) : adventures.length > 0 ? (
            <AdventureGrid adventures={adventures} />
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 py-20 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                No adventures found
              </h3>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Try changing the category or duration filters.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
