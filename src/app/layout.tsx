import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberGuard Elite - Premium Cybersecurity Training",
  description: "Enterprise-grade ethical cybersecurity awareness training platform. Simulated environments, no real exploits.",
  keywords: ["cybersecurity", "phishing awareness", "security training", "ethical hacking education"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
