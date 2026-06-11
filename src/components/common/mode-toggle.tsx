import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "./Icons";
import { m, AnimatePresence } from "framer-motion";
import { useHydrated } from "@/hooks/useHydrated";

const ModeToggle = () => {
  const hydrated = useHydrated();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!hydrated) return <button className="h-8 w-14" />;

  return (
    <button
      onClick={toggleTheme}
      className="border-border/80 bg-background/50 hover:border-primary/50 focus-visible:ring-primary relative flex h-9 w-16 items-center rounded-full border-2 shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
      aria-label="Toggle dark mode"
    >
      {/* Background Track Icons */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-1.5 opacity-50">
        <MoonIcon className="h-4 w-4" />
        <SunIcon className="h-4 w-4" />
      </div>

      {/* Sliding Toggle Thumb */}
      <m.div
        className="bg-primary text-primary-foreground absolute flex h-7 w-7 items-center justify-center rounded-full shadow-md"
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
            <m.div
              key="moon"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.15 }}
            >
              <MoonIcon className="h-3.5 w-3.5" />
            </m.div>
          ) : (
            <m.div
              key="sun"
              initial={{ opacity: 0, rotate: 45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -45 }}
              transition={{ duration: 0.15 }}
            >
              <SunIcon className="h-4 w-4" />
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </button>
  );
};

export default ModeToggle;
