"use client";

import type { AdventureDetail } from "@/types/ticket-trip";

import { useReservationForm } from "@/components/reservation/useReservationForm";

interface ReservationFormProps {
  adventure: AdventureDetail;
  onReserved?: () => void | Promise<void>;
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string | number;
  type?: string;
  min?: number;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

function TextField({
  id,
  label,
  value,
  type = "text",
  min,
  placeholder,
  required = false,
  onChange,
}: TextFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-600"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        min={min}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border px-4 py-3 text-gray-600 outline-none focus:border-orange-500"
      />
    </div>
  );
}

export default function ReservationForm({
  adventure,
  onReserved,
}: ReservationFormProps) {
  const { values, status, message, setField, handleSubmit } =
    useReservationForm(adventure.id, onReserved);

  const isSubmitting = status === "submitting";

  return (
    <div className="sticky top-24 rounded-2xl border bg-white p-6 shadow-lg">
      <p className="text-sm text-gray-500">Starting from</p>

      <p className="mt-1 text-3xl font-bold text-orange-600">
        ₹{adventure.costPerHead.toLocaleString()}
      </p>

      <p className="mt-1 text-sm text-gray-500">per person</p>

      <div className="my-6 border-t" />

      {status === "success" ? (
        <div className="rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-600">
          {message}
        </div>
      ) : !adventure.available ? (
        <div className="rounded-lg bg-red-50 p-4 text-center text-sm font-medium text-red-600">
          This adventure is currently unavailable.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <TextField
            id="reservation-name"
            label="Full name"
            value={values.name}
            placeholder="Enter your name"
            required
            onChange={(value) => setField("name", value)}
          />

          <TextField
            id="reservation-date"
            label="Travel date"
            type="date"
            value={values.date}
            required
            onChange={(value) => setField("date", value)}
          />

          <TextField
            id="reservation-person"
            label="Number of people"
            type="number"
            min={1}
            value={values.person}
            required
            onChange={(value) => setField("person", Number(value))}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Booking..." : "Book this adventure"}
          </button>

          {status === "error" && message && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
