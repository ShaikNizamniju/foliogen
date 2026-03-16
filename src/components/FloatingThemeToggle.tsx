import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { useLocation } from "react-router-dom";

export function FloatingThemeToggle() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  
  // Hide on dashboard as it's integrated into the header
  if (location.pathname.startsWith('/dashboard')) return null;

  // Check if currently dark (either explicit dark or system prefers dark)
  const isDark = theme === "dark" || 
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-[100] h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-label={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
      title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
    >
      <motion.div
        key={isDark ? "dark" : "light"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </motion.div>
    </motion.button>
  );
}
