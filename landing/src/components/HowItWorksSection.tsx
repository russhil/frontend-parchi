import { motion } from "framer-motion";
import { PhoneCall, BotMessageSquare, Stethoscope } from "lucide-react";

const steps = [{
  icon: BotMessageSquare,
  step: "01",
  title: "Patient Texts @parchi_ai on Telegram",
  description: "Patients message our Telegram bot to share symptoms, upload past records, and get instant responses — all captured automatically."
}, {
  icon: BotMessageSquare,
  step: "02",
  title: "AI Processes & Records",
  description: "Patient data is captured, records are updated, and the admin dashboard reflects everything in real-time."
}, {
  icon: Stethoscope,
  step: "03",
  title: "Doctor Gets AI Insights",
  description: "Before the visit, doctors see AI-generated case summaries and differential diagnoses to save time."
}];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="relative py-[64px]">
      <div className="section-glow left-1/2 top-0 -translate-x-1/2" />

      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            How It Works
          </span>
          <h2 className="font-display mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Simple. Seamless. Smart.
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glass-card relative rounded-2xl p-8 text-center transition-all duration-300 hover:glass-card-hover group cursor-pointer"
            >
              {i < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden h-px w-8 bg-gradient-to-r from-primary/40 to-transparent md:block" />
              )}

              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors"
              >
                <s.icon size={32} className="text-primary" />
              </motion.div>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="font-display text-sm font-bold text-primary"
              >
                Step {s.step}
              </motion.span>
              <h3 className="font-display mt-2 text-xl font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="mt-3 text-xs text-muted-foreground">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;