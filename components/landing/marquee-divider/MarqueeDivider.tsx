const ITEMS = [
  " HOW MANY R's in 🍓",
  "A CUP WITH NO BOTTOM",
  "WHO ARE YOU TO TELL ME TO BE SILENT 🤫",
  "CAN'T COUNT THE BROTHERS 👨‍👧‍👧",
  "WRITE IT BACKWARDS I DARE YOU 🔄",
  "CITE ME A DOLPHIN PAPER 🐬",
  "SARCASM 🪧",
  "I ATE IT ALL🍪",
  "2 + 2 = 5 🧮"
];
const TEXT = ITEMS.join(" // ") + " // ";

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
