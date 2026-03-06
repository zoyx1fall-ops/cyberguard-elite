"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Shield, Database, Eye, Code, ChevronRight, CheckCircle, Clock } from "lucide-react";

const CATEGORIES = [
  { id: "phishing", label: "Phishing & Social Engineering", icon: Shield, color: "#DC2626", desc: "Email saldırıları, spear phishing, vishing" },
  { id: "sql", label: "SQL Injection", icon: Database, color: "#1D4ED8", desc: "Injection saldırıları, bypass teknikleri, savunma" },
  { id: "keylogger", label: "Keylogger & Malware", icon: Eye, color: "#7C3AED", desc: "Keylogger mimarisi, tespit, savunma" },
  { id: "xss", label: "XSS & Web Saldırıları", icon: Code, color: "#059669", desc: "Cross-site scripting, DOM manipulation" },
];

interface Section {
  id: string;
  title: string;
  content: string;
}

interface Module {
  title: string;
  sections: Section[];
}

export default function ModulesPage() {
  const [activeCategory, setActiveCategory] = useState("phishing");
  const [activeSection, setActiveSection] = useState(0);
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(false);
  const [read, setRead] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("cg_token")) {
      router.push("/login");
      return;
    }
    loadModule(activeCategory);
  }, [activeCategory]);

  async function loadModule(cat: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/modules?category=${cat}`);
      const data = await res.json();
      setModule(data.module);
      setActiveSection(0);
    } catch {
      console.error("Failed to load module");
    } finally {
      setLoading(false);
    }
  }

  function markRead(sectionId: string) {
    if (!read.includes(sectionId)) {
      setRead(v => [...v, sectionId]);
    }
  }

  const cat = CATEGORIES.find(c => c.id === activeCategory)!;

  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid-bg">
      <nav className="border-b border-cyber-border/40 glass-card border-x-0 border-t-0 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 text-cyber-text-muted hover:text-cyber-text transition-colors" />
          </Link>
          <BookOpen className="w-4 h-4 text-cyber-purple-light" />
          <span className="font-display font-600 text-sm text-cyber-text">Eğitim Modülleri</span>
          <div className="ml-auto text-xs font-mono text-cyber-gold">+10 XP / modül</div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 space-y-3">
          <div className="text-xs font-mono text-cyber-text-muted uppercase tracking-wider mb-4">Kategoriler</div>
          {CATEGORIES.map(({ id, label, icon: Icon, color, desc }) => (
            <button key={id} onClick={() => setActiveCategory(id)}
              className={`w-full text-left glass-card rounded-xl p-4 transition-all ${activeCategory === id ? "border-opacity-60" : "hover:border-cyber-border"}`}
              style={{ borderColor: activeCategory === id ? color : undefined, boxShadow: activeCategory === id ? `0 0 20px ${color}20` : undefined }}>
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                <div>
                  <div className="text-xs font-display font-600 text-cyber-text">{label}</div>
                  <div className="text-xs text-cyber-text-muted mt-0.5">{desc}</div>
                </div>
              </div>
            </button>
          ))}

          <div className="pt-4 border-t border-cyber-border/30">
            <div className="text-xs font-mono text-cyber-text-muted mb-3">HIZLI ERİŞİM</div>
            <Link href="/simulations"
              className="flex items-center gap-2 p-3 glass-card rounded-xl text-xs text-cyber-purple-light hover:border-cyber-purple/40 transition-all">
              <Shield className="w-3.5 h-3.5" />
              Simülasyonlar
              <ChevronRight className="w-3 h-3 ml-auto" />
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-cyber-purple/30 border-t-cyber-purple rounded-full mx-auto" />
              <p className="text-cyber-text-muted text-sm mt-4">Modül yükleniyor...</p>
            </div>
          ) : module ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${cat.color}20`, border: `1px solid ${cat.color}40` }}>
                    <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                  </div>
                  <h1 className="font-display font-700 text-xl text-cyber-text">{module.title}</h1>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  {module.sections.map((s, i) => (
                    <button key={s.id} onClick={() => { setActiveSection(i); markRead(s.id); }}
                      className={`flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg transition-all ${activeSection === i ? "text-white" : "text-cyber-text-muted hover:text-cyber-text glass-card"}`}
                      style={activeSection === i ? { background: cat.color } : undefined}>
                      {read.includes(s.id) && <CheckCircle className="w-3 h-3 text-cyber-green-light" />}
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="glass-card rounded-2xl p-8">
                  <div className="prose prose-invert max-w-none">
                    {module.sections[activeSection].content.split('\n').map((line, i) => {
                      if (line.startsWith('# ')) return <h1 key={i} className="font-display font-800 text-2xl text-cyber-text mt-0 mb-4">{line.slice(2)}</h1>;
                      if (line.startsWith('## ')) return <h2 key={i} className="font-display font-700 text-xl text-cyber-text mt-8 mb-3">{line.slice(3)}</h2>;
                      if (line.startsWith('### ')) return <h3 key={i} className="font-display font-600 text-base text-cyber-purple-light mt-6 mb-2">{line.slice(4)}</h3>;
                      if (line.startsWith('```')) return null;
                      if (line.startsWith('- **')) {
                        const parts = line.slice(2).split('**');
                        return <div key={i} className="flex items-start gap-2 my-1 text-sm"><span className="text-cyber-purple-light mt-0.5">•</span><span className="text-cyber-text-muted"><strong className="text-cyber-text">{parts[1]}</strong>{parts[2]}</span></div>;
                      }
                      if (line.startsWith('- ')) return <div key={i} className="flex items-start gap-2 my-1 text-sm"><span className="text-cyber-purple-light mt-0.5">•</span><span className="text-cyber-text-muted">{line.slice(2)}</span></div>;
                      if (line.match(/^\d+\./)) return <div key={i} className="text-sm text-cyber-text-muted my-1 ml-4">{line}</div>;
                      if (line === '') return <div key={i} className="h-2" />;
                      return <p key={i} className="text-cyber-text-muted text-sm leading-relaxed">{line}</p>;
                    })}
                  </div>

                  <div className="mt-8 pt-6 border-t border-cyber-border/30 flex items-center justify-between">
                    <button onClick={() => markRead(module.sections[activeSection].id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-600 transition-all ${read.includes(module.sections[activeSection].id) ? "bg-cyber-green/20 text-cyber-green-light border border-cyber-green/30" : "glass-card text-cyber-text hover:border-cyber-green/40"}`}>
                      <CheckCircle className="w-4 h-4" />
                      {read.includes(module.sections[activeSection].id) ? "Okundu ✓ (+10 XP)" : "Okundu İşaretle"}
                    </button>

                    <div className="flex items-center gap-3">
                      {activeSection > 0 && (
                        <button onClick={() => setActiveSection(v => v - 1)}
                          className="px-4 py-2 rounded-lg glass-card text-cyber-text-muted text-sm hover:text-cyber-text transition-colors">
                          ← Önceki
                        </button>
                      )}
                      {activeSection < module.sections.length - 1 && (
                        <button onClick={() => { setActiveSection(v => v + 1); markRead(module.sections[activeSection].id); }}
                          className="px-4 py-2 rounded-lg text-white text-sm font-600 hover:opacity-90 transition-opacity"
                          style={{ background: cat.color }}>
                          Sonraki →
                        </button>
                      )}
                      {activeSection === module.sections.length - 1 && (
                        <Link href="/simulations"
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyber-purple to-cyber-blue text-white text-sm font-600 hover:opacity-90 transition-opacity">
                          Uygulamaya Geç <ChevronRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="glass-card rounded-xl p-4 flex items-center gap-3">
                <Clock className="w-4 h-4 text-cyber-gold" />
                <span className="text-xs text-cyber-text-muted">İçerikler her 6 saatte bir güncellenir. Son güncelleme: Bugün</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}