import { motion } from "framer-motion";
import { Linkedin, Sparkles } from "lucide-react";
import russhilPhoto from "@/assets/russhil.jpg";
import vanshPhoto from "@/assets/vansh.jpg";

const cofounders = [
  {
    name: "Russhil Chawla",
    role: "Co-Founder & CEO",
    bio: "IIM Bodhgaya sophomore with a passion for building AI-first products.",
    linkedin: "https://www.linkedin.com/in/rixx/",
    photo: russhilPhoto,
  },
  {
    name: "Vansh Sood",
    role: "Co-Founder & CEO",
    bio: "BITS Pilani grad driving the vision to automate clinic operations with AI-first thinking.",
    linkedin: "https://www.linkedin.com/in/vanshsback/",
    photo: vanshPhoto,
  },
];

const CofoundersSection = () => {
  return (
    <section id="team" className="relative py-16">
      <div className="section-glow right-0 top-1/2 translate-x-1/3 -translate-y-1/2" />

      {/* Floating sparkles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`co-spark-${i}`}
          animate={{ opacity: [0, 0.4, 0], y: [-8, -28, -8], rotate: [0, 180, 360] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, delay: i * 2 }}
          className="absolute hidden md:block pointer-events-none"
          style={{ left: `${30 + i * 20}%`, top: `${25 + i * 15}%` }}
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
            The Team
          </motion.span>
          <h2 className="font-display mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Meet the Cofounders
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            The people building the future of clinical AI.
          </p>
        </motion.div>

        <div className="mt-16 flex flex-col items-center justify-center gap-8 sm:flex-row">
          {cofounders.map((person, i) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6, type: "spring", bounce: 0.3 }}
              whileHover={{
                y: -10,
                scale: 1.03,
                boxShadow: "0 0 50px -12px hsl(210 100% 56% / 0.3)",
              }}
              className="glass-card group w-full max-w-sm rounded-2xl p-8 text-center transition-all duration-500 hover:glass-card-hover relative overflow-hidden"
            >
              {/* Background glow on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 30%, hsl(210 100% 56% / 0.06) 0%, transparent 60%)" }}
              />

              {/* Corner accent */}
              <motion.div
                animate={{ opacity: [0.05, 0.15, 0.05], scale: [1, 1.3, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 1.5 }}
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, hsl(210 100% 56% / 0.1) 0%, transparent 70%)" }}
              />

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mx-auto mb-6 relative w-24 h-24 flex items-center justify-center"
              >
                {/* Glow ring */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: "radial-gradient(circle, hsl(210 100% 56% / 0.15) 0%, transparent 60%)", transform: "scale(1.5)" }}
                />
                <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-accent/10 ring-2 ring-primary/20 transition-all duration-500 group-hover:ring-primary/50 group-hover:shadow-[0_0_40px_-8px_hsl(210_100%_56%/0.4)]">
                  <img src={person.photo} alt={person.name} className="h-full w-full object-cover" />
                </div>
              </motion.div>
              <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                {person.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-primary">{person.role}</p>
              <p className="mt-3 text-sm text-muted-foreground">{person.bio}</p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <motion.a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, boxShadow: "0 0 20px -4px hsl(210 100% 56% / 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <Linkedin size={18} />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CofoundersSection;
