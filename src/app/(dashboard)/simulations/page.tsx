"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, AlertTriangle, CheckCircle, XCircle, ChevronRight, ArrowLeft, BookOpen, Lock, Lightbulb, Flag, Star, Zap, Trophy } from "lucide-react";

interface Choice { label: string; correct: boolean; consequence: string; }
interface Step { id: number; title: string; content: string; choices: Choice[]; educationNote: string; realWorldExample?: string; }
interface Scenario { id: string; slug: string; title: string; description: string; category: string; difficulty: string; steps: Step[]; }

const DIFFICULTIES = [
  { id: "easy", label: "EASY", color: "#059669", desc: "3 ipucu hakkı, yol gösterici", multiplier: 1 },
  { id: "normal", label: "NORMAL", color: "#1D4ED8", desc: "1 ipucu hakkı, standart", multiplier: 1.5 },
  { id: "hard", label: "HARD", color: "#F59E0B", desc: "İpucu yok, süre baskısı", multiplier: 2 },
  { id: "legend", label: "LEGEND", color: "#DC2626", desc: "Tek şans, geri dönüş yok", multiplier: 3 },
  { id: "impossible", label: "IMPOSSIBLE", color: "#7C3AED", desc: "Karışık sorular, tuzak cevaplar", multiplier: 5 },
];

const STAGGER = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const FADE_UP = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function SimulationsPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [active, setActive] = useState<Scenario | null>(null);
  const [selectedDiff, setSelectedDiff] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [showGiveUpConfirm, setShowGiveUpConfirm] = useState(false);
  const [showFullCode, setShowFullCode] = useState(false);
  const [diffSelect, setDiffSelect] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("cg_token")) { router.push("/login"); return; }
    fetch("/api/simulations").then(r => r.json()).then(d => setScenarios(d.scenarios || []));
  }, [router]);

  const diff = DIFFICULTIES.find(d => d.id === selectedDiff) || DIFFICULTIES[0];
  const maxHints = selectedDiff === "easy" ? 3 : selectedDiff === "normal" ? 1 : 0;

  function startWithDiff(scenario: Scenario, diffId: string) {
    setActive(scenario);
    setSelectedDiff(diffId);
    setStep(0);
    setChosen(null);
    setScore(0);
    setDone(false);
    setHintsUsed(0);
    setShowHint(false);
    setGaveUp(false);
    setDiffSelect(false);
    setShowFullCode(false);
  }

  function selectChoice(i: number) {
    if (chosen !== null) return;
    setChosen(i);
    const c = active!.steps[step].choices[i];
    if (c.correct) {
      const baseXP = 40 / active!.steps.length;
      const hintPenalty = hintsUsed * 5;
      setScore(v => v + Math.round((baseXP - hintPenalty) * diff.multiplier));
    }
  }

  function useHint() {
    if (hintsUsed >= maxHints || chosen !== null) return;
    setHintsUsed(v => v + 1);
    setShowHint(true);
  }

  function giveUp() {
    setShowGiveUpConfirm(false);
    setGaveUp(true);
    setShowFullCode(true);
  }

  function nextStep() {
    if (step < active!.steps.length - 1) {
      setStep(v => v + 1);
      setChosen(null);
      setShowHint(false);
    } else {
      setDone(true);
    }
  }

  const diffColor: Record<string, string> = { PHISHING: "#1D4ED8", SQL_INJECTION: "#7C3AED", KEYLOGGER: "#059669", SOCIAL_ENGINEERING: "#DC2626" };
  const diffLabelColor: Record<string, string> = { BEGINNER: "#059669", INTERMEDIATE: "#F59E0B", ADVANCED: "#DC2626" };

  // Difficulty selection screen
  if (diffSelect && active) {
    return (
      <div className="min-h-screen bg-cyber-dark cyber-grid-bg flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="text-cyber-gold font-mono text-xs tracking-widest">ZORLUK SEÇ</div>
            <h2 className="font-display font-700 text-3xl text-cyber-text">{active.title}</h2>
            <p className="text-cyber-text-muted text-sm">Zorluk seviyeni seç. Daha zor = Daha fazla XP</p>
          </div>
          <div className="space-y-3">
            {DIFFICULTIES.map((d) => (
              <motion.button key={d.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => startWithDiff(active, d.id)}
                className="w-full glass-card rounded-xl p-5 text-left hover:border-opacity-60 transition-all"
                style={{ borderColor: `${d.color}40` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-800 text-sm"
                      style={{ background: `${d.color}20`, color: d.color, border: `1px solid ${d.color}40` }}>
                      {d.label[0]}
                    </div>
                    <div>
                      <div className="font-display font-700 text-base" style={{ color: d.color }}>{d.label}</div>
                      <div className="text-xs text-cyber-text-muted">{d.desc}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm" style={{ color: d.color }}>x{d.multiplier} XP</div>
                    <div className="text-xs text-cyber-text-muted">çarpan</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
          <button onClick={() => { setDiffSelect(false); setActive(null); }}
            className="w-full py-3 rounded-xl glass-card text-cyber-text-muted text-sm hover:text-cyber-text transition-colors">
            İptal
          </button>
        </motion.div>
      </div>
    );
  }

  // Active simulation
  if (active && selectedDiff) {
    const currentStep = active.steps[step];
    return (
      <div className="min-h-screen bg-cyber-dark cyber-grid-bg">
        <nav className="border-b border-cyber-border/40 glass-card border-x-0 border-t-0 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-4">
            <button onClick={() => { setActive(null); setSelectedDiff(null); }} className="text-cyber-text-muted hover:text-cyber-text transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="font-display font-600 text-sm text-cyber-text flex-1">{active.title}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: `${diff.color}20`, color: diff.color }}>{diff.label}</span>
              <span className="text-xs font-mono text-cyber-text-muted">Adım {step + 1}/{active.steps.length}</span>
              <span className="text-xs font-mono text-cyber-gold">+{score} XP</span>
            </div>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-6 py-10">
          {!done && !gaveUp ? (
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="glass-card rounded-2xl p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-cyber-text-muted">
                      <AlertTriangle className="w-3.5 h-3.5 text-cyber-gold" />
                      SENARYO · ADIM {step + 1}
                    </div>
                    <div className="h-1.5 w-32 bg-cyber-dark-3 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyber-purple to-cyber-blue rounded-full transition-all"
                        style={{ width: `${((step) / active.steps.length) * 100}%` }} />
                    </div>
                  </div>
                  <h2 className="font-display font-700 text-2xl text-cyber-text">{currentStep.title}</h2>
                  <p className="text-cyber-text text-base leading-relaxed whitespace-pre-line">{currentStep.content}</p>
                </div>

                {/* Hint */}
                {showHint && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-xl p-4 border border-cyber-gold/30 bg-cyber-gold/5">
                    <div className="flex items-center gap-2 text-xs font-mono text-cyber-gold mb-2">
                      <Lightbulb className="w-3.5 h-3.5" /> İPUCU (-5 XP)
                    </div>
                    <p className="text-cyber-text-muted text-sm">{currentStep.educationNote}</p>
                  </motion.div>
                )}

                <div className="space-y-3">
                  <div className="text-xs font-mono text-cyber-text-muted uppercase tracking-wider">Cevabını seç:</div>
                  {currentStep.choices.map((c, i) => (
                    <motion.button key={i} onClick={() => selectChoice(i)} disabled={chosen !== null}
                      whileHover={chosen === null ? { scale: 1.01 } : {}}
                      className={`w-full text-left p-5 rounded-xl border transition-all ${chosen === null ? "glass-card hover:border-cyber-purple/50 cursor-pointer" : i === chosen ? (c.correct ? "border-cyber-green bg-cyber-green/10" : "border-cyber-red bg-cyber-red/10") : "glass-card opacity-40"}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex-shrink-0 border flex items-center justify-center mt-0.5 ${chosen === i ? (c.correct ? "border-cyber-green bg-cyber-green" : "border-cyber-red bg-cyber-red") : "border-cyber-border"}`}>
                          {chosen === i && (c.correct ? <CheckCircle className="w-3 h-3 text-white" /> : <XCircle className="w-3 h-3 text-white" />)}
                        </div>
                        <span className="text-sm text-cyber-text">{c.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {chosen !== null ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className={`glass-card rounded-xl p-5 border ${currentStep.choices[chosen].correct ? "border-cyber-green/40 bg-cyber-green/5" : "border-cyber-red/40 bg-cyber-red/5"}`}>
                      <div className={`text-sm font-600 mb-1 ${currentStep.choices[chosen].correct ? "text-cyber-green-light" : "text-cyber-red-light"}`}>
                        {currentStep.choices[chosen].correct ? "✓ Doğru Cevap!" : "✗ Yanlış Cevap"}
                      </div>
                      <p className="text-cyber-text-muted text-sm">{currentStep.choices[chosen].consequence}</p>
                    </div>
                    <div className="glass-card rounded-xl p-5 border border-cyber-blue/30 bg-cyber-blue/5">
                      <div className="flex items-center gap-2 text-xs font-mono text-cyber-blue-light mb-2">
                        <BookOpen className="w-3.5 h-3.5" /> EĞİTİM NOTU
                      </div>
                      <p className="text-cyber-text-muted text-sm">{currentStep.educationNote}</p>
                      {currentStep.realWorldExample && (
                        <div className="mt-3 pt-3 border-t border-cyber-border/30">
                          <div className="text-xs font-mono text-cyber-gold mb-1">GERÇEK DÜNYA ÖRNEĞİ</div>
                          <p className="text-cyber-text-muted text-xs">{currentStep.realWorldExample}</p>
                        </div>
                      )}
                    </div>
                    <button onClick={nextStep}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-blue text-white font-display font-600 text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                      {step < active.steps.length - 1 ? <><span>Sonraki Adım</span><ChevronRight className="w-4 h-4" /></> : <span>Sonuçları Gör</span>}
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex gap-3">
                    {maxHints > 0 && hintsUsed < maxHints && (
                      <button onClick={useHint}
                        className="flex-1 py-3 rounded-xl glass-card text-cyber-gold text-sm font-display font-600 flex items-center justify-center gap-2 hover:border-cyber-gold/40 transition-all">
                        <Lightbulb className="w-4 h-4" />
                        İpucu ({maxHints - hintsUsed} hak)
                      </button>
                    )}
                    <button onClick={() => setShowGiveUpConfirm(true)}
                      className="flex-1 py-3 rounded-xl glass-card text-cyber-red-light text-sm font-display font-600 flex items-center justify-center gap-2 hover:border-cyber-red/40 transition-all">
                      <Flag className="w-4 h-4" />
                      Pes Et
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : gaveUp ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="glass-card rounded-2xl p-8 border border-cyber-red/30">
                <div className="text-center space-y-2 mb-6">
                  <div className="text-4xl">🏳️</div>
                  <h2 className="font-display font-700 text-2xl text-cyber-red-light">Pes Ettin</h2>
                  <p className="text-cyber-text-muted text-sm">Bu adımdan puan kazanamadın. Ama öğrenebilirsin:</p>
                </div>
                {showFullCode && (
                  <div className="space-y-4">
                    <div className="glass-card rounded-xl p-5 border border-cyber-blue/30 bg-cyber-blue/5">
                      <div className="text-xs font-mono text-cyber-blue-light mb-2">TAM AÇIKLAMA</div>
                      <p className="text-cyber-text text-sm">{currentStep.educationNote}</p>
                      {currentStep.realWorldExample && (
                        <div className="mt-3 pt-3 border-t border-cyber-border/30">
                          <div className="text-xs font-mono text-cyber-gold mb-1">GERÇEK ÖRNEK</div>
                          <p className="text-cyber-text-muted text-xs">{currentStep.realWorldExample}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => startWithDiff(active, selectedDiff)}
                        className="flex-1 py-3 rounded-xl glass-card text-cyber-text text-sm font-display font-600 hover:border-cyber-purple/50 transition-all">
                        Tekrar Dene
                      </button>
                      <button onClick={() => { setActive(null); setSelectedDiff(null); }}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-blue text-white text-sm font-display font-600 hover:opacity-90 transition-opacity">
                        Senaryolara Dön
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-10 text-center space-y-6">
              <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center"
                style={{ background: score >= 20 ? "rgba(5,150,105,0.2)" : "rgba(220,38,38,0.2)", border: `2px solid ${score >= 20 ? "#059669" : "#DC2626"}`, boxShadow: `0 0 30px ${score >= 20 ? "rgba(5,150,105,0.3)" : "rgba(220,38,38,0.3)"}` }}>
                {score >= 20 ? <Trophy className="w-10 h-10 text-cyber-green-light" /> : <Shield className="w-10 h-10 text-cyber-red-light" />}
              </div>
              <div>
                <div className="text-cyber-text-muted text-sm font-mono mb-1">SİMÜLASYON TAMAMLANDI · {diff.label}</div>
                <h2 className="font-display font-700 text-5xl text-cyber-text">+{score} <span className="text-cyber-gold text-2xl">XP</span></h2>
                <p className="text-cyber-text-muted mt-2 text-sm">
                  {hintsUsed > 0 && `${hintsUsed} ipucu kullandın (-${hintsUsed * 5} XP). `}
                  {score >= 20 ? "Harika performans! Tehditleri tespit ettin." : "Tekrar dene ve eğitim notlarını oku."}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-cyber-border/30">
                <div><div className="text-xs text-cyber-text-muted font-mono">Zorluk</div><div className="font-mono text-sm mt-1" style={{ color: diff.color }}>{diff.label}</div></div>
                <div><div className="text-xs text-cyber-text-muted font-mono">İpucu</div><div className="font-mono text-sm mt-1 text-cyber-red-light">{hintsUsed} kullanıldı</div></div>
                <div><div className="text-xs text-cyber-text-muted font-mono">Çarpan</div><div className="font-mono text-sm mt-1 text-cyber-gold">x{diff.multiplier}</div></div>
              </div>
              <div className="flex gap-3 justify-center">
                <button onClick={() => startWithDiff(active, selectedDiff)}
                  className="px-6 py-3 rounded-xl glass-card text-cyber-text text-sm font-display font-600 hover:border-cyber-purple/50 transition-all">
                  Tekrar Oyna
                </button>
                <button onClick={() => { setActive(null); setSelectedDiff(null); }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-blue text-white text-sm font-display font-600 hover:opacity-90 transition-opacity">
                  Tüm Senaryolar
                </button>
              </div>
            </motion.div>
          )}
        </main>

        {/* Give up confirm modal */}
        <AnimatePresence>
          {showGiveUpConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="glass-card rounded-2xl p-8 max-w-sm w-full text-center space-y-4">
                <div className="text-4xl">🏳️</div>
                <h3 className="font-display font-700 text-xl text-cyber-text">Pes Etmek İstiyor musun?</h3>
                <p className="text-cyber-text-muted text-sm">Bu adımdan puan kazanamayacaksın ama tam açıklama gösterilecek.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowGiveUpConfirm(false)}
                    className="flex-1 py-3 rounded-xl glass-card text-cyber-text text-sm font-600 hover:border-cyber-purple/50 transition-all">
                    Vazgeç
                  </button>
                  <button onClick={giveUp}
                    className="flex-1 py-3 rounded-xl bg-cyber-red text-white text-sm font-600 hover:opacity-90 transition-opacity">
                    Pes Et
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Scenario list
  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid-bg">
      <nav className="border-b border-cyber-border/40 glass-card border-x-0 border-t-0 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/dashboard"><ArrowLeft className="w-4 h-4 text-cyber-text-muted hover:text-cyber-text transition-colors" /></Link>
          <Shield className="w-4 h-4 text-cyber-purple-light" />
          <span className="font-display font-600 text-sm text-cyber-text">Simülasyon Kütüphanesi</span>
          <div className="ml-auto flex items-center gap-2 text-xs font-mono text-cyber-green-light">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
            GÜVENLİ ORTAM
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-10">
        <motion.div initial="hidden" animate="visible" variants={STAGGER} className="space-y-8">
          <motion.div variants={FADE_UP}>
            <h1 className="font-display font-700 text-3xl text-cyber-text">Simülasyon Kütüphanesi</h1>
            <p className="text-cyber-text-muted text-sm mt-1">Tüm senaryolar eğitim simülasyonudur. Gerçek sistem etkilenmez.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {scenarios.map((s) => (
              <motion.div key={s.id} variants={FADE_UP} whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-6 hover:border-cyber-purple/40 transition-all cursor-pointer"
                onClick={() => { setActive(s); setDiffSelect(true); }}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full"
                      style={{ background: `${diffColor[s.category] || "#7C3AED"}20`, color: diffColor[s.category] || "#A78BFA", border: `1px solid ${diffColor[s.category] || "#7C3AED"}40` }}>
                      {s.category.replace("_", " ")}
                    </span>
                    <span className="text-xs font-mono" style={{ color: diffLabelColor[s.difficulty] || "#94A3B8" }}>{s.difficulty}</span>
                  </div>
                  <div>
                    <h3 className="font-display font-600 text-base text-cyber-text mb-1">{s.title}</h3>
                    <p className="text-cyber-text-muted text-xs leading-relaxed line-clamp-2">{s.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-cyber-border/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-cyber-text-muted font-mono">{s.steps.length} adım</span>
                      <span className="text-xs text-cyber-gold font-mono flex items-center gap-1"><Star className="w-3 h-3" />40 XP</span>
                    </div>
                    <span className="text-xs text-cyber-purple-light flex items-center gap-1">Başla <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </div>
              </motion.div>
            ))}
            {[
              { title: "Ağ İzinsiz Giriş Tespiti", tag: "YAKINDA" },
              { title: "Ransomware Müdahalesi", tag: "YAKINDA" },
              { title: "İçeriden Tehdit", tag: "YAKINDA" },
            ].map(({ title, tag }) => (
              <motion.div key={title} variants={FADE_UP} className="glass-card rounded-2xl p-6 opacity-40 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyber-text-muted glass-card px-4 py-2 rounded-full">
                    <Lock className="w-3 h-3" />{tag}
                  </div>
                </div>
                <div className="space-y-3 blur-sm">
                  <div className="h-4 bg-cyber-border rounded w-24" />
                  <div className="h-5 bg-cyber-border rounded w-40" />
                  <div className="h-3 bg-cyber-border rounded w-full" />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={FADE_UP} className="glass-card rounded-2xl p-6 border border-cyber-gold/20">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-cyber-gold" />
              <h2 className="font-display font-600 text-cyber-text">Puan Sistemi</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { label: "Modül Okuma", value: "+10 XP", color: "text-cyber-green-light" },
                { label: "Uygulama Tamamlama", value: "+40 XP", color: "text-cyber-gold" },
                { label: "İpucu Kullanma", value: "-5 XP", color: "text-cyber-red-light" },
                { label: "Pes Etme", value: "0 XP", color: "text-cyber-text-muted" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-cyber-dark-3 rounded-xl p-4">
                  <div className={`font-display font-700 text-lg ${color}`}>{value}</div>
                  <div className="text-xs text-cyber-text-muted mt-1">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}