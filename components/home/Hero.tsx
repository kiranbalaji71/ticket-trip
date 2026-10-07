export default function Hero() {
  return (
    <section
      className="
        w-calc(100vw - 1rem)
        relative
        bg-cover
        bg-center
        bg-no-repeat 
        overflow-hidden
        bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg?cs=srgb&dl=pexels-josh-hild-2422461.jpg&fm=jpg')]
      "
    >
      <div className="mx-auto max-w-7xl px-4 py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
            Explore • Experience • Escape
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            Your next adventure
            <span className="block text-orange-500">starts here.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Discover amazing destinations, find unforgettable adventures, and
            book your next experience with TicketTrip.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#cities"
              className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Explore destinations
            </a>

            <a
              href="/reservations"
              className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              My reservations
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
