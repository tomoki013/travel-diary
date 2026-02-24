import { useUI } from "@/context/UIContext";

export const useMobileMenu = () => {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUI();

  return {
    isMenuOpen: isMobileMenuOpen,
    toggleMenu: toggleMobileMenu,
    closeMenu: closeMobileMenu,
  };
};
