import { motion } from "framer-motion";
import { CalendarCheck, Mic, Brain, Search, ArrowRight, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight: string;
  color: string;
}[] = [{
  icon: CalendarCheck,
  title: "Automated Bookings",
  description: "AI handles scheduling, rescheduling, and cancellations over WhatsApp - zero manual work for your front desk.",
  highlight: "Zero manual effort",
  color: "from-blue-500 to-cyan-400",
}, {
  icon: Search,
  title: "Smart Patient Search",
  description: 'Find any patient in seconds with natural queries like "migraine patient with elevated CRP".',
  highlight: "Natural language queries",
  color: "from-purple-500 to-pink-400",
}, {
  icon: Mic,
  title: "Voice & Text AI",
  description: "Doctors interact via voice or text. Parchi listens, understands, and responds with clinical-grade accuracy.",
  highlight: "Clinical-grade accuracy",
  color: "from-emerald-500 to-teal-400",
}, {
  icon: Brain,
  title: "AI Diagnosis & Summary",
  description: "Every visit starts with a complete AI-generated case summary and differential diagnoses - before the patient enters the room.",
  highlight: "Pre-visit intel",
  color: "from-amber-500 to-orange-400",
}];

// Animated SVG flow line between cards
const FlowLine = ({ index }: { index: number }) => (
  <div className="hidden lg:flex items-center justify-center absolute -right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none w-12">
    <svg width="48" height="24" viewBox="0 0 48 24" fill="none" className="overflow-visible">
      <motion.path
        d="M0 12 C12 12, 12 4, 24 4 S36 12, 48 12"
        stroke="url(#flow-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: index * 0.3 + 0.5 }}
      />
      <motion.circle
        cx="48" cy="12" r="3"
        fill="hsl(210 100% 56%)"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.3 + 1.2, type: "spring", bounce: 0.6 }}
      />
      <motion.circle
        cx="48" cy="12" r="3"
        fill="hsl(210 100% 56%)"
        animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
      />
      <defs>
        <linearGradient id="flow-gradient" x1="0" y1="12" x2="48" y2="12">
          <stop stopColor="hsl(210 100% 56% / 0.5)" />
          <stop offset="1" stopColor="hsl(190 100% 50% / 0.3)" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const FeatureCard = ({ f, i }: { f: typeof features[0]; i: number }) => (
  <div className="relative">
    {i < features.length - 1 && <FlowLine index={i} />}
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.15, duration: 0.6, type: "spring", bounce: 0.3 }}
      whileHover={{
        y: -12,
        scale: 1.04,
        boxShadow: "0 0 60px -12px hsl(210 100% 56% / 0.4)",
      }}
      className="glass-card group rounded-2xl p-8 text-center transition-all duration-500 cursor-pointer h-full flex flex-col items-center relative overflow-hidden"
    >
      {/* Animated background gradient on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, hsl(210 100% 56% / 0.1) 0%, transparent 60%)`,
        }}
      />

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 0 1px hsl(210 100% 56% / 0.2)",
        }}
      />

      {/* Corner accent */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
        className="absolute -top-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, hsl(210 100% 56% / 0.06) 0%, transparent 70%)` }}
      />

      {/* Step number */}
      <motion.span
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
        className="absolute top-4 right-5 text-[10px] font-bold text-primary/40 tracking-widest font-display"
      >
        0{i + 1}
      </motion.span>

      {/* Icon container */}
      <motion.div
        whileHover={{ rotate: 360, scale: 1.2 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="mb-6 relative"
      >
        {/* Glow ring behind icon */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
          className="absolute inset-0 rounded-2xl"
          style={{ background: `radial-gradient(circle, hsl(210 100% 56% / 0.2) 0%, transparent 70%)`, transform: "scale(1.5)" }}
        />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_40px_-6px_hsl(210_100%_56%/0.6)] group-hover:scale-110">
          <f.icon size={28} />
        </div>
      </motion.div>

      <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{f.title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground flex-1 group-hover:text-muted-foreground/80 transition-colors duration-300">{f.description}</p>

      {/* Highlight badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.15 + 0.4, type: "spring" }}
        className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 group-hover:border-primary/40 group-hover:bg-primary/10 transition-all duration-300"
      >
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          className="h-1.5 w-1.5 rounded-full bg-primary"
        />
        <span className="text-[10px] font-medium text-primary">{f.highlight}</span>
      </motion.div>

      {/* Hover arrow indicator */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2"
      >
        <ArrowRight size={14} className="text-primary mx-auto" />
      </motion.div>
    </motion.div>
  </div>
);

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-12">
      <div className="section-glow left-0 top-1/4 -translate-x-1/2" />
      <div className="section-glow right-0 bottom-1/4 translate-x-1/2" />

      {/* Subtle sparkles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`spark-${i}`}
          animate={{ opacity: [0, 0.6, 0], y: [-10, -30, -10], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 1.2 }}
          className="absolute hidden md:block pointer-events-none"
          style={{ left: `${20 + i * 20}%`, top: `${30 + (i % 2) * 30}%` }}
        >
          <Sparkles size={12 + i * 2} className="text-primary/20" />
        </motion.div>
      ))}

      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="text-sm font-medium uppercase tracking-widest text-primary"
          >
            Features
          </motion.span>
          <h2 className="font-display mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Everything Your Clinic Needs
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">
            From booking to bedside — Parchi automates the entire pre-consultation workflow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((f, i) => (
            <FeatureCard key={f.title} f={f} i={i} />
          ))}
        </div>

        {/* Bottom flow pulse (mobile) */}
        <div className="flex lg:hidden justify-center mt-8">
          <motion.div
            animate={{ scaleX: [0.8, 1.2, 0.8], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="h-0.5 w-2/3 rounded-full bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;