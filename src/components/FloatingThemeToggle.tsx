import { Moon, Sun, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";

export function FloatingThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  // Determine which icon to show based on current theme
  const getIcon = () => {
    if (theme === "system") {
      return <Monitor className="h-5 w-5" />;
    }
    if (theme === "dark") {
      return <Sun className="h-5 w-5" />;
    }
    return <Moon className="h-5 w-5" />;
  };

  const getLabel = () => {
    if (theme === "light") return "Switch to Dark";
    if (theme === "dark") return "Switch to System";
    return "Switch to Light";
  };

  return (
    <motion.button
      onClick={cycleTheme}
      className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-label={getLabel()}
      title={getLabel()}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {getIcon()}
      </motion.div>
    </motion.button>
  );
}
