import Image from "next/image";
import { Github } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="border-t border-dark-200 bg-dark-50 pb-8 pt-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-12 flex flex-col items-center justify-between md:flex-row">
          <div className="mb-6 flex items-center gap-2 md:mb-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-red to-accent-orange text-white">
              <Image
                src="/icon.svg"
                alt=""
                width={18}
                height={18}
                className="invert"
              />
            </div>
            <span className="text-lg font-bold text-white">RealityCheck</span>
          </div>
          <div className="flex gap-4 text-xs font-medium uppercase tracking-widest text-dark-500">
            <span>Verified Metrics</span>
            <span className="text-dark-300">|</span>
            <span>Open Methodology</span>
          </div>
        </div>

        <div className="flex flex-col border-t border-dark-200 pt-8 text-sm text-dark-500 md:flex-row md:items-center md:justify-between">
          <p>© 2024 RealityCheck AI. All rights reserved.</p>
          <div className="mt-4 flex gap-6 md:mt-0">
            <a
              href="#"
              className="hover:text-dark-700"
              aria-label="Twitter"
            >
              𝕏
            </a>
            <a
              href="https://github.com/tusmenko/reaitycheck"
              target="_blank"
              rel="noreferrer"
              className="hover:text-dark-700"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="hover:text-dark-700"
              aria-label="Discord"
            >
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
