"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function GlobalLoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Trigger brief navigation progress bar on route changes
  useEffect(() => {
    // Start bar
    setLoading(true);
    setProgress(35);

    const timer1 = setTimeout(() => {
      setProgress(85);
    }, 150);

    const timer2 = setTimeout(() => {
      setProgress(100);
      const timer3 = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer3);
    }, 350);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname, searchParams]);

  // Intercept click on <a> links to provide instant feedback before navigation completes
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      // Only internal routes
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("/#") &&
        target.getAttribute("target") !== "_blank"
      ) {
        setLoading(true);
        setProgress(40);
      }
    };

    document.addEventListener("click", handleAnchorClick, { passive: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 99999,
        pointerEvents: "none",
        backgroundColor: "transparent",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #059669 0%, #10b981 50%, #D4AF37 100%)",
          boxShadow: "0 0 10px rgba(16, 185, 129, 0.8), 0 0 5px rgba(212, 175, 55, 0.6)",
          transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
          opacity: loading ? 1 : 0,
        }}
      />
    </div>
  );
}
