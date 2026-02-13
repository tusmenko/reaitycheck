import Link from "next/link";
import { Github, Menu, Skull } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-dark-200 bg-dark-50/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-accent-red to-accent-orange text-white shadow-glow">
            <Skull className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            ReAItyCheck
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/#models"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            Models
          </Link>
          <Link
            href="/#challenges"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            Challenges
          </Link>
          <Link
            href="/benchmark"
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
          >
            Benchmarks
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/tusmenko/reaitycheck"
            target="_blank"
            rel="noreferrer"
            className="text-gray-400 transition-colors hover:text-white"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link
            href="/#challenges"
            className="hidden rounded-full bg-linear-to-r from-accent-red to-accent-orange px-5 py-2.5 text-sm font-medium text-dark-50 transition-all hover:shadow-glow sm:inline-flex"
          >
            Submit Challenge
          </Link>
          <button
            type="button"
            className="text-gray-400 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
