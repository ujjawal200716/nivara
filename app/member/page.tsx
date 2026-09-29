"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Home, 
  User, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Phone, 
  Mail, 
  Car, 
  KeyRound, 
  QrCode, 
  Receipt, 
  CreditCard, 
  Sparkles, 
  ShieldAlert, 
  Megaphone, 
  HelpCircle, 
  Calendar, 
  Check, 
  Star, 
  Mic, 
  Volume2, 
  Camera, 
  Droplets, 
  Wrench, 
  Zap, 
  Trash2, 
  ArrowRight, 
  ExternalLink, 
  LogOut, 
  Share2, 
  Copy, 
  Vote,
  Activity,
  Layers,
  PhoneCall
} from "lucide-react";
import { ThemeToggle } from "@/app/dashboard/ThemeToggle";
import { EditProfileModal, UserProfile } from "@/app/dashboard/EditProfileModal";
import { SendProblemModal } from "@/app/dashboard/SendProblemModal";
import { EmergencySOSModal } from "@/app/dashboard/EmergencySOSModal";
import { WalkthroughConcierge } from "@/app/dashboard/WalkthroughConcierge";
import { logoutAction } from "@/app/actions";
import { MemberNavbar } from "./MemberNavbar";

// Default resident profile for Flat B-402
const INITIAL_RESIDENT: UserProfile = {
  name: "Pooja Deshmukh",
  flat: "B-402",
  wing: "Wing B",
  type: "Tenant",
  phone: "+91 99302 67890",
  email: "pooja.d@society.com",
  vehicleCar: "MH-02-DN-4022",
  vehicleBike: "MH-02-AZ-9104",
  emergencyContactName: "Arjun Deshmukh (Brother)",
  emergencyContactPhone: "+91 98200 44556",
  intercom: "2402",
  avatarColor: "#10b981",
  notificationsEnabled: true
};

// Initial complaints filed by this resident
interface ResidentComplaint {
  id: string;
  category: "Lift" | "Water" | "Parking" | "Cleaning" | "Electricity" | "Noise" | "Security";
  original_text: string;
  translated_text: string;
  urgency: "Critical" | "High" | "Medium" | "Low";
  status: "Needs Triage" | "In Progress" | "Resolved";
  created_at: string;
  resolution_note?: string | null;
  assigned_technician?: string;
  rating?: number;
}

const INITIAL_COMPLAINTS: ResidentComplaint[] = [
  {
    id: "TKT-4891",
    category: "Lift",
    original_text: "B wing lift is stuck, koi bacha ander hai! Please jaldi technician bhejo",
    translated_text: "B-Wing elevator is stuck with a child inside. Immediate technician dispatch required.",
    urgency: "Critical",
    status: "In Progress",
    created_at: "Today, 1:45 PM",
    assigned_technician: "Otis Lift Maintenance (Team Leader Ramesh)",
    resolution_note: "Technician on site at B-Wing 4th floor. Power supply being restored."
  },
  {
    id: "TKT-3190",
    category: "Water",
    original_text: "Kitchen tap water pressure is very low since yesterday evening",
    translated_text: "Water pressure in kitchen inlet pipe has dropped significantly since yesterday evening.",
    urgency: "Medium",
    status: "Resolved",
    created_at: "Yesterday, 4:20 PM",
    assigned_technician: "Society Plumber (Suresh)",
    resolution_note: "Main pipeline air-lock removed from terrace booster pump. Pressure normal.",
    rating: 5
  },
  {
    id: "TKT-2019",
    category: "Cleaning",
    original_text: "Corridor floor mopping missed on 4th floor B wing",
    translated_text: "Housekeeping floor mopping was not completed on 4th floor B-Wing.",
    urgency: "Low",
    status: "Resolved",
    created_at: "3 days ago",
    assigned_technician: "Housekeeping Supervisor (Mahesh)",
    resolution_note: "Housekeeping staff reassigned and floor sanitized.",
    rating: 4
  }
];



export default function MemberPortalPage() {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_RESIDENT);
  const [activeTab, setActiveTab] = useState<"overview" | "problem" | "profile" | "directory">("overview");
  const [complaints, setComplaints] = useState<ResidentComplaint[]>(INITIAL_COMPLAINTS);
  
  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Poll state
  const [pollVoted, setPollVoted] = useState<"yes" | "no" | null>(null);
  const [pollStats, setPollStats] = useState({ yes: 78, no: 22, totalVotes: 142 });

  // Load profile from localStorage if modified earlier
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nivara_user_profile");
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const handleProfileUpdated = (updated: UserProfile) => {
    setProfile(updated);
    try {
      localStorage.setItem("nivara_user_profile", JSON.stringify(updated));
    } catch (e) {}
  };



  const handleRateComplaint = (complaintId: string, rating: number) => {
    setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, rating } : c));
  };

  const handleVotePoll = (choice: "yes" | "no") => {
    if (pollVoted) return;
    setPollVoted(choice);
    setPollStats(prev => ({
      ...prev,
      totalVotes: prev.totalVotes + 1,
      yes: choice === "yes" ? Math.round(((prev.yes * prev.totalVotes / 100) + 1) / (prev.totalVotes + 1) * 100) : Math.round((prev.yes * prev.totalVotes / 100) / (prev.totalVotes + 1) * 100),
      no: choice === "no" ? Math.round(((prev.no * prev.totalVotes / 100) + 1) / (prev.totalVotes + 1) * 100) : Math.round((prev.no * prev.totalVotes / 100) / (prev.totalVotes + 1) * 100)
    }));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      
      {/* ================= RESIDENT EXECUTIVE NAVBAR ================= */}
      <MemberNavbar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenProblemModal={() => setShowProblemModal(true)}
        onOpenProfileModal={() => setShowEditModal(true)}
        onOpenEmergencyModal={() => setShowEmergencyModal(true)}
        profile={profile}
        unresolvedCount={complaints.filter(c => c.status !== "Resolved").length}
      />

      {/* ================= MAIN RESIDENT PORTAL CONTENT ================= */}
      <main className="container flex-1" style={{ padding: '1.75rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Resident Welcome Banner */}
        <div 
          id="operations-header"
          className="glass-card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
                Flat {profile.flat} • {profile.wing}
              </span>
              <span className="badge badge-zinc font-mono" style={{ fontSize: '0.75rem' }}>
                Intercom: {profile.intercom}
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Welcome, {profile.name}
            </h1>
            <p className="text-sm text-muted mt-0.5">
              View your filed complaints, generate gate passes, and view society notices.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowProblemModal(true)}
              className="btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
            >
              <Send size={14} />
              <span>Report Problem</span>
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="btn-outline"
              style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
            >
              <User size={14} />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="btn-outline"
              style={{
                padding: '0.5rem 0.85rem',
                fontSize: '0.8125rem',
                color: '#ef4444'
              }}
            >
              <ShieldAlert size={14} />
              <span>Gate SOS</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          
          <div className="glass-card p-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider font-semibold">Active Issues</span>
              <p className="text-2xl font-bold mt-1 font-mono text-amber">
                {complaints.filter(c => c.status !== "Resolved").length}
              </p>
              <span className="text-xs text-muted">Awaiting completion</span>
            </div>
            <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
              <Clock size={20} />
            </div>
          </div>

          <div className="glass-card p-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider font-semibold">Solved Issues</span>
              <p className="text-2xl font-bold mt-1 font-mono text-green">
                {complaints.filter(c => c.status === "Resolved").length}
              </p>
              <span className="text-xs text-muted">100% resolution rate</span>
            </div>
            <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>



          <div className="glass-card p-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="text-xs text-muted uppercase tracking-wider font-semibold">Registered Vehicles</span>
              <p className="text-2xl font-bold mt-1 font-mono text-primary">2</p>
              <span className="text-xs text-muted">1 Car + 1 Two-Wheeler</span>
            </div>
            <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', backgroundColor: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
              <Car size={20} />
            </div>
          </div>

        </div>

        {/* Tab Switcher for Member Portal */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab("overview")}
            className={`filter-tab ${activeTab === "overview" ? "filter-tab-active" : ""}`}
          >
            <Layers size={15} />
            <span>My Complaints Feed</span>
          </button>

          <button
            onClick={() => setActiveTab("directory")}
            className={`filter-tab ${activeTab === "directory" ? "filter-tab-active" : ""}`}
          >
            <PhoneCall size={15} />
            <span>Emergency Directory</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`filter-tab ${activeTab === "profile" ? "filter-tab-active" : ""}`}
          >
            <User size={15} />
            <span>My Apartment Profile</span>
          </button>
        </div>

        {/* ================= TAB 1: OVERVIEW & COMPLAINTS ================= */}
        {activeTab === "overview" && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr', gap: '1.75rem' }} className="lg-grid-cols-1">
            
            {/* Left: Complaints List with Live Progress Timeline */}
            <div id="triage-feed-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div className="glass-card p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold">My Reported Issues ({complaints.length})</h2>
                  <p className="text-xs text-muted">Live AI classification, technician dispatch & resolution audit</p>
                </div>
                <button 
                  onClick={() => setShowProblemModal(true)}
                  className="btn-primary"
                  style={{ fontSize: '0.8125rem', padding: '0.45rem 0.85rem' }}
                >
                  <Plus size={14} /> Send Problem
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {complaints.map((item) => (
                  <div 
                    key={item.id}
                    className="glass-card p-5"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      borderLeft: item.urgency === "Critical" 
                        ? '4px solid #ef4444' 
                        : item.urgency === "High" 
                        ? '4px solid #f97316' 
                        : '4px solid #10b981'
                    }}
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          #{item.id}
                        </span>
                        <span className={`badge ${
                          item.urgency === "Critical" ? "badge-red" : item.urgency === "High" ? "badge-orange" : "badge-zinc"
                        }`}>
                          {item.urgency} Urgency
                        </span>
                        <span className="badge badge-zinc">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-xs text-muted font-mono">{item.created_at}</span>
                    </div>

                    {/* Complaint Text */}
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        "{item.original_text}"
                      </p>
                      {item.translated_text && item.translated_text !== item.original_text && (
                        <div style={{
                          marginTop: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.5rem',
                          backgroundColor: 'var(--muted)',
                          fontSize: '0.8125rem',
                          color: 'var(--muted-foreground)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <Sparkles size={14} color="#38bdf8" />
                          <span><strong>AI English Translation:</strong> {item.translated_text}</span>
                        </div>
                      )}
                    </div>

                    {/* Live Progress Stepper */}
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border)',
                      borderRadius: '0.75rem',
                      padding: '0.85rem 1rem'
                    }}>
                      <div className="flex items-center justify-between text-xs font-semibold mb-2">
                        <span style={{ color: '#10b981' }}>✓ Logged</span>
                        <span style={{ color: '#10b981' }}>✓ AI Triaged</span>
                        <span style={{ color: item.status !== "Needs Triage" ? '#10b981' : '#71717a' }}>
                          {item.status !== "Needs Triage" ? "✓ Staff Dispatched" : "○ Awaiting Dispatch"}
                        </span>
                        <span style={{ color: item.status === "Resolved" ? '#10b981' : '#71717a' }}>
                          {item.status === "Resolved" ? "✓ Resolved" : "○ In Progress"}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div style={{ height: '0.35rem', backgroundColor: 'var(--muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          backgroundColor: item.status === "Resolved" ? '#10b981' : '#f59e0b',
                          width: item.status === "Resolved" ? '100%' : item.status === "In Progress" ? '75%' : '40%',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>

                      {item.assigned_technician && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted">
                          <Wrench size={12} color="#38bdf8" />
                          <span>Assigned to: <strong style={{ color: 'var(--foreground)' }}>{item.assigned_technician}</strong></span>
                        </div>
                      )}

                      {item.resolution_note && (
                        <div style={{
                          marginTop: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.5rem',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          fontSize: '0.75rem',
                          color: '#10b981'
                        }}>
                          <strong>Resolution Note:</strong> {item.resolution_note}
                        </div>
                      )}
                    </div>

                    {/* Rating row if resolved */}
                    {item.status === "Resolved" && (
                      <div className="flex items-center justify-between text-xs pt-1 border-top" style={{ borderTop: '1px solid var(--border)' }}>
                        <span className="text-muted">Rate Committee Resolution:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRateComplaint(item.id, star)}
                              style={{
                                color: (item.rating || 0) >= star ? '#eab308' : '#71717a',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.15rem'
                              }}
                            >
                              <Star size={16} fill={(item.rating || 0) >= star ? '#eab308' : 'none'} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>

            </div>

            {/* Right: Quick Actions & Society Poll */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Send Problem Card Launcher */}
              <div className="glass-card p-5" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(14, 165, 233, 0.08) 100%)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={18} color="#10b981" />
                  <h3 className="text-base font-semibold">Report a Society Issue</h3>
                </div>
                <p className="text-xs text-muted mb-4">
                  Speak in Hindi or type in English. AI instantly tags urgency, estimates response SLA, and pings the right supervisor.
                </p>
                <button
                  onClick={() => setShowProblemModal(true)}
                  className="btn-primary w-full"
                  style={{ padding: '0.75rem', fontSize: '0.875rem' }}
                >
                  <Send size={15} />
                  <span>Launch Complaint Reporter</span>
                </button>
              </div>

              {/* Active Society Community Poll */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Vote size={18} color="#38bdf8" />
                  <h3 className="text-base font-semibold">Resident Poll</h3>
                  <span className="badge badge-zinc" style={{ fontSize: '0.625rem' }}>Active</span>
                </div>
                <p className="text-xs text-muted mb-3">
                  <strong>Question:</strong> "Should we install dedicated EV 2-Wheeler / 4-Wheeler charging spots in Basement 2?"
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleVotePoll("yes")}
                    disabled={!!pollVoted}
                    style={{
                      padding: '0.65rem 1rem',
                      borderRadius: '0.5rem',
                      backgroundColor: pollVoted === "yes" ? 'rgba(16, 185, 129, 0.2)' : 'var(--muted)',
                      border: pollVoted === "yes" ? '1px solid #10b981' : '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: pollVoted ? 'default' : 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>👍 Yes, install chargers</span>
                    <span className="font-mono font-bold text-xs text-green">{pollStats.yes}%</span>
                  </button>

                  <button
                    onClick={() => handleVotePoll("no")}
                    disabled={!!pollVoted}
                    style={{
                      padding: '0.65rem 1rem',
                      borderRadius: '0.5rem',
                      backgroundColor: pollVoted === "no" ? 'rgba(239, 68, 68, 0.2)' : 'var(--muted)',
                      border: pollVoted === "no" ? '1px solid #ef4444' : '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: pollVoted ? 'default' : 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>👎 No, prioritize other funds</span>
                    <span className="font-mono font-bold text-xs text-red">{pollStats.no}%</span>
                  </button>
                </div>

                <div className="flex justify-between items-center text-xs text-muted mt-3">
                  <span>Total votes: {pollStats.totalVotes}</span>
                  {pollVoted && <span className="text-green">✓ Your vote recorded</span>}
                </div>
              </div>

              {/* Emergency Contacts Quick Box */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold flex items-center gap-1.5">
                    <PhoneCall size={16} color="#ef4444" />
                    <span>Emergency Contacts</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab("directory")}
                    className="text-xs text-primary"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    All numbers →
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8125rem' }}>
                  <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--muted)' }}>
                    <span>Main Gate Security</span>
                    <a href="tel:+919820100001" className="font-mono text-primary font-bold">Call 101</a>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--muted)' }}>
                    <span>Lift Breakdown SOS</span>
                    <a href="tel:18002664000" className="font-mono text-red font-bold">1800-LIFT</a>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--muted)' }}>
                    <span>Electrician On Duty</span>
                    <a href="tel:+919820100003" className="font-mono text-primary font-bold">Call 103</a>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= TAB 5: EMERGENCY DIRECTORY ================= */}
        {activeTab === "directory" && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            
            <div className="glass-card p-5">
              <span className="badge badge-red mb-2">Gate Security</span>
              <h3 className="text-base font-bold">Main Gate 1 & 2 Security Cabin</h3>
              <p className="text-xs text-muted my-2">24x7 Intercom Ext: 101 • Mobile: +91 98201 00001</p>
              <div className="flex gap-2 mt-4">
                <a href="tel:+919820100001" className="btn-primary flex-1 text-center" style={{ padding: '0.5rem', fontSize: '0.8125rem', textDecoration: 'none' }}>
                  <Phone size={14} /> Call Gate
                </a>
                <a href="https://wa.me/919820100001" target="_blank" rel="noreferrer" className="btn-outline flex-1 text-center" style={{ padding: '0.5rem', fontSize: '0.8125rem', textDecoration: 'none' }}>
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="glass-card p-5">
              <span className="badge badge-amber mb-2">Emergency Breakdown</span>
              <h3 className="text-base font-bold">Otis Elevator 24/7 Rescue</h3>
              <p className="text-xs text-muted my-2">Immediate trapped passenger technician dispatch: 1800-266-4000</p>
              <div className="flex gap-2 mt-4">
                <a href="tel:18002664000" className="btn-primary flex-1 text-center" style={{ padding: '0.5rem', fontSize: '0.8125rem', backgroundColor: '#ef4444', textDecoration: 'none' }}>
                  <Phone size={14} /> Emergency Call
                </a>
              </div>
            </div>

            <div className="glass-card p-5">
              <span className="badge badge-blue mb-2">Maintenance</span>
              <h3 className="text-base font-bold">Society Plumber & Water Line</h3>
              <p className="text-xs text-muted my-2">Suresh (Duty: 8 AM - 8 PM) • Intercom Ext: 104</p>
              <div className="flex gap-2 mt-4">
                <a href="tel:+919820100004" className="btn-primary flex-1 text-center" style={{ padding: '0.5rem', fontSize: '0.8125rem', textDecoration: 'none' }}>
                  <Phone size={14} /> Call Plumber
                </a>
              </div>
            </div>

            <div className="glass-card p-5">
              <span className="badge badge-zinc mb-2">Administration</span>
              <h3 className="text-base font-bold">Society Estate Manager</h3>
              <p className="text-xs text-muted my-2">Mr. Rajesh Kulkarni • Office: Clubhouse 1st Floor</p>
              <div className="flex gap-2 mt-4">
                <a href="tel:+919765432109" className="btn-outline flex-1 text-center" style={{ padding: '0.5rem', fontSize: '0.8125rem', textDecoration: 'none' }}>
                  <Phone size={14} /> Call Manager
                </a>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 6: APARTMENT PROFILE VIEW ================= */}
        {activeTab === "profile" && (
          <div className="glass-card p-6" style={{ maxWidth: '44rem' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '50%',
                  backgroundColor: profile.avatarColor || '#10b981',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.25rem'
                }}>
                  {profile.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-xs text-muted">Flat {profile.flat} • {profile.wing} • {profile.type}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEditModal(true)}
                className="btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
              >
                <User size={14} /> Edit Profile
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
              <div className="p-3 rounded" style={{ backgroundColor: 'var(--muted)' }}>
                <span className="text-xs text-muted uppercase tracking-wider block">WhatsApp Number</span>
                <span className="font-mono text-sm font-semibold">{profile.phone}</span>
              </div>
              <div className="p-3 rounded" style={{ backgroundColor: 'var(--muted)' }}>
                <span className="text-xs text-muted uppercase tracking-wider block">Email Address</span>
                <span className="text-sm font-semibold">{profile.email}</span>
              </div>
              <div className="p-3 rounded" style={{ backgroundColor: 'var(--muted)' }}>
                <span className="text-xs text-muted uppercase tracking-wider block">4-Wheeler Car Plate</span>
                <span className="font-mono text-sm font-semibold">{profile.vehicleCar || "None"}</span>
              </div>
              <div className="p-3 rounded" style={{ backgroundColor: 'var(--muted)' }}>
                <span className="text-xs text-muted uppercase tracking-wider block">2-Wheeler Bike Plate</span>
                <span className="font-mono text-sm font-semibold">{profile.vehicleBike || "None"}</span>
              </div>
              <div className="p-3 rounded" style={{ backgroundColor: 'var(--muted)' }}>
                <span className="text-xs text-muted uppercase tracking-wider block">Emergency Contact</span>
                <span className="text-sm font-semibold">{profile.emergencyContactName}</span>
                <span className="font-mono text-xs text-muted block">{profile.emergencyContactPhone}</span>
              </div>
              <div className="p-3 rounded" style={{ backgroundColor: 'var(--muted)' }}>
                <span className="text-xs text-muted uppercase tracking-wider block">Intercom Number</span>
                <span className="font-mono text-sm font-semibold">{profile.intercom}</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================= MODALS & CHARACTER CONCIERGE ================= */}

      {/* 1. Send Problem Modal */}
      <SendProblemModal
        isOpen={showProblemModal}
        onClose={() => setShowProblemModal(false)}
        defaultFlat={profile.flat}
        onComplaintSubmitted={(newTicket) => {
          const formatted: ResidentComplaint = {
            id: `TKT-${Math.floor(5000 + Math.random() * 4000)}`,
            category: (newTicket.category || "Water") as any,
            original_text: newTicket.original_text || newTicket.raw_message || "Society Issue",
            translated_text: newTicket.translated_text || newTicket.translated_message || "Society Issue",
            urgency: newTicket.urgency || "High",
            status: "Needs Triage",
            created_at: "Just now",
            assigned_technician: "Triaging by AI engine..."
          };
          setComplaints([formatted, ...complaints]);
          setActiveTab("overview");
        }}
      />

      {/* 2. Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onProfileUpdated={handleProfileUpdated}
      />

      {/* 3. Emergency SOS Modal */}
      <EmergencySOSModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        userFlat={profile.flat}
      />



      {/* 5. Kai AI Concierge Mascot with Interactive Walkthrough */}
      <WalkthroughConcierge
        onOpenSendProblem={() => setShowProblemModal(true)}
        onOpenEditProfile={() => setShowEditModal(true)}
        onSwitchTab={(tab) => {
          if (tab === "triage") setActiveTab("overview");
          else if (tab === "sos") setShowEmergencyModal(true);
        }}
      />

    </div>
  );
}
