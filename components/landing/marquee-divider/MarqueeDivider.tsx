const TEXT = "EDGE CASES // REAL FAILURES // NO FLUFF // COMMUNITY DRIVEN // ";

export const MarqueeDivider = () => {
  return (
    <div className="
      overflow-hidden border-y-4 border-black bg-neon-yellow
      dark:border-foreground
    ">
      <div className="flex animate-marquee py-2 whitespace-nowrap">
        {Array.from({ length: 4 }, (_, i) => (
          <span
            key={i}
            className="
              px-4 text-sm font-bold tracking-widest text-black uppercase
            "
          >
            {TEXT}
          </span>
        ))}
      </div>
    </div>
  );
};
