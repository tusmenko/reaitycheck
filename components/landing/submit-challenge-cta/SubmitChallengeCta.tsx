import Link from "next/link";
import { Skull } from "lucide-react";

export const SubmitChallengeCta = () => {
  return (
    <div className="relative mt-16 rounded-3xl border border-dark-200 bg-linear-to-br from-dark-100 to-dark-50 p-10 text-center lg:p-16 lg:text-left">
      <div className="pattern-bg absolute inset-0 opacity-10" />
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent-red/20 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center justify-between gap-10 lg:flex-row">
        <div className="max-w-xl">
          <h3 className="font-display text-3xl font-bold text-white">
            Have a tricky prompt?
          </h3>
          <p className="mb-8 mt-4 text-lg text-gray-400">
            Submit your edge case. If it breaks major models, we add it to the
            gauntlet and credit the submission.
          </p>
          <Link
            href="/submit-challenge"
            className="inline-flex rounded-full bg-linear-to-r from-accent-red to-accent-orange px-8 py-3 font-bold text-white shadow-lg transition-all hover:shadow-glow"
          >
            Submit Challenge
          </Link>
        </div>

        <div className="shrink-0">
          <div className="w-64 rotate-3 rounded-2xl border border-dark-200 bg-dark-100/50 p-6 backdrop-blur-md transition-transform duration-500 hover:rotate-0">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-accent-red/50 bg-accent-red/30 text-accent-red">
                <Skull className="h-4 w-4" />
              </div>
              <div className="h-2 w-24 rounded-full bg-gray-700" />
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full rounded-full bg-gray-700" />
              <div className="h-2 w-3/4 rounded-full bg-gray-700" />
              <div className="h-2 w-5/6 rounded-full bg-gray-700" />
            </div>
            <div className="mt-6 rounded-lg border border-red-800 bg-red-900/30 p-3">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                <Skull className="h-3.5 w-3.5" />
                Model Eliminated
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
