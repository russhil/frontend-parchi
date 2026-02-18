import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import russhilPhoto from "@/assets/russhil.jpg";
import vanshPhoto from "@/assets/vansh.jpg";

const cofounders = [
  {
    name: "Russhil Chawla",
    role: "Co-Founder & CEO",
    bio: "IIM Bodhgaya grad with AI-driven thinking, on a mission to automate clinic operations.",
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
    <section id="team" className="relative py-32">
      <div className="section-glow right-0 top-1/2 translate-x-1/3 -translate-y-1/2" />

      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            The Team
          </span>
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="glass-card group w-full max-w-sm rounded-2xl p-8 text-center transition-all duration-300 hover:glass-card-hover"
            >
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-accent/10 ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 group-hover:shadow-[0_0_30px_-8px_hsl(210_100%_56%/0.3)]">
                <img src={person.photo} alt={person.name} className="h-full w-full object-cover" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                {person.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-primary">{person.role}</p>
              <p className="mt-3 text-sm text-muted-foreground">{person.bio}</p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">
                  <Linkedin size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CofoundersSection;
