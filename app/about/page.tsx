import Link from "next/link";

export const metadata = {
  title: "About",
  description:
    "Why ReAIty Check exists, how the site works, and how we track AI limitations with edge-case challenges and live benchmarks.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <main className="relative min-h-screen px-6 pb-16 pt-8 lg:px-12">
        <div className="absolute left-0 top-1/4 h-80 w-80 rounded-full bg-accent-red/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent-orange/10 blur-3xl" />

        <article className="relative z-10 mx-auto w-full max-w-3xl rounded-3xl border border-dark-200 bg-dark-100/80 p-10 shadow-sm backdrop-blur-sm lg:p-14">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-red">
            About
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white lg:text-5xl">
            ReAIty Check
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-400">
            AI is coming for your job — but first, let&apos;s see if it can
            handle edge cases. ReAIty Check started as a reaction to the current
            AI hype: claims of inevitable dominance, agent-driven development
            replacing engineers, and the idea that competence is optional. This
            project tests that belief against reality.
          </p>

          <h2 className="mt-10 font-display text-2xl font-bold text-white">
            How the site works
          </h2>
          <p className="mt-3 text-gray-400 leading-relaxed">
            The site runs the same non-trivial prompts across popular models and
            agents, then tracks results over time. You can:
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-gray-400">
            <li>
              <strong className="text-gray-300">Home</strong> — See live
              leaderboard, comparison grid, and last run time. Quick view of
              which models pass or fail which challenges.
            </li>
            <li>
              <strong className="text-gray-300">Models</strong> — Browse
              providers and model cards; drill into per-model results.
            </li>
            <li>
              <strong className="text-gray-300">Challenges</strong> — Catalog
              of prompt gauntlets sorted by kill rate. Each challenge has a
              prompt, expected result, and explanation of the trick.
            </li>
            <li>
              <strong className="text-gray-300">Benchmarks</strong> — Full
              failure-rate matrix: every challenge × every model. Updated as
              runs complete.
            </li>
            <li>
              <strong className="text-gray-300">Submit Challenge</strong> —
              Propose your own edge case. If it breaks major models, we add it to
              the gauntlet and credit you.
            </li>
          </ul>
          <p className="mt-4 text-gray-400 leading-relaxed">
            Results are driven by automated test runs. The
            leaderboard and grids reflect the latest pass/fail state and kill
            rates.
          </p>

          <h2 className="mt-10 font-display text-2xl font-bold text-white">
            Methodology
          </h2>
          <p className="mt-3 text-gray-400 leading-relaxed">
            We run the same prompts across many models and track which ones pass
            or fail. We focus on <strong className="text-gray-300">edge cases</strong>{" "}
            and meme-style problems (Strawberry Problem, Alice&apos;s Brother,
            fabricated citations, etc.) — not academic benchmarks. The goal is
            to surface failures that benchmark averages hide.
          </p>

          <h2 className="mt-10 font-display text-2xl font-bold text-white">
            Tracking AI &quot;dominance&quot;
          </h2>
          <p className="mt-3 text-gray-400 leading-relaxed">
            The site helps you see where models break. Progress is simple: we
            track until agents can solve simple edge-case problems at least as
            reliably as humans. When that happens, we&apos;ll know. Until then,
            the data is here — no fluff, no hype. This is not a scientific
            benchmark or a definitive ranking, and it&apos;s not an anti-AI
            statement. AI agents are powerful tools that can increase
            productivity; they don&apos;t replace competence. Before trusting
            them with architecture, decisions, or jobs, ReAIty Check lets you
            see how they behave on simple, tricky problems.
          </p>

          <h2 className="mt-10 font-display text-2xl font-bold text-white">
            Support this project
          </h2>
          <p className="mt-3 text-gray-400 leading-relaxed">
            ReAIity Check is free and the code is public.
          </p>
          <p className="mt-3 text-gray-400 leading-relaxed">
            But someone still has to pay the API bills ☕
          </p>
          <p className="mt-3 text-gray-400 leading-relaxed">
            Your support keeps the daily tests running.
          </p>
          <p className="mt-3 text-gray-400 leading-relaxed">
            If you find this useful —{" "}
            <a
              href="https://buymeacoffee.com/vksvjtzg2f"
              target="_blank"
              rel="noreferrer"
              className="text-accent-orange hover:text-accent-red transition-colors font-medium"
            >
              ☕ buy me a coffee
            </a>
            .
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full bg-linear-to-r from-accent-red to-accent-orange px-6 py-3 text-sm font-semibold text-dark-50 transition-all hover:shadow-glow"
            >
              Home
            </Link>
            <Link
              href="/challenges"
              className="rounded-full border border-dark-200 px-6 py-3 text-sm font-semibold text-gray-300 transition-colors hover:border-accent-red/50 hover:text-white"
            >
              Challenges
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
