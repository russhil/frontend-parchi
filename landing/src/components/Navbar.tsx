import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, LogIn } from "lucide-react";
import parchiLogo from "@/assets/parchi-logo.png";

// The app URL where the dashboard/login lives
// In production: https://app.parchi.ai or whatever your app subdomain is
// Falls back to /login for same-domain development
const APP_URL = import.meta.env.VITE_APP_URL || "";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const loginUrl = APP_URL ? `${APP_URL}/login` : "/login";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <a href="#" className="flex items-center gap-1">
          <img src={parchiLogo} alt="Parchi AI" className="h-16 w-auto" />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {["Features", "How It Works", "Team"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item}
            </a>
          ))}
          <motion.a
            href={loginUrl}
            whileHover={{ scale: 1.05, boxShadow: "0 0 24px -6px hsl(210 100% 56% / 0.4)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:shadow-[var(--shadow-glow)]"
          >
            <LogIn size={16} />
            Login
          </motion.a>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <a
            href={loginUrl}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-all"
          >
            <LogIn size={14} />
            Login
          </a>
          <button
            className="text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="absolute top-16 left-0 right-0 border-b border-border/50 bg-background/95 backdrop-blur-xl px-6 py-4 md:hidden shadow-lg"
        >
          {["Features", "How It Works", "Team"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="block py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </a>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
