export const metadata = {
  title: "About — ReAIty Check",
  description:
    "What ReAIty Check is, how it works, and how it helps track AI competence and edge-case reliability.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <main className="relative min-h-screen px-6 pb-16 pt-8 lg:px-12">
        <div className="absolute left-0 top-1/4 h-80 w-80 rounded-full bg-accent-red/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent-orange/10 blur-3xl" />

        <article className="relative z-10 mx-auto max-w-3xl rounded-3xl border border-dark-200 bg-dark-100/80 p-10 shadow-sm backdrop-blur-sm lg:p-14">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-red">
            About
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white lg:text-5xl">
            ReAIty Check
          </h1>
          <p className="mt-4 text-base text-gray-400 lg:text-lg">
            A reaction to the AI hype cycle — we test claims about AI dominance
            and agent competence against reality. Same prompts across models,
            track results, surface failures benchmarks tend to average out.
          </p>

          <section className="mt-8 space-y-4">
            <h2 className="font-display text-2xl font-bold text-white">
              Site functionality and flow
            </h2>
            <p className="text-gray-300">
              <strong className="text-gray-200">Home</strong> — Live results,
              leaderboard, and a comparison grid of models vs challenges.{" "}
              <strong className="text-gray-200">Models</strong> — Browse
              providers and model cards.{" "}
              <strong className="text-gray-200">Challenges</strong> — Catalog of
              prompt gauntlets with kill rates; see which challenges break the
              most models.{" "}
              <strong className="text-gray-200">Benchmarks</strong> — Full
              failure-rate matrix across all suites and models.{" "}
              <strong className="text-gray-200">Submit Challenge</strong> — Propose
              new prompts and expected outcomes for evaluation. Data is updated
              via automated runs and a Convex backend.
            </p>
          </section>

          <section className="mt-8 space-y-4">
            <h2 className="font-display text-2xl font-bold text-white">
              Methodology
            </h2>
            <p className="text-gray-300">
              We run the <strong className="text-gray-200">same prompts</strong>{" "}
              across multiple models, track pass/fail and kill rates, and focus
              on <strong className="text-gray-200">edge cases and meme-style
              problems</strong> — not academic benchmarks. The goal is to see
              where models fail on simple logical traps, constraints, and
              fabricated citations that humans handle instinctively.
            </p>
          </section>

          <section className="mt-8 space-y-4">
            <h2 className="font-display text-2xl font-bold text-white">
              How this helps track &quot;AI dominance&quot;
            </h2>
            <p className="text-gray-300">
              ReAIty Check <strong className="text-gray-200">surfaces where
              models fail</strong>. Progress means agents can handle simple
              edge-case problems at least as reliably as humans. This is not
              anti-AI — it’s a <strong className="text-gray-200">competence
              check</strong> before trusting agents with architecture,
              decisions, or jobs. Before delegating, see how they behave on
              simple problems.
            </p>
          </section>

          <p className="mt-10 text-sm italic text-gray-500">
            Ignore hype. Take a reAIty check.
          </p>
        </article>
      </main>
    </div>
  );
}
