import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "./Icons";
import { motion, AnimatePresence } from "framer-motion";
import { useHydrated } from "@/hooks/useHydrated";

const ModeToggle = () => {
  const hydrated = useHydrated();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!hydrated) return <button className="w-14 h-8" />;

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-9 w-16 items-center rounded-full border-2 border-border/80 bg-background/50 shadow-sm transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label="Toggle dark mode"
    >
      {/* Background Track Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none opacity-50">
        <MoonIcon className="h-4 w-4" />
        <SunIcon className="h-4 w-4" />
      </div>

      {/* Sliding Toggle Thumb */}
      <motion.div
        className="absolute flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
        initial={false}
        animate={{
          x: theme === "dark" ? "4px" : "28px",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {theme === "dark" ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.15 }}
            >
              <MoonIcon className="h-3.5 w-3.5" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: 45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -45 }}
              transition={{ duration: 0.15 }}
            >
              <SunIcon className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
};

export default ModeToggle;
