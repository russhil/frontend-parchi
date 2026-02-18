import { motion } from "framer-motion";
import { Mic, MessageSquare, ArrowRight, CalendarCheck, TrendingUp, PenTool, Sparkles, LogIn } from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "";

const HeroSection = () => {
  const loginUrl = APP_URL ? `${APP_URL}/login` : "/login";

  return <section className="relative min-h-screen overflow-hidden pt-16">
    <div className="hero-glow left-1/2 top-0 -translate-x-1/2 -translate-y-1/3" />
    <div className="hero-glow right-0 top-1/3 translate-x-1/3 opacity-50" />

    {/* Floating pen decorations */}
    <motion.div animate={{
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0]
    }} transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }} className="absolute left-[10%] top-[20%] hidden lg:block opacity-20">
      <PenTool size={40} className="text-primary" />
    </motion.div>
    <motion.div animate={{
      y: [10, -10, 10],
      rotate: [0, -8, 8, 0]
    }} transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }} className="absolute right-[12%] top-[30%] hidden lg:block opacity-15">
      <PenTool size={28} className="text-accent" />
    </motion.div>

    {/* Animated sparkles */}
    {[...Array(5)].map((_, i) => <motion.div key={i} animate={{
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5],
      y: [0, -20, 0]
    }} transition={{
      duration: 3 + i,
      repeat: Infinity,
      delay: i * 0.7
    }} className="absolute hidden lg:block" style={{
      left: `${15 + i * 18}%`,
      top: `${25 + i % 3 * 15}%`
    }}>
      <Sparkles size={12 + i * 3} className="text-primary/30" />
    </motion.div>)}

    <div className="container relative mx-auto flex flex-col items-center px-6 pb-20 pt-24 text-center lg:pt-36">
      <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 glass-card px-4 py-1.5">
        <motion.span animate={{
          scale: [1, 1.4, 1]
        }} transition={{
          duration: 1.5,
          repeat: Infinity
        }} className="h-2 w-2 rounded-full bg-primary" />
        <span className="text-xs font-medium text-primary">AI-Powered Healthcare Reception</span>
        <motion.div animate={{
          rotate: [0, -10, 10, 0]
        }} transition={{
          duration: 2,
          repeat: Infinity
        }}>
          <PenTool size={12} className="text-primary" />
        </motion.div>
      </motion.div>

      <motion.h1 initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.1
      }} className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
        <motion.span initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }}>
          Your Clinic's AI
        </motion.span>
        <br />
        <motion.span initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5,
          delay: 0.4
        }} className="gradient-text">
          Receptionist & Assistant
        </motion.span>
      </motion.h1>

      <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }} className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
        Parchi AI handles bookings, manages patient records, summarizes cases, and provides differential diagnoses - all through voice and text.
      </motion.p>

      <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.3
      }} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <motion.a href={loginUrl} whileHover={{
          scale: 1.05,
          boxShadow: "0 0 40px -8px hsl(210 100% 56% / 0.5)"
        }} whileTap={{
          scale: 0.97
        }} className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-medium text-primary-foreground transition-all">
          <motion.div animate={{
            scale: [1, 1.15, 1]
          }} transition={{
            duration: 1.5,
            repeat: Infinity
          }}>
            <LogIn size={18} />
          </motion.div>
          Login to Dashboard
          <motion.div animate={{
            x: [0, 4, 0]
          }} transition={{
            duration: 1.5,
            repeat: Infinity
          }}>
            <ArrowRight size={16} />
          </motion.div>
        </motion.a>
        <motion.a href="#features" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.97
        }} className="flex items-center gap-2 rounded-xl glass-card px-8 py-3.5 font-medium text-secondary-foreground transition-all hover:glass-card-hover">
          <MessageSquare size={18} />
          See Features
        </motion.a>
      </motion.div>

      {/* Social proof stats */}
      <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.5
      }} className="mt-20 flex flex-col items-center gap-8 sm:flex-row">
        <motion.div whileHover={{
          y: -4,
          scale: 1.02
        }} className="glass-card flex items-center gap-4 rounded-2xl px-8 py-5 cursor-pointer">
          <motion.div animate={{
            rotate: [0, 5, -5, 0]
          }} transition={{
            duration: 3,
            repeat: Infinity
          }} className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <CalendarCheck size={24} className="text-primary" />
          </motion.div>
          <div className="text-left">
            <p className="font-display text-2xl font-bold text-foreground">50+</p>
            <p className="text-sm text-muted-foreground">Bookings Handled</p>
          </div>
        </motion.div>
        <motion.div whileHover={{
          y: -4,
          scale: 1.02
        }} className="glass-card flex items-center gap-4 rounded-2xl px-8 py-5 cursor-pointer">
          <motion.div animate={{
            scale: [1, 1.1, 1]
          }} transition={{
            duration: 2,
            repeat: Infinity
          }} className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <TrendingUp size={24} className="text-primary" />
          </motion.div>
          <div className="text-left">
            <p className="font-display text-2xl font-bold text-foreground">1</p>
            <p className="text-sm text-muted-foreground">Active Clinic Partner</p>
          </div>
        </motion.div>
      </motion.div>
    </div>

    {/* Scroll indicator */}
    <motion.div animate={{
      y: [0, 8, 0],
      opacity: [0.3, 1, 0.3]
    }} transition={{
      duration: 2,
      repeat: Infinity
    }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
      <div className="h-8 w-5 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-1.5">
        <motion.div animate={{
          y: [0, 8, 0]
        }} transition={{
          duration: 1.5,
          repeat: Infinity
        }} className="h-1.5 w-1.5 rounded-full bg-primary" />
      </div>
    </motion.div>
  </section>;
};
export default HeroSection;