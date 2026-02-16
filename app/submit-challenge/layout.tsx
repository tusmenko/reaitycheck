import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a challenge",
  description:
    "Submit a prompt gauntlet for our benchmark. We run it across popular " +
    "AI models and track failure rates.",
};

export default function SubmitChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
