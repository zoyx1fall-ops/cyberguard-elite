"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Trophy, Target, Clock, ArrowRight, LogOut, Terminal, Star, Users, ChevronUp, GraduationCap } from "lucide-react";

const LEAGUES = [
  { name: "TRY", color: "#60A5FA", modules: 3, desc: "Başlangıç" },
  { name: "JUNIOR", color: "#A78BFA", modules: 6, desc: "Gelişen" },
  { name: "SENIOR", color: "#FCD34D", modules: 10, desc: "Uzman" },
  { name: "BIG SENIOR", color: "#F97316", modules: 30, desc: "İleri Uzman" },
  { name: "HACK GOD", color: "#EC4899", modules: 80, desc: "Efsane" },
];

const STAGGER = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const FADE_UP = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "leaderboard" | "leagues">("overview");
  const [leaderboard, setLeaderboard] = useState<{ rank: number; name: string; score: number; league: string }[]>([]);
  const router = useRouter();
  const userScore = 120;
  const userLeague = LEAGUES[0];

  useEffect(() => {
    const stored = localStorage.getItem("cg_user");
    if (!stored) { router.push("/login"); return; }
    setUser(JSON.parse(stored));
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("cg_token");
    fetch("/api/leaderboard", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data.users) setLeaderboard(data.users); })
      .catch(() => {});
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid-bg">
      <nav className="border-b border-cyber-border/40 glass-card border-x-0 border-t-0 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyber-purple to-cyber-purple-light flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-700 text-sm">CyberGuard <span className="text-cyber-gold">Elite</span></span>
          </div>
          <div className="flex items-center gap-6">
            {[
              { id: "overview", label: "Panel" },
              { id: "leaderboard", label: "Sıralama" },
              { id: "leagues", label: "Ligler" },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => setActiveTab(id as typeof activeTab)}
                className={`text-xs font-mono transition-colors ${activeTab === id ? "text-cyber-purple-light" : "text-cyber-text-muted hover:text-cyber-text"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-mono text-cyber-gold">{userLeague.name}</div>
              <div className="text-xs text-cyber-text-muted">{userScore} XP</div>
            </div>
            <button onClick={() => { localStorage.clear(); router.push("/"); }} className="text-cyber-text-muted hover:text-cyber-red-light transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === "overview" && (
          <motion.div initial="hidden" animate="visible" variants={STAGGER} className="space-y-8">
            <motion.div variants={FADE_UP} className="flex items-start justify-between">
              <div>
                <h1 className="font-display font-700 text-3xl text-cyber-text">
                  Hoş geldin, <span className="text-cyber-purple-light">{user.name.split(" ")[0]}</span>
                </h1>
                <p className="text-cyber-text-muted text-sm mt-1">Eğitimine devam et. Her modül seni bir adım öteye taşır.</p>
              </div>
              <div className="glass-card rounded-xl px-5 py-3 text-center">
                <div className="font-display font-700 text-2xl" style={{ color: userLeague.color }}>{userLeague.name}</div>
                <div className="text-xs text-cyber-text-muted font-mono">{userScore} XP</div>
              </div>
            </motion.div>

            <motion.div variants={FADE_UP} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Tamamlanan", value: "1", icon: Trophy, color: "text-cyber-gold" },
                { label: "Devam Eden", value: "2", icon: Clock, color: "text-cyber-purple-light" },
                { label: "Ortalama Puan", value: "95%", icon: Target, color: "text-cyber-green-light" },
                { label: "Sıralama", value: `#${leaderboard.length > 0 ? leaderboard.length : "-"}`, icon: Users, color: "text-cyber-blue-light" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="glass-card rounded-xl p-5 space-y-3">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <div>
                    <div className="font-display font-700 text-2xl text-cyber-text">{value}</div>
                    <div className="text-cyber-text-muted text-xs font-mono">{label}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={FADE_UP} className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-600 text-cyber-text">Sonraki Lig: JUNIOR</h2>
                <span className="text-xs font-mono text-cyber-text-muted">3 modül gerekli</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-cyber-text-muted">İlerleme</span>
                  <span className="text-cyber-purple-light">1 / 3 modül</span>
                </div>
                <div className="h-2 bg-cyber-dark-3 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "33%" }} transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-cyber-purple to-cyber-blue" />
                </div>
              </div>
            </motion.div>

            <motion.div variants={FADE_UP}>
              <h2 className="font-display font-600 text-lg text-cyber-text mb-4">Eğitim Platformu</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card rounded-2xl p-6 border border-cyber-blue/20 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyber-blue/20 border border-cyber-blue/40 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-cyber-blue-light" />
                    </div>
                    <div>
                      <div className="font-display font-700 text-cyber-text">Eğitim Modülleri</div>
                      <div className="text-xs text-cyber-text-muted">Teknik içerik, kod örnekleri, gerçek vakalar</div>
                    </div>
                  </div>
                  <Link href="/modules"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-cyber-blue/20 border border-cyber-blue/40 text-cyber-blue-light text-sm font-display font-600 hover:bg-cyber-blue/30 transition-all">
                    <GraduationCap className="w-4 h-4" />Modüllere Git<ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="glass-card rounded-2xl p-6 border border-cyber-purple/20 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyber-purple/20 border border-cyber-purple/40 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-cyber-purple-light" />
                    </div>
                    <div>
                      <div className="font-display font-700 text-cyber-text">Simülasyonlar</div>
                      <div className="text-xs text-cyber-text-muted">4 şıklı sorular, zorluk modları, XP kazan</div>
                    </div>
                  </div>
                  <Link href="/simulations"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-cyber-purple/20 border border-cyber-purple/40 text-cyber-purple-light text-sm font-display font-600 hover:bg-cyber-purple/30 transition-all">
                    <Shield className="w-4 h-4" />Simülasyonlara Git<ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div variants={FADE_UP} className="grid md:grid-cols-3 gap-4">
              <Link href="/terminal" className="glass-card rounded-xl p-5 hover:border-cyber-gold/40 transition-all group">
                <Terminal className="w-5 h-5 text-cyber-gold mb-3" />
                <div className="font-display font-600 text-sm text-cyber-text">Sanal Terminal</div>
                <div className="text-xs text-cyber-text-muted mt-1">Güvenli lab ortamı</div>
                <ArrowRight className="w-4 h-4 text-cyber-text-muted mt-3 group-hover:text-cyber-gold group-hover:translate-x-1 transition-all" />
              </Link>
              <button onClick={() => setActiveTab("leaderboard")} className="glass-card rounded-xl p-5 hover:border-cyber-purple/40 transition-all group text-left">
                <Trophy className="w-5 h-5 text-cyber-purple-light mb-3" />
                <div className="font-display font-600 text-sm text-cyber-text">Liderlik Tablosu</div>
                <div className="text-xs text-cyber-text-muted mt-1">Sıralamanda yüksel</div>
                <ArrowRight className="w-4 h-4 text-cyber-text-muted mt-3 group-hover:text-cyber-purple-light group-hover:translate-x-1 transition-all" />
              </button>
              <button onClick={() => setActiveTab("leagues")} className="glass-card rounded-xl p-5 hover:border-cyber-gold/40 transition-all group text-left">
                <Star className="w-5 h-5 text-cyber-gold mb-3" />
                <div className="font-display font-600 text-sm text-cyber-text">Lig Sistemi</div>
                <div className="text-xs text-cyber-text-muted mt-1">Ligleri keşfet</div>
                <ArrowRight className="w-4 h-4 text-cyber-text-muted mt-3 group-hover:text-cyber-gold group-hover:translate-x-1 transition-all" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {activeTab === "leaderboard" && (
          <motion.div initial="hidden" animate="visible" variants={STAGGER} className="space-y-6">
            <motion.div variants={FADE_UP}>
              <h1 className="font-display font-700 text-3xl text-cyber-text">Liderlik Tablosu</h1>
              <p className="text-cyber-text-muted text-sm mt-1">Gerçek kullanıcı sıralaması</p>
            </motion.div>
            {leaderboard.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-cyber-text-muted" />
                <p className="text-cyber-text-muted">Henüz sıralamada kullanıcı yok. İlk sen ol!</p>
              </div>
            ) : (
              <>
                <motion.div variants={FADE_UP} className="grid grid-cols-3 gap-4">
                  {leaderboard.slice(0, 3).map((u, i) => {
                    const league = LEAGUES.find(l => l.name === u.league);
                    return (
                      <div key={u.rank} className={`glass-card rounded-2xl p-6 text-center ${i === 0 ? "border-cyber-gold/40" : ""}`}
                        style={{ boxShadow: i === 0 ? "0 0 30px rgba(245,158,11,0.2)" : undefined }}>
                        <div className="text-3xl mb-2">{["👑", "🥈", "🥉"][i]}</div>
                        <div className="font-display font-700 text-lg text-cyber-text">{u.name}</div>
                        <div className="font-display font-700 text-2xl mt-3" style={{ color: league?.color }}>{u.score.toLocaleString()}</div>
                        <div className="text-xs text-cyber-text-muted font-mono">XP · {u.league}</div>
                      </div>
                    );
                  })}
                </motion.div>
                <motion.div variants={FADE_UP} className="glass-card rounded-2xl overflow-hidden">
                  {leaderboard.map((u) => {
                    const league = LEAGUES.find(l => l.name === u.league);
                    const isMe = u.name === user?.name;
                    return (
                      <div key={u.rank} className={`flex items-center gap-4 px-6 py-4 border-b border-cyber-border/20 transition-colors ${isMe ? "bg-cyber-purple/10" : "hover:bg-cyber-dark-3"}`}>
                        <div className={`w-8 text-center font-display font-700 ${u.rank <= 3 ? "text-cyber-gold" : "text-cyber-text-muted"}`}>
                          {u.rank <= 3 ? ["🥇", "🥈", "🥉"][u.rank - 1] : `#${u.rank}`}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-display font-600 text-sm ${isMe ? "text-cyber-purple-light" : "text-cyber-text"}`}>{u.name}</span>
                            {isMe && <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(124,58,237,0.2)", color: "#A78BFA" }}>Sen</span>}
                          </div>
                          <div className="text-xs text-cyber-text-muted font-mono">{u.league}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-display font-700" style={{ color: league?.color }}>{u.score.toLocaleString()}</div>
                          <div className="text-xs text-cyber-text-muted font-mono">XP</div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </>
            )}
          </motion.div>
        )}

        {activeTab === "leagues" && (
          <motion.div initial="hidden" animate="visible" variants={STAGGER} className="space-y-6">
            <motion.div variants={FADE_UP}>
              <h1 className="font-display font-700 text-3xl text-cyber-text">Lig Sistemi</h1>
              <p className="text-cyber-text-muted text-sm mt-1">Her ligde modülleri oku ve simülasyonları tamamla.</p>
            </motion.div>
            <div className="space-y-4">
              {LEAGUES.map((league, i) => (
                <motion.div key={league.name} variants={FADE_UP}
                  className={`glass-card rounded-2xl p-6 ${league.name === userLeague.name ? "border-2" : ""}`}
                  style={{ borderColor: league.name === userLeague.name ? league.color : undefined }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-800 text-lg"
                        style={{ background: `${league.color}20`, color: league.color, border: `1px solid ${league.color}40` }}>
                        {["🔵", "🟣", "🟡", "🟠", "🔴"][i]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-700 text-lg" style={{ color: league.color }}>{league.name}</span>
                          {league.name === userLeague.name && (
                            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyber-green/20 text-cyber-green-light border border-cyber-green/30">Mevcut</span>
                          )}
                        </div>
                        <div className="text-xs text-cyber-text-muted">{league.desc}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-700 text-xl" style={{ color: league.color }}>{league.modules}</div>
                      <div className="text-xs text-cyber-text-muted font-mono">modül gerekli</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div variants={FADE_UP} className="glass-card rounded-2xl p-6 border border-cyber-gold/30">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-5 h-5 text-cyber-gold" />
                <h2 className="font-display font-600 text-cyber-text">Yükselme Kuralları</h2>
              </div>
              <div className="space-y-2 text-sm text-cyber-text-muted">
                <div className="flex items-start gap-2"><ChevronUp className="w-4 h-4 text-cyber-green-light mt-0.5" /><span>Tüm modülleri oku</span></div>
                <div className="flex items-start gap-2"><ChevronUp className="w-4 h-4 text-cyber-green-light mt-0.5" /><span>1 hafta boyunca liginde ilk 5'te kal</span></div>
                <div className="flex items-start gap-2"><ChevronUp className="w-4 h-4 text-cyber-gold mt-0.5" /><span>Pes etmek o uygulamadan puan kazanmanı engeller</span></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}