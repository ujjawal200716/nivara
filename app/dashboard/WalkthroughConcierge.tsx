"use client";

import { useState } from "react";
import { 
  HelpCircle, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  Users, 
  Home, 
  CheckCircle2, 
  MessageSquare,
  Sparkles
} from "lucide-react";

export interface WalkthroughStep {
  targetId: string;
  title: string;
  badge: string;
  content: string;
  hint?: string;
  tabToActivate?: "triage" | "members" | "notices" | "sos";
}

const TOUR_STEPS: WalkthroughStep[] = [
  {
    targetId: "operations-header",
    title: "Welcome to Nivara Operations",
    badge: "Step 1 of 6 • Welcome",
    content: "Welcome to the society management platform. This guide will quickly walk you through how incident triage and resident management work.",
    hint: "Click 'Next' to continue."
  },
  {
    targetId: "triage-feed-container",
    title: "AI Incident Triage Feed",
    badge: "Step 2 of 6 • Triage",
    content: "All complaints filed by residents in English, Hindi, or Hinglish appear here. Tickets are automatically categorized, prioritized, and ready for dispatch.",
    hint: "Use 'Mark In Progress' or 'Resolve' to manage tickets.",
    tabToActivate: "triage"
  },
  {
    targetId: "send-problem-btn",
    title: "Submit a Problem",
    badge: "Step 3 of 6 • Reporting",
    content: "Quickly file maintenance issues with category tags, flat numbers, and urgency. AI triages each ticket instantly upon submission.",
    hint: "Click '+ Report Issue' anytime from the top bar.",
    tabToActivate: "triage"
  },
  {
    targetId: "nav-tab-members",
    title: "Resident Directory",
    badge: "Step 4 of 6 • Directory",
    content: "Search and manage building residents, committee members, flat numbers, and emergency contact details in one unified table.",
    hint: "Switch to the Members tab to explore.",
    tabToActivate: "members"
  },
  {
    targetId: "profile-trigger-btn",
    title: "User Profile & Flat Details",
    badge: "Step 5 of 6 • Profile",
    content: "View and edit your personal profile, vehicle registration numbers, flat number, and WhatsApp notification preferences.",
    hint: "Click your profile pill in the header to edit."
  },
  {
    targetId: "nav-tab-notices",
    title: "Bulletins & Gate Passes",
    badge: "Step 6 of 6 • Notices & Gate",
    content: "View society notices, water supply schedules, and manage digital gate passes or security alerts.",
    hint: "Access via the Notice Board tab.",
    tabToActivate: "notices"
  }
];

interface WalkthroughConciergeProps {
  onOpenSendProblem: () => void;
  onOpenEditProfile: () => void;
  onSwitchTab?: (tab: "triage" | "members" | "notices" | "sos") => void;
}

export function WalkthroughConcierge({
  onOpenSendProblem,
  onOpenEditProfile,
  onSwitchTab
}: WalkthroughConciergeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [aiChatQuery, setAiChatQuery] = useState("");
  const [aiChatResponse, setAiChatResponse] = useState<string | null>(null);

  const step = TOUR_STEPS[currentStepIndex];

  const startTour = () => {
    setIsTourActive(true);
    setCurrentStepIndex(0);
    setIsOpen(true);
    if (TOUR_STEPS[0].tabToActivate && onSwitchTab) {
      onSwitchTab(TOUR_STEPS[0].tabToActivate);
    }
  };

  const nextStep = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      if (TOUR_STEPS[nextIdx].tabToActivate && onSwitchTab) {
        onSwitchTab(TOUR_STEPS[nextIdx].tabToActivate);
      }
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      if (TOUR_STEPS[prevIdx].tabToActivate && onSwitchTab) {
        onSwitchTab(TOUR_STEPS[prevIdx].tabToActivate);
      }
    }
  };

  const endTour = () => {
    setIsTourActive(false);
    setCurrentStepIndex(0);
    setIsOpen(false);
  };

  const handleAskKai = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes("water") || q.includes("paani")) {
      setAiChatResponse("Water issues are ranked High priority and routed to the society plumbing supervisor.");
    } else if (q.includes("lift") || q.includes("elevator")) {
      setAiChatResponse("Lift entrapments are tagged Critical SOS and send immediate alerts to maintenance.");
    } else if (q.includes("member") || q.includes("flat")) {
      setAiChatResponse("Look up residents in the Member Directory tab by flat number or vehicle plate.");
    } else {
      setAiChatResponse("You can file a new complaint with '+ Report Issue', view active tickets, or check the Notice Board.");
    }
  };

  return (
    <>
      {/* Help / Guide Trigger in bottom-right corner */}
      <div 
        id="kai-concierge-widget"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 60
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn-outline"
          style={{
            backgroundColor: "var(--card)",
            boxShadow: "var(--shadow-md)",
            borderRadius: "9999px",
            padding: "0.5rem 0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            fontSize: "0.8125rem",
            fontWeight: 500
          }}
          aria-label="Help & Guide"
        >
          <HelpCircle size={16} style={{ color: "var(--primary)" }} />
          <span>Guide & Help</span>
        </button>

        {/* Tour Dialog Popover */}
        {isTourActive && isOpen && (
          <div 
            className="glass-card"
            style={{
              position: "absolute",
              bottom: "3rem",
              right: 0,
              width: "22rem",
              maxWidth: "calc(100vw - 2rem)",
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden"
            }}
          >
            {/* Header */}
            <div style={{
              padding: "0.75rem 1rem",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "var(--muted)"
            }}>
              <div>
                <span className="badge badge-zinc" style={{ fontSize: "0.6875rem" }}>
                  {step.badge}
                </span>
                <h3 style={{ fontSize: "0.875rem", fontWeight: 600, marginTop: "0.25rem" }}>
                  {step.title}
                </h3>
              </div>

              <button
                onClick={endTour}
                style={{ color: "var(--muted-foreground)", padding: "0.25rem" }}
                aria-label="Close guide"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div style={{ padding: "1rem" }}>
              <p style={{ fontSize: "0.8125rem", lineHeight: 1.5, color: "var(--foreground)", marginBottom: "0.75rem" }}>
                {step.content}
              </p>

              {step.hint && (
                <div style={{
                  padding: "0.45rem 0.65rem",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--muted)",
                  fontSize: "0.75rem",
                  color: "var(--muted-foreground)",
                  marginBottom: "0.75rem"
                }}>
                  {step.hint}
                </div>
              )}

              {/* Step indicator dots */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}>
                {TOUR_STEPS.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    style={{
                      width: idx === currentStepIndex ? "1rem" : "0.35rem",
                      height: "0.35rem",
                      borderRadius: "9999px",
                      backgroundColor: idx === currentStepIndex ? "var(--primary)" : "var(--muted-foreground)",
                      opacity: idx === currentStepIndex ? 1 : 0.4,
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Footer Navigation */}
            <div style={{
              padding: "0.65rem 1rem",
              borderTop: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "var(--muted)"
            }}>
              <button
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="btn-outline"
                style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", opacity: currentStepIndex === 0 ? 0.4 : 1 }}
              >
                <ChevronLeft size={13} /> Back
              </button>

              <button
                onClick={nextStep}
                className="btn-primary"
                style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}
              >
                <span>{currentStepIndex === TOUR_STEPS.length - 1 ? "Finish" : "Next"}</span>
                {currentStepIndex < TOUR_STEPS.length - 1 && <ChevronRight size={13} />}
              </button>
            </div>
          </div>
        )}

        {/* Regular Help Menu */}
        {isOpen && !isTourActive && (
          <div 
            className="glass-card"
            style={{
              position: "absolute",
              bottom: "3rem",
              right: 0,
              width: "20rem",
              maxWidth: "calc(100vw - 2rem)",
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden"
            }}
          >
            {/* Header */}
            <div style={{
              padding: "0.75rem 1rem",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "var(--muted)"
            }}>
              <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                Help & Quick Actions
              </span>
              <button onClick={() => setIsOpen(false)} style={{ color: "var(--muted-foreground)", padding: "0.25rem" }}>
                <X size={15} />
              </button>
            </div>

            <div style={{ padding: "0.85rem 1rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              <button
                onClick={startTour}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", fontSize: "0.8125rem", padding: "0.5rem" }}
              >
                Start Quick Guided Tour
              </button>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <span className="text-xs text-muted" style={{ fontWeight: 600 }}>Shortcuts</span>
                <button
                  onClick={() => { onOpenSendProblem(); setIsOpen(false); }}
                  className="btn-outline"
                  style={{ width: "100%", justifyContent: "flex-start", fontSize: "0.8125rem", padding: "0.4rem 0.6rem" }}
                >
                  <Send size={13} style={{ color: "var(--primary)" }} />
                  <span>Report a Problem</span>
                </button>
                <button
                  onClick={() => { if (onSwitchTab) onSwitchTab("members"); setIsOpen(false); }}
                  className="btn-outline"
                  style={{ width: "100%", justifyContent: "flex-start", fontSize: "0.8125rem", padding: "0.4rem 0.6rem" }}
                >
                  <Users size={13} style={{ color: "var(--primary)" }} />
                  <span>Resident Directory</span>
                </button>
                <button
                  onClick={() => { onOpenEditProfile(); setIsOpen(false); }}
                  className="btn-outline"
                  style={{ width: "100%", justifyContent: "flex-start", fontSize: "0.8125rem", padding: "0.4rem 0.6rem" }}
                >
                  <Home size={13} style={{ color: "var(--primary)" }} />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Quick Question */}
              <div style={{ marginTop: "0.25rem", borderTop: "1px solid var(--border)", paddingTop: "0.65rem" }}>
                <span className="text-xs text-muted" style={{ fontWeight: 600, display: "block", marginBottom: "0.35rem" }}>
                  Ask a Question
                </span>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  <input
                    type="text"
                    value={aiChatQuery}
                    onChange={(e) => setAiChatQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && aiChatQuery) handleAskKai(aiChatQuery); }}
                    placeholder="e.g. how does triage work?"
                    className="input-field"
                    style={{ fontSize: "0.75rem", padding: "0.35rem 0.5rem" }}
                  />
                  <button
                    onClick={() => { if (aiChatQuery) handleAskKai(aiChatQuery); }}
                    className="btn-primary"
                    style={{ padding: "0.35rem 0.6rem" }}
                  >
                    <Send size={12} />
                  </button>
                </div>

                {aiChatResponse && (
                  <div style={{
                    marginTop: "0.5rem",
                    padding: "0.5rem",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--muted)",
                    fontSize: "0.75rem",
                    color: "var(--foreground)",
                    lineHeight: 1.4
                  }}>
                    {aiChatResponse}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
