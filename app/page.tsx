"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Home, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Send,
  Zap,
  Clock,
  Activity,
  Award,
  Users,
  Check,
  ChevronRight,
  Radio
} from "lucide-react";
import { loginAction } from "./actions";
import { ThemeToggle } from "./dashboard/ThemeToggle";

export default function LoginPage() {
  const [role, setRole] = useState<"admin" | "member">("admin");
  const [email, setEmail] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live status ticker rotation
  const [tickerIndex, setTickerIndex] = useState(0);
  const tickerItems = [
    { text: "Lift B-2 emergency sensor alert auto-resolved by vendor", time: "6m ago", tag: "Critical SLA" },
    { text: "Overhead water reservoir pumped & quality certified", time: "18m ago", tag: "Utilities" },
    { text: "Main Gate security QR gatepass verified for Flat A-204", time: "24m ago", tag: "Visitor Gate" },
    { text: "Monthly electricity common meter audit completed • 100% normal", time: "42m ago", tag: "Maintenance" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [tickerItems.length]);

  const handleRoleChange = (newRole: "admin" | "member") => {
    setRole(newRole);
    setErrorMsg(null);
    if (newRole === "admin") {
      setEmail("admin");
      setPassword("admin");
    } else {
      setEmail("resident@society.com");
      setPassword("resident");
    }
  };

  const fillCredentials = (user: string, pass: string) => {
    setEmail(user);
    setPassword(pass);
  };

  const handleQuickDemoLogin = async (selectedRole: "admin" | "member") => {
    setIsLoading(true);
    setErrorMsg(null);
    const formData = new FormData();
    formData.append("role", selectedRole);
    formData.append("email", selectedRole === "admin" ? "admin" : "resident@society.com");
    formData.append("password", selectedRole === "admin" ? "admin" : "resident");

    try {
      const res = await loginAction(formData);
      if (res?.error) {
        setErrorMsg(res.error);
      }
    } catch (err: any) {
      if (err?.message !== "NEXT_REDIRECT") {
        setErrorMsg(err?.message || "Sign in failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-split-page">
      {/* ================= LEFT SIDE: SHOWCASE, IMAGE & INFO ================= */}
      <div 
        className="login-left-panel"
        style={{
          backgroundImage: "linear-gradient(180deg, rgba(10, 15, 29, 0.78) 0%, rgba(10, 15, 29, 0.6) 40%, rgba(10, 15, 29, 0.94) 100%), url('/society-residence.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Ambient Top Glow Effect */}
        <div 
          style={{
            position: "absolute",
            top: "-15%",
            left: "-10%",
            width: "35rem",
            height: "35rem",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 1
          }} 
        />
        <div 
          style={{
            position: "absolute",
            bottom: "10%",
            right: "-15%",
            width: "30rem",
            height: "30rem",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 1
          }} 
        />

        {/* Content Layer */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
          
          {/* Top Brand Header */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div 
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "0.625rem",
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.8))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 16px -4px rgba(16, 185, 129, 0.4)",
                    color: "#ffffff"
                  }}
                >
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.02em", color: "#ffffff" }}>
                      Nivara
                    </span>
                    <span 
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "9999px",
                        backgroundColor: "rgba(16, 185, 129, 0.2)",
                        color: "#34d399",
                        border: "1px solid rgba(16, 185, 129, 0.35)"
                      }}
                    >
                      Society OS
                    </span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(226, 232, 240, 0.75)" }}>
                    Greenwood Heights Residential Community
                  </div>
                </div>
              </div>

              {/* Status Beacon */}
              <div 
                className="glass-overlay-subtle"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.35rem 0.75rem",
                  fontSize: "0.75rem",
                  borderRadius: "9999px"
                }}
              >
                <span className="pulse-dot" />
                <span style={{ fontWeight: 500, color: "rgba(255, 255, 255, 0.9)" }}>AI Triage Engine Active</span>
              </div>
            </div>

            {/* Hero Main Headline */}
            <div style={{ marginTop: "3.5rem", maxWidth: "34rem" }}>
              <div 
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.3rem 0.8rem",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#a7f3d0",
                  marginBottom: "1.25rem"
                }}
              >
                <Sparkles size={13} />
                <span>Next-Gen Housing Community Platform</span>
              </div>

              <h1 
                style={{
                  fontSize: "2.35rem",
                  lineHeight: "1.18",
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  color: "#ffffff",
                  margin: 0
                }}
              >
                Intelligent Triage &amp; Seamless Living for Modern Estates.
              </h1>

              <p 
                style={{
                  fontSize: "0.95rem",
                  lineHeight: "1.55",
                  color: "rgba(226, 232, 240, 0.85)",
                  marginTop: "1rem",
                  maxWidth: "32rem"
                }}
              >
                Autonomous natural language complaint triage, instant visitor gate passes, committee tracking, and verified vendor SLA dispatch for 240+ flats.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div 
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(13.5rem, 1fr))",
                gap: "0.85rem",
                marginTop: "2.25rem"
              }}
            >
              <div className="glass-overlay-card" style={{ padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
                  <div style={{ padding: "0.35rem", borderRadius: "0.375rem", backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#34d399" }}>
                    <Zap size={16} />
                  </div>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#ffffff" }}>AI Rapid Triage</span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "rgba(226, 232, 240, 0.75)", margin: 0, lineHeight: 1.4 }}>
                  Understands Hindi, Hinglish &amp; English issues with 99.4% categorization accuracy.
                </p>
              </div>

              <div className="glass-overlay-card" style={{ padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
                  <div style={{ padding: "0.35rem", borderRadius: "0.375rem", backgroundColor: "rgba(59, 130, 246, 0.2)", color: "#60a5fa" }}>
                    <Clock size={16} />
                  </div>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#ffffff" }}>&lt; 15 min SLA</span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "rgba(226, 232, 240, 0.75)", margin: 0, lineHeight: 1.4 }}>
                  Instant WhatsApp dispatch for critical lift, plumbing &amp; electrical breakdowns.
                </p>
              </div>

              <div className="glass-overlay-card" style={{ padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
                  <div style={{ padding: "0.35rem", borderRadius: "0.375rem", backgroundColor: "rgba(245, 158, 11, 0.2)", color: "#fbbf24" }}>
                    <Building2 size={16} />
                  </div>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#ffffff" }}>Gate &amp; Passes</span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "rgba(226, 232, 240, 0.75)", margin: 0, lineHeight: 1.4 }}>
                  Secure QR visitor passes, maid/staff daily verification, and one-tap SOS.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry & Social Proof */}
          <div style={{ marginTop: "3rem" }}>
            {/* Live Rotating Society Activity Card */}
            <div 
              className="glass-overlay-card" 
              style={{
                padding: "0.85rem 1.15rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                borderLeft: "3px solid #10b981",
                marginBottom: "1.5rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                <div 
                  style={{
                    width: "1.75rem",
                    height: "1.75rem",
                    borderRadius: "50%",
                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                    color: "#34d399",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  <Activity size={14} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", color: "#34d399" }}>
                      {tickerItems[tickerIndex].tag}
                    </span>
                    <span style={{ fontSize: "0.6875rem", color: "rgba(255, 255, 255, 0.5)" }}>• {tickerItems[tickerIndex].time}</span>
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#ffffff", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tickerItems[tickerIndex].text}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>
                {tickerItems.map((_, idx) => (
                  <div 
                    key={idx}
                    style={{
                      width: idx === tickerIndex ? "1rem" : "0.35rem",
                      height: "0.35rem",
                      borderRadius: "9999px",
                      backgroundColor: idx === tickerIndex ? "#10b981" : "rgba(255, 255, 255, 0.25)",
                      transition: "all 0.3s ease"
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Resident Satisfaction & Trust Badges */}
            <div 
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
                paddingTop: "1.25rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.12)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"].map((bg, i) => (
                    <div 
                      key={i}
                      style={{
                        width: "1.75rem",
                        height: "1.75rem",
                        borderRadius: "50%",
                        backgroundColor: bg,
                        border: "2px solid #0f172a",
                        marginLeft: i === 0 ? 0 : "-0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.625rem",
                        fontWeight: 700,
                        color: "#ffffff"
                      }}
                    >
                      {["VM", "PS", "AK", "RD"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ffffff" }}>
                    4.9 / 5 Resident Satisfaction
                  </div>
                  <div style={{ fontSize: "0.6875rem", color: "rgba(226, 232, 240, 0.65)" }}>
                    Verified by 320+ flat owners &amp; tenants
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.75rem", color: "rgba(226, 232, 240, 0.65)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                  <Award size={13} color="#34d399" /> ISO 27001
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                  <ShieldCheck size={13} color="#60a5fa" /> 256-bit SSL
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= RIGHT SIDE: AUTHENTICATION & ACCESS ================= */}
      <div className="login-right-panel">
        
        {/* Top Header / Actions Bar */}
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem"
          }}
        >
          {/* Mobile brand (shown on smaller screens) */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div 
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)"
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <span style={{ fontWeight: 700, fontSize: "0.95rem", letterSpacing: "-0.02em" }}>
              Nivara Society Hub
            </span>
          </div>

          {/* Quick Direct Links & Theme Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <Link 
              href="/dashboard"
              className="nav-link hidden-mobile"
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }}
            >
              Admin Board
            </Link>
            <Link 
              href="/member"
              className="nav-link hidden-mobile"
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }}
            >
              Resident Portal
            </Link>
            <Link 
              href="/complaint/new"
              className="btn-outline hidden-mobile"
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
            >
              <Send size={12} />
              <span>Submit Issue</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Center Login Form Container */}
        <div 
          style={{
            maxWidth: "28rem",
            width: "100%",
            margin: "auto 0",
            alignSelf: "center",
            padding: "1rem 0"
          }}
        >
          {/* Welcome Text */}
          <div style={{ marginBottom: "1.75rem", textAlign: "left" }}>
            <div 
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.25rem 0.65rem",
                borderRadius: "9999px",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--primary)",
                marginBottom: "0.65rem"
              }}
            >
              <Sparkles size={12} />
              <span>Secure Member Access</span>
            </div>

            <h2 
              style={{
                fontSize: "1.85rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: 0,
                color: "var(--foreground)"
              }}
            >
              Sign in to your society
            </h2>
            <p 
              style={{
                fontSize: "0.875rem",
                color: "var(--muted-foreground)",
                marginTop: "0.35rem"
              }}
            >
              Select your role or choose a 1-click verified test account below.
            </p>
          </div>

          {/* 1-Click Fast Pair-Programming Demo Access Cards */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div 
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.5rem"
              }}
            >
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                ⚡ 1-Click Instant Demo Login
              </span>
              <span style={{ fontSize: "0.6875rem", color: "var(--primary)", fontWeight: 600 }}>No typing needed</span>
            </div>

            <div 
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem"
              }}
            >
              {/* Demo Admin Button */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("admin")}
                disabled={isLoading}
                className="glass-card-interactive"
                style={{
                  padding: "0.85rem 0.95rem",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                  cursor: "pointer",
                  borderLeft: role === "admin" ? "3px solid var(--primary)" : "1px solid var(--card-border)"
                }}
                title="Log in directly as Committee Admin"
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span 
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      color: "var(--primary)",
                      backgroundColor: "rgba(16, 185, 129, 0.12)",
                      padding: "0.15rem 0.45rem",
                      borderRadius: "var(--radius-sm)"
                    }}
                  >
                    Admin Hub
                  </span>
                  <ShieldCheck size={15} color="var(--primary)" />
                </div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--foreground)" }}>
                  Vikram Malhotra
                </div>
                <div style={{ fontSize: "0.6875rem", color: "var(--muted-foreground)" }}>
                  Society President • Full Triage
                </div>
              </button>

              {/* Demo Resident Button */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("member")}
                disabled={isLoading}
                className="glass-card-interactive"
                style={{
                  padding: "0.85rem 0.95rem",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                  cursor: "pointer",
                  borderLeft: role === "member" ? "3px solid #3b82f6" : "1px solid var(--card-border)"
                }}
                title="Log in directly as Flat B-402 Resident"
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span 
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      color: "#3b82f6",
                      backgroundColor: "rgba(59, 130, 246, 0.12)",
                      padding: "0.15rem 0.45rem",
                      borderRadius: "var(--radius-sm)"
                    }}
                  >
                    Resident
                  </span>
                  <Home size={15} color="#3b82f6" />
                </div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--foreground)" }}>
                  Pooja Sharma
                </div>
                <div style={{ fontSize: "0.6875rem", color: "var(--muted-foreground)" }}>
                  Flat B-402 • Gate &amp; Tickets
                </div>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div 
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              margin: "1.25rem 0",
              color: "var(--muted-foreground)",
              fontSize: "0.75rem"
            }}
          >
            <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }} />
            <span>or sign in with credentials</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }} />
          </div>

          {/* Main Card with Form */}
          <div 
            className="glass-card"
            style={{
              padding: "1.65rem",
              boxShadow: "var(--shadow-md)"
            }}
          >
            {/* Role Switcher Tabs */}
            <div 
              style={{
                display: "flex",
                backgroundColor: "var(--muted)",
                borderRadius: "var(--radius-md)",
                padding: "0.25rem",
                marginBottom: "1.25rem"
              }}
            >
              <button
                type="button"
                onClick={() => handleRoleChange("admin")}
                style={{
                  flex: 1,
                  padding: "0.55rem 0.75rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.8125rem",
                  fontWeight: role === "admin" ? 600 : 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  backgroundColor: role === "admin" ? "var(--card)" : "transparent",
                  color: role === "admin" ? "var(--foreground)" : "var(--muted-foreground)",
                  boxShadow: role === "admin" ? "var(--shadow-sm)" : "none",
                  transition: "all 0.15s ease"
                }}
              >
                <ShieldCheck size={15} style={{ color: role === "admin" ? "var(--primary)" : "inherit" }} />
                <span>Committee Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("member")}
                style={{
                  flex: 1,
                  padding: "0.55rem 0.75rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.8125rem",
                  fontWeight: role === "member" ? 600 : 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  backgroundColor: role === "member" ? "var(--card)" : "transparent",
                  color: role === "member" ? "var(--foreground)" : "var(--muted-foreground)",
                  boxShadow: role === "member" ? "var(--shadow-sm)" : "none",
                  transition: "all 0.15s ease"
                }}
              >
                <Home size={15} style={{ color: role === "member" ? "#3b82f6" : "inherit" }} />
                <span>Resident</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div 
                style={{
                  padding: "0.65rem 0.85rem",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.8125rem",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <span>⚠️ {errorMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form
              action={async (formData) => {
                setIsLoading(true);
                setErrorMsg(null);
                try {
                  const res = await loginAction(formData);
                  if (res?.error) {
                    setErrorMsg(res.error);
                  }
                } catch (err: any) {
                  if (err?.message !== "NEXT_REDIRECT") {
                    setErrorMsg(err?.message || "Authentication failed. Please verify credentials.");
                  }
                } finally {
                  setIsLoading(false);
                }
              }}
              style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
            >
              <input type="hidden" name="role" value={role} />

              {/* Email / Username Field */}
              <div>
                <label 
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "0.35rem"
                  }}
                >
                  {role === "admin" ? "Admin Username / Email" : "Resident Email"}
                </label>
                <div style={{ position: "relative" }}>
                  <Mail 
                    size={16} 
                    style={{
                      position: "absolute",
                      left: "0.85rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--muted-foreground)"
                    }} 
                  />
                  <input
                    type={role === "admin" ? "text" : "email"}
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field"
                    style={{ paddingLeft: "2.4rem", height: "2.75rem" }}
                    placeholder={role === "admin" ? "admin" : "resident@society.com"}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                  <label 
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--foreground)"
                    }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      fontSize: "0.6875rem",
                      color: "var(--muted-foreground)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      cursor: "pointer"
                    }}
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>

                <div style={{ position: "relative" }}>
                  <Lock 
                    size={16} 
                    style={{
                      position: "absolute",
                      left: "0.85rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--muted-foreground)"
                    }} 
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field"
                    style={{ paddingLeft: "2.4rem", height: "2.75rem" }}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Preset Helper Chip */}
              <div 
                style={{
                  backgroundColor: "var(--muted)",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.75rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <span style={{ color: "var(--muted-foreground)" }}>Quick Preset:</span>
                <button
                  type="button"
                  onClick={() => {
                    if (role === "admin") {
                      fillCredentials("admin", "admin");
                    } else {
                      fillCredentials("resident@society.com", "resident");
                    }
                  }}
                  style={{
                    color: "var(--primary)",
                    fontWeight: 600,
                    fontFamily: "var(--font-mono)",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontSize: "0.75rem"
                  }}
                  title="Click to auto-fill"
                >
                  {role === "admin" ? "admin / admin" : "resident@society.com / resident"}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                style={{ 
                  width: "100%", 
                  padding: "0.75rem 1rem", 
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  height: "2.85rem",
                  marginTop: "0.25rem",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)"
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>{role === "admin" ? "Sign In to Admin Hub" : "Enter Resident Portal"}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Direct Preview Shortcuts */}
            <div 
              style={{
                marginTop: "1.25rem",
                paddingTop: "1rem",
                borderTop: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "0.75rem"
              }}
            >
              <span style={{ color: "var(--muted-foreground)" }}>Direct Explore:</span>
              <div style={{ display: "flex", gap: "0.85rem" }}>
                <Link 
                  href="/dashboard"
                  style={{ color: "var(--primary)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.2rem" }}
                >
                  <span>Admin Board</span>
                  <ChevronRight size={12} />
                </Link>
                <Link 
                  href="/member"
                  style={{ color: "#3b82f6", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.2rem" }}
                >
                  <span>Resident Portal</span>
                  <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Need help or Guest issue */}
          <div 
            style={{
              textAlign: "center",
              marginTop: "1.25rem",
              fontSize: "0.8125rem",
              color: "var(--muted-foreground)"
            }}
          >
            <span>Have an urgent building breakdown? </span>
            <Link 
              href="/complaint/new"
              style={{ color: "var(--foreground)", fontWeight: 600, textDecoration: "underline" }}
            >
              Submit issue without login &rarr;
            </Link>
          </div>
        </div>

        {/* Clean Bottom Footer */}
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border)",
            fontSize: "0.75rem",
            color: "var(--muted-foreground)",
            marginTop: "1.5rem"
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} Nivara Society Triage &bull; Greenwood Heights
          </div>
          <div style={{ display: "flex", gap: "1.25rem" }}>
            <Link href="/terms" style={{ color: "var(--foreground)" }}>Terms</Link>
            <Link href="/privacy" style={{ color: "var(--foreground)" }}>Privacy</Link>
            <Link href="/complaint/new" style={{ color: "var(--foreground)" }}>Helpdesk</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
