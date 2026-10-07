"use client";

import { FormEvent, useState } from "react";

import { createReservation } from "@/lib/api";

import type { AdventureDetail } from "@/types/ticket-trip";

interface ReservationFormProps {
  adventure: AdventureDetail;
}

export default function ReservationForm({ adventure }: ReservationFormProps) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [person, setPerson] = useState(1);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      await createReservation({
        name,
        date,
        person,
        adventure: adventure.id,
      });

      setMessage("Reservation created successfully!");

      setName("");
      setDate("");
      setPerson(1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Reservation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sticky top-24 rounded-2xl border bg-white p-6 shadow-lg">
      <p className="text-sm text-gray-500">Starting from</p>

      <p className="mt-1 text-3xl font-bold text-orange-600">
        ₹{adventure.costPerHead.toLocaleString()}
      </p>

      <p className="mt-1 text-sm text-gray-500">per person</p>

      <div className="my-6 border-t" />

      {!adventure.available ? (
        <div className="rounded-lg bg-red-50 p-4 text-center text-sm font-medium text-red-600">
          This adventure is currently unavailable.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 text-gray-600 block text-sm font-medium">
              Full name
            </label>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              placeholder="Enter your name"
              className="w-full text-gray-600 rounded-lg border px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 text-gray-600 block text-sm font-medium">
              Travel date
            </label>

            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              className="w-full text-gray-600 rounded-lg border px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 text-gray-600 block text-sm font-medium">
              Number of people
            </label>

            <input
              type="number"
              min={1}
              value={person}
              onChange={(event) => setPerson(Number(event.target.value))}
              required
              className="w-full text-gray-600 rounded-lg border px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Booking..." : "Book this adventure"}
          </button>

          {message && (
            <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
