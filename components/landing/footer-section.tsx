import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="border-t border-dark-200 bg-dark-50 pb-8 pt-16">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12">
        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-accent-red to-accent-orange text-sm font-bold text-white">
              RC
            </div>
            <span className="font-display text-lg font-bold text-white">
              RealityCheck
            </span>
          </div>

          <div className="flex gap-4 text-xs font-medium uppercase tracking-widest text-gray-500">
            <span>Verified Metrics</span>
            <span className="text-dark-300">|</span>
            <span>Open Methodology</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-dark-200 pt-8 text-sm text-gray-500 md:flex-row">
          <p>© 2026 RealityCheck AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="transition-colors hover:text-gray-300">
              <Twitter className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/tusmenko/reaitycheck"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-gray-300"
            >
              <Github className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
