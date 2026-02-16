import { useState } from "react";

export const useNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleMenu = () => setMenuOpen((prev) => !prev);
  const handleCloseMenu = () => setMenuOpen(false);

  return {
    menuOpen,
    handleToggleMenu,
    handleCloseMenu,
  };
};
