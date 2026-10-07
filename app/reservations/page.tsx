"use client";

import { DataTable, type TableAction, type TableColumn } from "@/components/ui";
import { fetchReservations } from "@/lib/api";
import type { Reservation } from "@/types/ticket-trip";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReservations() {
      try {
        setLoadingReservations(true);
        setError(null);

        const data = await fetchReservations();

        setReservations(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load reservations.");
      } finally {
        setLoadingReservations(false);
      }
    }

    loadReservations();
  }, []);

  const columns: TableColumn<Reservation>[] = [
    {
      id: "adventureName",
      header: "Adventure",
      accessor: "adventureName",
      sortable: true,
      cell: (reservation) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {reservation.adventureName}
          </p>

          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            ID: {reservation.adventure}
          </p>
        </div>
      ),
    },

    {
      id: "name",
      header: "Customer",
      accessor: "name",
      sortable: true,
      cell: (reservation) => (
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {reservation.name}
        </span>
      ),
    },

    {
      id: "date",
      header: "Date",
      accessor: "date",
      sortable: true,
      cell: (reservation) => (
        <span className="text-gray-600 dark:text-gray-400">
          {dayjs(reservation.date).format("DD MMM YYYY")}
        </span>
      ),
    },

    {
      id: "time",
      header: "Time",
      accessor: "time",
      sortable: true,
      cell: (reservation) => (
        <span className="text-gray-600 dark:text-gray-400">
          {dayjs(reservation.time).format("h:mm A")}
        </span>
      ),
    },

    {
      id: "person",
      header: "People",
      accessor: "person",
      sortable: true,
      align: "center",
    },

    {
      id: "price",
      header: "Price",
      accessor: "price",
      sortable: true,
      align: "right",
      cell: (reservation) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          ₹{Number(reservation.price).toLocaleString("en-IN")}
        </span>
      ),
    },
  ];

  const actions: TableAction<Reservation>[] = [
    {
      label: "View reservation",
      title: "View reservation",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12s3.5-6.75 9.75-6.75S21.75 12 21.75 12s-3.5 6.75-9.75 6.75S2.25 12 2.25 12Z"
          />

          <circle cx="12" cy="12" r="2.5" />
        </svg>
      ),
      onClick: (reservation) => {
        console.log("View reservation:", reservation);
      },
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-10 dark:bg-gray-950">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
            Bookings
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            My Reservations
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            View and manage your adventure reservations.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={reservations}
          getRowId={(reservation) => reservation.id}
          sortable
          pagination
          pageSize={10}
          pageSizeOptions={[10, 25, 50]}
          loading={loadingReservations}
          error={error}
          emptyMessage="You don't have any reservations yet."
          actions={actions}
          caption="Adventure reservations"
        />
      </section>
    </main>
  );
}
