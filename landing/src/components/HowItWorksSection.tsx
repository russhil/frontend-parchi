import { motion } from "framer-motion";
import { MessageCircle, BotMessageSquare, Stethoscope, Sparkles } from "lucide-react";

const steps = [{
  icon: MessageCircle,
  step: "01",
  title: "Patient Intake on Whatsapp",
  description: "Patients share symptoms and upload past records before the visit.",
  color: "from-green-400 to-emerald-500",
}, {
  icon: BotMessageSquare,
  step: "02",
  title: "AI Processes & Records",
  description: "History, reports, and past visits are organized into a clean clinical summary.",
  color: "from-blue-400 to-cyan-500",
}, {
  icon: Stethoscope,
  step: "03",
  title: "Doctor Starts Prepared",
  description: "Before the consult, the doctor sees context, not chaos.",
  color: "from-purple-400 to-pink-500",
}];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="relative py-12">
      <div className="section-glow left-1/2 top-0 -translate-x-1/2" />

      {/* Subtle sparkles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`hw-spark-${i}`}
          animate={{ opacity: [0, 0.5, 0], rotate: [0, 180, 360], y: [-5, -25, -5] }}
          transition={{ duration: 5 + i * 2, repeat: Infinity, delay: i * 1.5 }}
          className="absolute hidden md:block pointer-events-none"
          style={{ left: `${25 + i * 25}%`, top: `${20 + i * 15}%` }}
        >
          <Sparkles size={10 + i * 3} className="text-primary/15" />
        </motion.div>
      ))}

      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="text-sm font-medium uppercase tracking-widest text-primary"
          >
            How It Works
          </motion.span>
          <h2 className="font-display mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Simple. Seamless. Smart.
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.step} className="relative">
              {/* Flow connector between cards */}
              {i < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center z-10 pointer-events-none">
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.3 + 0.8, duration: 0.6 }}
                    className="w-8 h-[2px] origin-left"
                    style={{ background: "linear-gradient(90deg, hsl(210 100% 56% / 0.5), hsl(210 100% 56% / 0.1))" }}
                  />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    className="w-2 h-2 rounded-full bg-primary/50 -ml-1"
                  />
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6, type: "spring", bounce: 0.3 }}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                  boxShadow: "0 0 50px -12px hsl(210 100% 56% / 0.35)",
                }}
                className="glass-card relative rounded-2xl p-8 text-center transition-all duration-500 hover:glass-card-hover group cursor-pointer overflow-hidden"
              >
                {/* Animated background glow */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl pointer-events-none"
                  style={{ background: "radial-gradient(circle at 50% 20%, hsl(210 100% 56% / 0.08) 0%, transparent 60%)" }}
                />

                {/* Pulsing corner accent */}
                <motion.div
                  animate={{ opacity: [0.05, 0.15, 0.05], scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, hsl(210 100% 56% / 0.15) 0%, transparent 70%)" }}
                />

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="mx-auto mb-6 relative w-20 h-20 flex items-center justify-center"
                >
                  {/* Glow ring */}
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.05, 0.2, 0.05] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: "radial-gradient(circle, hsl(210 100% 56% / 0.2) 0%, transparent 70%)", transform: "scale(1.8)" }}
                  />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-500 group-hover:shadow-[0_0_30px_-6px_hsl(210_100%_56%/0.4)]">
                    <s.icon size={32} className="text-primary" />
                  </div>
                </motion.div>
                <motion.span
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="font-display text-sm font-bold text-primary"
                >
                  Step {s.step}
                </motion.span>
                <h3 className="font-display mt-2 text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {s.title}
                </h3>
                <p className="mt-3 text-xs text-muted-foreground">
                  {s.description}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;