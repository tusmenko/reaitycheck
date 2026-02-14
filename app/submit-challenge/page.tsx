"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Turnstile } from "@marsidev/react-turnstile";
import {
  MAX_EXPECTED_RESULT,
  MAX_MODEL_FAILURE_INSIGHT,
  MAX_PROMPT,
  MAX_SUBMITTER_LINK,
  MAX_SUBMITTER_NAME,
  MAX_TRICK_DESCRIPTION,
} from "@/convex/challengeSubmissionLimits";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-dark-300 bg-dark-200 px-4 py-3 text-white placeholder:text-dark-500 focus:border-accent-red/50 focus:outline-none focus:ring-2 focus:ring-accent-red/20";
const labelClass = "mb-1.5 block text-sm font-medium text-gray-300";

function isValidHttpUrl(s: string): boolean {
  try {
    const url = new URL(s);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const challengeFormSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, { message: "Prompt is required." })
    .max(MAX_PROMPT, {
      message: `Prompt must be at most ${MAX_PROMPT.toLocaleString()} characters.`,
    }),
  expectedResult: z
    .string()
    .trim()
    .min(1, { message: "Expected result is required." })
    .max(MAX_EXPECTED_RESULT, {
      message: `Expected result must be at most ${MAX_EXPECTED_RESULT.toLocaleString()} characters.`,
    }),
  trickDescription: z
    .string()
    .trim()
    .min(1, { message: "Trick description is required." })
    .max(MAX_TRICK_DESCRIPTION, {
      message: `Trick description must be at most ${MAX_TRICK_DESCRIPTION.toLocaleString()} characters.`,
    }),
  modelFailureInsight: z
    .string()
    .trim()
    .max(MAX_MODEL_FAILURE_INSIGHT, {
      message: `At most ${MAX_MODEL_FAILURE_INSIGHT.toLocaleString()} characters.`,
    }),
  submitterName: z
    .string()
    .trim()
    .max(MAX_SUBMITTER_NAME, {
      message: `Name must be at most ${MAX_SUBMITTER_NAME} characters.`,
    }),
  submitterLink: z
    .string()
    .trim()
    .max(MAX_SUBMITTER_LINK, {
      message: `Link must be at most ${MAX_SUBMITTER_LINK.toLocaleString()} characters.`,
    })
    .refine((s) => s === "" || isValidHttpUrl(s), {
      message: "Link must be a valid http or https URL.",
    }),
  rulesAccepted: z
    .boolean()
    .refine((v) => v === true, {
      message: "You must agree to the submission rules.",
    }),
});

type ChallengeFormValues = z.infer<typeof challengeFormSchema>;

const defaultValues: ChallengeFormValues = {
  prompt: "",
  expectedResult: "",
  trickDescription: "",
  modelFailureInsight: "",
  submitterName: "",
  submitterLink: "",
  rulesAccepted: false,
};

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY ?? "";

export default function SubmitChallengePage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeFormSchema),
    mode: "onChange",
    defaultValues,
  });

  async function onSubmit(data: ChallengeFormValues) {
    setSubmitError(null);
    if (turnstileSiteKey && !turnstileToken) {
      setSubmitError("Please complete the verification challenge.");
      return;
    }
    try {
      const res = await fetch("/api/submit-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: data.prompt,
          expectedResult: data.expectedResult,
          trickDescription: data.trickDescription,
          modelFailureInsight: data.modelFailureInsight,
          submitterName: data.submitterName,
          submitterLink: data.submitterLink,
          ...(turnstileSiteKey && turnstileToken
            ? { turnstileToken }
            : {}),
        }),
      });
      const json = (await res.json()) as {
        success?: boolean;
        error?: string;
        code?: string;
      };
      if (!res.ok) {
        setSubmitError(json.error ?? "Submission failed. Please try again.");
        // Only reset Turnstile when the token was invalid/expired, not for rate limit or other errors
        if (res.status === 400 && json.code === "turnstile_invalid") {
          setTurnstileToken(null);
          setTurnstileKey((k) => k + 1);
        }
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Submission failed. Please try again.");
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <main className="relative min-h-screen overflow-hidden px-6 pb-16 pt-28 lg:px-12">
        <div className="absolute left-0 top-1/4 h-80 w-80 rounded-full bg-accent-red/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent-orange/10 blur-3xl" />

        <section className="relative z-10 mx-auto w-full max-w-4xl rounded-3xl border border-dark-200 bg-dark-100/80 p-10 shadow-sm backdrop-blur-sm lg:p-14">
          {submitted ? (
            <div className="flex flex-col items-center text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-red">
                Thank you
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold text-white lg:text-5xl">
                Challenge submitted
              </h1>
              <p className="mt-4 max-w-2xl text-base text-gray-400 lg:text-lg">
                Your submission will be reviewed. If it passes our initial
                kill-rate check, we&apos;ll add it to the challenges ladder and
                you&apos;ll see it in the catalog.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/challenges"
                  className="rounded-full bg-linear-to-r from-accent-red to-accent-orange px-6 py-3 text-sm font-semibold text-dark-50 transition-all hover:shadow-glow"
                >
                  Browse Challenges
                </Link>
                <Link
                  href="/"
                  className="rounded-full border border-dark-200 px-6 py-3 text-sm font-semibold text-gray-300 transition-colors hover:border-accent-red/50 hover:text-white"
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-red">
                Submit a challenge
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold text-white lg:text-5xl">
                Have a tricky prompt?
              </h1>
              <p className="mt-2 max-w-2xl text-base text-gray-400 lg:text-lg">
                Submit your edge case. If it breaks major models, we add it to
                the gauntlet and credit the submission.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-8 flex flex-col gap-6"
              >
                <div>
                  <label htmlFor="prompt" className={labelClass}>
                    Prompt <span className="text-gray-500">(required)</span>
                  </label>
                  <textarea
                    id="prompt"
                    {...register("prompt")}
                    className={inputClass}
                    rows={4}
                    maxLength={MAX_PROMPT}
                    placeholder="The prompt or instruction you want to test…"
                  />
                  {errors.prompt && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.prompt.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="expectedResult" className={labelClass}>
                    Expected result{" "}
                    <span className="text-gray-500">(required)</span>
                  </label>
                  <textarea
                    id="expectedResult"
                    {...register("expectedResult")}
                    className={inputClass}
                    rows={3}
                    maxLength={MAX_EXPECTED_RESULT}
                    placeholder="What the model should answer or do when it gets it right?"
                  />
                  {errors.expectedResult && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.expectedResult.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="trickDescription" className={labelClass}>
                    What&apos;s the trick?{" "}
                    <span className="text-gray-500">(required)</span>
                  </label>
                  <textarea
                    id="trickDescription"
                    {...register("trickDescription")}
                    className={inputClass}
                    rows={3}
                    maxLength={MAX_TRICK_DESCRIPTION}
                    placeholder="Describe what makes this prompt tricky or easy to get wrong."
                  />
                  {errors.trickDescription && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.trickDescription.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="modelFailureInsight" className={labelClass}>
                    What does it reveal about a model when it fails?{" "}
                    <span className="text-gray-500">(optional)</span>
                  </label>
                  <textarea
                    id="modelFailureInsight"
                    {...register("modelFailureInsight")}
                    className={inputClass}
                    rows={2}
                    maxLength={MAX_MODEL_FAILURE_INSIGHT}
                    placeholder="e.g. tendency to comply, lack of reasoning, etc."
                  />
                  {errors.modelFailureInsight && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.modelFailureInsight.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="submitterName" className={labelClass}>
                    Your nickname {" "}
                    <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    id="submitterName"
                    type="text"
                    {...register("submitterName")}
                    className={inputClass}
                    maxLength={MAX_SUBMITTER_NAME}
                    placeholder="How we can credit you"
                  />
                  {errors.submitterName && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.submitterName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="submitterLink" className={labelClass}>
                    Link to show on your challenge{" "}
                    <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    id="submitterLink"
                    type="url"
                    {...register("submitterLink")}
                    className={inputClass}
                    maxLength={MAX_SUBMITTER_LINK}
                    placeholder="e.g. https://…"
                  />
                  {errors.submitterLink && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.submitterLink.message}
                    </p>
                  )}
                </div>
                <div className="flex items-start gap-3">
                  <input
                    id="rulesAccepted"
                    type="checkbox"
                    {...register("rulesAccepted")}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-dark-300 bg-dark-200 text-accent-red focus:ring-2 focus:ring-accent-red/20 focus:ring-offset-0"
                  />
                  <label
                    htmlFor="rulesAccepted"
                    className="text-sm text-gray-300"
                  >
                    I have read and agree to the{" "}
                    <Link
                      href="/submit-challenge/rules"
                      className="font-medium text-accent-red underline hover:text-accent-orange"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Submission rules
                    </Link>{" "}
                    and the license I grant there. I will not submit personal,
                    confidential, or policy-violating content.
                  </label>
                </div>
                {errors.rulesAccepted && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.rulesAccepted.message}
                  </p>
                )}
                {submitError && (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                    {submitError}
                  </p>
                )}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !isValid ||
                      (!!turnstileSiteKey && !turnstileToken)
                    }
                    className="rounded-full bg-linear-to-r cursor-pointer from-accent-red to-accent-orange px-8 py-3 font-semibold text-dark-50 transition-all hover:shadow-glow disabled:opacity-70 disabled:cursor-not-allowed "
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      "Submit challenge"
                    )}
                  </Button>
                </div>
              </form>
              {turnstileSiteKey && (
                <div
                  className="absolute bottom-6 right-6 z-0"
                  aria-hidden
                >
                  <Turnstile
                    key={turnstileKey}
                    siteKey={turnstileSiteKey}
                    onSuccess={setTurnstileToken}
                    onExpire={() => setTurnstileToken(null)}
                    options={{ theme: "dark", size: "invisible" }}
                  />
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
