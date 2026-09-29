"use client";

import { useState, useEffect } from "react";
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Search, 
  Plus, 
  Users, 
  Home, 
  ShieldAlert, 
  Wrench, 
  Droplets,
  Zap,
  Car,
  Trash2,
  Megaphone,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Check
} from "lucide-react";
import { DashboardNavbar } from "./DashboardNavbar";
import { resolveComplaint, updateComplaintStatus, addMember, processAndSubmitComplaint } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";

// Import our interactive components
import { EditProfileModal, UserProfile } from "./EditProfileModal";
import { SendProblemModal } from "./SendProblemModal";
import { MemberDirectorySection, SocietyMember } from "./MemberDirectorySection";
import { NoticeBoard } from "./NoticeBoard";
import { EmergencySOSModal } from "./EmergencySOSModal";
import { WalkthroughConcierge } from "./WalkthroughConcierge";

// Initial realistic complaints
const INITIAL_COMPLAINTS = [
  {
    id: "demo-1",
    original_text: "B wing lift is stuck, koi bacha ander hai! Please jaldi technician bhejo",
    translated_text: "B-Wing elevator is stuck with a child inside. Immediate technician dispatch required.",
    category: "Lift",
    urgency: "Critical",
    status: "Needs Triage",
    flat: "B-402",
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    resolution_note: null
  },
  {
    id: "demo-2",
    original_text: "Pani kab aayega? Subah se overhead tank khali hai A wing me",
    translated_text: "No water supply since morning. Overhead water tank in A-Wing is empty.",
    category: "Water",
    urgency: "High",
    status: "In Progress",
    flat: "A-201",
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    resolution_note: null
  },
  {
    id: "demo-3",
    original_text: "Somebody parked black SUV in my assigned parking spot #102 again",
    translated_text: "Unauthorized black SUV parked in assigned parking bay #102.",
    category: "Parking",
    urgency: "Medium",
    status: "Needs Triage",
    flat: "C-102",
    created_at: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    resolution_note: null
  },
  {
    id: "demo-4",
    original_text: "Garbage collection missed today on 3rd floor B wing",
    translated_text: "Daily doorstep waste collection was missed on the 3rd floor of B-Wing.",
    category: "Cleaning",
    urgency: "Low",
    status: "Resolved",
    flat: "B-305",
    created_at: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    resolution_note: "Housekeeping supervisor instructed. Bin cleared at 11:30 AM."
  }
];

// Initial realistic members
const INITIAL_MEMBERS: SocietyMember[] = [
  { id: "m-1", full_name: "Vikram Malhotra", flat: "B-402", type: "Committee Member", whatsapp_number: "+91 98201 12345", email: "vikram@example.com", wing: "Wing B", vehicle: "MH-12-AB-4020" },
  { id: "m-2", full_name: "Pooja Deshmukh", flat: "B-402", type: "Tenant", whatsapp_number: "+91 99302 67890", email: "pooja.d@example.com", wing: "Wing B", vehicle: "MH-12-CD-1002" },
  { id: "m-3", full_name: "Ananya Roy", flat: "C-102", type: "Owner", whatsapp_number: "+91 98110 54321", email: "ananya.roy@example.com", wing: "Wing C", vehicle: "MH-12-EF-3004" },
  { id: "m-4", full_name: "Rajesh Kulkarni", flat: "A-201", type: "Owner", whatsapp_number: "+91 97654 32109", email: "rajesh.k@example.com", wing: "Wing A", vehicle: "MH-12-GH-5006" },
  { id: "m-5", full_name: "Col. Suresh Verma", flat: "A-501", type: "Secretary", whatsapp_number: "+91 98450 99887", email: "secretary@society.com", wing: "Wing A", vehicle: "MH-12-JK-7008" }
];

export default function UnifiedDashboard() {
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [members, setMembers] = useState<SocietyMember[]>(INITIAL_MEMBERS);
  const [activeTab, setActiveTab] = useState<"all" | "Needs Triage" | "In Progress" | "Resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"triage" | "members" | "notices" | "sos">("triage");

  // Modals state
  const [showSendProblemModal, setShowSendProblemModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // User Profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load user profile & db data on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nivara_user_profile");
      if (stored) {
        setUserProfile(JSON.parse(stored));
      } else {
        const defaultProf: UserProfile = {
          name: "Vikram Malhotra",
          flat: "B-402",
          wing: "Wing B",
          type: "Committee Member",
          phone: "+91 98201 12345",
          email: "vikram@example.com",
          vehicleCar: "MH-12-AB-4020",
          vehicleBike: "MH-12-CD-1002",
          emergencyContactName: "Pooja Malhotra (Spouse)",
          emergencyContactPhone: "+91 98201 99999",
          intercom: "4021",
          avatarColor: "#10b981",
          notificationsEnabled: true
        };
        setUserProfile(defaultProf);
      }
    } catch (e) {
      console.warn("Profile load fallback:", e);
    }

    // Load Supabase data
    async function loadData() {
      try {
        const supabase = createClient();
        const { data: dbMembers } = await supabase.from("Nivara").select("*").order("created_at", { ascending: false });
        if (dbMembers && dbMembers.length > 0) {
          setMembers(dbMembers);
        }

        const { data: dbComplaints } = await supabase.from("complaints").select("*").order("created_at", { ascending: false });
        if (dbComplaints && dbComplaints.length > 0) {
          setComplaints(dbComplaints);
        }
      } catch (e) {
        console.warn("Using offline fallback state for dashboard:", e);
      }
    }
    loadData();
  }, []);

  // Handlers
  const handleResolve = async (id: string | number) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: "Resolved", resolution_note: "Resolved by Admin via Operations Hub" };
      }
      return c;
    }));
    showToast("Incident marked Resolved and archived.");

    try {
      await resolveComplaint(id, "Resolved by Admin via Operations Hub");
    } catch (e) {
      console.error("Resolve error:", e);
    }
  };

  const handleDispatch = async (id: string | number) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: "In Progress" };
      }
      return c;
    }));
    showToast("Technician dispatched. Ticket marked In Progress.");

    try {
      await updateComplaintStatus(id, "In Progress");
    } catch (e) {
      console.error("Dispatch error:", e);
    }
  };

  const handleResetSampleTickets = () => {
    setComplaints(INITIAL_COMPLAINTS);
    showToast("Sample incidents reloaded to initial demo state.");
  };

  const handleComplaintSubmitted = (newRecord: any) => {
    setComplaints(prev => [newRecord, ...prev]);
    showToast("New incident triaged and added to active queue!");
  };

  const handleMemberAdded = (newMember: SocietyMember) => {
    setMembers(prev => [newMember, ...prev]);
    showToast(`Resident ${newMember.full_name} added to directory.`);
  };

  // Filtered Complaints
  const filteredComplaints = complaints.filter(c => {
    const matchesTab = activeTab === "all" ? true : c.status === activeTab;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      c.translated_text?.toLowerCase().includes(query) ||
      c.original_text?.toLowerCase().includes(query) ||
      c.category?.toLowerCase().includes(query) ||
      c.flat?.toLowerCase().includes(query);
    return matchesTab && matchesSearch;
  });

  // KPI Calculations
  const needsTriageCount = complaints.filter(c => c.status === "Needs Triage" || c.status === "Pending").length;
  const inProgressCount = complaints.filter(c => c.status === "In Progress").length;
  const resolvedCount = complaints.filter(c => c.status === "Resolved").length;
  const criticalCount = complaints.filter(c => c.urgency?.toLowerCase() === "critical" && c.status !== "Resolved").length;

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case "critical": return <span className="badge badge-red">Critical Alert</span>;
      case "high": return <span className="badge badge-orange">High Priority</span>;
      case "medium": return <span className="badge badge-amber">Medium</span>;
      default: return <span className="badge badge-green">Low</span>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "lift": return <Wrench size={14} color="#f59e0b" />;
      case "water": return <Droplets size={14} color="#3b82f6" />;
      case "electricity": return <Zap size={14} color="#eab308" />;
      case "parking": return <Car size={14} color="#8b5cf6" />;
      case "cleaning": return <Trash2 size={14} color="#10b981" />;
      default: return <AlertCircle size={14} color="#64748b" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      
      {/* 1. Distinct Dashboard Navbar */}
      <DashboardNavbar
        onOpenReportModal={() => setShowSendProblemModal(true)}
        onOpenProfileModal={() => setShowEditProfileModal(true)}
        onOpenTour={() => {
          const el = document.getElementById("kai-concierge-widget");
          el?.scrollIntoView({ behavior: 'smooth' });
          const btn = el?.querySelector("button");
          btn?.click();
        }}
        openComplaintsCount={needsTriageCount + inProgressCount}
        membersCount={members.length}
        activeView={activeView}
        onSelectView={setActiveView}
        userProfile={userProfile}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div 
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            backgroundColor: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--primary)',
            boxShadow: 'var(--shadow-lg)',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            fontSize: '0.875rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <CheckCircle2 size={18} color="var(--primary)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="container" style={{ paddingTop: '1.75rem', paddingBottom: '5rem', flex: 1 }}>
        
        {/* ================= VIEW 1: TRIAGE CENTER ================= */}
        {activeView === "triage" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* Top Operations Header */}
            <div id="operations-header" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                  <h1 className="text-xl font-bold tracking-tight">Incident Triage &amp; Operations</h1>
                  {criticalCount > 0 && (
                    <span className="badge badge-red">
                      {criticalCount} Critical SOS
                    </span>
                  )}
                  <span className="badge badge-zinc">
                    Sample Demo Mode
                  </span>
                </div>
                <p className="text-sm text-muted">
                  Live resident incident triage, Hindi/English translations, and maintenance dispatch.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleResetSampleTickets}
                  className="btn-outline"
                  title="Reset sample tickets to initial demo state"
                  style={{ fontSize: '0.8125rem' }}
                >
                  <RotateCcw size={14} />
                  <span>Reset Demo Tickets</span>
                </button>

                <button
                  onClick={() => setShowEmergencyModal(true)}
                  className="btn-outline"
                  style={{ color: '#ef4444' }}
                >
                  <ShieldAlert size={15} />
                  <span>Gate SOS</span>
                </button>

                <button
                  onClick={() => setShowSendProblemModal(true)}
                  className="btn-primary"
                >
                  <Plus size={15} />
                  <span>Report Problem</span>
                </button>
              </div>
            </div>

            {/* Top KPI Metrics Cards */}
            <div className="grid grid-cols-4 md-grid-cols-2 lg-grid-cols-1" style={{ gap: '1rem' }}>
              <div 
                className="stat-card" 
                onClick={() => setActiveView("members")}
                style={{ cursor: 'pointer' }}
                title="Click to view Member Section"
              >
                <div>
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                    Total Residents
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span className="text-3xl font-extrabold">{members.length}</span>
                    <span className="text-xs text-muted">registered</span>
                  </div>
                </div>
                <div style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3b82f6'
                }}>
                  <Users size={22} />
                </div>
              </div>

              <div className="stat-card" style={{ borderColor: needsTriageCount > 0 ? 'rgba(239, 68, 68, 0.3)' : undefined }}>
                <div>
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                    Needs Triage
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span className="text-3xl font-extrabold text-red">{needsTriageCount}</span>
                    <span className="text-xs text-muted">unreviewed</span>
                  </div>
                </div>
                <div style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444'
                }}>
                  <ShieldAlert size={22} />
                </div>
              </div>

              <div className="stat-card">
                <div>
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                    In Dispatch
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span className="text-3xl font-extrabold text-amber">{inProgressCount}</span>
                    <span className="text-xs text-muted">active</span>
                  </div>
                </div>
                <div style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f59e0b'
                }}>
                  <Clock size={22} />
                </div>
              </div>

              <div className="stat-card">
                <div>
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                    Resolved Tickets
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span className="text-3xl font-extrabold text-green">{resolvedCount}</span>
                    <span className="text-xs text-muted">
                      ({complaints.length > 0 ? Math.round((resolvedCount / complaints.length) * 100) : 100}%)
                    </span>
                  </div>
                </div>
                <div style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981'
                }}>
                  <CheckCircle2 size={22} />
                </div>
              </div>
            </div>

            {/* Split Section: Complaints Feed (Left) & Quick Sidebar (Right) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 0.95fr', gap: '1.75rem' }} className="lg-grid-cols-1">
              
              {/* LEFT COLUMN: Problems & AI Triage Feed */}
              <div id="triage-feed-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Status Tabs & Search */}
                <div className="glass-card p-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    
                    <div style={{
                      display: 'flex',
                      gap: '0.25rem',
                      backgroundColor: 'var(--muted)',
                      padding: '0.25rem',
                      borderRadius: '0.75rem'
                    }}>
                      <button
                        onClick={() => setActiveTab("all")}
                        className={`filter-tab ${activeTab === "all" ? "filter-tab-active" : ""}`}
                      >
                        All ({complaints.length})
                      </button>
                      <button
                        onClick={() => setActiveTab("Needs Triage")}
                        className={`filter-tab ${activeTab === "Needs Triage" ? "filter-tab-active" : ""}`}
                      >
                        <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                        Needs Triage ({needsTriageCount})
                      </button>
                      <button
                        onClick={() => setActiveTab("In Progress")}
                        className={`filter-tab ${activeTab === "In Progress" ? "filter-tab-active" : ""}`}
                      >
                        <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                        In Progress ({inProgressCount})
                      </button>
                      <button
                        onClick={() => setActiveTab("Resolved")}
                        className={`filter-tab ${activeTab === "Resolved" ? "filter-tab-active" : ""}`}
                      >
                        <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: '#10b981' }} />
                        Resolved ({resolvedCount})
                      </button>
                    </div>

                    <div className="text-xs text-muted">
                      Showing <strong>{filteredComplaints.length}</strong> problems
                    </div>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <Search size={16} className="text-muted" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search complaints by keyword, flat number, category..."
                      className="input-field"
                      style={{ paddingLeft: '2.5rem', height: '2.5rem' }}
                    />
                  </div>
                </div>

                {/* Complaints List Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {filteredComplaints.map(item => {
                    const isResolved = item.status === "Resolved";
                    return (
                      <div
                        key={item.id}
                        className="glass-card p-4"
                        style={{
                          borderLeft: item.urgency === "Critical" && !isResolved ? '4px solid #ef4444' : undefined,
                          opacity: isResolved ? 0.85 : 1,
                          transition: 'all 0.2s'
                        }}
                      >
                        {/* Header: Urgency, Category, Flat & Time */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {getUrgencyBadge(item.urgency)}
                            <span className="badge badge-zinc" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              {getCategoryIcon(item.category)}
                              {item.category}
                            </span>
                            <span className="badge badge-zinc font-mono" style={{ textTransform: 'none' }}>
                              <Home size={11} style={{ marginRight: '0.2rem' }} />
                              {item.flat || "Unit"}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="text-xs text-muted" suppressHydrationWarning>
                              {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isResolved ? (
                              <span className="badge badge-green" style={{ fontSize: '0.625rem' }}>
                                <Check size={12} /> Resolved
                              </span>
                            ) : item.status === "In Progress" ? (
                              <span className="badge badge-amber" style={{ fontSize: '0.625rem' }}>
                                <Clock size={12} /> Dispatched
                              </span>
                            ) : (
                              <span className="badge badge-red" style={{ fontSize: '0.625rem' }}>
                                Pending
                              </span>
                            )}
                          </div>
                        </div>

                        {/* AI Translated Action Title */}
                        <h3 style={{
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: isResolved ? 'var(--muted-foreground)' : 'var(--foreground)',
                          marginBottom: '0.35rem',
                          textDecoration: isResolved ? 'line-through' : 'none'
                        }}>
                          {item.translated_text}
                        </h3>

                        {/* Original Raw / Hinglish message */}
                        <p style={{
                          fontSize: '0.75rem',
                          color: 'var(--muted-foreground)',
                          fontStyle: 'italic',
                          marginBottom: '0.875rem',
                          backgroundColor: 'var(--muted)',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '0.375rem',
                          borderLeft: '2px solid var(--border)'
                        }}>
                          "{item.original_text}"
                        </p>

                        {/* Resolution Note if present */}
                        {item.resolution_note && (
                          <div style={{
                            padding: '0.4rem 0.75rem',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            color: '#10b981',
                            marginBottom: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}>
                            <CheckCircle2 size={14} />
                            <span>{item.resolution_note}</span>
                          </div>
                        )}

                        {/* Action Buttons: "Solve" and "Dispatch" */}
                        {!isResolved && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: '0.625rem',
                            paddingTop: '0.5rem',
                            borderTop: '1px solid var(--border)'
                          }}>
                            {item.status !== "In Progress" && (
                              <button
                                onClick={() => handleDispatch(item.id)}
                                className="btn-outline"
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                              >
                                <Clock size={13} color="#f59e0b" />
                                <span>Mark In Progress</span>
                              </button>
                            )}

                            {/* Direct "Solve" Button */}
                            <button
                              onClick={() => handleResolve(item.id)}
                              className="btn-solve"
                              title="Resolve and close this ticket"
                            >
                              <CheckCircle2 size={14} />
                              <span>Resolve Ticket</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {filteredComplaints.length === 0 && (
                    <div className="glass-card p-8 text-center" style={{ color: 'var(--muted-foreground)' }}>
                      <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 0.75rem auto', opacity: 0.8 }} />
                      <p className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>All Caught Up!</p>
                      <p className="text-xs text-muted mt-1 mb-4">No incidents match this filter or all sample complaints are resolved.</p>
                      <button
                        onClick={handleResetSampleTickets}
                        className="btn-primary"
                        style={{ fontSize: '0.8125rem', margin: '0 auto' }}
                      >
                        <RotateCcw size={14} />
                        <span>Reload Sample Incidents</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT COLUMN: Quick Member Roster & Gate Intercom Shortcuts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Quick Member Section Preview Card */}
                <div className="glass-card p-4">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={18} className="text-primary" />
                      <h3 className="font-bold text-base">Society Residents</h3>
                    </div>
                    
                    <button
                      onClick={() => setActiveView("members")}
                      className="text-xs text-primary font-semibold flex items-center gap-1"
                    >
                      <span>Open Member Section</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {members.slice(0, 4).map(member => (
                      <div
                        key={member.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.625rem 0.75rem',
                          backgroundColor: 'var(--muted)',
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <div style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}>
                            {member.full_name?.charAt(0) || "M"}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{member.full_name}</div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)' }}>{member.type}</div>
                          </div>
                        </div>

                        <span className="badge badge-zinc font-mono" style={{ fontSize: '0.6875rem' }}>
                          {member.flat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resident Portal Shortcut Card */}
                <div 
                  className="glass-card p-4"
                  style={{
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Home size={18} color="#3b82f6" />
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Switch to Resident Portal</h4>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.875rem', lineHeight: 1.4 }}>
                    Experience the resident interface as Pooja Deshmukh (Flat B-402) with voice complaints, gate passes, and dues.
                  </p>
                  <a
                    href="/member"
                    className="btn-outline"
                    style={{ width: '100%', fontSize: '0.75rem', padding: '0.45rem', justifyContent: 'center' }}
                  >
                    <span>Launch Resident Suite &rarr;</span>
                  </a>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================= VIEW 2: RESIDENT DIRECTORY ================= */}
        {activeView === "members" && (
          <MemberDirectorySection
            members={members}
            onAddMemberSuccess={handleMemberAdded}
            onEditProfileClick={() => setShowEditProfileModal(true)}
          />
        )}

        {/* ================= VIEW 3: NOTICE BOARD ================= */}
        {activeView === "notices" && (
          <NoticeBoard />
        )}

        {/* ================= VIEW 4: SOS CENTER ================= */}
        {activeView === "sos" && (
          <div className="glass-card p-6 text-center" style={{ maxWidth: '36rem', margin: '0 auto' }}>
            <ShieldAlert size={48} color="#ef4444" style={{ margin: '0 auto 1rem auto' }} />
            <h2 className="text-xl font-bold mb-2">Gate Security &amp; Emergency SOS</h2>
            <p className="text-sm text-muted mb-6">
              Trigger high-priority security alarms directly to the main entrance security booth.
            </p>
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="btn-primary"
              style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', margin: '0 auto', padding: '0.75rem 1.5rem' }}
            >
              <ShieldAlert size={18} />
              <span>Open Emergency Dispatch Panel</span>
            </button>
          </div>
        )}

      </main>

      {/* ================= MODALS ================= */}
      <SendProblemModal
        isOpen={showSendProblemModal}
        onClose={() => setShowSendProblemModal(false)}
        defaultFlat="B-402"
        onComplaintSubmitted={handleComplaintSubmitted}
      />

      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        onProfileUpdated={(updated) => setUserProfile(updated)}
      />

      <EmergencySOSModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        userFlat="B-402"
      />

      <WalkthroughConcierge
        onOpenSendProblem={() => setShowSendProblemModal(true)}
        onOpenEditProfile={() => setShowEditProfileModal(true)}
        onSwitchTab={(tab) => setActiveView(tab)}
      />

    </div>
  );
}
