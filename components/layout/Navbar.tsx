"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-orange-600"
        >
          TicketTrip
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-orange-600"
          >
            Home
          </Link>

          <Link
            href="/reservations"
            className="text-sm font-medium text-gray-700 hover:text-orange-600"
          >
            My Reservations
          </Link>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg border px-3 py-2 md:hidden text-gray-600"
        >
          ☰
        </button>
      </div>

      {open && (
        <nav className="border-t bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4 text-gray-600">
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>

            <Link href="/reservations" onClick={() => setOpen(false)}>
              My Reservations
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
