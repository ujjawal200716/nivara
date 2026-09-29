"use client";

import { useState } from "react";
import { 
  X, 
  PhoneCall, 
  ShieldAlert, 
  Wrench, 
  Droplets, 
  Zap, 
  Car, 
  Check, 
  Copy, 
  QrCode, 
  KeyRound, 
  UserCheck, 
  AlertTriangle 
} from "lucide-react";

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  userFlat?: string;
}

const EMERGENCY_CONTACTS = [
  { role: "Main Gate Security Desk", number: "Intercom: 1001", phone: "+91 98200 01001", icon: ShieldAlert, color: "#ef4444", status: "24/7 Active" },
  { role: "On-Duty Electrician (Ram Lal)", number: "Direct Call", phone: "+91 98200 01002", icon: Zap, color: "#eab308", status: "On Duty" },
  { role: "On-Duty Plumber (Suresh)", number: "Direct Call", phone: "+91 98200 01003", icon: Droplets, color: "#3b82f6", status: "On Duty" },
  { role: "Facility Manager (Deepak)", number: "Office Intercom: 1005", phone: "+91 98200 01004", icon: Wrench, color: "#10b981", status: "9 AM - 7 PM" },
  { role: "Nearest Hospital & Ambulance", number: "Apollo Clinic Hotline", phone: "108 / 022-25001111", icon: ShieldAlert, color: "#ef4444", status: "Emergency" },
];

export function EmergencySOSModal({ isOpen, onClose, userFlat = "B-402" }: EmergencySOSModalProps) {
  const [activeTab, setActiveTab] = useState<"sos" | "visitor">("sos");
  const [visitorName, setVisitorName] = useState("");
  const [visitorType, setVisitorType] = useState<"Guest" | "Delivery" | "Cab" | "Service">("Delivery");
  const [generatedPass, setGeneratedPass] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);

  if (!isOpen) return null;

  const handleGeneratePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const pass = {
      name: visitorName,
      type: visitorType,
      pin,
      flat: userFlat,
      validUntil: "Today, 11:59 PM",
      created: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setGeneratedPass(pass);
  };

  const handleCopyPass = () => {
    if (!generatedPass) return;
    const text = `🏢 Nivara Society Visitor Entry Pass\nFlat: ${generatedPass.flat}\nVisitor: ${generatedPass.name} (${generatedPass.type})\n🔑 4-Digit Gate Entry PIN: ${generatedPass.pin}\nShow this PIN to Main Gate Security for contactless entry.`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerSOSAlert = () => {
    setSosTriggered(true);
    setTimeout(() => {
      setSosTriggered(false);
    }, 4000);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 120 }}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '36rem', 
          maxHeight: '90vh', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: 'var(--card)',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.75rem',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Security & Gate Hub</h2>
              <p className="text-xs text-muted">Direct gate buzzer, on-duty emergency contacts & visitor entry pass</p>
            </div>
          </div>

          <button onClick={onClose} className="theme-toggle-btn">
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem 0 1.5rem',
          borderBottom: '1px solid var(--border)'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab("sos")}
            className={`filter-tab ${activeTab === "sos" ? "filter-tab-active" : ""}`}
          >
            <ShieldAlert size={14} color="#ef4444" /> Quick SOS & Contacts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("visitor")}
            className={`filter-tab ${activeTab === "visitor" ? "filter-tab-active" : ""}`}
          >
            <KeyRound size={14} color="#10b981" /> Visitor & Delivery Pass
          </button>
        </div>

        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {activeTab === "sos" && (
            <>
              {/* Emergency SOS Broadcast Button */}
              <div style={{
                padding: '1.25rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <h4 style={{ fontWeight: 700, color: '#ef4444', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertTriangle size={18} />
                    <span>Trigger Society Gate SOS Siren</span>
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.2rem' }}>
                    Alerts Main Gate Security and nearby guards to Flat {userFlat} immediately.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={triggerSOSAlert}
                  disabled={sosTriggered}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontWeight: 700,
                    padding: '0.625rem 1.25rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.8125rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                    cursor: 'pointer'
                  }}
                >
                  <ShieldAlert size={16} />
                  <span>{sosTriggered ? "🚨 SIREN SOUNDING (GUARDS DISPATCHED)" : "Buzzer SOS"}</span>
                </button>
              </div>

              {/* Directory of Emergency Contacts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Direct Line Emergency Directory
                </span>

                {EMERGENCY_CONTACTS.map((c, idx) => {
                  const Icon = c.icon;
                  return (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.75rem',
                        backgroundColor: 'var(--muted)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '2rem',
                          height: '2rem',
                          borderRadius: '0.5rem',
                          backgroundColor: `${c.color}20`,
                          color: c.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.role}</span>
                            <span className="badge badge-zinc" style={{ fontSize: '0.625rem' }}>{c.status}</span>
                          </div>
                          <p className="text-xs text-muted font-mono">{c.number}</p>
                        </div>
                      </div>

                      <a 
                        href={`tel:${c.phone}`}
                        style={{
                          padding: '0.4rem 0.75rem',
                          borderRadius: '0.5rem',
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        <PhoneCall size={13} />
                        <span>{c.phone}</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {activeTab === "visitor" && (
            <>
              {/* Visitor Pass Generator */}
              <form onSubmit={handleGeneratePass} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1" style={{ display: 'block' }}>
                    Visitor / Delivery Agent Name *
                  </label>
                  <input 
                    type="text"
                    required
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="e.g. Swiggy Rider / Amit Kumar (Guest)"
                    className="input-field"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {(["Delivery", "Guest", "Cab", "Service"] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setVisitorType(type)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: visitorType === type ? '2px solid #10b981' : '1px solid var(--border)',
                        backgroundColor: visitorType === type ? 'rgba(16, 185, 129, 0.15)' : 'var(--muted)',
                        color: visitorType === type ? '#10b981' : 'var(--muted-foreground)'
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <button 
                  type="submit"
                  className="btn-primary"
                  style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}
                >
                  <KeyRound size={15} />
                  <span>Generate Gate Entry Pass</span>
                </button>
              </form>

              {/* Generated Digital Pass Card */}
              {generatedPass && (
                <div style={{
                  marginTop: '0.75rem',
                  padding: '1.25rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'var(--muted)',
                  border: '2px dashed #10b981',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-green">Valid Pass</span>
                      <span className="text-xs text-muted font-mono">Unit {generatedPass.flat}</span>
                    </div>
                    <span className="text-xs text-muted">Valid: {generatedPass.validUntil}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                    <div>
                      <h4 className="font-bold text-base">{generatedPass.name}</h4>
                      <p className="text-xs text-muted">{generatedPass.type} Verification</p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="text-xs text-muted uppercase tracking-wider block">Security PIN</span>
                      <span style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '0.15em', color: '#10b981', fontFamily: 'monospace' }}>
                        {generatedPass.pin}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyPass}
                    className="btn-outline w-full"
                    style={{ fontSize: '0.8125rem', padding: '0.5rem' }}
                  >
                    {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    <span>{copied ? "Pass Copied to Clipboard!" : "Copy Pass to Share via WhatsApp"}</span>
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
