"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { ThemeToggle } from "./dashboard/ThemeToggle";

export function ClientNavbar() {
  const pathname = usePathname();

  // Hide the global website navbar on Login page, Dashboard and Member Portal
  // (Both have dedicated clean command & resident navbars)
  if (pathname === "/" || pathname === "/login" || pathname.startsWith("/dashboard") || pathname.startsWith("/member")) {
    return null;
  }

  return (
    <header className="glass-header" style={{ height: "3.75rem" }}>
      <div className="container flex items-center justify-between h-full" style={{ padding: "0 1.25rem" }}>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sm tracking-tight">
            <div style={{
              width: "1.75rem",
              height: "1.75rem",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--primary)"
            }}>
              <ShieldCheck size={16} />
            </div>
            <span>Nivara Triage</span>
          </Link>
        </div>
        
        <nav className="flex items-center gap-4 hidden-mobile">
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
          <Link href="/member" className="nav-link">My Complaints</Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/complaint/new" className="btn-primary">
            Submit Complaint
          </Link>
        </div>
      </div>
    </header>
  );
}
