"use client";

import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  fullScreen?: boolean;
  message?: string;
  showTelemetry?: boolean;
  subtitle?: string;
}

export function LoadingScreen({
  fullScreen = true,
  message = "Loading...",
  subtitle
}: LoadingScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: fullScreen ? "fixed" : "relative",
        inset: fullScreen ? 0 : "auto",
        width: "100%",
        minHeight: fullScreen ? "100vh" : "320px",
        height: fullScreen ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        zIndex: fullScreen ? 9999 : 1,
        padding: "2rem"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          maxWidth: "320px",
          textAlign: "center"
        }}
      >
        <Loader2 size={32} className="spin" style={{ color: "var(--primary)" }} />
        
        <div>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: 0, color: "var(--foreground)" }}>
            {message}
          </h2>
          {subtitle && (
            <p style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)", marginTop: "0.25rem" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
