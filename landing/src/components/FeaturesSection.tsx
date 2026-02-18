import { motion } from "framer-motion";
import { CalendarCheck, Mic, Brain, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [{
  icon: CalendarCheck,
  title: "Automated Bookings",
  description: "AI handles scheduling, rescheduling, and cancellations automatically."
}, {
  icon: Search,
  title: "Smart Patient Search",
  description: 'Find any patient with natural queries like "migraine patient with elevated CRP".'
}, {
  icon: Mic,
  title: "Voice & Text AI",
  description: "Interact via voice calls or text chat with clinical-grade accuracy."
}, {
  icon: Brain,
  title: "AI Diagnosis & Summary",
  description: "AI-generated case summaries and differential diagnoses before every visit."
}];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-16">
      <div className="section-glow left-0 top-1/4 -translate-x-1/2" />

      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            Features
          </span>
          <h2 className="font-display mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Everything Your Clinic Needs
          </h2>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="glass-card group rounded-xl p-5 text-center transition-all duration-300 hover:glass-card-hover cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_24px_-4px_hsl(210_100%_56%/0.4)]"
              >
                <f.icon size={20} />
              </motion.div>
              <h3 className="font-display text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;