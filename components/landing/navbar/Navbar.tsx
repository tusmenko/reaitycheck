"use client";

import { Coffee, Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { MOBILE_NAV_LINKS } from "./Navbar.constants";
import { useNavbar } from "./useNavbar";

export const Navbar = () => {
  const { menuOpen, handleToggleMenu, handleCloseMenu } = useNavbar();

  return (
    <>
      <nav className="
        fixed inset-x-0 top-0 z-50 border-b-4 border-black bg-card
        dark:border-foreground dark:bg-card
      ">
        <div className="
          mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between
          px-6
          lg:px-12
        ">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-foreground uppercase">Re</span>
              <span className="
                mx-1 inline-block -rotate-6 border-4 border-black bg-neon-pink
                px-2 py-1 text-lg font-bold text-white shadow-[3px_3px_0px_#000]
                dark:border-foreground
              ">AI</span>
              <span className="text-2xl font-bold text-foreground uppercase">ty Check</span>
            </div>
          </Link>

          <div className="
            hidden items-center gap-8
            md:flex
          ">
            <Link
              href="/providers"
              className="
                text-sm font-bold tracking-wider text-foreground/70 uppercase
                transition-colors
                hover:text-foreground
              "
            >
              Models
            </Link>
            <Link
              href="/challenges"
              className="
                text-sm font-bold tracking-wider text-foreground/70 uppercase
                transition-colors
                hover:text-foreground
              "
            >
              Challenges
            </Link>
            <Link
              href="/benchmark"
              className="
                text-sm font-bold tracking-wider text-foreground/70 uppercase
                transition-colors
                hover:text-foreground
              "
            >
              Benchmarks
            </Link>
            <Link
              href="/about"
              className="
                text-sm font-bold tracking-wider text-foreground/70 uppercase
                transition-colors
                hover:text-foreground
              "
            >
              About
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/tusmenko/reaitycheck"
              target="_blank"
              rel="noreferrer"
              className="
                text-foreground/60 transition-colors
                hover:text-foreground
              "
            >
              <Github className="size-5" />
            </Link>
            <Link
              href="https://buymeacoffee.com/vksvjtzg2f"
              target="_blank"
              rel="noreferrer"
              className="
                text-foreground/60 transition-colors
                hover:text-neon-yellow
              "
              title="Support ReAIty Check via Buy Me a Coffee"
            >
              <Coffee className="size-5" />
            </Link>
            <Link
              href="/submit-challenge"
              className="
                hidden border-4 border-black bg-neon-pink px-5 py-2.5 text-sm
                font-bold tracking-wider text-white uppercase
                shadow-brutalist-sm transition-all
                hover:translate-1 hover:shadow-none
                sm:inline-flex
                dark:border-foreground dark:shadow-[4px_4px_0px_#f5f5f0]
              "
            >
              Submit Challenge
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="
                flex size-10 items-center justify-center border-2 border-black
                text-foreground/60 transition-colors
                hover:text-foreground
                md:hidden
                dark:border-foreground
              "
              onClick={handleToggleMenu}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="
            fixed inset-0 top-20 z-40 bg-black/50
            md:hidden
          "
          onClick={handleCloseMenu}
        />
      )}

      {/* Mobile menu panel */}
      <div
        className={`
          fixed inset-x-0 top-20 z-50 border-b-4 border-black bg-card p-6
          transition-all duration-200 ease-out
          md:hidden
          dark:border-foreground
          ${menuOpen
          ? "visible opacity-100"
          : "pointer-events-none invisible opacity-0"
          }
        `}
      >
        <div className="flex flex-col gap-1">
          {MOBILE_NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="
                border-2 border-transparent p-3 text-sm font-bold tracking-wider
                text-foreground/70 uppercase transition-colors
                hover:border-black hover:bg-muted hover:text-foreground
              "
              onClick={handleCloseMenu}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
