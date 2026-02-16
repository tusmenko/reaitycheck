export const avatarGradientByRank = (rank: number) => {
  if (rank === 1) return "from-orange-400 to-red-500";
  if (rank === 2) return "from-purple-500 to-indigo-600";
  if (rank === 3) return "from-gray-600 to-gray-800";
  return "from-dark-300 to-dark-500";
};

export const rankIconColorByRank = (rank: number) => {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-gray-300";
  if (rank === 3) return "text-amber-600";
  return "text-white";
};
