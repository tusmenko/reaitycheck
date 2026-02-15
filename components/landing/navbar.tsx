"use client";

import Link from "next/link";
import { Github, Menu, Skull, X } from "lucide-react";
import { useState } from "react";

const mobileNavLinks = [
  { href: "/providers", label: "Models" },
  { href: "/challenges", label: "Challenges" },
  { href: "/benchmark", label: "Benchmarks" },
  { href: "/submit-challenge", label: "Submit Challenge" },
] as const;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
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
              href="/providers"
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              Models
            </Link>
            <Link
              href="/challenges"
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
              href="/submit-challenge"
              className="hidden rounded-full bg-linear-to-r from-accent-red to-accent-orange px-5 py-2.5 text-sm font-medium text-dark-50 transition-all hover:shadow-glow sm:inline-flex"
            >
              Submit Challenge
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:text-white md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 top-20 z-40 bg-black/50 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile menu panel */}
      <div
        className={`fixed left-0 right-0 top-20 z-50 border-b border-dark-200 bg-dark-50 px-6 py-6 transition-all duration-200 ease-out md:hidden ${
          menuOpen
            ? "opacity-100 visible"
            : "pointer-events-none invisible opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1">
          {mobileNavLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-3 text-sm font-medium text-gray-400 transition-colors hover:bg-dark-200 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
