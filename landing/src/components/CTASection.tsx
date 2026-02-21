import { motion } from "framer-motion";
import { ArrowRight, Sparkles, LogIn } from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "";

const CTASection = () => {
  const loginUrl = APP_URL ? `${APP_URL}/login` : "/login";

  return (
    <section id="contact" className="relative py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card relative overflow-hidden rounded-3xl p-12 text-center sm:p-20"
        >
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-accent/5 blur-3xl" />

          {/* Extra animated glow */}
          <motion.div
            animate={{ opacity: [0.03, 0.1, 0.03], scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute left-1/4 top-1/3 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, hsl(190 100% 50% / 0.1) 0%, transparent 70%)" }}
          />

          {/* Floating sparkles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0, 0.7, 0],
                y: [20, -40, 20],
                x: [0, (i % 2 ? 15 : -15), 0],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
              className="absolute pointer-events-none"
              style={{ left: `${8 + i * 12}%`, top: `${15 + (i % 3) * 25}%` }}
            >
              <Sparkles size={8 + i * 2} className="text-primary/20" />
            </motion.div>
          ))}

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display relative text-3xl font-bold text-foreground sm:text-5xl"
          >
            Ready to Transform
            <br />
            <motion.span
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                backgroundSize: "200% 200%",
                backgroundImage: "linear-gradient(135deg, hsl(210 100% 65%), hsl(190 100% 60%), hsl(230 100% 70%), hsl(210 100% 65%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Your Clinic?
            </motion.span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative mx-auto mt-6 max-w-lg text-muted-foreground"
          >
            We're currently working with our first clinic partner and have already
            handled over 50 bookings. Be among the first to join.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.a
              href={loginUrl}
              whileHover={{ scale: 1.05, boxShadow: "0 0 50px -8px hsl(210 100% 56% / 0.6)", y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all overflow-hidden"
            >
              {/* Shimmer */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none"
              />
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <LogIn size={18} />
              </motion.div>
              Login to Dashboard
              <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight size={18} />
              </motion.div>
            </motion.a>
            <motion.a
              href="mailto:russhil@parchi.ai"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px -8px hsl(210 100% 56% / 0.3)", y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="glass-card rounded-xl px-8 py-4 font-semibold text-secondary-foreground transition-all hover:glass-card-hover"
            >
              Contact Us
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
