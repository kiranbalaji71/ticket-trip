"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { fetchAdventure } from "@/lib/api";

import type { AdventureDetail } from "@/types/ticket-trip";

import ReservationForm from "@/components/reservation/ReservationForm";
import { Carousel } from "@/components/ui";

export default function AdventurePage() {
  const params = useParams();

  const id = params.id as string;

  const [adventure, setAdventure] = useState<AdventureDetail | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdventure() {
      try {
        const data = await fetchAdventure(id);

        setAdventure(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadAdventure();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        Loading adventure...
      </div>
    );
  }

  if (!adventure) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        Adventure not found.
      </div>
    );
  }

  return (
    <main className="bg-gray-50 dark:bg-gray-950 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <section>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {adventure.name}
              </h1>
              <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                {adventure.subtitle}
              </p>
            </div>
            <Carousel
              images={adventure.images}
              alt={adventure.name}
              className="rounded-2xl object-cover"
              aspectRatio="aspect-video"
            />

            <div className="mt-8">
              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  About this adventure
                </h2>

                <p className="mt-3 leading-8 text-gray-500 dark:text-gray-400">
                  {adventure.content}
                </p>
              </div>
            </div>
          </section>

          <aside>
            <ReservationForm adventure={adventure} />
          </aside>
        </div>
      </div>
    </main>
  );
}
