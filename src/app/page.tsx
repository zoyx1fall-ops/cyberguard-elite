"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { Shield, Zap, Eye, Database, Terminal, ChevronRight, Lock, AlertTriangle, CheckCircle, Users, Trophy, BarChart3, ArrowRight } from "lucide-react";

const STAGGER = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const FADE_UP = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

const modules = [
  { icon: AlertTriangle, title: "Phishing Awareness", desc: "Realistic spear-phishing simulations with decision trees. Identify attack vectors before they hit.", color: "from-cyber-red/20 to-cyber-red/5", glow: "rgba(220,38,38,0.3)", badge: "5 Scenarios", href: "/simulations/phishing" },
  { icon: Database, title: "SQL Injection", desc: "Safe mock-environment walkthrough of injection attacks. Understand the code, not exploit it.", color: "from-cyber-blue/20 to-cyber-blue/5", glow: "rgba(29,78,216,0.3)", badge: "3 Labs", href: "/simulations/sql-injection" },
  { icon: Eye, title: "Keylogger Defense", desc: "Visual simulation of keylogger mechanics. Learn to detect, prevent, and respond.", color: "from-cyber-green/20 to-cyber-green/5", glow: "rgba(5,150,105,0.3)", badge: "4 Modules", href: "/simulations/keylogger" },
];

const scenarios = [
  { title: "Grandparent Scam Bot", category: "Social Engineering", difficulty: "Beginner", color: "#7C3AED", href: "/simulations" },
  { title: "Small Business Phishing", category: "Phishing", difficulty: "Intermediate", color: "#F59E0B", href: "/simulations" },
  { title: "Fake Bank Fraud", category: "Vishing", difficulty: "Advanced", color: "#DC2626", href: "/simulations" },
];

const stats = [
  { value: "50K+", label: "Trained Professionals" },
  { value: "99.2%", label: "Threat Recognition Rate" },
  { value: "5", label: "Core Simulation Modules" },
  { value: "SOC2", label: "Compliant Platform" },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [hoveredModule, setHoveredModule] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid-bg">
      {/* NAV */}
      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-cyber-border/50 border-x-0 border-t-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-purple to-cyber-purple-light flex items-center justify-center" style={{ boxShadow: "0 0 20px rgba(124,58,237,0.5)" }}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-700 text-lg tracking-tight">CyberGuard <span className="text-cyber-gold glow-text-gold">Elite</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Platform", "Modules", "Scenarios", "Pricing"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-cyber-text-muted hover:text-cyber-text transition-colors font-body">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-cyber-text-muted hover:text-cyber-text transition-colors px-4 py-2">Sign In</Link>
            <Link href="/register" className="text-sm font-medium px-5 py-2 rounded-lg bg-gradient-to-r from-cyber-purple to-cyber-purple-light text-white transition-all hover:scale-105 hover:shadow-glow-purple">
              Start Free
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="scan-overlay" />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div variants={STAGGER} initial="hidden" animate="visible" className="flex flex-col items-center gap-6">
            <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-mono text-cyber-purple-light border border-cyber-purple/30">
              <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
              ETHICAL TRAINING PLATFORM · NO REAL EXPLOITS · SAFE ENVIRONMENT
            </motion.div>
            <motion.h1 variants={FADE_UP} className="font-display font-800 text-6xl md:text-8xl leading-[0.9] tracking-tight">
              <span className="block text-cyber-text">DEFEND</span>
              <span className="block text-cyber-text">BEFORE</span>
              <span className="block glow-text-purple" style={{ color: "#A78BFA" }}>THEY STRIKE</span>
            </motion.h1>
            <motion.p variants={FADE_UP} className="text-cyber-text-muted text-lg md:text-xl max-w-2xl leading-relaxed font-body font-300">
              Enterprise cybersecurity awareness training through <strong className="text-cyber-text font-500">guided simulations</strong>. Real attack patterns. Safe environments. Measurable results.
            </motion.p>
            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link href="/register" className="group relative overflow-hidden px-8 py-4 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-blue text-white font-display font-600 text-sm tracking-wide transition-all hover:scale-105" style={{ boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}>
                <span className="relative z-10 flex items-center gap-2">START TRAINING <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
              </Link>
              <Link href="/dashboard" className="px-8 py-4 rounded-xl glass-card text-cyber-text font-display font-600 text-sm tracking-wide hover:border-cyber-purple/50 transition-all">
                VIEW PLATFORM
              </Link>
            </motion.div>
            <motion.div variants={FADE_UP} className="flex items-center gap-6 pt-4">
              {[{ icon: Lock, text: "No Real Exploits" }, { icon: CheckCircle, text: "OWASP Compliant" }, { icon: Shield, text: "SOC2 Ready" }].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-cyber-text-muted">
                  <Icon className="w-3.5 h-3.5 text-cyber-green" />{text}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)" }} />
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-cyber-border/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <motion.div key={label} variants={FADE_UP} className="text-center">
                <div className="font-display font-800 text-4xl glow-text-purple" style={{ color: "#A78BFA" }}>{value}</div>
                <div className="text-cyber-text-muted text-sm mt-1 font-body">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="space-y-16">
            <motion.div variants={FADE_UP} className="text-center space-y-3">
              <div className="text-cyber-gold font-mono text-xs tracking-widest">CORE MODULES</div>
              <h2 className="font-display font-700 text-4xl md:text-5xl text-cyber-text">Training Arsenal</h2>
              <p className="text-cyber-text-muted max-w-xl mx-auto">Three battle-hardened simulation modules covering the most critical attack vectors targeting individuals and businesses today.</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {modules.map(({ icon: Icon, title, desc, color, glow, badge, href }, i) => (
                <motion.div key={title} variants={FADE_UP}
                  onMouseEnter={() => setHoveredModule(i)} onMouseLeave={() => setHoveredModule(null)}
                  className="group relative overflow-hidden rounded-2xl glass-card p-8 cursor-pointer transition-all duration-500"
                  style={{ boxShadow: hoveredModule === i ? `0 20px 60px ${glow}` : undefined }}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center">
                        <Icon className="w-6 h-6 text-cyber-text" />
                      </div>
                      <span className="text-xs font-mono text-cyber-text-muted glass-card px-3 py-1 rounded-full">{badge}</span>
                    </div>
                    <div>
                      <h3 className="font-display font-700 text-xl text-cyber-text mb-2">{title}</h3>
                      <p className="text-cyber-text-muted text-sm leading-relaxed">{desc}</p>
                    </div>
                    <Link href={href} className="inline-flex items-center gap-2 text-cyber-purple-light text-sm font-500 group-hover:gap-3 transition-all">
                      Explore Module <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SCENARIOS */}
      <section id="scenarios" className="py-24 bg-cyber-dark-2">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="space-y-12">
            <motion.div variants={FADE_UP} className="text-center space-y-3">
              <div className="text-cyber-gold font-mono text-xs tracking-widest">REAL-WORLD SCENARIOS</div>
              <h2 className="font-display font-700 text-4xl md:text-5xl text-cyber-text">Live Threat Simulations</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {scenarios.map(({ title, category, difficulty, color, href }) => (
                <motion.div key={title} variants={FADE_UP} className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-transform">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono px-3 py-1 rounded-full" style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>{category}</span>
                      <span className="text-xs text-cyber-text-muted">{difficulty}</span>
                    </div>
                    <h3 className="font-display font-600 text-lg text-cyber-text">{title}</h3>
                    <Link href={href} className="flex items-center gap-2 text-sm text-cyber-purple-light hover:text-cyber-text transition-colors">
                      Start Simulation <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="platform" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="space-y-16">
            <motion.div variants={FADE_UP} className="text-center">
              <div className="text-cyber-gold font-mono text-xs tracking-widest mb-3">PLATFORM FEATURES</div>
              <h2 className="font-display font-700 text-4xl text-cyber-text">Built for Enterprise</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Terminal, title: "Virtual Lab Terminal", desc: "Safe command simulation engine with predefined responses. Zero system access.", color: "text-cyber-purple-light" },
                { icon: BarChart3, title: "Analytics Dashboard", desc: "Completion rates, risk scores, and training insights across your organization.", color: "text-cyber-gold" },
                { icon: Trophy, title: "Badge System", desc: "Gamified progression with earned certificates and achievement tracking.", color: "text-cyber-green-light" },
                { icon: Users, title: "Admin Control Panel", desc: "Create custom scenarios, manage users, and view detailed simulation data.", color: "text-cyber-blue-light" },
                { icon: Lock, title: "OWASP Hardened", desc: "Rate limiting, CSRF, XSS sanitization, secure headers, JWT auth.", color: "text-cyber-red-light" },
                { icon: Zap, title: "Instant Deployment", desc: "One command setup. Docker-ready. Production-grade from day one.", color: "text-cyber-purple-light" },
              ].map(({ icon: Icon, title, desc, color }) => (
                <motion.div key={title} variants={FADE_UP} className="glass-card rounded-xl p-6 hover:border-cyber-purple/40 transition-all">
                  <Icon className={`w-6 h-6 ${color} mb-4`} />
                  <h3 className="font-display font-600 text-base text-cyber-text mb-2">{title}</h3>
                  <p className="text-cyber-text-muted text-sm">{desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-cyber-border/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="space-y-8">
            <motion.div variants={FADE_UP} className="space-y-4">
              <div className="text-cyber-gold font-mono text-xs tracking-widest">START TODAY</div>
              <h2 className="font-display font-700 text-5xl text-cyber-text">Ready to Train?</h2>
              <p className="text-cyber-text-muted text-lg">Join thousands of professionals building cyber resilience through simulation.</p>
            </motion.div>
            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="px-10 py-4 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-blue text-white font-display font-600 text-sm tracking-wide hover:scale-105 transition-all" style={{ boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}>
                CREATE FREE ACCOUNT
              </Link>
              <Link href="/login" className="px-10 py-4 rounded-xl glass-card text-cyber-text font-display font-600 text-sm tracking-wide hover:border-cyber-purple/50 transition-all">
                SIGN IN
              </Link>
            </motion.div>
            <motion.div variants={FADE_UP} className="text-xs text-cyber-text-muted font-mono">
              No credit card required · Ethical training only · GDPR compliant
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-cyber-border/30 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-cyber-purple to-cyber-purple-light flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
            <span className="font-display font-600 text-sm">CyberGuard Elite</span>
          </div>
          <p className="text-xs text-cyber-text-muted text-center">
            ⚠️ This platform is for <strong>educational simulation only</strong>. No real exploits. No real vulnerabilities. All scenarios are fictional.
          </p>
          <p className="text-xs text-cyber-text-muted">© 2024 CyberGuard Elite</p>
        </div>
      </footer>
    </div>
  );
}
