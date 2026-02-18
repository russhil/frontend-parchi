import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Home, Calendar, Users, Settings, Search, Bell, Mic, MessageSquare, ChevronRight, Plus, Eye, Phone, Mail, Activity, Heart, Thermometer, Droplets, FileText, Sparkles, PenTool, CheckCircle2, Clock, TrendingUp, BarChart3, Stethoscope, Pill, AlertCircle } from "lucide-react";

// Floating particles component
const FloatingParticles = () => <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({
    length: 20
  }).map((_, i) => <motion.div key={i} className="absolute h-1 w-1 rounded-full bg-primary/30" initial={{
    x: Math.random() * 100 + "%",
    y: Math.random() * 100 + "%",
    scale: Math.random() * 0.5 + 0.5
  }} animate={{
    y: [null, "-20%", "120%"],
    opacity: [0, 1, 0]
  }} transition={{
    duration: Math.random() * 8 + 6,
    repeat: Infinity,
    delay: Math.random() * 5,
    ease: "linear"
  }} />)}
  </div>;

// Animated counter
const AnimatedCounter = ({
  value,
  suffix = ""
}: {
  value: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  return <motion.span onViewportEnter={() => {
    let start = 0;
    const step = value / 40;
    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);
  }}>
      {count}{suffix}
    </motion.span>;
};

// Typing animation component
const TypingText = ({
  text,
  delay = 0
}: {
  text: string;
  delay?: number;
}) => {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [started, text]);
  return <motion.span onViewportEnter={() => setTimeout(() => setStarted(true), delay)}>
      {displayed}
      {started && displayed.length < text.length && <motion.span animate={{
      opacity: [1, 0]
    }} transition={{
      duration: 0.5,
      repeat: Infinity
    }} className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle" />}
    </motion.span>;
};

// Prescription pen writing animation
const PrescriptionPen = () => {
  const lines = ["Rx: Amoxicillin 500mg", "Sig: 1 tab TID x 7 days", "Disp: #21", "Refills: 0"];
  return <motion.div initial={{
    opacity: 0
  }} whileInView={{
    opacity: 1
  }} viewport={{
    once: true
  }} className="relative glass-card rounded-xl p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3 border-b border-border/50 pb-2">
        <motion.div animate={{
        rotate: [0, -10, 0]
      }} transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}>
          <PenTool size={14} className="text-primary" />
        </motion.div>
        <span className="text-xs font-medium text-primary">AI Prescription</span>
        <motion.div animate={{
        scale: [1, 1.2, 1]
      }} transition={{
        duration: 1.5,
        repeat: Infinity
      }} className="ml-auto">
          <Sparkles size={12} className="text-accent" />
        </motion.div>
      </div>
      {lines.map((line, i) => <div key={i} className="text-xs text-muted-foreground font-mono py-0.5">
          <TypingText text={line} delay={i * 1200 + 500} />
        </div>)}
    </motion.div>;
};

// Appointment row with staggered animations
const AppointmentRow = ({
  name,
  initials,
  time,
  reason,
  status,
  delay,
  color
}: {
  name: string;
  initials: string;
  time: string;
  reason: string;
  status: string;
  delay: number;
  color: string;
}) => {
  const [hovered, setHovered] = useState(false);
  return <motion.div initial={{
    opacity: 0,
    x: -20
  }} whileInView={{
    opacity: 1,
    x: 0
  }} viewport={{
    once: true
  }} transition={{
    delay,
    duration: 0.4
  }} onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-primary/5 cursor-pointer group">
      <motion.div animate={hovered ? {
      scale: 1.1,
      rotate: 5
    } : {
      scale: 1,
      rotate: 0
    }} className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color} text-xs font-bold text-primary`}>
        {initials}
      </motion.div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">{name}</p>
        <p className="text-[10px] text-muted-foreground truncate">{reason}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[11px] font-medium text-foreground">{time}</p>
        <motion.p animate={hovered ? {
        scale: 1.05
      } : {
        scale: 1
      }} className="text-[10px] text-primary font-medium">
          {status}
        </motion.p>
      </div>
      <motion.div animate={hovered ? {
      x: 3,
      opacity: 1
    } : {
      x: 0,
      opacity: 0.3
    }} transition={{
      duration: 0.2
    }}>
        <ChevronRight size={14} className="text-muted-foreground" />
      </motion.div>
    </motion.div>;
};

// Patient table row
const PatientRow = ({
  name,
  initials,
  age,
  gender,
  condition,
  conditionColor,
  delay
}: {
  name: string;
  initials: string;
  age: string;
  gender: string;
  condition: string;
  conditionColor: string;
  delay: number;
}) => {
  const [hovered, setHovered] = useState(false);
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    delay,
    duration: 0.3
  }} onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)} className="flex items-center gap-3 py-2 px-2 rounded-md transition-colors hover:bg-primary/5 cursor-pointer">
      <motion.div animate={hovered ? {
      scale: 1.15
    } : {
      scale: 1
    }} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
        {initials}
      </motion.div>
      <span className="text-xs text-foreground flex-1 truncate">{name}</span>
      <span className="text-[10px] text-muted-foreground w-12">{age}, {gender}</span>
      <motion.span animate={hovered ? {
      scale: 1.1
    } : {
      scale: 1
    }} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${conditionColor}`}>
        {condition}
      </motion.span>
      <div className="flex gap-1">
        <motion.div whileHover={{
        scale: 1.3
      }} className="p-1 rounded hover:bg-primary/10 cursor-pointer">
          <Mic size={10} className="text-primary" />
        </motion.div>
        <motion.div whileHover={{
        scale: 1.3
      }} className="p-1 rounded hover:bg-primary/10 cursor-pointer">
          <Eye size={10} className="text-primary" />
        </motion.div>
      </div>
    </motion.div>;
};

// Vital stat card
const VitalCard = ({
  icon: Icon,
  label,
  value,
  unit,
  color,
  delay
}: {
  icon: typeof Heart;
  label: string;
  value: string;
  unit: string;
  color: string;
  delay: number;
}) => <motion.div initial={{
  opacity: 0,
  scale: 0.8
}} whileInView={{
  opacity: 1,
  scale: 1
}} viewport={{
  once: true
}} transition={{
  delay,
  duration: 0.4,
  type: "spring"
}} whileHover={{
  scale: 1.05,
  y: -2
}} className="glass-card rounded-lg p-2.5 cursor-pointer group">
    <div className="flex items-center gap-1.5 mb-1">
      <motion.div animate={{
      rotate: [0, 5, -5, 0]
    }} transition={{
      duration: 3,
      repeat: Infinity,
      delay
    }}>
        <Icon size={12} className={color} />
      </motion.div>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
    <p className="text-sm font-bold text-foreground">{value}</p>
    <p className="text-[9px] text-muted-foreground">{unit}</p>
  </motion.div>;

// Main dashboard mockup
const DashboardMockup = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationPing, setNotificationPing] = useState(true);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [3, -3]);
  const rotateY = useTransform(mouseX, [-400, 400], [-3, 3]);
  const springRotateX = useSpring(rotateX, {
    stiffness: 100,
    damping: 30
  });
  const springRotateY = useSpring(rotateY, {
    stiffness: 100,
    damping: 30
  });
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };
  const sidebarItems = [{
    icon: Home,
    label: "Home",
    id: "home"
  }, {
    icon: Calendar,
    label: "Schedule",
    id: "schedule"
  }, {
    icon: Users,
    label: "Patients",
    id: "patients"
  }, {
    icon: Settings,
    label: "Settings",
    id: "settings"
  }];
  return <section className="relative overflow-hidden py-[64px]">
      <FloatingParticles />
      <div className="section-glow left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="container relative mx-auto px-6">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.5
      }} className="text-center mb-16">
          <motion.div initial={{
          opacity: 0,
          scale: 0
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} transition={{
          type: "spring",
          bounce: 0.5
        }} className="inline-flex items-center gap-2 mb-4">
            <motion.div animate={{
            rotate: [0, -15, 15, 0]
          }} transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}>
              <PenTool size={20} className="text-primary" />
            </motion.div>
            <span className="text-sm font-medium uppercase tracking-widest text-primary">
              The Dashboard
            </span>
          </motion.div>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            From Manual <motion.span className="inline-block" animate={{
            rotate: [0, -3, 0]
          }} transition={{
            duration: 2,
            repeat: Infinity
          }}>📝</motion.span> to{" "}
            <span className="gradient-text">AI-Powered</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Parchi replaces paper prescriptions with an intelligent dashboard. See it in action.
          </p>
        </motion.div>

        {/* 3D perspective dashboard */}
        <motion.div initial={{
        opacity: 0,
        y: 60
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true,
        margin: "-100px"
      }} transition={{
        duration: 0.8,
        ease: "easeOut"
      }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{
        perspective: 1200
      }} className="mx-auto max-w-5xl">
          <motion.div style={{
          rotateX: springRotateX,
          rotateY: springRotateY
        }} className="glass-card rounded-2xl border border-border/50 overflow-hidden shadow-[0_0_80px_-20px_hsl(210_100%_56%/0.15)]">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5 bg-card/50">
              <div className="flex items-center gap-3">
                <motion.div whileHover={{
                scale: 1.1,
                rotate: 360
              }} transition={{
                duration: 0.5
              }} className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary cursor-pointer">
                  <span className="text-[10px] font-bold text-primary-foreground">P</span>
                </motion.div>
                <span className="font-display text-sm font-bold text-foreground">Parchi</span>
                <motion.span animate={{
                opacity: [0.5, 1, 0.5]
              }} transition={{
                duration: 2,
                repeat: Infinity
              }} className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary">
                  AI-Powered
                </motion.span>
              </div>

              {/* Search bar */}
              <motion.div animate={searchFocused ? {
              width: 280,
              borderColor: "hsl(210 100% 56% / 0.5)"
            } : {
              width: 220
            }} className="hidden md:flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-3 py-1.5">
                <motion.div animate={searchFocused ? {
                rotate: 90
              } : {
                rotate: 0
              }}>
                  <Search size={12} className="text-muted-foreground" />
                </motion.div>
                <input className="bg-transparent text-[11px] text-muted-foreground outline-none w-full placeholder:text-muted-foreground/50" placeholder="Search patients, records..." onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} />
              </motion.div>

              <div className="flex items-center gap-3">
                <motion.div whileHover={{
                scale: 1.2
              }} whileTap={{
                scale: 0.9
              }} className="relative cursor-pointer" onClick={() => setNotificationPing(false)}>
                  <Bell size={14} className="text-muted-foreground" />
                  <AnimatePresence>
                    {notificationPing && <motion.div initial={{
                    scale: 0
                  }} animate={{
                    scale: 1
                  }} exit={{
                    scale: 0
                  }} className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-destructive">
                        <motion.div animate={{
                      scale: [1, 2, 1],
                      opacity: [1, 0, 1]
                    }} transition={{
                      duration: 1.5,
                      repeat: Infinity
                    }} className="h-full w-full rounded-full bg-destructive" />
                      </motion.div>}
                  </AnimatePresence>
                </motion.div>
                <motion.div whileHover={{
                scale: 1.1
              }} className="flex items-center gap-2 cursor-pointer">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-[9px] font-bold text-primary">
                    YC
                  </div>
                  <span className="hidden sm:block text-[11px] text-foreground font-medium">Dr. YC</span>
                </motion.div>
              </div>
            </div>

            <div className="flex min-h-[420px]">
              {/* Sidebar */}
              <div className="hidden sm:flex w-14 flex-col items-center gap-1 border-r border-border/50 bg-card/30 py-4">
                {sidebarItems.map((item, i) => <motion.button key={item.id} initial={{
                opacity: 0,
                x: -10
              }} whileInView={{
                opacity: 1,
                x: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: i * 0.1
              }} whileHover={{
                scale: 1.15,
                x: 2
              }} whileTap={{
                scale: 0.95
              }} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-0.5 rounded-lg p-2 transition-colors cursor-pointer ${activeTab === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                    <item.icon size={16} />
                    <span className="text-[8px] font-medium">{item.label}</span>
                    {activeTab === item.id && <motion.div layoutId="sidebar-indicator" className="absolute left-0 h-6 w-0.5 rounded-full bg-primary" />}
                  </motion.button>)}
              </div>

              {/* Main content */}
              <div className="flex-1 p-4 overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeTab === "home" && <motion.div key="home" initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -10
                }} transition={{
                  duration: 0.3
                }}>
                      {/* Greeting */}
                      <motion.h3 initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} className="font-display text-lg font-bold text-foreground mb-1">
                        Hi Dr. YC, how can I help today?
                      </motion.h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        Your AI assistant is ready for patients.
                      </p>

                      {/* Action buttons */}
                      <div className="flex gap-2 mb-5">
                        <motion.button whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 20px -4px hsl(210 100% 56% / 0.4)"
                    }} whileTap={{
                      scale: 0.95
                    }} className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground cursor-pointer">
                          <motion.div animate={{
                        scale: [1, 1.2, 1]
                      }} transition={{
                        duration: 1.5,
                        repeat: Infinity
                      }}>
                            <Mic size={12} />
                          </motion.div>
                          Talk to Me
                        </motion.button>
                        <motion.button whileHover={{
                      scale: 1.05
                    }} whileTap={{
                      scale: 0.95
                    }} className="flex items-center gap-1.5 rounded-full border border-border/50 px-4 py-2 text-xs font-medium text-foreground cursor-pointer hover:bg-primary/5">
                          <MessageSquare size={12} />
                          Chat with AI
                        </motion.button>
                      </div>

                      {/* Dashboard grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Appointments */}
                        <div className="md:col-span-2 glass-card rounded-xl p-3">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-semibold text-foreground">Today's Appointments</h4>
                            <motion.span animate={{
                          opacity: [0.5, 1, 0.5]
                        }} transition={{
                          duration: 2,
                          repeat: Infinity
                        }} className="text-[10px] text-muted-foreground">
                              Monday, 9 Feb
                            </motion.span>
                          </div>
                          <AppointmentRow name="Russhil Chawla" initials="RC" time="06:58 pm" reason="Headache and fatigue" status="Scheduled" delay={0.1} color="bg-primary/15" />
                          <AppointmentRow name="Test Patient" initials="TP" time="07:30 pm" reason="Test appointment" status="Scheduled" delay={0.2} color="bg-accent/15" />
                          <AppointmentRow name="John Doe" initials="JD" time="08:30 pm" reason="Fever and cough" status="Scheduled" delay={0.3} color="bg-primary/15" />
                          <motion.a whileHover={{
                        x: 4
                      }} className="mt-2 flex items-center gap-1 text-[11px] text-primary font-medium cursor-pointer">
                            View all appointments <ChevronRight size={12} />
                          </motion.a>
                        </div>

                        {/* Prescription pen */}
                        <div className="flex flex-col gap-3">
                          <PrescriptionPen />

                          {/* Quick stats */}
                          <motion.div initial={{
                        opacity: 0,
                        scale: 0.9
                      }} whileInView={{
                        opacity: 1,
                        scale: 1
                      }} viewport={{
                        once: true
                      }} transition={{
                        delay: 0.4
                      }} className="glass-card rounded-xl p-3">
                            <div className="flex items-center gap-1.5 mb-2">
                              <TrendingUp size={12} className="text-primary" />
                              <span className="text-[10px] font-medium text-foreground">Today's Stats</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-center">
                                <p className="font-display text-lg font-bold text-primary">
                                  <AnimatedCounter value={12} />
                                </p>
                                <p className="text-[9px] text-muted-foreground">Patients</p>
                              </div>
                              <div className="text-center">
                                <p className="font-display text-lg font-bold text-accent">
                                  <AnimatedCounter value={8} />
                                </p>
                                <p className="text-[9px] text-muted-foreground">AI Summaries</p>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>}

                  {activeTab === "schedule" && <motion.div key="schedule" initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -10
                }} transition={{
                  duration: 0.3
                }}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-display text-lg font-bold text-foreground">Appointments</h3>
                          <p className="text-xs text-muted-foreground">38 total appointments</p>
                        </div>
                        <motion.button whileHover={{
                      scale: 1.05
                    }} whileTap={{
                      scale: 0.95
                    }} className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground cursor-pointer">
                          <Plus size={12} /> New Appointment
                        </motion.button>
                      </div>

                      {/* Tabs */}
                      <div className="flex gap-1 mb-4">
                        {["All", "Today", "Upcoming"].map((tab, i) => <motion.button key={tab} initial={{
                      opacity: 0,
                      y: 5
                    }} animate={{
                      opacity: 1,
                      y: 0
                    }} transition={{
                      delay: i * 0.05
                    }} whileHover={{
                      scale: 1.05
                    }} className={`rounded-full px-3 py-1 text-[10px] font-medium cursor-pointer ${i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-primary/5"}`}>
                            {tab}
                          </motion.button>)}
                      </div>

                      <div className="space-y-1">
                        {[{
                      name: "Stephen McCormick",
                      initials: "SM",
                      time: "06:08 am",
                      date: "Sun, 22 Feb",
                      reason: "Sore throat and fever"
                    }, {
                      name: "Timothy Sullivan",
                      initials: "TS",
                      time: "06:08 am",
                      date: "Sat, 21 Feb",
                      reason: "Persistent cough"
                    }, {
                      name: "Zachary Marsh",
                      initials: "ZM",
                      time: "06:08 am",
                      date: "Sat, 21 Feb",
                      reason: "Headache and migraine"
                    }, {
                      name: "Randy Clark",
                      initials: "RC",
                      time: "06:09 am",
                      date: "Wed, 18 Feb",
                      reason: "Weight management"
                    }].map((apt, i) => <motion.div key={apt.name + i} initial={{
                      opacity: 0,
                      x: -15
                    }} animate={{
                      opacity: 1,
                      x: 0
                    }} transition={{
                      delay: i * 0.08
                    }} whileHover={{
                      x: 4,
                      backgroundColor: "hsl(210 100% 56% / 0.03)"
                    }} className="flex items-center gap-3 rounded-lg border border-border/30 p-2.5 cursor-pointer transition-colors">
                            <div className="text-center shrink-0 w-14">
                              <p className="text-xs font-bold text-foreground">{apt.time}</p>
                              <p className="text-[9px] text-muted-foreground">{apt.date}</p>
                            </div>
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                              {apt.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">{apt.name}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{apt.reason}</p>
                            </div>
                            <span className="text-[10px] text-primary font-medium shrink-0">Scheduled</span>
                            <motion.div whileHover={{
                        scale: 1.2
                      }} className="p-1 rounded-full bg-primary cursor-pointer shrink-0">
                              <Mic size={10} className="text-primary-foreground" />
                            </motion.div>
                          </motion.div>)}
                      </div>
                    </motion.div>}

                  {activeTab === "patients" && <motion.div key="patients" initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -10
                }} transition={{
                  duration: 0.3
                }}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-display text-lg font-bold text-foreground">Patients</h3>
                          <p className="text-xs text-muted-foreground">24 patients registered</p>
                        </div>
                        <motion.button whileHover={{
                      scale: 1.05
                    }} whileTap={{
                      scale: 0.95
                    }} className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground cursor-pointer">
                          <Plus size={12} /> Add Patient
                        </motion.button>
                      </div>

                      {/* Search */}
                      <motion.div initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/30 px-3 py-2 mb-4">
                        <Search size={12} className="text-muted-foreground" />
                        <span className="text-[11px] text-muted-foreground/50">Search by name, condition, or ID...</span>
                      </motion.div>

                      {/* Header */}
                      <div className="flex items-center gap-3 py-1.5 px-2 text-[9px] uppercase tracking-wider text-muted-foreground font-medium border-b border-border/30 mb-1">
                        <span className="w-7" />
                        <span className="flex-1">Patient</span>
                        <span className="w-12">Age</span>
                        <span className="w-20">Condition</span>
                        <span className="w-12">Actions</span>
                      </div>

                      <PatientRow name="Andrew Meyers" initials="AM" age="46y" gender="M" condition="Hypertension" conditionColor="bg-blue-500/10 text-blue-400" delay={0.05} />
                      <PatientRow name="Brooke Burns" initials="BB" age="54y" gender="F" condition="Arthritis" conditionColor="bg-amber-500/10 text-amber-400" delay={0.1} />
                      <PatientRow name="Christina Perry" initials="CP" age="75y" gender="O" condition="Diabetes" conditionColor="bg-red-500/10 text-red-400" delay={0.15} />
                      <PatientRow name="Chris Larson" initials="CL" age="37y" gender="M" condition="Migraine" conditionColor="bg-purple-500/10 text-purple-400" delay={0.2} />
                    </motion.div>}

                  {activeTab === "settings" && <motion.div key="settings" initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -10
                }} transition={{
                  duration: 0.3
                }} className="flex flex-col items-center justify-center h-64">
                      <motion.div animate={{
                    rotate: 360
                  }} transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}>
                        <Settings size={32} className="text-muted-foreground/30" />
                      </motion.div>
                      <p className="text-sm text-muted-foreground mt-4">Settings coming soon</p>
                    </motion.div>}
                </AnimatePresence>
              </div>

              {/* Right panel - Patient overview (visible on home) */}
              {activeTab === "home" && <motion.div initial={{
              opacity: 0,
              x: 20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: 0.3,
              duration: 0.5
            }} className="hidden lg:block w-52 border-l border-border/50 p-3 overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <Stethoscope size={12} className="text-primary" />
                    <span className="text-[10px] font-semibold text-foreground">Patient Overview</span>
                  </div>

                  <motion.div whileHover={{
                scale: 1.02
              }} className="glass-card rounded-lg p-2.5 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                        RC
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">Russhil Chawla</p>
                        <p className="text-[9px] text-muted-foreground">19y • Male • P-B9529F1C</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      <motion.div whileHover={{
                    scale: 1.15
                  }} className="p-1 rounded bg-primary/10 cursor-pointer">
                        <Phone size={9} className="text-primary" />
                      </motion.div>
                      <motion.div whileHover={{
                    scale: 1.15
                  }} className="p-1 rounded bg-primary/10 cursor-pointer">
                        <Mail size={9} className="text-primary" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Vitals grid */}
                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    <VitalCard icon={Activity} label="BP" value="120/80" unit="mmHg" color="text-red-400" delay={0.4} />
                    <VitalCard icon={Droplets} label="SpO2" value="98" unit="%" color="text-blue-400" delay={0.5} />
                    <VitalCard icon={Heart} label="Heart" value="72" unit="bpm" color="text-pink-400" delay={0.6} />
                    <VitalCard icon={Thermometer} label="Temp" value="98.6" unit="°F" color="text-amber-400" delay={0.7} />
                  </div>

                  {/* AI Summary button */}
                  <motion.button whileHover={{
                scale: 1.03,
                boxShadow: "0 0 16px -4px hsl(210 100% 56% / 0.3)"
              }} whileTap={{
                scale: 0.97
              }} className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[10px] font-medium text-primary-foreground cursor-pointer">
                    <motion.div animate={{
                  rotate: [0, 15, -15, 0]
                }} transition={{
                  duration: 2,
                  repeat: Infinity
                }}>
                      <Sparkles size={10} />
                    </motion.div>
                    Generate AI Summary
                  </motion.button>

                  {/* Bottom action bar */}
                  <div className="mt-3 flex items-center justify-between gap-1">
                    {[{
                  icon: FileText,
                  label: "Note"
                }, {
                  icon: Mic,
                  label: "Voice"
                }, {
                  icon: Pill,
                  label: "Rx"
                }, {
                  icon: CheckCircle2,
                  label: "Seen"
                }].map((action, i) => <motion.button key={action.label} initial={{
                  opacity: 0,
                  y: 5
                }} whileInView={{
                  opacity: 1,
                  y: 0
                }} viewport={{
                  once: true
                }} transition={{
                  delay: 0.5 + i * 0.05
                }} whileHover={{
                  scale: 1.1,
                  y: -2
                }} whileTap={{
                  scale: 0.95
                }} className="flex flex-col items-center gap-0.5 p-1.5 rounded-md hover:bg-primary/5 cursor-pointer group">
                        <action.icon size={10} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[7px] text-muted-foreground group-hover:text-foreground transition-colors">{action.label}</span>
                      </motion.button>)}
                  </div>
                </motion.div>}
            </div>

            {/* Bottom bar with live indicator */}
            <div className="flex items-center justify-between border-t border-border/50 px-4 py-1.5 bg-card/30">
              <div className="flex items-center gap-1.5">
                <motion.div animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.5, 1]
              }} transition={{
                duration: 2,
                repeat: Infinity
              }} className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-[9px] text-muted-foreground">AI Active</span>
              </div>
              <div className="flex items-center gap-2">
                <motion.span animate={{
                opacity: [0.3, 1, 0.3]
              }} transition={{
                duration: 3,
                repeat: Infinity
              }} className="text-[9px] text-muted-foreground">
                  <Clock size={9} className="inline mr-0.5" />
                  Real-time sync
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* Reflection glow */}
          <motion.div animate={{
          opacity: [0.3, 0.6, 0.3]
        }} transition={{
          duration: 4,
          repeat: Infinity
        }} className="mx-auto mt-4 h-16 w-3/4 rounded-full bg-primary/5 blur-3xl" />
        </motion.div>

        {/* Feature callouts below dashboard */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[{
          icon: PenTool,
          label: "AI Prescriptions",
          value: "100%",
          desc: "Automated"
        }, {
          icon: Mic,
          label: "Voice Sessions",
          value: "24/7",
          desc: "Available"
        }, {
          icon: BarChart3,
          label: "Analytics",
          value: "Real-time",
          desc: "Dashboard"
        }, {
          icon: AlertCircle,
          label: "Diagnosis",
          value: "AI-Powered",
          desc: "Differential Dx"
        }].map((stat, i) => <motion.div key={stat.label} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: i * 0.1
        }} whileHover={{
          y: -4,
          scale: 1.03
        }} className="glass-card rounded-xl p-4 text-center cursor-pointer group">
              <motion.div whileHover={{
            rotate: 360
          }} transition={{
            duration: 0.5
          }} className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <stat.icon size={14} />
              </motion.div>
              <p className="font-display text-sm font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.desc}</p>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default DashboardMockup;