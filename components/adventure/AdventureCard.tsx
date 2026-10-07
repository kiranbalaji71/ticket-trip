import Link from "next/link";
import type { Adventure } from "@/types/ticket-trip";

interface AdventureCardProps {
  adventure: Adventure;
}

export default function AdventureCard({ adventure }: AdventureCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm transition  hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={adventure.image}
          alt={adventure.name}
          className="h-full w-full object-cover"
        />

        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-800 shadow">
          {adventure.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900">{adventure.name}</h3>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Starting from</p>

            <p className="text-lg font-bold text-orange-600">
              ₹{adventure.costPerHead.toLocaleString()}
            </p>
          </div>

          <p className="text-sm text-gray-500">{adventure.duration} hrs</p>
        </div>

        <Link
          href={`/adventures/${adventure.id}`}
          className="mt-5 block rounded-lg bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          View adventure
        </Link>
      </div>
    </article>
  );
}
