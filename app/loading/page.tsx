"use client";

import Link from "next/link";
import { LoadingScreen } from "../LoadingScreen";
import { ArrowRight, LayoutDashboard, LogIn } from "lucide-react";

export default function LoadingDemoPage() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", backgroundColor: "#09090b" }}>
      {/* Live Loading Screen */}
      <LoadingScreen fullScreen={true} />

      {/* Floating navigation overlay for easy user preview/testing */}
      <div
        style={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.5rem 0.75rem",
          borderRadius: "9999px",
          background: "rgba(18, 18, 22, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
        }}
      >
        <span
          style={{
            fontSize: "0.75rem",
            color: "#a1a1aa",
            fontWeight: 500,
            paddingLeft: "0.25rem",
          }}
        >
          Preview Mode
        </span>
        <div style={{ width: "1px", height: "14px", backgroundColor: "rgba(255, 255, 255, 0.15)" }} />
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#10b981",
            textDecoration: "none",
            padding: "0.3rem 0.65rem",
            borderRadius: "9999px",
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            transition: "all 0.2s ease",
          }}
        >
          <LayoutDashboard style={{ width: "13px", height: "13px" }} />
          Dashboard
        </Link>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "#d4d4d8",
            textDecoration: "none",
            padding: "0.3rem 0.65rem",
            borderRadius: "9999px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <LogIn style={{ width: "13px", height: "13px" }} />
          Login
        </Link>
      </div>
    </div>
  );
}
