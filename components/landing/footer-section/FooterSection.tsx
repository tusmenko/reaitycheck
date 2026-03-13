export const FooterSection = () => {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "0.0.0";

  return (
    <footer className="
      border-t-4 border-black bg-card
      dark:border-foreground
    ">
      <div className="
        flex flex-row items-center justify-between gap-4 px-6 py-8 font-mono
        text-sm text-muted-foreground uppercase
        sm:justify-between
      ">
        <p>© 2026 ReAIty Check v{version} by Eugene Tusmenko</p>
      </div>
    </footer>
  );
};
