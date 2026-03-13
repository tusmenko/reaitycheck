"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  MAX_EXPECTED_RESULT,
  MAX_MODEL_FAILURE_INSIGHT,
  MAX_PROMPT,
  MAX_SUBMITTER_LINK,
  MAX_SUBMITTER_NAME,
  MAX_TRICK_DESCRIPTION,
} from "@/convex/challengeSubmissionLimits";

const inputClass =
  "w-full border-4 border-black bg-background px-4 py-3 " +
  "text-foreground placeholder:text-muted-foreground " +
  "focus:border-neon-blue focus:outline-none focus:ring-2 " +
  "focus:ring-neon-blue/20 dark:border-foreground " +
  "dark:focus:border-neon-blue";
const labelClass =
  "mb-1.5 block text-sm font-bold text-foreground uppercase";

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
      message: "Expected result must be at most " +
        `${MAX_EXPECTED_RESULT.toLocaleString()} characters.`,
    }),
  trickDescription: z
    .string()
    .trim()
    .min(1, { message: "Trick description is required." })
    .max(MAX_TRICK_DESCRIPTION, {
      message: "Trick description must be at most " +
        `${MAX_TRICK_DESCRIPTION.toLocaleString()} characters.`,
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
    <div className="relative min-h-screen bg-background">
      <main className="
        relative min-h-screen px-6 pt-8 pb-16
        lg:px-12
      ">
        <section className="
          relative z-10 mx-auto w-full max-w-4xl border-4 border-black bg-card
          p-10 shadow-brutalist
          lg:p-14
          dark:border-foreground dark:shadow-[8px_8px_0px_#f5f5f0]
        ">
          {submitted ? (
            <div className="flex flex-col items-center text-center">
              <span className="
                inline-block -rotate-1 border-4 border-black bg-neon-green px-3
                py-1 text-xs font-bold tracking-wide text-white uppercase
                shadow-[3px_3px_0px_#000]
                dark:border-foreground
              ">
                Thank you
              </span>
              <h1 className="
                mt-4 font-display text-4xl font-bold text-foreground uppercase
                lg:text-5xl
              ">
                Challenge submitted
              </h1>
              <p className="
                mt-4 max-w-2xl font-mono text-base text-muted-foreground
                lg:text-lg
              ">
                Your submission will be reviewed. If it passes our
                initial kill-rate check, we&apos;ll add it to the
                challenges ladder and you&apos;ll see it in the catalog.
              </p>
              <div className="
                mt-8 flex flex-col gap-3
                sm:flex-row
              ">
                <Link
                  href="/challenges"
                  className="
                    border-4 border-black bg-neon-blue px-6 py-3 text-sm
                    font-bold tracking-wider text-white uppercase
                    shadow-brutalist-sm transition-all
                    hover:translate-1 hover:shadow-none
                    dark:border-foreground
                  "
                >
                  Browse Challenges
                </Link>
                <Link
                  href="/"
                  className="
                    border-4 border-black bg-card px-6 py-3 text-sm font-bold
                    tracking-wider text-foreground uppercase shadow-brutalist-sm
                    transition-all
                    hover:translate-1 hover:shadow-none
                    dark:border-foreground
                  "
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          ) : (
            <>
              <span className="
                inline-block rotate-1 border-4 border-black bg-neon-purple px-3
                py-1 text-xs font-bold tracking-wide text-white uppercase
                shadow-[3px_3px_0px_#000]
                dark:border-foreground
              ">
                Submit a challenge
              </span>
              <h1 className="
                mt-4 font-display text-4xl font-bold text-foreground uppercase
                lg:text-5xl
              ">
                Have a tricky prompt?
              </h1>
              <p className="
                mt-2 max-w-2xl font-mono text-base text-muted-foreground
                lg:text-lg
              ">
                Submit your edge case. If it breaks major models, we
                add it to the gauntlet and credit the submission.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-8 flex flex-col gap-6"
              >
                <div>
                  <label htmlFor="prompt" className={labelClass}>
                    Prompt{" "}
                    <span className="text-muted-foreground">
                      (required)
                    </span>
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
                    <p className="mt-1 text-sm text-neon-pink">
                      {errors.prompt.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="expectedResult"
                    className={labelClass}
                  >
                    Expected result{" "}
                    <span className="text-muted-foreground">
                      (required)
                    </span>
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
                    <p className="mt-1 text-sm text-neon-pink">
                      {errors.expectedResult.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="trickDescription"
                    className={labelClass}
                  >
                    What&apos;s the trick?{" "}
                    <span className="text-muted-foreground">
                      (required)
                    </span>
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
                    <p className="mt-1 text-sm text-neon-pink">
                      {errors.trickDescription.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="modelFailureInsight"
                    className={labelClass}
                  >
                    What does it reveal about a model when it fails?{" "}
                    <span className="text-muted-foreground">
                      (optional)
                    </span>
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
                    <p className="mt-1 text-sm text-neon-pink">
                      {errors.modelFailureInsight.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="submitterName"
                    className={labelClass}
                  >
                    Your nickname {" "}
                    <span className="text-muted-foreground">
                      (optional)
                    </span>
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
                    <p className="mt-1 text-sm text-neon-pink">
                      {errors.submitterName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="submitterLink"
                    className={labelClass}
                  >
                    Link to show on your challenge{" "}
                    <span className="text-muted-foreground">
                      (optional)
                    </span>
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
                    <p className="mt-1 text-sm text-neon-pink">
                      {errors.submitterLink.message}
                    </p>
                  )}
                </div>
                <div className="flex items-start gap-3">
                  <input
                    id="rulesAccepted"
                    type="checkbox"
                    {...register("rulesAccepted")}
                    className="
                      mt-1 size-4 shrink-0 border-2 border-black bg-background
                      text-neon-blue
                      focus:ring-2 focus:ring-neon-blue/20 focus:ring-offset-0
                      dark:border-foreground
                    "
                  />
                  <label
                    htmlFor="rulesAccepted"
                    className="text-sm text-foreground"
                  >
                    I have read and agree to the{" "}
                    <Link
                      href="/submit-challenge/rules"
                      className="
                        font-bold text-neon-pink underline
                        hover:text-neon-orange
                      "
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Submission rules
                    </Link>{" "}
                    and the license I grant there. I will not submit
                    personal, confidential, or policy-violating content.
                  </label>
                </div>
                {errors.rulesAccepted && (
                  <p className="mt-1 text-sm text-neon-pink">
                    {errors.rulesAccepted.message}
                  </p>
                )}
                {submitError && (
                  <p className="
                    border-4 border-neon-pink bg-neon-pink/10 px-4 py-2 text-sm
                    text-neon-pink
                  ">
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
                    className="
                      cursor-pointer
                      disabled:cursor-not-allowed disabled:opacity-70
                    "
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
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
                  className="absolute right-6 bottom-6 z-0"
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
