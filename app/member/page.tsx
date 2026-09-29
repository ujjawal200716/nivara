"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Home, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldAlert, 
  Wrench, 
  Droplets, 
  Car, 
  Trash2, 
  Search, 
  Star, 
  Send, 
  User, 
  ArrowRight,
  ShieldCheck,
  Check,
  Zap,
  Filter,
  X,
  Phone,
  Quote,
  Building,
  Edit3
} from "lucide-react";
import { MemberNavbar } from "./MemberNavbar";
import { EditProfileModal, UserProfile } from "@/app/dashboard/EditProfileModal";
import { SendProblemModal } from "@/app/dashboard/SendProblemModal";
import { EmergencySOSModal } from "@/app/dashboard/EmergencySOSModal";

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

// Core resident complaints data
interface ResidentComplaint {
  id: string;
  category: "Lift" | "Water" | "Parking" | "Cleaning" | "Electricity" | "Noise" | "Security" | string;
  original_text: string;
  translated_text: string;
  urgency: "Critical" | "High" | "Medium" | "Low" | string;
  status: "Needs Triage" | "In Progress" | "Resolved" | string;
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
  const [complaints, setComplaints] = useState<ResidentComplaint[]>(INITIAL_COMPLAINTS);
  const [filterStatus, setFilterStatus] = useState<"all" | "In Progress" | "Resolved">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Floating Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load profile and stored ratings from localStorage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("nivara_user_profile");
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
      const savedComplaints = localStorage.getItem("nivara_member_complaints");
      if (savedComplaints) {
        setComplaints(JSON.parse(savedComplaints));
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  const saveComplaints = (updated: ResidentComplaint[]) => {
    setComplaints(updated);
    try {
      localStorage.setItem("nivara_member_complaints", JSON.stringify(updated));
    } catch (e) {}
  };

  const handleProfileUpdated = (updated: UserProfile) => {
    setProfile(updated);
    try {
      localStorage.setItem("nivara_user_profile", JSON.stringify(updated));
    } catch (e) {}
    showToast("Profile details updated successfully!");
  };

  const handleRateComplaint = (complaintId: string, rating: number) => {
    const updated = complaints.map(c => c.id === complaintId ? { ...c, rating } : c);
    saveComplaints(updated);
    showToast(`Rated ${rating} ★. Feedback recorded!`);
  };

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchesFilter = filterStatus === "all" ? true : c.status === filterStatus;
      const matchesCategory = selectedCategory === "all" ? true : c.category.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || (
        c.original_text.toLowerCase().includes(q) ||
        c.translated_text.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (c.assigned_technician && c.assigned_technician.toLowerCase().includes(q))
      );
      return matchesFilter && matchesCategory && matchesQuery;
    });
  }, [complaints, filterStatus, selectedCategory, searchQuery]);

  const activeCount = complaints.filter(c => c.status !== "Resolved").length;
  const resolvedCount = complaints.filter(c => c.status === "Resolved").length;

  const categories = useMemo(() => {
    const set = new Set<string>();
    complaints.forEach(c => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [complaints]);

  // Clean category pill styling & icon
  const getCategoryConfig = (category: string) => {
    switch (category.toLowerCase()) {
      case "lift": 
        return { icon: <Wrench size={12} strokeWidth={2.2} />, color: "#d97706", bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.25)" };
      case "water": 
        return { icon: <Droplets size={12} strokeWidth={2.2} />, color: "#2563eb", bg: "rgba(37, 99, 235, 0.1)", border: "rgba(37, 99, 235, 0.25)" };
      case "cleaning": 
        return { icon: <Trash2 size={12} strokeWidth={2.2} />, color: "#059669", bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.25)" };
      case "parking": 
        return { icon: <Car size={12} strokeWidth={2.2} />, color: "#7c3aed", bg: "rgba(124, 58, 237, 0.1)", border: "rgba(124, 58, 237, 0.25)" };
      case "electricity": 
        return { icon: <Zap size={12} strokeWidth={2.2} />, color: "#ca8a04", bg: "rgba(202, 138, 4, 0.1)", border: "rgba(202, 138, 4, 0.25)" };
      default: 
        return { icon: <AlertCircle size={12} strokeWidth={2.2} />, color: "#4b5563", bg: "rgba(107, 114, 128, 0.1)", border: "rgba(107, 114, 128, 0.25)" };
    }
  };

  // Subtle urgency indicator
  const getUrgencyConfig = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "critical": 
        return { label: "Critical", dotColor: "#ef4444", textColor: "#ef4444", bg: "rgba(239, 68, 68, 0.08)", border: "rgba(239, 68, 68, 0.25)" };
      case "high": 
        return { label: "High", dotColor: "#f97316", textColor: "#f97316", bg: "rgba(249, 115, 22, 0.08)", border: "rgba(249, 115, 22, 0.25)" };
      case "medium": 
        return { label: "Medium", dotColor: "#f59e0b", textColor: "#ca8a04", bg: "rgba(245, 158, 11, 0.08)", border: "rgba(245, 158, 11, 0.2)" };
      default: 
        return { label: "Low", dotColor: "#10b981", textColor: "#059669", bg: "rgba(16, 185, 129, 0.08)", border: "rgba(16, 185, 129, 0.2)" };
    }
  };

  // Pipeline milestone steps
  const PIPELINE_STEPS = [
    { key: "reported", label: "Reported" },
    { key: "triage", label: "AI Triaged" },
    { key: "dispatch", label: "Dispatched" },
    { key: "resolved", label: "Resolved" }
  ];

  const getStepState = (stepIndex: number, status: string) => {
    // 0: Reported - Always done
    if (stepIndex === 0) return "done";
    // 1: AI Triaged - Always done for recorded tickets
    if (stepIndex === 1) return "done";
    // 2: Dispatched
    if (stepIndex === 2) {
      if (status === "Resolved") return "done";
      if (status === "In Progress") return "active";
      return "pending";
    }
    // 3: Resolved
    if (stepIndex === 3) {
      if (status === "Resolved") return "done";
      return "pending";
    }
    return "pending";
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      
      {/* Top Navbar */}
      <MemberNavbar
        onOpenProblemModal={() => setShowProblemModal(true)}
        onOpenProfileModal={() => setShowEditModal(true)}
        profile={profile}
        unresolvedCount={activeCount}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div 
          style={{
            position: 'fixed',
            bottom: '1.75rem',
            right: '1.75rem',
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

      {/* Main Content Area */}
      <main className="container flex-1" style={{ padding: '1.75rem 1.25rem', maxWidth: '58rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* ================= COMPACT RESIDENT HEADER ================= */}
        <section 
          className="glass-card"
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            border: '1px solid var(--border)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            
            {/* Resident Profile Identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div 
                style={{
                  width: '3.25rem',
                  height: '3.25rem',
                  borderRadius: '50%',
                  backgroundColor: profile.avatarColor || '#10b981',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.15rem',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                  flexShrink: 0
                }}
              >
                {profile.name?.substring(0, 2).toUpperCase() || "PD"}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
                    {profile.name}
                  </h1>
                  <span 
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: 'var(--primary)',
                      border: '1px solid rgba(16, 185, 129, 0.25)'
                    }}
                  >
                    Flat {profile.flat} • {profile.wing}
                  </span>
                  <span 
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--muted)',
                      color: 'var(--muted-foreground)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {profile.type}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem', fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
                  <span>Intercom: <strong style={{ color: 'var(--foreground)' }}>{profile.intercom}</strong></span>
                  <span>•</span>
                  <span>Emergency: <strong style={{ color: 'var(--foreground)' }}>{profile.emergencyContactName?.split(" ")[0]}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowProblemModal(true)}
                className="btn-primary"
                style={{ padding: '0.55rem 1.15rem', fontSize: '0.8125rem', fontWeight: 600 }}
              >
                <Plus size={15} strokeWidth={2.5} />
                <span>New Complaint</span>
              </button>

              <button
                onClick={() => setShowEmergencyModal(true)}
                className="btn-outline"
                style={{
                  padding: '0.55rem 0.85rem',
                  fontSize: '0.8125rem',
                  color: '#ef4444',
                  borderColor: 'rgba(239, 68, 68, 0.25)'
                }}
                title="Trigger Emergency Gate Siren"
              >
                <ShieldAlert size={15} />
                <span>Gate SOS</span>
              </button>

              <button
                onClick={() => setShowEditModal(true)}
                className="btn-outline"
                style={{ padding: '0.55rem 0.75rem', fontSize: '0.8125rem' }}
                title="Edit Flat & Profile Info"
              >
                <Edit3 size={14} />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar inside Header */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              paddingTop: '0.875rem', 
              borderTop: '1px solid var(--border)',
              flexWrap: 'wrap'
            }}
          >
            <div 
              onClick={() => setFilterStatus("all")}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: filterStatus === "all" ? 'var(--muted)' : 'transparent',
                fontWeight: filterStatus === "all" ? 600 : 500
              }}
            >
              <span style={{ color: 'var(--muted-foreground)' }}>Total Tickets:</span>
              <span className="font-mono font-bold">{complaints.length}</span>
            </div>

            <div 
              onClick={() => setFilterStatus("In Progress")}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: filterStatus === "In Progress" ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                fontWeight: filterStatus === "In Progress" ? 600 : 500,
                color: filterStatus === "In Progress" ? '#d97706' : 'inherit'
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
              <span style={{ color: 'var(--muted-foreground)' }}>Active:</span>
              <span className="font-mono font-bold" style={{ color: '#d97706' }}>{activeCount}</span>
            </div>

            <div 
              onClick={() => setFilterStatus("Resolved")}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: filterStatus === "Resolved" ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                fontWeight: filterStatus === "Resolved" ? 600 : 500,
                color: filterStatus === "Resolved" ? '#059669' : 'inherit'
              }}
            >
              <CheckCircle2 size={13} color="#10b981" />
              <span style={{ color: 'var(--muted-foreground)' }}>Resolved:</span>
              <span className="font-mono font-bold" style={{ color: '#059669' }}>{resolvedCount}</span>
            </div>
          </div>
        </section>

        {/* ================= CONTROLS & FILTER ROW ================= */}
        <section 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.875rem'
          }}
        >
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: 'var(--muted)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
            <button
              onClick={() => setFilterStatus("all")}
              className={`filter-tab ${filterStatus === "all" ? "filter-tab-active" : ""}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}
            >
              All Tickets ({complaints.length})
            </button>
            <button
              onClick={() => setFilterStatus("In Progress")}
              className={`filter-tab ${filterStatus === "In Progress" ? "filter-tab-active" : ""}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              In Progress ({activeCount})
            </button>
            <button
              onClick={() => setFilterStatus("Resolved")}
              className={`filter-tab ${filterStatus === "Resolved" ? "filter-tab-active" : ""}`}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              Resolved ({resolvedCount})
            </button>
          </div>

          {/* Search Field */}
          <div style={{ position: 'relative', width: '18rem' }} className="md-w-full">
            <Search size={14} className="text-muted" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword, tech, id..."
              className="input-field"
              style={{ paddingLeft: '2.25rem', paddingRight: searchQuery ? '2rem' : '0.85rem', height: '2.25rem', fontSize: '0.8125rem' }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </section>

        {/* Category Filter Chips */}
        {categories.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>Category:</span>
            <button
              onClick={() => setSelectedCategory("all")}
              style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: selectedCategory === "all" ? 'var(--primary)' : 'var(--border)',
                backgroundColor: selectedCategory === "all" ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                color: selectedCategory === "all" ? 'var(--primary)' : 'var(--muted-foreground)',
                fontWeight: selectedCategory === "all" ? 600 : 500,
                cursor: 'pointer'
              }}
            >
              All
            </button>
            {categories.map(cat => {
              const cfg = getCategoryConfig(cat);
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(isSelected ? "all" : cat)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: isSelected ? cfg.color : 'var(--border)',
                    backgroundColor: isSelected ? cfg.bg : 'transparent',
                    color: isSelected ? cfg.color : 'var(--muted-foreground)',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {cfg.icon}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ================= SLEEK LINEAR TICKET FEED ================= */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredComplaints.map((item) => {
            const catConfig = getCategoryConfig(item.category);
            const urgencyConfig = getUrgencyConfig(item.urgency);
            const isResolved = item.status === "Resolved";

            return (
              <div 
                key={item.id}
                className="glass-card"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* 1. Header Row: Category, ID, Priority & Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  
                  {/* Left: Category Pill + Ticket ID + Priority Indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    
                    {/* Category Pill */}
                    <span 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: catConfig.bg,
                        color: catConfig.color,
                        border: `1px solid ${catConfig.border}`,
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}
                    >
                      {catConfig.icon}
                      {item.category}
                    </span>

                    {/* Ticket ID */}
                    <span 
                      className="font-mono" 
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--muted-foreground)',
                        fontWeight: 600
                      }}
                    >
                      #{item.id}
                    </span>

                    {/* Urgency Dot & Label */}
                    <span 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: urgencyConfig.bg,
                        color: urgencyConfig.textColor,
                        border: `1px solid ${urgencyConfig.border}`,
                        fontSize: '0.6875rem',
                        fontWeight: 600
                      }}
                    >
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: urgencyConfig.dotColor }} />
                      {urgencyConfig.label}
                    </span>
                  </div>

                  {/* Right: Timestamp & Status Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                      {item.created_at}
                    </span>

                    {isResolved ? (
                      <span 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.2rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: 'rgba(16, 185, 129, 0.12)',
                          color: '#059669',
                          border: '1px solid rgba(16, 185, 129, 0.25)'
                        }}
                      >
                        <Check size={12} strokeWidth={2.5} />
                        Resolved
                      </span>
                    ) : (
                      <span 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.2rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: 'rgba(245, 158, 11, 0.12)',
                          color: '#d97706',
                          border: '1px solid rgba(245, 158, 11, 0.25)'
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b', animation: 'pulse 1.8s infinite' }} />
                        In Progress
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Main Title (AI English Summary) */}
                <div>
                  <h2 
                    style={{ 
                      fontSize: '0.975rem', 
                      fontWeight: 600, 
                      color: 'var(--foreground)', 
                      margin: 0, 
                      lineHeight: 1.45 
                    }}
                  >
                    {item.translated_text || item.original_text}
                  </h2>

                  {/* Clean Original Resident Quote (if translated/different) */}
                  {item.original_text && item.original_text !== item.translated_text && (
                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '0.45rem',
                        marginTop: '0.35rem',
                        fontSize: '0.8125rem',
                        color: 'var(--muted-foreground)'
                      }}
                    >
                      <Quote size={12} style={{ flexShrink: 0, opacity: 0.6, transform: 'rotate(180deg)' }} />
                      <span style={{ fontStyle: 'italic' }}>"{item.original_text}"</span>
                    </div>
                  )}
                </div>

                {/* 3. Linear Milestone Pipeline (Zero Clutter Stepper) */}
                <div 
                  style={{
                    padding: '0.75rem 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
                    {PIPELINE_STEPS.map((step, idx) => {
                      const state = getStepState(idx, item.status);
                      const isLast = idx === PIPELINE_STEPS.length - 1;

                      return (
                        <div 
                          key={step.key} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            flex: isLast ? '0 0 auto' : 1 
                          }}
                        >
                          {/* Step Node */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                            <div 
                              style={{
                                width: '1.35rem',
                                height: '1.35rem',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.625rem',
                                fontWeight: 700,
                                zIndex: 2,
                                transition: 'all 0.3s ease',
                                backgroundColor: state === "done" 
                                  ? '#10b981' 
                                  : state === "active" 
                                  ? 'rgba(245, 158, 11, 0.15)' 
                                  : 'var(--muted)',
                                color: state === "done" ? '#ffffff' : state === "active" ? '#d97706' : 'var(--muted-foreground)',
                                border: state === "done" 
                                  ? '1px solid #10b981' 
                                  : state === "active" 
                                  ? '2px solid #f59e0b' 
                                  : '1px solid var(--border)'
                              }}
                            >
                              {state === "done" ? (
                                <Check size={10} strokeWidth={3} />
                              ) : state === "active" ? (
                                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                              ) : (
                                <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--muted-foreground)' }} />
                              )}
                            </div>

                            {/* Node Label Below */}
                            <span 
                              style={{
                                position: 'absolute',
                                top: '1.6rem',
                                fontSize: '0.6875rem',
                                whiteSpace: 'nowrap',
                                fontWeight: state === "done" || state === "active" ? 600 : 500,
                                color: state === "done" 
                                  ? 'var(--foreground)' 
                                  : state === "active" 
                                  ? '#d97706' 
                                  : 'var(--muted-foreground)'
                              }}
                            >
                              {step.label}
                            </span>
                          </div>

                          {/* Connecting Bar */}
                          {!isLast && (
                            <div 
                              style={{
                                flex: 1,
                                height: '2px',
                                margin: '0 0.4rem',
                                backgroundColor: state === "done" 
                                  ? (getStepState(idx + 1, item.status) === "done" ? '#10b981' : '#f59e0b') 
                                  : 'var(--border)',
                                borderRadius: '9999px',
                                transition: 'all 0.3s ease'
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Spacer for step labels */}
                  <div style={{ height: '0.75rem' }} />
                </div>

                {/* 4. Footer Strip: Technician, Audit Note & Rating */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border)'
                  }}
                >
                  {/* Left: Assigned Staff or Resolution Audit */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
                    {item.assigned_technician && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--muted-foreground)' }}>
                        <Wrench size={12} color="var(--primary)" />
                        <span>Assigned Staff: <strong style={{ color: 'var(--foreground)' }}>{item.assigned_technician}</strong></span>
                      </div>
                    )}

                    {item.resolution_note && (
                      <div 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'rgba(16, 185, 129, 0.08)',
                          color: '#059669',
                          border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}
                      >
                        <CheckCircle2 size={12} />
                        <span>{item.resolution_note}</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Star Rating on Resolved */}
                  {isResolved && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--muted-foreground)' }}>Rate Service:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRateComplaint(item.id, star)}
                            style={{
                              color: (item.rating || 0) >= star ? '#eab308' : 'var(--muted-foreground)',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0.1rem',
                              transition: 'transform 0.15s ease'
                            }}
                            title={`Rate ${star} star`}
                          >
                            <Star size={14} fill={(item.rating || 0) >= star ? '#eab308' : 'none'} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            );
          })}

          {/* Empty State */}
          {filteredComplaints.length === 0 && (
            <div 
              className="glass-card" 
              style={{
                padding: '3rem 1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
                border: '1px solid var(--border)'
              }}
            >
              <div 
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}
              >
                <CheckCircle2 size={24} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>No Complaints Found</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', maxWidth: '24rem', margin: 0 }}>
                {searchQuery || selectedCategory !== "all" || filterStatus !== "all"
                  ? "No tickets match your selected filters. Try clearing your search or filter tags."
                  : "All society maintenance tasks for your unit are currently clear."}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {(searchQuery || selectedCategory !== "all" || filterStatus !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setFilterStatus("all");
                    }}
                    className="btn-outline"
                    style={{ fontSize: '0.8125rem' }}
                  >
                    Reset Filters
                  </button>
                )}
                <button
                  onClick={() => setShowProblemModal(true)}
                  className="btn-primary"
                  style={{ fontSize: '0.8125rem' }}
                >
                  <Plus size={14} />
                  <span>Submit New Ticket</span>
                </button>
              </div>
            </div>
          )}
        </section>

      </main>

      {/* ================= MODALS ================= */}
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
          saveComplaints([formatted, ...complaints]);
          showToast("Issue submitted & AI triaged!");
        }}
      />

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onProfileUpdated={handleProfileUpdated}
      />

      <EmergencySOSModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        userFlat={profile.flat}
      />

    </div>
  );
}
