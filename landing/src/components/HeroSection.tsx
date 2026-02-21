import { motion } from "framer-motion";
import { Mic, MessageSquare, ArrowRight, CalendarCheck, TrendingUp, PenTool, Sparkles, LogIn, Zap, Shield, Clock } from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "";

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 30 }).map((_, i) => (
      <motion.div
        key={`hero-particle-${i}`}
        className="absolute h-1 w-1 rounded-full bg-primary/40"
        initial={{
          x: Math.random() * 100 + "%",
          y: Math.random() * 100 + "%",
          scale: Math.random() * 0.5 + 0.5,
        }}
        animate={{
          y: [null, "-20%", "120%"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: Math.random() * 10 + 10,
          repeat: Infinity,
          delay: Math.random() * 5,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

const HeroSection = () => {
  const loginUrl = APP_URL ? `${APP_URL}/login` : "/login";

  return <section className="relative min-h-screen pt-16">
    {/* Enhanced glows */}
    <div className="hero-glow left-1/2 top-0 -translate-x-1/2 -translate-y-1/3" />
    <div className="hero-glow right-0 top-1/3 translate-x-1/3 opacity-50" />
    <motion.div
      animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute left-1/4 bottom-1/4 w-[800px] h-[800px] rounded-full pointer-events-none"
      style={{
        background: "radial-gradient(circle, hsl(var(--accent) / 0.1) 0%, transparent 60%)",
        transform: "translateZ(0)"
      }}
    />

    {/* Grid pattern overlay */}
    <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
      style={{
        backgroundImage: "linear-gradient(hsl(210 100% 56% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(210 100% 56% / 0.3) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />

    <FloatingParticles />

    {/* Floating pen decorations */}
    <motion.div animate={{
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      scale: [1, 1.05, 1],
    }} transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }} className="absolute left-[10%] top-[20%] hidden lg:block opacity-20">
      <PenTool size={40} className="text-primary" />
    </motion.div>
    <motion.div animate={{
      y: [10, -10, 10],
      rotate: [0, -8, 8, 0],
      scale: [1, 0.95, 1],
    }} transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }} className="absolute right-[12%] top-[30%] hidden lg:block opacity-15">
      <PenTool size={28} className="text-accent" />
    </motion.div>

    {/* Floating orbs */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={`orb-${i}`}
        animate={{
          y: [-20 + i * 10, 20 - i * 10, -20 + i * 10],
          x: [-10, 10 + i * 5, -10],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{ duration: 10 + i * 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute hidden lg:block rounded-full pointer-events-none"
        style={{
          left: `${20 + i * 30}%`,
          top: `${15 + i * 20}%`,
          width: `${80 + i * 40}px`,
          height: `${80 + i * 40}px`,
          background: `radial-gradient(circle, hsl(210 100% 56% / ${0.08 + i * 0.03}) 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
    ))}

    {/* Animated sparkles */}
    {[...Array(8)].map((_, i) => <motion.div key={i} animate={{
      opacity: [0, 1, 0],
      scale: [0.5, 1.2, 0.5],
      y: [0, -30, 0],
      rotate: [0, 180, 360],
    }} transition={{
      duration: 3 + i * 0.5,
      repeat: Infinity,
      delay: i * 0.5
    }} className="absolute hidden lg:block" style={{
      left: `${10 + i * 11}%`,
      top: `${20 + i % 4 * 12}%`
    }}>
      <Sparkles size={10 + i * 2} className="text-primary/30" />
    </motion.div>)}

    {/* Floating icons */}
    <motion.div
      animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5], opacity: [0.15, 0.25, 0.15] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className="absolute right-[8%] top-[55%] hidden lg:block"
    >
      <Zap size={24} className="text-accent" />
    </motion.div>
    <motion.div
      animate={{ y: [8, -12, 8], rotate: [5, -5, 5], opacity: [0.12, 0.2, 0.12] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      className="absolute left-[6%] top-[60%] hidden lg:block"
    >
      <Shield size={20} className="text-primary/60" />
    </motion.div>
    <motion.div
      animate={{ y: [-6, 10, -6], rotate: [0, 360], opacity: [0.1, 0.2, 0.1] }}
      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      className="absolute right-[18%] top-[15%] hidden lg:block"
    >
      <Clock size={18} className="text-primary/40" />
    </motion.div>

    <div className="container relative mx-auto flex flex-col items-center px-6 pb-20 pt-24 text-center lg:pt-36">
      {/* Badge */}
      <motion.div initial={{
        opacity: 0,
        y: 20,
        scale: 0.9,
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }} transition={{
        duration: 0.6,
        type: "spring",
        bounce: 0.4,
      }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 glass-card px-4 py-1.5">
        <motion.span animate={{
          scale: [1, 1.4, 1],
          boxShadow: ["0 0 0px hsl(210 100% 56% / 0)", "0 0 12px hsl(210 100% 56% / 0.6)", "0 0 0px hsl(210 100% 56% / 0)"],
        }} transition={{
          duration: 1.5,
          repeat: Infinity
        }} className="h-2 w-2 rounded-full bg-primary" />
        <span className="text-xs font-medium text-primary">AI-Powered Healthcare Reception</span>
        <motion.div animate={{
          rotate: [0, -10, 10, 0],
          scale: [1, 1.1, 1],
        }} transition={{
          duration: 2,
          repeat: Infinity
        }}>
          <PenTool size={12} className="text-primary" />
        </motion.div>
      </motion.div>

      {/* Title */}
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
          Prepared from minute zero.
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
        }} className="gradient-text inline-block">
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
            by Parchi AI
          </motion.span>
        </motion.span>
      </motion.h1>

      {/* Subtitle */}
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
        Parchi AI handles bookings, manages patient records, summarizes cases, and provides differential diagnoses - before the patient steps foot in the clinic.
      </motion.p>

      {/* CTA Buttons */}
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
          boxShadow: "0 0 50px -8px hsl(210 100% 56% / 0.6)",
          y: -2,
        }} whileTap={{
          scale: 0.97
        }} className="group relative flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-medium text-primary-foreground transition-all overflow-hidden">
          {/* Shimmer effect */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none"
          />
          <motion.div animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0],
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
          scale: 1.05,
          boxShadow: "0 0 30px -8px hsl(210 100% 56% / 0.3)",
          y: -2,
        }} whileTap={{
          scale: 0.97
        }} className="flex items-center gap-2 rounded-xl glass-card px-8 py-3.5 font-medium text-secondary-foreground transition-all hover:glass-card-hover">
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <MessageSquare size={18} />
          </motion.div>
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
          y: -6,
          scale: 1.04,
          boxShadow: "0 0 40px -8px hsl(210 100% 56% / 0.3)",
        }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="glass-card flex items-center gap-4 rounded-2xl px-8 py-5 cursor-pointer relative overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: "radial-gradient(circle at 30% 50%, hsl(210 100% 56% / 0.06) 0%, transparent 60%)" }}
          />
          <motion.div animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }} transition={{
            duration: 3,
            repeat: Infinity
          }} className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <CalendarCheck size={24} className="text-primary" />
          </motion.div>
          <div className="text-left">
            <motion.p
              className="font-display text-2xl font-bold text-foreground"
              animate={{ opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 2, repeat: Infinity }}
            >100+</motion.p>
            <p className="text-sm text-muted-foreground">Bookings Handled</p>
          </div>
        </motion.div>
        <motion.div whileHover={{
          y: -6,
          scale: 1.04,
          boxShadow: "0 0 40px -8px hsl(210 100% 56% / 0.3)",
        }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="glass-card flex items-center gap-4 rounded-2xl px-8 py-5 cursor-pointer relative overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: "radial-gradient(circle at 30% 50%, hsl(210 100% 56% / 0.06) 0%, transparent 60%)" }}
          />
          <motion.div animate={{
            scale: [1, 1.1, 1],
          }} transition={{
            duration: 2,
            repeat: Infinity
          }} className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <TrendingUp size={24} className="text-primary" />
          </motion.div>
          <div className="text-left">
            <motion.p
              className="font-display text-2xl font-bold text-foreground"
              animate={{ opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >2</motion.p>
            <p className="text-sm text-muted-foreground">Active Clinic Partners</p>
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