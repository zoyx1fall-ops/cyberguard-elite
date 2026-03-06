"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Users, BookOpen, BarChart3, ArrowLeft, LogOut, CheckCircle, Search, Plus, Minus, Ban, Trash2, ChevronUp, ChevronDown, Star } from "lucide-react";

const LEAGUES = [
  { name: "TRY", color: "#60A5FA" },
  { name: "JUNIOR", color: "#A78BFA" },
  { name: "SENIOR", color: "#F59E0B" },
  { name: "BIG SENIOR", color: "#F97316" },
  { name: "HACK GOD", color: "#EC4899" },
];

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  score: number;
  league: string;
  banned: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "stats">("users");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [actionModal, setActionModal] = useState<string | null>(null);
  const [pointAmount, setPointAmount] = useState(100);
  const [notification, setNotification] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("cg_user");
    if (!stored) { router.push("/login"); return; }
    const u = JSON.parse(stored);
    if (u.role !== "ADMIN") { router.push("/dashboard"); return; }
    setUser(u);
    loadUsers();
  }, [router]);

  async function loadUsers() {
    const token = localStorage.getItem("cg_token");
    try {
      const res = await fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch { 
      // Fallback fake data
      setUsers([
        { id: "1", name: "demo", email: "demo@cyberguard.local", role: "USER", score: 120, league: "TRY", banned: false, createdAt: new Date().toISOString() },
        { id: "2", name: "0xShadow", email: "0xShadow@cyberguard.local", role: "USER", score: 4820, league: "HACK GOD", banned: false, createdAt: new Date().toISOString() },
        { id: "3", name: "NullByte", email: "NullByte@cyberguard.local", role: "USER", score: 3950, league: "HACK GOD", banned: false, createdAt: new Date().toISOString() },
        { id: "4", name: "Kr3ator", email: "Kr3ator@cyberguard.local", role: "USER", score: 3210, league: "BIG SENIOR", banned: false, createdAt: new Date().toISOString() },
        { id: "5", name: "xpl01t", email: "xpl01t@cyberguard.local", role: "USER", score: 980, league: "JUNIOR", banned: true, createdAt: new Date().toISOString() },
      ]);
    }
  }

  function getLeagueByScore(score: number) {
    if (score >= 3000) return "HACK GOD";
    if (score >= 1000) return "BIG SENIOR";
    if (score >= 400) return "SENIOR";
    if (score >= 100) return "JUNIOR";
    return "TRY";
  }

  function showNotif(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  }

  function addPoints(amount: number) {
    if (!selectedUser) return;
    setUsers(v => v.map(u => u.id === selectedUser.id ? {
      ...u,
      score: Math.max(0, u.score + amount),
      league: getLeagueByScore(Math.max(0, u.score + amount))
    } : u));
    setSelectedUser(v => v ? { ...v, score: Math.max(0, v.score + amount), league: getLeagueByScore(Math.max(0, v.score + amount)) } : v);
    showNotif(`${amount > 0 ? "+" : ""}${amount} XP uygulandı → ${selectedUser.name}`);
  }

  function promoteUser() {
    if (!selectedUser) return;
    const idx = LEAGUES.findIndex(l => l.name === selectedUser.league);
    if (idx >= LEAGUES.length - 1) { showNotif("Zaten en yüksek lig!"); return; }
    const newLeague = LEAGUES[idx + 1].name;
    const newScore = [0, 100, 400, 1000, 3000][idx + 1];
    setUsers(v => v.map(u => u.id === selectedUser.id ? { ...u, league: newLeague, score: newScore } : u));
    setSelectedUser(v => v ? { ...v, league: newLeague, score: newScore } : v);
    showNotif(`${selectedUser.name} → ${newLeague} ligine yükseltildi!`);
  }

  function demoteUser() {
    if (!selectedUser) return;
    const idx = LEAGUES.findIndex(l => l.name === selectedUser.league);
    if (idx <= 0) { showNotif("Zaten en düşük lig!"); return; }
    const newLeague = LEAGUES[idx - 1].name;
    const newScore = [0, 50, 200, 600, 1500][idx - 1];
    setUsers(v => v.map(u => u.id === selectedUser.id ? { ...u, league: newLeague, score: newScore } : u));
    setSelectedUser(v => v ? { ...v, league: newLeague, score: newScore } : v);
    showNotif(`${selectedUser.name} → ${newLeague} ligine düşürüldü!`);
  }

  function banUser() {
    if (!selectedUser) return;
    setUsers(v => v.map(u => u.id === selectedUser.id ? { ...u, banned: !u.banned } : u));
    setSelectedUser(v => v ? { ...v, banned: !v.banned } : v);
    showNotif(`${selectedUser.name} ${selectedUser.banned ? "ban kaldırıldı" : "banlandı"}!`);
    setActionModal(null);
  }

  function resetPoints() {
    if (!selectedUser) return;
    setUsers(v => v.map(u => u.id === selectedUser.id ? { ...u, score: 0, league: "TRY" } : u));
    setSelectedUser(v => v ? { ...v, score: 0, league: "TRY" } : v);
    showNotif(`${selectedUser.name} puanları sıfırlandı!`);
    setActionModal(null);
  }

  function deleteUser() {
    if (!selectedUser) return;
    setUsers(v => v.filter(u => u.id !== selectedUser.id));
    setSelectedUser(null);
    showNotif(`${selectedUser.name} silindi!`);
    setActionModal(null);
  }

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0A0A0F 0%, #1A0A2E 50%, #0A0A0F 100%)" }}>
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl text-sm font-mono"
            style={{ background: "rgba(5,150,105,0.9)", color: "#fff", border: "1px solid rgba(5,150,105,0.5)", boxShadow: "0 0 30px rgba(5,150,105,0.3)" }}>
            ✓ {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className="border-b sticky top-0 z-50" style={{ background: "rgba(10,5,20,0.9)", backdropFilter: "blur(20px)", borderColor: "rgba(124,58,237,0.3)" }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard"><ArrowLeft className="w-4 h-4 transition-colors" style={{ color: "#475569" }} /></Link>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7C3AED, #F59E0B)" }}>
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-700 text-sm" style={{ color: "#E2E8F0" }}>
              Cyber<span style={{ color: "#F59E0B" }}>Guard</span> Admin
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" }}>
              ADMIN PANEL
            </span>
          </div>
          <div className="flex items-center gap-4">
            {["users", "stats"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as typeof activeTab)}
                className="text-xs font-mono transition-colors capitalize"
                style={{ color: activeTab === tab ? "#A78BFA" : "#475569" }}>
                {tab === "users" ? "Kullanıcılar" : "İstatistikler"}
              </button>
            ))}
            <button onClick={() => { localStorage.clear(); router.push("/"); }}
              style={{ color: "#475569" }} className="hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "stats" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h1 className="font-display font-700 text-3xl" style={{ color: "#E2E8F0" }}>Platform İstatistikleri</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Toplam Kullanıcı", value: users.length, icon: Users, color: "#A78BFA" },
                { label: "Aktif Kullanıcı", value: users.filter(u => !u.banned).length, icon: CheckCircle, color: "#34D399" },
                { label: "Banlı Kullanıcı", value: users.filter(u => u.banned).length, icon: Ban, color: "#F87171" },
                { label: "Hack God", value: users.filter(u => u.league === "HACK GOD").length, icon: Star, color: "#EC4899" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="rounded-xl p-5 space-y-3"
                  style={{ background: "rgba(20,10,40,0.8)", border: `1px solid ${color}30` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                  <div>
                    <div className="font-display font-700 text-2xl" style={{ color: "#E2E8F0" }}>{value}</div>
                    <div className="text-xs font-mono" style={{ color: "#475569" }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-6" style={{ background: "rgba(20,10,40,0.8)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <h2 className="font-display font-600 mb-4" style={{ color: "#E2E8F0" }}>Lig Dağılımı</h2>
              <div className="space-y-3">
                {LEAGUES.map(league => {
                  const count = users.filter(u => u.league === league.name).length;
                  const pct = users.length > 0 ? (count / users.length) * 100 : 0;
                  return (
                    <div key={league.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span style={{ color: league.color }}>{league.name}</span>
                        <span style={{ color: "#475569" }}>{count} kullanıcı</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full" style={{ background: league.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="font-display font-700 text-3xl" style={{ color: "#E2E8F0" }}>Kullanıcı Yönetimi</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Kullanıcı ara..."
                  className="pl-10 pr-4 py-2 rounded-xl text-sm font-mono focus:outline-none"
                  style={{ background: "rgba(20,10,40,0.8)", border: "1px solid rgba(124,58,237,0.3)", color: "#E2E8F0", width: "250px" }} />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* User list */}
              <div className="lg:col-span-2 rounded-2xl overflow-hidden"
                style={{ background: "rgba(20,10,40,0.8)", border: "1px solid rgba(124,58,237,0.2)" }}>
                <div className="px-6 py-4 border-b flex items-center justify-between"
                  style={{ borderColor: "rgba(124,58,237,0.2)" }}>
                  <span className="font-display font-600 text-sm" style={{ color: "#E2E8F0" }}>
                    Kullanıcılar ({filtered.length})
                  </span>
                </div>
                <div className="divide-y" style={{ borderColor: "rgba(124,58,237,0.1)" }}>
                  {filtered.map(u => {
                    const league = LEAGUES.find(l => l.name === u.league);
                    return (
                      <motion.div key={u.id} whileHover={{ backgroundColor: "rgba(124,58,237,0.05)" }}
                        onClick={() => setSelectedUser(u)}
                        className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all ${selectedUser?.id === u.id ? "border-l-2" : ""}`}
                        style={{ borderLeftColor: selectedUser?.id === u.id ? "#7C3AED" : "transparent" }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-700 text-sm"
                          style={{ background: `${league?.color}20`, color: league?.color, border: `1px solid ${league?.color}30` }}>
                          {u.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-600 text-sm" style={{ color: u.banned ? "#475569" : "#E2E8F0" }}>
                              {u.name}
                            </span>
                            {u.banned && <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(220,38,38,0.15)", color: "#F87171" }}>BAN</span>}
                            {u.role === "ADMIN" && <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>ADMIN</span>}
                          </div>
                          <div className="text-xs font-mono" style={{ color: "#475569" }}>{u.score.toLocaleString()} XP</div>
                        </div>
                        <div className="text-xs font-mono px-2 py-1 rounded" style={{ background: `${league?.color}15`, color: league?.color }}>
                          {u.league}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Action panel */}
              <div className="space-y-4">
                {selectedUser ? (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="rounded-2xl p-6 space-y-5"
                    style={{ background: "rgba(20,10,40,0.8)", border: "1px solid rgba(124,58,237,0.3)" }}>
                    {/* User header */}
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center font-display font-800 text-2xl"
                        style={{ background: `${LEAGUES.find(l => l.name === selectedUser.league)?.color}20`, color: LEAGUES.find(l => l.name === selectedUser.league)?.color, border: `2px solid ${LEAGUES.find(l => l.name === selectedUser.league)?.color}40` }}>
                        {selectedUser.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-display font-700 text-lg" style={{ color: "#E2E8F0" }}>{selectedUser.name}</div>
                        <div className="font-display font-700 text-xl" style={{ color: LEAGUES.find(l => l.name === selectedUser.league)?.color }}>
                          {selectedUser.score.toLocaleString()} XP
                        </div>
                        <div className="text-xs font-mono" style={{ color: LEAGUES.find(l => l.name === selectedUser.league)?.color }}>
                          {selectedUser.league}
                        </div>
                      </div>
                    </div>

                    {/* Puan ekle/çıkar */}
                    <div className="space-y-3 p-4 rounded-xl" style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.15)" }}>
                      <div className="text-xs font-mono text-center" style={{ color: "#7C3AED" }}>PUAN İŞLEMİ</div>
                      <div className="flex items-center gap-2">
                        <input type="number" value={pointAmount} onChange={e => setPointAmount(Number(e.target.value))} min={1} max={9999}
                          className="flex-1 px-3 py-2 rounded-lg text-sm font-mono text-center focus:outline-none"
                          style={{ background: "rgba(10,10,20,0.8)", border: "1px solid rgba(124,58,237,0.3)", color: "#E2E8F0" }} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => addPoints(pointAmount)}
                          className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-600 transition-all hover:opacity-80"
                          style={{ background: "rgba(5,150,105,0.2)", color: "#34D399", border: "1px solid rgba(5,150,105,0.3)" }}>
                          <Plus className="w-4 h-4" />+{pointAmount}
                        </button>
                        <button onClick={() => addPoints(-pointAmount)}
                          className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-600 transition-all hover:opacity-80"
                          style={{ background: "rgba(220,38,38,0.15)", color: "#F87171", border: "1px solid rgba(220,38,38,0.3)" }}>
                          <Minus className="w-4 h-4" />-{pointAmount}
                        </button>
                      </div>
                    </div>

                    {/* Lig işlemleri */}
                    <div className="space-y-2">
                      <div className="text-xs font-mono" style={{ color: "#475569" }}>LİG İŞLEMLERİ</div>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={promoteUser}
                          className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-600 transition-all hover:opacity-80"
                          style={{ background: "rgba(124,58,237,0.15)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.3)" }}>
                          <ChevronUp className="w-4 h-4" />Yükselt
                        </button>
                        <button onClick={demoteUser}
                          className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-600 transition-all hover:opacity-80"
                          style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.2)" }}>
                          <ChevronDown className="w-4 h-4" />Düşür
                        </button>
                      </div>
                    </div>

                    {/* Tehlikeli işlemler */}
                    <div className="space-y-2 pt-2 border-t" style={{ borderColor: "rgba(220,38,38,0.2)" }}>
                      <div className="text-xs font-mono" style={{ color: "#475569" }}>TEHLİKELİ İŞLEMLER</div>
                      <button onClick={() => setActionModal("reset")}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-600 transition-all hover:opacity-80"
                        style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.2)" }}>
                        <BarChart3 className="w-4 h-4" />Puanları Sıfırla
                      </button>
                      <button onClick={() => setActionModal("ban")}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-600 transition-all hover:opacity-80"
                        style={{ background: "rgba(220,38,38,0.1)", color: "#F87171", border: "1px solid rgba(220,38,38,0.2)" }}>
                        <Ban className="w-4 h-4" />{selectedUser.banned ? "Ban Kaldır" : "Banla"}
                      </button>
                      <button onClick={() => setActionModal("delete")}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-600 transition-all hover:opacity-80"
                        style={{ background: "rgba(220,38,38,0.15)", color: "#F87171", border: "1px solid rgba(220,38,38,0.3)" }}>
                        <Trash2 className="w-4 h-4" />Kullanıcıyı Sil
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="rounded-2xl p-8 text-center"
                    style={{ background: "rgba(20,10,40,0.8)", border: "1px solid rgba(124,58,237,0.2)" }}>
                    <Users className="w-8 h-8 mx-auto mb-3" style={{ color: "#334155" }} />
                    <p className="text-sm" style={{ color: "#475569" }}>Yönetmek için bir kullanıcı seç</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Confirm modals */}
      <AnimatePresence>
        {actionModal && selectedUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-6"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="rounded-2xl p-8 max-w-sm w-full text-center space-y-4"
              style={{ background: "rgba(20,10,40,0.95)", border: "1px solid rgba(220,38,38,0.4)" }}>
              <div className="text-4xl">
                {actionModal === "ban" ? "🔨" : actionModal === "delete" ? "🗑️" : "🔄"}
              </div>
              <h3 className="font-display font-700 text-xl" style={{ color: "#E2E8F0" }}>
                {actionModal === "ban" ? (selectedUser.banned ? "Ban Kaldır" : "Kullanıcıyı Banla") :
                  actionModal === "delete" ? "Kullanıcıyı Sil" : "Puanları Sıfırla"}
              </h3>
              <p className="text-sm" style={{ color: "#64748B" }}>
                <span style={{ color: "#A78BFA" }}>{selectedUser.name}</span> için bu işlemi onaylıyor musun?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setActionModal(null)}
                  className="flex-1 py-3 rounded-xl text-sm font-600 transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.1)" }}>
                  İptal
                </button>
                <button onClick={actionModal === "ban" ? banUser : actionModal === "delete" ? deleteUser : resetPoints}
                  className="flex-1 py-3 rounded-xl text-sm font-600 text-white transition-all hover:opacity-80"
                  style={{ background: "linear-gradient(135deg, #DC2626, #7C3AED)" }}>
                  Onayla
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}