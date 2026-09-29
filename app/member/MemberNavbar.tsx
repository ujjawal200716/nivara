"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Home, 
  Layers, 
  Plus, 
  KeyRound, 
  Receipt, 
  Megaphone, 
  PhoneCall, 
  User, 
  ShieldAlert, 
  LogOut, 
  Menu, 
  X,
  Send,
  Sparkles
} from "lucide-react";
import { ThemeToggle } from "@/app/dashboard/ThemeToggle";
import { UserProfile } from "@/app/dashboard/EditProfileModal";
import { logoutAction } from "@/app/actions";

export type MemberNavTab = "overview" | "problem" | "profile" | "directory";

interface MemberNavbarProps {
  activeTab: MemberNavTab;
  onSelectTab: (tab: MemberNavTab) => void;
  onOpenProblemModal: () => void;
  onOpenProfileModal: () => void;
  onOpenEmergencyModal?: () => void;
  profile: UserProfile;
  unresolvedCount?: number;
}

export function MemberNavbar({
  activeTab,
  onSelectTab,
  onOpenProblemModal,
  onOpenProfileModal,
  onOpenEmergencyModal,
  profile,
  unresolvedCount = 0
}: MemberNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: MemberNavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="glass-header" style={{ height: '3.75rem', position: 'sticky', top: 0, zIndex: 40, width: '100%' }}>
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
                padding: '0.2rem 0.5rem',
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

          {/* Center Navigation Tabs (Desktop) */}
          <nav 
            className="flex items-center gap-1 hidden-mobile" 
            style={{ 
              backgroundColor: 'var(--muted)', 
              padding: '0.2rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border)'
            }}
          >
            <button
              onClick={() => handleTabClick("overview")}
              className={`filter-tab ${activeTab === "overview" ? "filter-tab-active" : ""}`}
              style={{ fontSize: '0.8125rem', padding: '0.35rem 0.75rem' }}
            >
              <Layers size={13} />
              <span>Tickets</span>
              {unresolvedCount > 0 && (
                <span className="badge badge-zinc font-mono" style={{ padding: '0.1rem 0.35rem', fontSize: '0.625rem' }}>
                  {unresolvedCount}
                </span>
              )}
            </button>


            <button
              onClick={() => handleTabClick("directory")}
              className={`filter-tab ${activeTab === "directory" ? "filter-tab-active" : ""}`}
              style={{ fontSize: '0.8125rem', padding: '0.35rem 0.75rem' }}
            >
              <PhoneCall size={13} />
              <span>Directory</span>
            </button>

            <button
              onClick={() => handleTabClick("profile")}
              className={`filter-tab ${activeTab === "profile" ? "filter-tab-active" : ""}`}
              style={{ fontSize: '0.8125rem', padding: '0.35rem 0.75rem' }}
            >
              <User size={13} />
              <span>Profile</span>
            </button>
          </nav>

          {/* Right: Actions, Tour, Profile & Sign Out */}
          <div className="flex items-center gap-2">
            
            {/* Quick Report Issue Button */}
            <button
              id="member-navbar-send-problem-btn"
              onClick={onOpenProblemModal}
              className="btn-primary"
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.8125rem',
                whiteSpace: 'nowrap'
              }}
              title="Report an issue via Voice or Text"
            >
              <Plus size={15} />
              <span className="hidden-mobile">Report Issue</span>
            </button>

            {/* Emergency SOS Button (Desktop) */}
            {onOpenEmergencyModal && (
              <button
                onClick={onOpenEmergencyModal}
                className="hidden-mobile btn-outline"
                style={{
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.8125rem',
                  color: '#ef4444'
                }}
                title="Trigger Emergency Gate Security SOS"
              >
                <ShieldAlert size={14} />
                <span>Gate SOS</span>
              </button>
            )}

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
              <ShieldAlert size={13} />
              <span>Admin Board</span>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile Avatar Button */}
            <button
              id="profile-trigger-btn"
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
              title="Edit Resident Profile & Vehicles"
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
                {profile.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden-mobile text-left" style={{ lineHeight: 1.15 }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', whiteSpace: 'nowrap' }}>
                  {profile.name.split(" ")[0]}
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

            {/* Mobile Menu Hamburger Toggle */}
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: 'none', width: '2.2rem', height: '2.2rem' }}
              aria-label="Toggle navigation menu"
              id="member-mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

          </div>

        </div>

        {/* Responsive Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div 
            style={{
              position: 'absolute',
              top: '4.5rem',
              left: 0,
              right: 0,
              backgroundColor: 'var(--card)',
              borderBottom: '1px solid var(--border)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              zIndex: 50
            }}
          >
            {/* Resident Info Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--muted)',
              fontSize: '0.75rem'
            }}>
              <div>
                <strong>{profile.name}</strong> • Flat {profile.flat} ({profile.wing})
              </div>
              <span className="badge badge-green" style={{ fontSize: '0.6875rem' }}>{profile.type}</span>
            </div>

            {/* Nav Links */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                onClick={() => handleTabClick("overview")}
                className={`filter-tab ${activeTab === "overview" ? "filter-tab-active" : ""}`}
                style={{ justifyContent: 'flex-start', padding: '0.6rem 0.75rem' }}
              >
                <Layers size={15} />
                <span>Complaints ({unresolvedCount})</span>
              </button>


              <button
                onClick={() => handleTabClick("directory")}
                className={`filter-tab ${activeTab === "directory" ? "filter-tab-active" : ""}`}
                style={{ justifyContent: 'flex-start', padding: '0.6rem 0.75rem' }}
              >
                <PhoneCall size={15} />
                <span>Directory</span>
              </button>

              <button
                onClick={() => handleTabClick("profile")}
                className={`filter-tab ${activeTab === "profile" ? "filter-tab-active" : ""}`}
                style={{ justifyContent: 'flex-start', padding: '0.6rem 0.75rem' }}
              >
                <User size={15} />
                <span>My Profile</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProblemModal();
                }}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.6rem' }}
              >
                <Send size={15} />
                <span>Report Society Issue</span>
              </button>

              {onOpenEmergencyModal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenEmergencyModal();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    color: '#ef4444',
                    fontWeight: 700,
                    fontSize: '0.8125rem'
                  }}
                >
                  <ShieldAlert size={16} />
                  <span>Gate Security SOS</span>
                </button>
              )}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  href="/dashboard"
                  className="btn-outline"
                  style={{ flex: 1, justifyContent: 'center', padding: '0.5rem', textDecoration: 'none', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                >
                  <ShieldAlert size={14} />
                  <span>Admin Board</span>
                </Link>

                <form action={logoutAction} style={{ flexShrink: 0 }}>
                  <button
                    type="submit"
                    className="btn-outline"
                    style={{ padding: '0.5rem 0.75rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                    title="Sign Out"
                  >
                    <LogOut size={14} />
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

      </header>

      {/* Media query for hamburger menu display */}
      <style jsx global>{`
        @media (max-width: 900px) {
          #member-mobile-menu-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
