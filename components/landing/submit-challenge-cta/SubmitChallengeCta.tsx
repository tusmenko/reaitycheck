import { Skull } from "lucide-react";
import Link from "next/link";

export const SubmitChallengeCta = () => {
  return (
    <div className="
      relative mt-16 border-4 border-black bg-neon-pink p-10 text-center
      shadow-brutalist
      lg:p-16 lg:text-left
      dark:border-foreground dark:shadow-[8px_8px_0px_#f5f5f0]
    ">
      <div className="
        relative z-10 flex flex-col items-center justify-between gap-10
        lg:flex-row
      ">
        <div className="max-w-xl">
          <h3 className="font-display text-3xl font-bold text-white uppercase">
            Have a tricky prompt?
          </h3>
          <p className="mt-4 mb-8 text-lg text-white/80">
            Submit your edge case. If it breaks major models, we add it to the
            gauntlet and credit the submission.
          </p>
          <Link
            href="/submit-challenge"
            className="
              inline-flex border-4 border-white bg-black px-8 py-3 font-bold
              tracking-wider text-white uppercase shadow-[4px_4px_0px_#fff]
              transition-all
              hover:translate-1 hover:shadow-none
            "
          >
            Submit Challenge
          </Link>
        </div>

        <div className="shrink-0">
          <div className="
            w-64 animate-float border-4 border-white bg-white/10 p-6
            shadow-[6px_6px_0px_#000] transition-transform duration-500
            hover:rotate-0 hover:paused
          ">
            <div className="mb-4 flex items-center gap-3">
              <div className="
                flex size-8 items-center justify-center border-2 border-white
                bg-white/20 text-white
              ">
                <Skull className="size-4" />
              </div>
              <div className="h-2 w-24 bg-white/30" />
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full bg-white/30" />
              <div className="h-2 w-3/4 bg-white/30" />
              <div className="h-2 w-5/6 bg-white/30" />
            </div>
            <div className="mt-6 border-4 border-white bg-black/30 p-3">
              <div className="
                flex items-center gap-2 text-xs font-bold text-white uppercase
              ">
                <Skull className="size-3.5" />
                Model Eliminated
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
