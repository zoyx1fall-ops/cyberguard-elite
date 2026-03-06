"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function SiteLockPage() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    await new Promise((r) => setTimeout(r, 800));

    if (password === "2372859525680375jJCARbanak") {
      document.cookie = `cg_site_access=${password}; path=/; max-age=86400`;
      window.location.href = "/";
    } else {
      setError(true);
      setPassword("");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-cyber-dark cyber-grid-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-10 space-y-8 text-center">
          {/* Icon */}
          <motion.div
            animate={{ boxShadow: ["0 0 20px rgba(124,58,237,0.4)", "0 0 50px rgba(124,58,237,0.8)", "0 0 20px rgba(124,58,237,0.4)"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-purple to-cyber-blue flex items-center justify-center mx-auto"
          >
            <Lock className="w-10 h-10 text-white" />
          </motion.div>

          <div className="space-y-2">
            <h1 className="font-display font-800 text-3xl text-cyber-text">
              Cyber<span className="text-cyber-gold glow-text-gold">Guard</span> Elite
            </h1>
            <p className="text-cyber-text-muted text-sm">Bu platforma erişim kısıtlıdır.</p>
            <p className="text-cyber-text-muted text-xs font-mono">Erişim şifrenizi girin</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-cyber-red/10 border border-cyber-red/30 text-cyber-red-light text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                Yanlış şifre. Tekrar deneyin.
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Erişim şifresi"
                className="w-full bg-cyber-dark-3 border border-cyber-border rounded-xl px-5 py-4 pr-12 text-cyber-text text-sm focus:outline-none focus:border-cyber-purple transition-colors text-center font-mono tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cyber-text-muted hover:text-cyber-text transition-colors"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading || !password}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyber-purple to-cyber-blue text-white font-display font-700 text-sm tracking-widest disabled:opacity-50 transition-all"
              style={{ boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Doğrulanıyor...
                </span>
              ) : (
                "ERİŞİM TALEP ET"
              )}
            </motion.button>
          </form>

          <div className="flex items-center justify-center gap-2 text-xs text-cyber-text-muted font-mono">
            <Shield className="w-3 h-3" />
            Yetkisiz erişim girişimleri kayıt altına alınır
          </div>
        </div>
      </motion.div>
    </div>
  );
}
