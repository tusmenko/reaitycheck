export function FooterSection() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "0.0.0";

  return (
    <footer className=" border-dark-200 bg-background pb-8">
      <div className="flex flex-row items-center justify-between gap-4 border-t border-dark-200 px-6 pt-8 text-sm text-gray-500 sm:justify-between">
        <p>© 2026 ReAIityCheck v{version} by Eugene Tusmenko</p>
      </div>
    </footer>
  );
}
