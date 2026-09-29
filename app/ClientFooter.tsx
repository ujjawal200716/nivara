"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ClientFooter() {
  const pathname = usePathname();

  // Do not show footer on login page, full-screen dashboard, or member portal
  if (pathname === "/" || pathname === "/login" || pathname.startsWith("/dashboard") || pathname.startsWith("/member")) {
    return null;
  }

  return (
    <footer className="mt-auto py-2 text-center text-xs text-muted flex justify-center gap-6" style={{ padding: '2rem 0', marginTop: '2rem', borderTop: '1px solid var(--border)' }}>
      <span>&copy; {new Date().getFullYear()} Nivara Society Triage</span>
      <Link href="/terms" style={{ color: 'var(--foreground)' }}>Terms</Link>
      <Link href="/privacy" style={{ color: 'var(--foreground)' }}>Privacy</Link>
    </footer>
  );
}
