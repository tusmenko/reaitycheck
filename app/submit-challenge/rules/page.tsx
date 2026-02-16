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
        <div className="
          absolute top-1/4 left-0 h-80 w-80 rounded-full bg-accent-red/10
          blur-3xl
        " />
        <div className="
          absolute right-0 bottom-0 h-80 w-80 rounded-full bg-accent-orange/10
          blur-3xl
        " />

        <article className="
          relative z-10 mx-auto max-w-3xl rounded-3xl border border-dark-200
          bg-dark-100/80 p-10 shadow-sm backdrop-blur-sm
          lg:p-14
        ">
          <p className="
            text-sm font-semibold tracking-wide text-accent-red uppercase
          ">
            Submission rules
          </p>
          <h1 className="
            mt-3 font-display text-4xl font-bold text-white
            lg:text-5xl
          ">
            Challenge submission rules
          </h1>
          <p className="
            mt-4 text-base text-gray-400
            lg:text-lg
          ">
            By submitting a challenge you agree to the following. Please read
            before submitting.
          </p>

          <section className="mt-8 space-y-6">
            <h2 className="text-lg font-semibold text-white">
              Content you must not submit
            </h2>
            <ul className="list-inside list-disc space-y-2 text-gray-300">
              <li>
                <strong className="text-gray-200">Personal data</strong> (yours
                or others): real names, emails, addresses, identifiers, and
                similar.
              </li>
              <li>
                <strong className="text-gray-200">
                  Confidential or sensitive information
                </strong>
                : secrets, credentials, proprietary data, health or financial
                details.
              </li>
              <li>
                <strong className="text-gray-200">
                  Content that violates laws or third-party terms
                </strong>
                : e.g.{" "}
                <a
                  href="https://openrouter.ai/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    font-medium text-accent-red underline
                    hover:text-accent-orange
                  "
                >
                  OpenRouter
                </a>{" "}
                and model-provider acceptable use (no illegal content, abuse,
                deception, harassment, or similar). You are responsible for
                complying with those services’ terms.
              </li>
              <li>
                <strong className="text-gray-200">
                  Anything you do not have the right to share.
                </strong>
              </li>
            </ul>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-lg font-semibold text-white">
              Expectations for your challenge
            </h2>
            <ul className="list-inside list-disc space-y-2 text-gray-300">
              <li>
                <strong className="text-gray-200">Self-contained</strong> — The
                prompt is sent as a single user message with no prior context. It
                must not rely on previous turns, uploaded files, or information
                only you have. Everything needed to answer should be in the
                prompt.
              </li>
              <li>
                <strong className="text-gray-200">Clear pass/fail</strong> — The
                expected result should be specific enough that we can tell
                whether the model passed. Vague or subjective criteria are hard
                to evaluate consistently across models.
              </li>
              <li>
                <strong className="text-gray-200">Non-trivial</strong> —
                Challenges are meant to surface interesting failures or edge
                cases. Trivial prompts that almost every model gets right add
                little value to the ladder.
              </li>
              <li>
                <strong className="text-gray-200">One main task</strong> — Focus
                on a single, well-defined task per prompt so evaluation is
                unambiguous and the &quot;trick&quot; is clear.
              </li>
              <li>
                <strong className="text-gray-200">Honest trick</strong> — The
                trick description should accurately describe what makes the
                prompt tricky (e.g. tokenization, perspective-taking, instruction
                overload). It helps curators and users understand the challenge.
              </li>
              <li>
                <strong className="text-gray-200">
                  No prompt injection / jailbreaks
                </strong>{" "}
                — Do not design prompts that ask the model to ignore
                instructions, reveal system prompts, or bypass safety in ways
                that violate provider terms. That is already disallowed under
                &quot;Content that violates laws or third-party terms&quot;; this
                clarifies it for prompt design.
              </li>
              <li>
                <strong className="text-gray-200">Length limits</strong> — The
                prompt, expected result, and trick description are each limited
                to 500 characters. We keep limits short to avoid abuse of very
                long messages, keep evaluation fair and cheap, and encourage
                focused challenges. Stay within the limits shown on the
                submission form.
              </li>
              <li>
                <strong className="text-gray-200">Language</strong> — Prompts
                are typically evaluated in the language they are written in
                (e.g. English). Other languages may be supported but evaluation
                consistency may vary.
              </li>
            </ul>
          </section>

          <section className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold text-white">
              What we do with submissions
            </h2>
            <ul className="list-inside list-disc space-y-2 text-gray-300">
              <li>
                Submissions may be{" "}
                <strong className="text-gray-200">
                  run through external APIs
                </strong>{" "}
                (e.g.{" "}
                <a
                  href="https://openrouter.ai/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    font-medium text-accent-red underline
                    hover:text-accent-orange
                  "
                >
                  OpenRouter
                </a>
                ) for evaluation. You are responsible for ensuring your content
                complies with those services’ terms.
              </li>
              <li>
                We may{" "}
                <strong className="text-gray-200">reject or remove</strong> any
                submission at our discretion (e.g. if it fails checks, violates
                these rules, or for operational reasons).
              </li>
              <li>
                There is <strong className="text-gray-200">no guarantee</strong>{" "}
                that a submission will be added to the challenge ladder.
              </li>
            </ul>
          </section>

          <section className="mt-8 space-y-2">
            <h2 className="text-lg font-semibold text-white">
              License you grant
            </h2>
            <p className="text-gray-300">
              By submitting, you grant ReAIty Check a{" "}
              <strong className="text-gray-200">
                non-exclusive, royalty-free license
              </strong>{" "}
              to use, store, reproduce, and process your submission (prompt,
              expected result, trick description, and optional fields) to
              operate the service, including: sending it to third-party APIs
              (e.g.{" "}
              <a
                href="https://openrouter.ai/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  font-medium text-accent-red underline
                  hover:text-accent-orange
                "
              >
                OpenRouter
              </a>
              ) for evaluation, running kill-rate checks, and, if accepted,
              displaying it in the challenge catalog (with optional credit to you).
              You agree that we may allow those providers (e.g. OpenRouter) to
              process your content as required by their terms.
            </p>
          </section>

          <section className="mt-8 space-y-2">
            <h2 className="text-lg font-semibold text-white">
              Your responsibility
            </h2>
            <ul className="list-inside list-disc space-y-2 text-gray-300">
              <li>
                You are at least <strong className="text-gray-200">13 years old</strong>; if
                you are under 18, you have your parent or guardian’s permission to
                submit.
              </li>
              <li>
                You are the <strong className="text-gray-200">creator or owner</strong> of
                the submission, or you have the{" "}
                <strong className="text-gray-200">necessary rights and consents</strong> to
                submit it and to grant the license above.
              </li>
              <li>
                Your submission does <strong className="text-gray-200">not infringe</strong> any
                third-party right (e.g. copyright, privacy) and does not cause
                ReAIty Check or its providers (e.g. OpenRouter) to{" "}
                <strong className="text-gray-200">violate any law</strong>.
              </li>
            </ul>
          </section>

          <p className="mt-10 text-sm text-gray-500 italic">
            By submitting you agree to these rules.
          </p>

          <div className="mt-10">
            <Link
              href="/submit-challenge"
              className="
                rounded-full border border-dark-200 px-6 py-3 text-sm
                font-semibold text-gray-300 transition-colors
                hover:border-accent-red/50 hover:text-white
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
