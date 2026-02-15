import Link from "next/link";
import { Github } from "lucide-react";

export function FooterSection() {
  return (
    <footer className=" border-dark-200 bg-background pb-8">
      <div className="flex flex-row flex-wrap items-center justify-between gap-4 border-t border-dark-200 px-6 pt-8 text-sm text-gray-500 sm:justify-between">
        <p>© 2026 ReAIityCheck by Eugene Tusmenko</p>
        <div className="flex items-center gap-6">
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
    </footer>
  );
}
