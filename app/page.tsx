"use client";

import { useState } from "react";
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
  Zap
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
    <div 
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        background: "radial-gradient(ellipse at 50% 10%, rgba(16, 185, 129, 0.08) 0%, transparent 60%), var(--background)"
      }}
    >
      {/* ================= CLEAN TOP HEADER ================= */}
      <header 
        style={{
          height: "3.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--card)",
          position: "sticky",
          top: 0,
          zIndex: 40
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
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
            <ShieldCheck size={20} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em" }}>
              Nivara Society Hub
            </span>
            <span 
              className="badge badge-green" 
              style={{ fontSize: "0.6875rem", padding: "0.15rem 0.45rem" }}
            >
              Online
            </span>
          </div>
        </div>

        {/* Top Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link 
            href="/dashboard" 
            className="nav-link hidden-mobile"
            style={{ fontSize: "0.8125rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <span>Admin Board</span>
          </Link>

          <Link 
            href="/member" 
            className="nav-link hidden-mobile"
            style={{ fontSize: "0.8125rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <span>Resident Portal</span>
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
      </header>

      {/* ================= MAIN LOGIN CONTAINER ================= */}
      <main 
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2.5rem 1rem"
        }}
      >
        <div style={{ width: "100%", maxWidth: "27rem" }}>
          
          {/* Header Title Section */}
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div 
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--primary)",
                marginBottom: "0.75rem"
              }}
            >
              <Sparkles size={13} />
              <span>Society Triage &amp; Management</span>
            </div>
            
            <h1 
              style={{
                fontSize: "1.65rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: 0,
                color: "var(--foreground)"
              }}
            >
              Sign in to your society
            </h1>
            <p 
              style={{
                fontSize: "0.875rem",
                color: "var(--muted-foreground)",
                marginTop: "0.4rem",
                lineHeight: 1.4
              }}
            >
              Access real-time incident triage, visitor gate passes, and community maintenance.
            </p>
          </div>

          {/* 1-Click Fast Demo Login Switchers */}
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
              marginBottom: "1.25rem"
            }}
          >
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("admin")}
              disabled={isLoading}
              className="glass-card-interactive"
              style={{
                padding: "0.75rem 0.85rem",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
                cursor: "pointer"
              }}
              title="1-Click Login as Committee Admin"
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)" }}>
                  ⚡ Quick Demo
                </span>
                <ShieldCheck size={14} color="var(--primary)" />
              </div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Committee Admin</div>
              <div style={{ fontSize: "0.6875rem", color: "var(--muted-foreground)" }}>Vikram Malhotra</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin("member")}
              disabled={isLoading}
              className="glass-card-interactive"
              style={{
                padding: "0.75rem 0.85rem",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
                cursor: "pointer"
              }}
              title="1-Click Login as Resident (Flat B-402)"
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#3b82f6" }}>
                  🏡 Quick Demo
                </span>
                <Home size={14} color="#3b82f6" />
              </div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Resident Portal</div>
              <div style={{ fontSize: "0.6875rem", color: "var(--muted-foreground)" }}>Pooja (Flat B-402)</div>
            </button>
          </div>

          {/* Main Login Card */}
          <div 
            className="glass-card"
            style={{
              padding: "1.75rem",
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
                <ShieldCheck size={14} style={{ color: role === "admin" ? "var(--primary)" : "inherit" }} />
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
                <Home size={14} style={{ color: role === "member" ? "#3b82f6" : "inherit" }} />
                <span>Resident</span>
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div 
                style={{
                  padding: "0.625rem 0.75rem",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.8125rem",
                  marginBottom: "1rem"
                }}
              >
                {errorMsg}
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
                  {role === "admin" ? "Username or Email" : "Resident Email"}
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
                    style={{ paddingLeft: "2.4rem", height: "2.65rem" }}
                    placeholder={role === "admin" ? "admin" : "resident@society.com"}
                  />
                </div>
              </div>

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
                    {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
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
                    style={{ paddingLeft: "2.4rem", height: "2.65rem" }}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Sample Credentials Badge */}
              <div 
                style={{
                  backgroundColor: "var(--muted)",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.75rem",
                  color: "var(--muted-foreground)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <span>Default {role === "admin" ? "Admin" : "Resident"}:</span>
                <span style={{ fontWeight: 600, color: "var(--foreground)", fontFamily: "var(--font-mono)" }}>
                  {role === "admin" ? "admin / admin" : "resident@society.com / resident"}
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                style={{ 
                  width: "100%", 
                  padding: "0.75rem 1rem", 
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                  height: "2.75rem"
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
                    <ArrowRight size={15} />
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
                  style={{ color: "var(--primary)", fontWeight: 600 }}
                >
                  Admin Board &rarr;
                </Link>
                <Link 
                  href="/member"
                  style={{ color: "#3b82f6", fontWeight: 600 }}
                >
                  Resident Portal &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Simple Features Summary */}
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.75rem",
              marginTop: "1.5rem",
              textAlign: "center"
            }}
          >
            <div className="glass-card" style={{ padding: "0.75rem 0.5rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700 }}>Multilingual</div>
              <div style={{ fontSize: "0.6875rem", color: "var(--muted-foreground)", marginTop: "0.15rem" }}>Hindi &amp; Hinglish triage</div>
            </div>
            <div className="glass-card" style={{ padding: "0.75rem 0.5rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700 }}>Auto Ranking</div>
              <div style={{ fontSize: "0.6875rem", color: "var(--muted-foreground)", marginTop: "0.15rem" }}>Critical lift &amp; water</div>
            </div>
            <div className="glass-card" style={{ padding: "0.75rem 0.5rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700 }}>Gate &amp; Passes</div>
              <div style={{ fontSize: "0.6875rem", color: "var(--muted-foreground)", marginTop: "0.15rem" }}>Visitor &amp; SOS alerts</div>
            </div>
          </div>

        </div>
      </main>

      {/* ================= CLEAN FOOTER ================= */}
      <footer 
        style={{
          borderTop: "1px solid var(--border)",
          padding: "1.25rem 1.5rem",
          backgroundColor: "var(--card)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          fontSize: "0.75rem",
          color: "var(--muted-foreground)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontWeight: 600, color: "var(--foreground)" }}>Nivara Society Triage</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <Link href="/terms" style={{ color: "var(--foreground)" }}>Terms</Link>
          <Link href="/privacy" style={{ color: "var(--foreground)" }}>Privacy</Link>
          <Link href="/complaint/new" style={{ color: "var(--foreground)" }}>Submit Complaint</Link>
        </div>
      </footer>
    </div>
  );
}
