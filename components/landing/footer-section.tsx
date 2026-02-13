import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";

export function FooterSection() {
  return (
    <footer className="py-8">
      <Separator className="mb-8" />
      <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p className="inline-flex items-center gap-2">
          <Image
            src="/icon.svg"
            alt=""
            width={20}
            height={20}
            className="h-5 w-5"
          />
          Ignore hype. Take a reAIity check.
        </p>
        <Link
          href="https://github.com/tusmenko/reaitycheck"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2"
        >
          <Image
            height="20"
            width="20"
            alt="GitHub"
            src="https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/github.svg"
          />
          GitHub
        </Link>
      </div>
    </footer>
  );
}
