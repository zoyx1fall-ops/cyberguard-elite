"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, AlertCircle, CheckCircle, User, Lock } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.name + "@cyberguard.local", password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kayıt başarısız");
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0A0A0F 0%, #1A0A2E 50%, #0A0A0F 100%)" }}>
      {/* Animated bg orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-pulse"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)" }} />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)" }} />

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-md">

        <div className="rounded-2xl p-8 space-y-6"
          style={{ background: "rgba(20,10,40,0.8)", backdropFilter: "blur(20px)", border: "1px solid rgba(124,58,237,0.3)", boxShadow: "0 0 60px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.05)" }}>

          {/* Logo */}
          <div className="text-center space-y-3">
            <motion.div animate={{ boxShadow: ["0 0 20px rgba(124,58,237,0.4)", "0 0 50px rgba(124,58,237,0.8)", "0 0 20px rgba(124,58,237,0.4)"] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED, #F59E0B)" }}>
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="font-display font-800 text-2xl" style={{ color: "#E2E8F0" }}>
                Cyber<span style={{ color: "#F59E0B", textShadow: "0 0 20px rgba(245,158,11,0.5)" }}>Guard</span> Elite
              </h1>
              <p style={{ color: "#64748B", fontSize: "13px" }} className="mt-1">Hesap oluştur · Ücretsiz</p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "rgba(124,58,237,0.3)" }} />
            <span className="text-xs font-mono" style={{ color: "#7C3AED" }}>YENİ HESAP</span>
            <div className="flex-1 h-px" style={{ background: "rgba(124,58,237,0.3)" }} />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl text-sm"
              style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "#FCA5A5" }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </motion.div>
          )}

          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl text-sm"
              style={{ background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.3)", color: "#6EE7B7" }}>
              <CheckCircle className="w-4 h-4" />Hesap oluşturuldu! Yönlendiriliyor...
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: "#F59E0B" }}>
                Kullanıcı Adı
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#7C3AED" }} />
                <input type="text" value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} required
                  placeholder="0xShadow" minLength={3}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-mono focus:outline-none transition-all"
                  style={{ background: "rgba(10,10,20,0.8)", border: "1px solid rgba(124,58,237,0.3)", color: "#E2E8F0" }}
                  onFocus={e => e.target.style.borderColor = "#7C3AED"}
                  onBlur={e => e.target.style.borderColor = "rgba(124,58,237,0.3)"} />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest" style={{ color: "#F59E0B" }}>
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#7C3AED" }} />
                <input type="password" value={form.password} onChange={e => setForm(v => ({ ...v, password: e.target.value }))} required
                  placeholder="••••••••" minLength={6}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-mono focus:outline-none transition-all"
                  style={{ background: "rgba(10,10,20,0.8)", border: "1px solid rgba(124,58,237,0.3)", color: "#E2E8F0" }}
                  onFocus={e => e.target.style.borderColor = "#7C3AED"}
                  onBlur={e => e.target.style.borderColor = "rgba(124,58,237,0.3)"} />
              </div>
            </div>

            <motion.button type="submit" disabled={loading || success}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl font-display font-700 text-sm tracking-widest text-white disabled:opacity-50 transition-all"
              style={{ background: "linear-gradient(135deg, #7C3AED, #1D4ED8)", boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  Oluşturuluyor...
                </span>
              ) : "HESAP OLUŞTUR"}
            </motion.button>
          </form>

          <div className="text-center text-sm" style={{ color: "#475569" }}>
            Zaten hesabın var mı?{" "}
            <Link href="/login" className="font-600 transition-colors hover:text-white" style={{ color: "#A78BFA" }}>
              Giriş yap
            </Link>
          </div>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "#334155" }}>
          <Link href="/" className="hover:text-white transition-colors">← Ana sayfaya dön</Link>
        </p>
      </motion.div>
    </div>
  );
}