import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "TicketTrip | Explore. Experience. Escape.",
  description: "Discover destinations and book unforgettable adventures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased scroll-smooth">
        <Navbar />

        <main>{children}</main>

        <footer className="bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row">
              <div>
                <h2 className="text-xl font-bold text-orange-500">
                  TicketTrip
                </h2>

                <p className="mt-2 max-w-md text-sm text-slate-400">
                  Discover amazing places and unforgettable adventures.
                </p>
              </div>

              <p className="text-sm text-slate-500">
                © {new Date().getFullYear()} TicketTrip
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
