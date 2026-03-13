import Link from "next/link";

export const metadata = {
  title: "About",
  description:
    "Why ReAIty Check exists, how the site works, and how we track AI " +
    "limitations with edge-case challenges and live benchmarks.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <main className="
        relative min-h-screen px-6 pt-8 pb-16
        lg:px-12
      ">
        <article className="
          relative z-10 mx-auto w-full max-w-3xl border-4 border-black bg-card
          p-10 shadow-brutalist
          lg:p-14
          dark:border-foreground dark:shadow-[8px_8px_0px_#f5f5f0]
        ">
          <span className="
            inline-block -rotate-1 border-4 border-black bg-neon-pink px-3 py-1
            text-xs font-bold tracking-wide text-white uppercase
            shadow-[3px_3px_0px_#000]
            dark:border-foreground
          ">
            About
          </span>
          <h1 className="
            mt-4 font-display text-4xl font-bold text-foreground uppercase
            lg:text-5xl
          ">
            ReAIty Check
          </h1>
          <p className="mt-4 font-mono text-lg/relaxed text-muted-foreground">
            AI is coming for your job — but first, let&apos;s see if it
            can handle edge cases. ReAIty Check started as a reaction to
            the current AI hype: claims of inevitable dominance,
            agent-driven development replacing engineers, and the idea
            that competence is optional. This project tests that belief
            against reality.
          </p>

          <h2 className="
            mt-10 font-display text-2xl font-bold text-foreground uppercase
          ">
            How the site works
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The site runs the same non-trivial prompts across popular
            models and agents, then tracks results over time. You can:
          </p>
          <ul className="
            mt-3 list-inside list-disc space-y-1 text-muted-foreground
          ">
            <li>
              <strong className="text-foreground">Home</strong> — See
              live leaderboard, comparison grid, and last run time.
              Quick view of which models pass or fail which challenges.
            </li>
            <li>
              <strong className="text-foreground">Models</strong> —
              Browse providers and model cards; drill into per-model
              results.
            </li>
            <li>
              <strong className="text-foreground">Challenges</strong> —
              Catalog of prompt gauntlets sorted by kill rate. Each
              challenge has a prompt, expected result, and explanation of
              the trick.
            </li>
            <li>
              <strong className="text-foreground">Benchmarks</strong> —
              Full failure-rate matrix: every challenge × every model.
              Updated as runs complete.
            </li>
            <li>
              <strong className="text-foreground">
                Submit Challenge
              </strong> — Propose your own edge case. If it breaks major
              models, we add it to the gauntlet and credit you.
            </li>
          </ul>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Results are driven by automated test runs. The leaderboard
            and grids reflect the latest pass/fail state and kill rates.
          </p>

          <h2 className="
            mt-10 font-display text-2xl font-bold text-foreground uppercase
          ">
            Methodology
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            We run the same prompts across many models and track which
            ones pass or fail. We focus on{" "}
            <strong className="text-foreground">edge cases</strong> and
            meme-style problems (Strawberry Problem, Alice&apos;s
            Brother, fabricated citations, etc.) — not academic
            benchmarks. The goal is to surface failures that benchmark
            averages hide.
          </p>

          <h2 className="
            mt-10 font-display text-2xl font-bold text-foreground uppercase
          ">
            Tracking AI &quot;dominance&quot;
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The site helps you see where models break. Progress is
            simple: we track until agents can solve simple edge-case
            problems at least as reliably as humans. When that happens,
            we&apos;ll know. Until then, the data is here — no fluff,
            no hype. This is not a scientific benchmark or a definitive
            ranking, and it&apos;s not an anti-AI statement. AI agents
            are powerful tools that can increase productivity; they
            don&apos;t replace competence. Before trusting them with
            architecture, decisions, or jobs, ReAIty Check lets you see
            how they behave on simple, tricky problems.
          </p>

          <h2 className="
            mt-10 font-display text-2xl font-bold text-foreground uppercase
          ">
            Support this project
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            ReAIity Check is free and the code is public.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            But someone still has to pay the API bills ☕
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Your support keeps the daily tests running.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            If you find this useful —{" "}
            <a
              href="https://buymeacoffee.com/vksvjtzg2f"
              target="_blank"
              rel="noreferrer"
              className="
                font-bold text-neon-orange transition-colors
                hover:text-neon-pink
              "
            >
              ☕ buy me a coffee
            </a>
            .
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="
                border-4 border-black bg-neon-blue px-6 py-3 text-sm font-bold
                tracking-wider text-white uppercase shadow-brutalist-sm
                transition-all
                hover:translate-1 hover:shadow-none
                dark:border-foreground
              "
            >
              Home
            </Link>
            <Link
              href="/challenges"
              className="
                border-4 border-black bg-card px-6 py-3 text-sm font-bold
                tracking-wider text-foreground uppercase shadow-brutalist-sm
                transition-all
                hover:translate-1 hover:shadow-none
                dark:border-foreground
              "
            >
              Challenges
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
