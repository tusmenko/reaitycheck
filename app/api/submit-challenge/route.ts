import { fetchMutation } from "convex/nextjs";
import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function getRemoteIp(request: Request): string | undefined {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return undefined;
}

export async function POST(request: Request) {
  const secret = process.env.TURNSTILE_SECRETKEY;
  const turnstileEnabled = Boolean(secret?.trim());

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const requiredFields = ["prompt", "expectedResult", "trickDescription"];
  if (turnstileEnabled) requiredFields.push("turnstileToken");

  if (
    !body ||
    typeof body !== "object" ||
    requiredFields.some((f) => !(f in body))
  ) {
    return NextResponse.json(
      {
        error: turnstileEnabled
          ? "Missing required fields: prompt, expectedResult, trickDescription, turnstileToken."
          : "Missing required fields: prompt, expectedResult, trickDescription.",
      },
      { status: 400 }
    );
  }

  const {
    prompt,
    expectedResult,
    trickDescription,
    modelFailureInsight,
    submitterName,
    submitterLink,
    turnstileToken,
  } = body as {
    prompt: string;
    expectedResult: string;
    trickDescription: string;
    modelFailureInsight?: string;
    submitterName?: string;
    submitterLink?: string;
    turnstileToken?: string;
  };

  if (turnstileEnabled) {
    if (typeof turnstileToken !== "string" || !turnstileToken.trim()) {
      return NextResponse.json(
        { error: "Verification is required. Please complete the challenge." },
        { status: 400 }
      );
    }

    const remoteip = getRemoteIp(request);
    const formData = new FormData();
    formData.append("secret", secret!);
    formData.append("response", turnstileToken.trim());
    if (remoteip) formData.append("remoteip", remoteip);

    let siteverifyRes: Response;
    try {
      siteverifyRes = await fetch(SITEVERIFY_URL, {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      console.error("Turnstile siteverify request failed:", err);
      return NextResponse.json(
        { error: "Verification failed. Please try again." },
        { status: 502 }
      );
    }

    let result: { success?: boolean; "error-codes"?: string[] };
    try {
      result = (await siteverifyRes.json()) as {
        success?: boolean;
        "error-codes"?: string[];
      };
    } catch {
      return NextResponse.json(
        { error: "Verification failed. Please try again." },
        { status: 502 }
      );
    }

    if (!result.success) {
      const codes = result["error-codes"] ?? [];
      if (
        codes.includes("timeout-or-duplicate") ||
        codes.includes("invalid-input-response")
      ) {
        return NextResponse.json(
          {
            error: "Verification expired or already used. Please complete the challenge again.",
            code: "turnstile_invalid",
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          error: "Verification failed. Please try again.",
          code: "turnstile_invalid",
        },
        { status: 400 }
      );
    }
  }

  try {
    await fetchMutation(api.mutations.submitChallenge, {
      prompt:
        typeof prompt === "string" ? prompt.trim() : "",
      expectedResult:
        typeof expectedResult === "string" ? expectedResult.trim() : "",
      trickDescription:
        typeof trickDescription === "string" ? trickDescription.trim() : "",
      modelFailureInsight:
        typeof modelFailureInsight === "string" && modelFailureInsight.trim()
          ? modelFailureInsight.trim()
          : undefined,
      submitterName:
        typeof submitterName === "string" && submitterName.trim()
          ? submitterName.trim()
          : undefined,
      submitterLink:
        typeof submitterLink === "string" && submitterLink.trim()
          ? submitterLink.trim()
          : undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Submission failed.";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
