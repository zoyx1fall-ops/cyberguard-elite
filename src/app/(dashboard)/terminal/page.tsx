"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal as TermIcon, ArrowLeft, Shield } from "lucide-react";

const COMMANDS: Record<string, string[]> = {
  help: ["Available commands:", "  help        - Show this help message", "  whoami      - Display current user context", "  scan        - Run educational network scan simulation", "  analyze     - Analyze simulated threat data", "  report      - Generate training report", "  clear       - Clear terminal", "  about       - About CyberGuard Elite", "", "[NOTE] This is a SAFE simulation terminal. No real system commands are executed."],
  whoami: ["cyberguard-trainee@lab-environment", "Role: Security Awareness Student", "Clearance: Training Mode", "[SAFE] No real system access"],
  scan: ["Initiating SIMULATED network scan...", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "[SIM] Scanning: 192.168.1.0/24 (VIRTUAL)", "[SIM] Host discovered: 192.168.1.1 (Gateway)", "[SIM] Host discovered: 192.168.1.42 (Workstation)", "[SIM] Host discovered: 192.168.1.100 (Server)", "", "EDUCATIONAL NOTE:", "Real network scans require authorization.", "Unauthorized scanning is illegal (CFAA, Computer Misuse Act).", "Always get written permission before any security testing.", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "[SIM] Scan complete. 3 virtual hosts found."],
  analyze: ["Analyzing simulated threat intelligence...", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "[SIM] Threat Level: MEDIUM (simulated)", "[SIM] Vector: Phishing email campaign (educational)", "[SIM] IOC: fake-domain.ru → mirrors real.bank.com", "[SIM] TTPs: T1566.001 Spearphishing Attachment", "", "MITRE ATT&CK Mapping (Educational):", "  Initial Access → Phishing (T1566)", "  Execution → User Execution (T1204)", "  Persistence → Registry Run Keys (T1547.001)", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "[SIM] Analysis complete."],
  report: ["Generating training report...", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "CYBERGUARD ELITE - TRAINING REPORT", "Date: " + new Date().toLocaleDateString(), "Student: Current User", "", "Modules Accessed:", "  ✓ Phishing Awareness    [60% complete]", "  ✓ SQL Injection Basics  [30% complete]", "  ○ Keylogger Defense     [Not started]", "  ○ Virtual Terminal      [Active]", "", "Risk Score: 72/100 (IMPROVING)", "Recommendation: Complete Keylogger module.", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"],
  about: ["CyberGuard Elite v1.0.0", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "Enterprise Cybersecurity Awareness Training Platform", "", "IMPORTANT DISCLAIMER:", "This platform contains ONLY educational simulations.", "No real hacking tools, exploits, or vulnerabilities.", "All scenarios are fictional and controlled.", "", "Use of real attack tools is illegal without authorization.", "This platform prepares defenders, not attackers.", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"],
};

interface Line { text: string; type: "output" | "input" | "error"; }

export default function TerminalPage() {
  const [lines, setLines] = useState<Line[]>([
    { text: "CyberGuard Elite - Educational Simulation Terminal v1.0", type: "output" },
    { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', type: "output" },
    { text: "⚠  SAFE ENVIRONMENT - No real system commands executed", type: "output" },
    { text: 'Type "help" to see available commands.', type: "output" },
    { text: "", type: "output" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  function runCommand(cmd: string) {
    const trimmed = cmd.trim().toLowerCase();
    const newLines: Line[] = [{ text: `trainer@cyberguard:~$ ${cmd}`, type: "input" }];
    if (trimmed === "clear") { setLines([{ text: 'Terminal cleared. Type "help" for commands.', type: "output" }]); return; }
    if (trimmed === "") { setLines(v => [...v, ...newLines]); return; }
    const response = COMMANDS[trimmed];
    if (response) {
      response.forEach(t => newLines.push({ text: t, type: "output" }));
    } else {
      newLines.push({ text: `Command not found: "${trimmed}". Type "help" for available commands.`, type: "error" });
      newLines.push({ text: "[SAFE] Real system commands are blocked in this environment.", type: "error" });
    }
    newLines.push({ text: "", type: "output" });
    setLines(v => [...v, ...newLines]);
    setHistory(v => [trimmed, ...v.slice(0, 49)]);
    setHistIdx(-1);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") { runCommand(input); setInput(""); }
    else if (e.key === "ArrowUp") { const i = Math.min(histIdx + 1, history.length - 1); setHistIdx(i); setInput(history[i] || ""); }
    else if (e.key === "ArrowDown") { const i = Math.max(histIdx - 1, -1); setHistIdx(i); setInput(i === -1 ? "" : history[i]); }
  }

  return (
    <div className="min-h-screen bg-cyber-dark flex flex-col">
      <nav className="border-b border-cyber-border/40 glass-card border-x-0 border-t-0 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/dashboard"><ArrowLeft className="w-4 h-4 text-cyber-text-muted hover:text-cyber-text transition-colors" /></Link>
          <TermIcon className="w-4 h-4 text-cyber-purple-light" />
          <span className="font-display font-600 text-sm text-cyber-text">Virtual Lab Terminal</span>
          <div className="ml-auto flex items-center gap-2 text-xs font-mono text-cyber-green-light">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
            SAFE MODE ACTIVE
          </div>
        </div>
      </nav>
      <div className="flex-1 p-4 md:p-6">
        <div className="h-full max-w-5xl mx-auto glass-card rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: "calc(100vh - 8rem)" }}>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-cyber-border/40 bg-cyber-dark-3">
            {["#DC2626", "#F59E0B", "#059669"].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
            <span className="ml-2 text-xs font-mono text-cyber-text-muted">cyberguard-lab — educational-simulation-terminal</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-0.5" onClick={() => inputRef.current?.focus()}>
            {lines.map((line, i) => (
              <div key={i} className={`leading-relaxed ${line.type === "input" ? "text-cyber-purple-light" : line.type === "error" ? "text-cyber-red-light" : "text-cyber-green-light"}`}>
                {line.text || "\u00A0"}
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="text-cyber-purple-light">trainer@cyberguard:~$</span>
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} autoFocus
                className="flex-1 bg-transparent outline-none text-cyber-green-light caret-cyber-purple-light font-mono" />
            </div>
            <div ref={endRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
