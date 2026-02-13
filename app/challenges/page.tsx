import Link from "next/link";

export default function ChallengesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-dark-50 px-6 pb-16 pt-28 lg:px-12">
      <div className="absolute left-0 top-1/4 h-80 w-80 rounded-full bg-accent-red/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent-orange/10 blur-3xl" />

      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center rounded-3xl border border-dark-200 bg-dark-100/80 p-10 text-center shadow-sm backdrop-blur-sm lg:p-14">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-red">
          Challenges
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white lg:text-5xl">
          Challenge catalog is coming soon
        </h1>
        <p className="mt-4 max-w-2xl text-base text-gray-400 lg:text-lg">
          We&apos;re building a dedicated home for every prompt gauntlet, difficulty
          tier, and leaderboard filter. Check back soon for the full challenge index.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-linear-to-r from-accent-red to-accent-orange px-6 py-3 text-sm font-semibold text-dark-50 transition-all hover:shadow-glow"
          >
            Back to Homepage
          </Link>
          <Link
            href="/#challenges"
            className="rounded-full border border-dark-200 px-6 py-3 text-sm font-semibold text-gray-300 transition-colors hover:border-accent-red/50 hover:text-white"
          >
            Browse Featured Challenges
          </Link>
        </div>
      </section>
    </main>
  );
}
