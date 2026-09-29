import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Society Complaint Triage",
  description: "AI-powered complaint triage dashboard for housing societies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.variable} ${spaceMono.variable} antialiased min-h-screen flex flex-col`}>
        <div className="flex-1">
          {children}
        </div>
        <footer className="mt-auto py-6 border-t border-white/40 text-center text-xs text-zinc-500 flex justify-center gap-4">
          <span>&copy; {new Date().getFullYear()} Society Triage</span>
          <a href="/terms" className="hover:text-zinc-800 transition-colors">Terms</a>
          <a href="/privacy" className="hover:text-zinc-800 transition-colors">Privacy</a>
        </footer>
      </body>
    </html>
  );
}
