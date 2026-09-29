"use client";

import Link from "next/link";
import { 
  ShieldCheck, 
  Radio, 
  Users, 
  Home, 
  LogOut, 
  ArrowLeft
} from "lucide-react";
import { ThemeToggle } from "@/app/dashboard/ThemeToggle";
import { logoutAction } from "@/app/actions";

interface MembersNavbarProps {
  membersCount: number;
}

export function MembersNavbar({ membersCount }: MembersNavbarProps) {
  return (
    <header className="glass-header" style={{ height: '3.75rem', width: '100%', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container flex items-center justify-between h-full" style={{ padding: '0 1.25rem' }}>
        
        {/* Left: Branding & Back Button */}
        <div className="flex items-center gap-2.5">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2" 
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              width: '2rem',
              height: '2rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              flexShrink: 0
            }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <span 
                className="font-semibold text-sm tracking-tight" 
                style={{ display: 'block', lineHeight: 1.2, whiteSpace: 'nowrap' }}
              >
                Nivara Operations
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Main Navigation Switcher Tabs */}
        <nav className="flex items-center gap-1 hidden-mobile" style={{
          backgroundColor: 'var(--muted)',
          padding: '0.2rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)'
        }}>
          <Link
            href="/dashboard"
            className="filter-tab"
            style={{ fontSize: '0.8125rem', padding: '0.35rem 0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Radio size={13} />
            <span>Tickets</span>
          </Link>

          <div
            className="filter-tab filter-tab-active"
            style={{ fontSize: '0.8125rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', cursor: 'default' }}
          >
            <Users size={13} style={{ color: "var(--primary)" }} />
            <span>Directory</span>
            <span className="badge badge-zinc font-mono" style={{ padding: '0.1rem 0.35rem', fontSize: '0.625rem' }}>
              {membersCount}
            </span>
          </div>

          <Link
            href="/member"
            className="filter-tab"
            style={{ fontSize: '0.8125rem', padding: '0.35rem 0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Home size={13} />
            <span>Resident Portal</span>
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="btn-outline hidden-mobile"
            style={{
              padding: '0.45rem 0.75rem',
              fontSize: '0.8125rem',
              gap: '0.35rem',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={13} />
            <span>Dashboard</span>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Sign Out */}
          <form action={logoutAction}>
            <button
              type="submit"
              className="theme-toggle-btn"
              title="Sign Out"
              style={{ width: '2rem', height: '2rem', color: '#ef4444' }}
            >
              <LogOut size={14} />
            </button>
          </form>
        </div>

      </div>
    </header>
  );
}
