import Link from "next/link";

export const metadata = {
  title: "Challenge submission rules",
  description:
    "Rules and guidelines for submitting a challenge to ReAIty Check. " +
    "Content you must not submit, quality bar, and how we use submissions.",
};

export default function SubmitChallengeRulesPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <main className="
        relative min-h-screen px-6 pt-8 pb-16
        lg:px-12
      ">
        <article className="
          relative z-10 mx-auto max-w-3xl border-4 border-black bg-card p-10
          shadow-brutalist
          lg:p-14
          dark:border-foreground dark:shadow-[8px_8px_0px_#f5f5f0]
        ">
          <span className="
            inline-block -rotate-1 border-4 border-black bg-neon-purple px-3
            py-1 text-xs font-bold tracking-wide text-white uppercase
            shadow-[3px_3px_0px_#000]
            dark:border-foreground
          ">
            Submission rules
          </span>
          <h1 className="
            mt-4 font-display text-4xl font-bold text-foreground uppercase
            lg:text-5xl
          ">
            Challenge submission rules
          </h1>
          <p className="
            mt-4 font-mono text-base text-muted-foreground
            lg:text-lg
          ">
            By submitting a challenge you agree to the following.
            Please read before submitting.
          </p>

          <section className="mt-8 space-y-6">
            <h2 className="text-lg font-bold text-foreground uppercase">
              Content you must not submit
            </h2>
            <ul className="list-inside list-disc space-y-2 text-foreground/80">
              <li>
                <strong className="text-foreground">
                  Personal data
                </strong>{" "}
                (yours or others): real names, emails, addresses,
                identifiers, and similar.
              </li>
              <li>
                <strong className="text-foreground">
                  Confidential or sensitive information
                </strong>
                : secrets, credentials, proprietary data, health or
                financial details.
              </li>
              <li>
                <strong className="text-foreground">
                  Content that violates laws or third-party terms
                </strong>
                : e.g.{" "}
                <a
                  href="https://openrouter.ai/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    font-bold text-neon-pink underline
                    hover:text-neon-orange
                  "
                >
                  OpenRouter
                </a>{" "}
                and model-provider acceptable use (no illegal content,
                abuse, deception, harassment, or similar). You are
                responsible for complying with those services&apos; terms.
              </li>
              <li>
                <strong className="text-foreground">
                  Anything you do not have the right to share.
                </strong>
              </li>
            </ul>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-lg font-bold text-foreground uppercase">
              Expectations for your challenge
            </h2>
            <ul className="list-inside list-disc space-y-2 text-foreground/80">
              <li>
                <strong className="text-foreground">
                  Self-contained
                </strong>{" "}
                — The prompt is sent as a single user message with no
                prior context. It must not rely on previous turns,
                uploaded files, or information only you have. Everything
                needed to answer should be in the prompt.
              </li>
              <li>
                <strong className="text-foreground">
                  Clear pass/fail
                </strong>{" "}
                — The expected result should be specific enough that we
                can tell whether the model passed. Vague or subjective
                criteria are hard to evaluate consistently across models.
              </li>
              <li>
                <strong className="text-foreground">
                  Non-trivial
                </strong>{" "}
                — Challenges are meant to surface interesting failures
                or edge cases. Trivial prompts that almost every model
                gets right add little value to the ladder.
              </li>
              <li>
                <strong className="text-foreground">
                  One main task
                </strong>{" "}
                — Focus on a single, well-defined task per prompt so
                evaluation is unambiguous and the &quot;trick&quot; is
                clear.
              </li>
              <li>
                <strong className="text-foreground">
                  Honest trick
                </strong>{" "}
                — The trick description should accurately describe what
                makes the prompt tricky (e.g. tokenization,
                perspective-taking, instruction overload). It helps
                curators and users understand the challenge.
              </li>
              <li>
                <strong className="text-foreground">
                  No prompt injection / jailbreaks
                </strong>{" "}
                — Do not design prompts that ask the model to ignore
                instructions, reveal system prompts, or bypass safety in
                ways that violate provider terms. That is already
                disallowed under &quot;Content that violates laws or
                third-party terms&quot;; this clarifies it for prompt
                design.
              </li>
              <li>
                <strong className="text-foreground">
                  Length limits
                </strong>{" "}
                — The prompt, expected result, and trick description are
                each limited to 500 characters. We keep limits short to
                avoid abuse of very long messages, keep evaluation fair
                and cheap, and encourage focused challenges. Stay within
                the limits shown on the submission form.
              </li>
              <li>
                <strong className="text-foreground">
                  Language
                </strong>{" "}
                — Prompts are typically evaluated in the language they
                are written in (e.g. English). Other languages may be
                supported but evaluation consistency may vary.
              </li>
            </ul>
          </section>

          <section className="mt-8 space-y-4">
            <h2 className="text-lg font-bold text-foreground uppercase">
              What we do with submissions
            </h2>
            <ul className="list-inside list-disc space-y-2 text-foreground/80">
              <li>
                Submissions may be{" "}
                <strong className="text-foreground">
                  run through external APIs
                </strong>{" "}
                (e.g.{" "}
                <a
                  href="https://openrouter.ai/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    font-bold text-neon-pink underline
                    hover:text-neon-orange
                  "
                >
                  OpenRouter
                </a>
                ) for evaluation. You are responsible for ensuring your
                content complies with those services&apos; terms.
              </li>
              <li>
                We may{" "}
                <strong className="text-foreground">
                  reject or remove
                </strong>{" "}
                any submission at our discretion (e.g. if it fails
                checks, violates these rules, or for operational
                reasons).
              </li>
              <li>
                There is{" "}
                <strong className="text-foreground">
                  no guarantee
                </strong>{" "}
                that a submission will be added to the challenge ladder.
              </li>
            </ul>
          </section>

          <section className="mt-8 space-y-2">
            <h2 className="text-lg font-bold text-foreground uppercase">
              License you grant
            </h2>
            <p className="text-foreground/80">
              By submitting, you grant ReAIty Check a{" "}
              <strong className="text-foreground">
                non-exclusive, royalty-free license
              </strong>{" "}
              to use, store, reproduce, and process your submission
              (prompt, expected result, trick description, and optional
              fields) to operate the service, including: sending it to
              third-party APIs (e.g.{" "}
              <a
                href="https://openrouter.ai/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  font-bold text-neon-pink underline
                  hover:text-neon-orange
                "
              >
                OpenRouter
              </a>
              ) for evaluation, running kill-rate checks, and, if
              accepted, displaying it in the challenge catalog (with
              optional credit to you). You agree that we may allow those
              providers (e.g. OpenRouter) to process your content as
              required by their terms.
            </p>
          </section>

          <section className="mt-8 space-y-2">
            <h2 className="text-lg font-bold text-foreground uppercase">
              Your responsibility
            </h2>
            <ul className="list-inside list-disc space-y-2 text-foreground/80">
              <li>
                You are at least{" "}
                <strong className="text-foreground">
                  13 years old
                </strong>
                ; if you are under 18, you have your parent or
                guardian&apos;s permission to submit.
              </li>
              <li>
                You are the{" "}
                <strong className="text-foreground">
                  creator or owner
                </strong>{" "}
                of the submission, or you have the{" "}
                <strong className="text-foreground">
                  necessary rights and consents
                </strong>{" "}
                to submit it and to grant the license above.
              </li>
              <li>
                Your submission does{" "}
                <strong className="text-foreground">
                  not infringe
                </strong>{" "}
                any third-party right (e.g. copyright, privacy) and
                does not cause ReAIty Check or its providers (e.g.
                OpenRouter) to{" "}
                <strong className="text-foreground">
                  violate any law
                </strong>
                .
              </li>
            </ul>
          </section>

          <p className="mt-10 font-mono text-sm text-muted-foreground italic">
            By submitting you agree to these rules.
          </p>

          <div className="mt-10">
            <Link
              href="/submit-challenge"
              className="
                border-4 border-black bg-card px-6 py-3 text-sm font-bold
                tracking-wider text-foreground uppercase shadow-brutalist-sm
                transition-all
                hover:translate-1 hover:shadow-none
                dark:border-foreground
              "
            >
              Back to Submit challenge
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
