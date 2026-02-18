import { motion } from "framer-motion";
import { ArrowRight, Sparkles, LogIn } from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "";

const CTASection = () => {
  const loginUrl = APP_URL ? `${APP_URL}/login` : "/login";

  return (
    <section id="contact" className="relative py-32">
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

          {/* Floating sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0, 0.6, 0],
                y: [20, -30, 20],
                x: [0, (i % 2 ? 10 : -10), 0],
              }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
              className="absolute"
              style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 20}%` }}
            >
              <Sparkles size={10 + i * 2} className="text-primary/20" />
            </motion.div>
          ))}

          <h2 className="font-display relative text-3xl font-bold text-foreground sm:text-5xl">
            Ready to Transform
            <br />
            <span className="gradient-text">Your Clinic?</span>
          </h2>
          <p className="relative mx-auto mt-6 max-w-lg text-muted-foreground">
            We're currently working with our first clinic partner and have already
            handled over 50 bookings. Be among the first to join.
          </p>
          <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.a
              href={loginUrl}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px -8px hsl(210 100% 56% / 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all"
            >
              <LogIn size={18} />
              Login to Dashboard
              <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight size={18} />
              </motion.div>
            </motion.a>
            <motion.a
              href="mailto:russhil@parchi.ai"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-card rounded-xl px-8 py-4 font-semibold text-secondary-foreground transition-all hover:glass-card-hover"
            >
              Contact Us
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
