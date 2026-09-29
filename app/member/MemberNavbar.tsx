"use client";

import Link from "next/link";
import { 
  Home, 
  Plus, 
  ShieldAlert, 
  LogOut, 
  User
} from "lucide-react";
import { ThemeToggle } from "@/app/dashboard/ThemeToggle";
import { UserProfile } from "@/app/dashboard/EditProfileModal";
import { logoutAction } from "@/app/actions";

interface MemberNavbarProps {
  onOpenProblemModal: () => void;
  onOpenProfileModal: () => void;
  profile: UserProfile;
  unresolvedCount?: number;
}

export function MemberNavbar({
  onOpenProblemModal,
  onOpenProfileModal,
  profile,
  unresolvedCount = 0
}: MemberNavbarProps) {
  return (
    <header className="glass-header" style={{ height: '3.75rem', position: 'sticky', top: 0, zIndex: 50, width: '100%' }}>
      <div className="container flex items-center justify-between h-full" style={{ padding: '0 1.25rem' }}>
        
        {/* Left: Branding & Resident Flat Tag */}
        <div className="flex items-center gap-2.5">
          <Link href="/member" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
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
              <Home size={18} />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight" style={{ display: 'block', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                Nivara Resident
              </span>
            </div>
          </Link>

          {/* Flat & Status Chip */}
          <div 
            id="resident-status-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.55rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--muted)',
              border: '1px solid var(--border)',
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: 'var(--muted-foreground)',
              whiteSpace: 'nowrap'
            }} 
            className="hidden-mobile"
          >
            <span style={{ width: '0.45rem', height: '0.45rem', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
            <span>{profile.flat} • {profile.wing}</span>
          </div>
        </div>

        {/* Right: Primary Action, Admin Switcher, Profile, Theme Toggle */}
        <div className="flex items-center gap-2">
          
          {/* Quick Report Issue Button */}
          <button
            onClick={onOpenProblemModal}
            className="btn-primary"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.8125rem',
              whiteSpace: 'nowrap'
            }}
            title="Report a new maintenance issue"
          >
            <Plus size={15} />
            <span>New Complaint</span>
          </button>

          {/* Switch to Admin Board Link */}
          <Link
            href="/dashboard"
            className="btn-outline hidden-mobile"
            style={{
              padding: '0.45rem 0.75rem',
              fontSize: '0.8125rem',
              gap: '0.35rem',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              whiteSpace: 'nowrap'
            }}
            title="Switch to Management Committee Admin Board"
          >
            <ShieldAlert size={13} color="var(--primary)" />
            <span>Admin Board</span>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile Button */}
          <button
            onClick={onOpenProfileModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.3rem 0.55rem',
              borderRadius: '0.75rem',
              backgroundColor: 'var(--muted)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
            title="Edit Resident Profile"
          >
            <div style={{
              width: '1.875rem',
              height: '1.875rem',
              borderRadius: '50%',
              backgroundColor: profile.avatarColor || '#10b981',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.75rem',
              flexShrink: 0
            }}>
              {profile.name?.substring(0, 2).toUpperCase() || "PD"}
            </div>
            <div className="hidden-mobile text-left" style={{ lineHeight: 1.15 }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', whiteSpace: 'nowrap' }}>
                {profile.name?.split(" ")[0] || "Resident"}
              </span>
              <span className="text-muted font-mono" style={{ fontSize: '0.6875rem', display: 'block', whiteSpace: 'nowrap' }}>
                {profile.flat}
              </span>
            </div>
          </button>

          {/* Logout */}
          <form action={logoutAction} className="hidden-mobile">
            <button
              type="submit"
              className="theme-toggle-btn"
              title="Sign Out"
              style={{ width: '2.1rem', height: '2.1rem', color: '#ef4444' }}
            >
              <LogOut size={15} />
            </button>
          </form>

        </div>

      </div>
    </header>
  );
}
