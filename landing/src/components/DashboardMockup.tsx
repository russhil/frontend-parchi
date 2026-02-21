import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Home, Calendar, Users, Settings, Search, Bell, Mic, MessageSquare, ChevronRight, Plus, Eye, Phone, Mail, Activity, Heart, Thermometer, Droplets, FileText, Sparkles, PenTool, CheckCircle2, Clock, TrendingUp, BarChart3, Stethoscope, Pill, AlertCircle, ClipboardList, Camera, Upload, Image as ImageIcon, Copy, Scan } from "lucide-react";
import { PatientDetailMockup } from "./PatientDetailMockup";

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
  color,
  onClick
}: {
  name: string;
  initials: string;
  time: string;
  reason: string;
  status: string;
  delay: number;
  color: string;
  onClick?: () => void;
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
  }} onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)} onClick={onClick} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-primary/5 cursor-pointer group">
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
  delay,
  onClick
}: {
  name: string;
  initials: string;
  age: string;
  gender: string;
  condition: string;
  conditionColor: string;
  delay: number;
  onClick?: () => void;
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
  }} onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)} onClick={onClick} className="flex items-center gap-3 py-2 px-2 rounded-md transition-colors hover:bg-primary/5 cursor-pointer">
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

  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const sidebarItems = [{
    icon: Home,
    label: "Home",
    id: "home"
  }, {
    icon: Calendar,
    label: "Schedule",
    id: "schedule"
  }, {
    icon: ClipboardList,
    label: "Intake",
    id: "intake"
  }, {
    icon: Users,
    label: "Patients",
    id: "patients"
  }, {
    icon: Settings,
    label: "Settings",
    id: "settings"
  }];
  return <section className="relative py-[64px] z-10">
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

          <div className="flex flex-col sm:flex-row h-[560px] sm:h-[480px]">
            {/* Mobile Nav Top */}
            <div className="sm:hidden flex items-center justify-around border-b border-border/50 bg-card/30 py-1.5 shrink-0 px-2 overflow-x-auto relative">
              {sidebarItems.map((item) => <button key={`mobile-${item.id}`} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center justify-center gap-1 p-2 cursor-pointer w-16 relative ${activeTab === item.id ? "text-primary" : "text-muted-foreground"}`}>
                <item.icon size={18} />
                <span className="text-[9px] font-medium">{item.label}</span>
                {activeTab === item.id && <motion.div layoutId="mobile-nav-indicator" className="absolute -bottom-1.5 h-0.5 w-10 rounded-t-full bg-primary" />}
              </button>)}
            </div>

            {/* Sidebar Desktop */}
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
            {selectedPatient ? (
              <div className="flex-1 overflow-hidden relative border-l border-border/50">
                <AnimatePresence mode="wait">
                  <PatientDetailMockup key="patient-detail" patientName={selectedPatient} onBack={() => setSelectedPatient(null)} />
                </AnimatePresence>
              </div>
            ) : (
              <>
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
                    }} className="flex flex-col items-center justify-center px-4 max-w-3xl mx-auto h-full w-full">
                      {/* Greeting */}
                      <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-xl md:text-2xl font-bold text-foreground mb-1 text-center">
                        Hi Dr. YC, how can I help you today?
                      </motion.h3>
                      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xs text-muted-foreground mb-5 text-center max-w-lg">
                        Your AI assistant is ready to help with patient records, diagnoses, and documentation.
                      </motion.p>

                      {/* Action buttons */}
                      <motion.button initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 30px -4px hsl(210 100% 56% / 0.5)"
                      }} whileTap={{
                        scale: 0.95
                      }} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground cursor-pointer mb-5 shadow-lg shadow-primary/20">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                          <Mic size={16} />
                        </motion.div>
                        Talk to Me
                      </motion.button>

                      {/* Big Search Bar */}
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full max-w-md flex items-center gap-2 rounded-xl border border-border/50 bg-card/50 p-1.5 pl-3 mb-6 shadow-sm backdrop-blur-md hover:border-primary/30 transition-colors focus-within:border-primary/50 focus-within:shadow-[0_0_20px_-5px_hsl(210_100%_56%/0.3)]">
                        <Search size={16} className="text-muted-foreground" />
                        <input className="bg-transparent text-xs text-foreground outline-none w-full placeholder:text-muted-foreground/50" placeholder="Search patients or conditions..." />
                        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0">
                          Search
                        </button>
                      </motion.div>

                      {/* Appointments */}
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-full max-w-xl glass-card rounded-xl p-3 border border-border/50">
                        <div className="flex items-center justify-between mb-2 border-b border-border/50 pb-2">
                          <h4 className="text-xs font-semibold text-foreground">Today's Appointments</h4>
                          <span className="text-[10px] text-muted-foreground">Monday, 9 Feb</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <AppointmentRow name="Russhil Chawla" initials="RC" time="06:58 pm" reason="Headache and fatigue" status="Scheduled" delay={0.1} color="bg-primary/15" onClick={() => setSelectedPatient("Russhil Chawla")} />
                          <AppointmentRow name="Test Patient" initials="TP" time="07:30 pm" reason="Test appointment" status="Scheduled" delay={0.2} color="bg-accent/15" onClick={() => setSelectedPatient("Test Patient")} />
                        </div>
                        <div className="mt-2 pt-2 border-t border-border/30 text-center">
                          <motion.a whileHover={{ x: 4 }} className="inline-flex items-center gap-1 text-[10px] text-primary font-medium cursor-pointer">
                            View all appointments <ChevronRight size={12} />
                          </motion.a>
                        </div>
                      </motion.div>
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
                        }} onClick={() => setSelectedPatient(apt.name)} className="flex items-center gap-3 rounded-lg border border-border/30 p-2.5 cursor-pointer transition-colors">
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
                    </motion.div>
                    }

                    {activeTab === "intake" && <motion.div key="intake" initial={{
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
                    }} className="flex flex-col w-full h-full p-4 md:p-6 overflow-hidden">
                      <h2 className="text-base md:text-lg font-bold text-foreground mb-3">Setup Patient Intake</h2>

                      {/* Toggle */}
                      <div className="flex bg-card/60 rounded-lg p-1 w-max mb-3 border border-border/50">
                        <button className="flex items-center gap-1.5 bg-primary/20 text-primary px-3 py-1.5 rounded-md font-medium text-xs transition-colors cursor-pointer">
                          <Camera size={14} />
                          Parchi
                        </button>
                        <button className="flex items-center gap-1.5 text-muted-foreground px-3 py-1.5 rounded-md font-medium text-xs hover:bg-white/5 hover:text-foreground transition-colors cursor-pointer">
                          <ClipboardList size={14} className="rotate-90" />
                          Manual Entry
                        </button>
                      </div>

                      {/* Scan Parchi Card */}
                      <div className="glass-card flex-1 rounded-xl border border-border/50 p-4 shrink-0 flex flex-col relative overflow-hidden group">

                        {/* Background glow piece */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                        <div className="relative z-10 flex items-start gap-3 mb-3 shrink-0">
                          <div className="bg-primary text-primary-foreground p-2 rounded-lg shadow-lg shadow-primary/20">
                            <Scan size={18} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground text-xs md:text-sm">Scan Parchi</h3>
                            <p className="text-[10px] text-muted-foreground mt-0.5 max-w-sm leading-tight">Upload a photo of your handwritten appointment chit — AI will extract & WhatsApp each patient</p>
                          </div>
                        </div>

                        {/* Upload Area */}
                        <div className="w-full relative z-10 mt-auto border-2 border-dashed border-border/60 rounded-xl flex flex-col items-center justify-center py-4 px-6 hover:bg-muted/5 hover:border-primary/30 transition-all cursor-pointer bg-black/20 flex-1 min-h-[140px]">
                          <motion.div whileHover={{ scale: 1.1 }} className="bg-primary shadow-lg shadow-primary/20 text-primary-foreground w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-transform shrink-0">
                            <Camera size={16} />
                          </motion.div>
                          <h4 className="font-medium text-foreground text-xs mb-1">Upload Parchi</h4>
                          <p className="text-[9px] text-muted-foreground text-center mb-3 max-w-[200px]">Take a photo or drag & drop your handwritten appointment chit</p>

                          <div className="flex flex-wrap justify-center items-center gap-2 text-[9px] text-muted-foreground">
                            <span className="flex items-center gap-1 hover:text-primary transition-colors"><Camera size={10} /> Tap to capture</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 hover:text-primary transition-colors"><Upload size={10} /> Drag & drop</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 hover:text-primary transition-colors"><Copy size={10} /> Paste image</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>}

                    {
                      activeTab === "patients" && <motion.div key="patients" initial={{
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

                        <PatientRow name="Andrew Meyers" initials="AM" age="46y" gender="M" condition="Hypertension" conditionColor="bg-blue-500/10 text-blue-400" delay={0.05} onClick={() => setSelectedPatient("Andrew")} />
                        <PatientRow name="Brooke Burns" initials="BB" age="54y" gender="F" condition="Arthritis" conditionColor="bg-amber-500/10 text-amber-400" delay={0.1} onClick={() => setSelectedPatient("Brooke")} />
                        <PatientRow name="Christina Perry" initials="CP" age="75y" gender="O" condition="Diabetes" conditionColor="bg-red-500/10 text-red-400" delay={0.15} onClick={() => setSelectedPatient("Christina")} />
                        <PatientRow name="Chris Larson" initials="CL" age="37y" gender="M" condition="Migraine" conditionColor="bg-purple-500/10 text-purple-400" delay={0.2} onClick={() => setSelectedPatient("Chris")} />
                      </motion.div>
                    }

                    {
                      activeTab === "settings" && <motion.div key="settings" initial={{
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
                      </motion.div>
                    }
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Bottom bar with live indicator */}
          < div className="flex items-center justify-between border-t border-border/50 px-4 py-1.5 bg-card/30" >
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
          </div >
        </motion.div >

        {/* Reflection glow */}
        < motion.div animate={{
          opacity: [0.3, 0.6, 0.3]
        }} transition={{
          duration: 4,
          repeat: Infinity
        }} className="mx-auto mt-4 h-16 w-3/4 rounded-full bg-primary/5 blur-3xl" />
      </motion.div >

      {/* Feature callouts below dashboard */}
      < div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto" >
        {
          [{
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
          </motion.div>)
        }
      </div >
    </div >
  </section >;
};
export default DashboardMockup;