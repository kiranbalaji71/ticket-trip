import type { Adventure } from "@/types/ticket-trip";
import AdventureCard from "./AdventureCard";

interface AdventureGridProps {
  adventures: Adventure[];
}

export default function AdventureGrid({ adventures }: AdventureGridProps) {
  return (
    <>
      {adventures.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <p className="text-gray-600">
            No adventures found for this destination.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {adventures.map((adventure) => (
            <AdventureCard key={adventure.id} adventure={adventure} />
          ))}
        </div>
      )}
    </>
  );
}
