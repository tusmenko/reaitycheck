"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Github } from "lucide-react";

const navLinks = [
  { href: "#models", label: "Models" },
  { href: "#challenges", label: "Challenges" },
  { href: "#test-runs", label: "Benchmarks" },
  { href: "#", label: "About" },
];

export function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-dark-200 bg-dark-50/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-red to-accent-orange text-white shadow-glow">
            <Image
              src="/icon.svg"
              alt=""
              width={24}
              height={24}
              className="invert"
            />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            RealityCheck
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-dark-500 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/tusmenko/reaitycheck"
            target="_blank"
            rel="noreferrer"
            className="text-dark-500 transition-colors hover:text-white"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <Link
            href="#"
            className="hidden items-center justify-center rounded-full bg-gradient-to-r from-accent-red to-accent-orange px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-all focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2 focus:ring-offset-dark-50 sm:inline-flex"
          >
            Submit Model
          </Link>
          <button
            type="button"
            className="text-dark-500 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
