"use client";

import { useState } from "react";
import { 
  X, 
  Send, 
  AlertTriangle, 
  Sparkles, 
  Camera, 
  Mic, 
  Droplets, 
  Wrench, 
  Zap, 
  Car, 
  Trash2, 
  Volume2, 
  ShieldAlert, 
  Home, 
  CheckCircle2, 
  Clock,
  Image as ImageIcon
} from "lucide-react";
import { processAndSubmitComplaint } from "@/app/actions";

interface SendProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFlat?: string;
  onComplaintSubmitted?: (newComplaint: any) => void;
}

const CATEGORIES = [
  { label: "Lift / Elevator", icon: Wrench, color: "#f59e0b", defaultUrgency: "Critical", sample: "B-Wing lift is stuck between 3rd and 4th floor!" },
  { label: "Water Supply", icon: Droplets, color: "#3b82f6", defaultUrgency: "High", sample: "Overhead tank empty, no water supply in kitchen or bathroom." },
  { label: "Parking Bay", icon: Car, color: "#8b5cf6", defaultUrgency: "Medium", sample: "Unknown black car parked in assigned slot #204." },
  { label: "Electricity / Power", icon: Zap, color: "#eab308", defaultUrgency: "High", sample: "Corridor light fixture sparking near apartment 402." },
  { label: "Cleaning / Waste", icon: Trash2, color: "#10b981", defaultUrgency: "Low", sample: "Doorstep waste collection missed this morning." },
  { label: "Noise / Disturbance", icon: Volume2, color: "#ec4899", defaultUrgency: "Medium", sample: "Loud construction drilling during restricted quiet hours." },
  { label: "Security & Gate", icon: ShieldAlert, color: "#ef4444", defaultUrgency: "High", sample: "Main gate intercom not reaching security cabin." },
];

const SAMPLE_VOICE_PROMPTS = [
  "B-Wing lift mein bacha atak gaya hai, jaldi emergency technician bhejo!",
  "Paani subah se bilkul nahi aa raha hai kitchen aur washroom mein.",
  "Parking bay 102 mein kisi ne gaadi park kar di hai, rasta block hai.",
  "Corridor ka light switch spark kar raha hai 4th floor pe."
];

export function SendProblemModal({ 
  isOpen, 
  onClose, 
  defaultFlat = "B-402",
  onComplaintSubmitted 
}: SendProblemModalProps) {
  const [complaintText, setComplaintText] = useState("");
  const [flat, setFlat] = useState(defaultFlat);
  const [selectedCategory, setSelectedCategory] = useState<string>("Water Supply");
  const [urgency, setUrgency] = useState<"Low" | "Medium" | "High" | "Critical">("High");
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [successResult, setSuccessResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleVoiceSimulation = () => {
    setIsRecording(true);
    setTimeout(() => {
      const randomPrompt = SAMPLE_VOICE_PROMPTS[Math.floor(Math.random() * SAMPLE_VOICE_PROMPTS.length)];
      setComplaintText(randomPrompt);
      setIsRecording(false);

      // Auto pick urgency if critical keywords found
      if (randomPrompt.includes("atak") || randomPrompt.includes("emergency") || randomPrompt.includes("bacha")) {
        setUrgency("Critical");
        setSelectedCategory("Lift / Elevator");
      } else if (randomPrompt.includes("Paani")) {
        setUrgency("High");
        setSelectedCategory("Water Supply");
      } else if (randomPrompt.includes("Parking")) {
        setUrgency("Medium");
        setSelectedCategory("Parking Bay");
      }
    }, 1200);
  };

  const handleQuickCategory = (cat: typeof CATEGORIES[0]) => {
    setSelectedCategory(cat.label);
    if (!complaintText) {
      setComplaintText(cat.sample);
    }
    setUrgency(cat.defaultUrgency as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) return;

    setIsSubmitting(true);
    setSuccessResult(null);

    const formData = new FormData();
    formData.append("complaint", complaintText);
    formData.append("flat", flat || "B-402");

    // Optimistic complaint record
    const optimistic = {
      id: "ticket-" + Date.now(),
      original_text: complaintText,
      translated_text: complaintText,
      category: selectedCategory.split(" ")[0],
      urgency: urgency,
      status: urgency === "Critical" ? "Needs Triage" : "Needs Triage",
      flat: flat || "B-402",
      created_at: new Date().toISOString(),
      resolution_note: null,
      photo: attachedPhoto
    };

    try {
      const res = await processAndSubmitComplaint(formData);
      const finalRecord = {
        ...optimistic,
        translated_text: res?.aiParsed?.translation || complaintText,
        category: res?.aiParsed?.category || optimistic.category,
        urgency: res?.aiParsed?.urgency || urgency
      };

      setSuccessResult(finalRecord);
      if (onComplaintSubmitted) {
        onComplaintSubmitted(finalRecord);
      }

      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessResult(null);
        setComplaintText("");
        setAttachedPhoto(null);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      if (onComplaintSubmitted) {
        onComplaintSubmitted(optimistic);
      }
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 120 }}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '38rem', 
          maxHeight: '92vh', 
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
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>Send Problem & Grievance</span>
                <span className="badge badge-amber" style={{ fontSize: '0.625rem' }}>AI Triage</span>
              </h2>
              <p className="text-xs text-muted">Issue will be translated, categorized, and auto-dispatched to society committee</p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="theme-toggle-btn"
            style={{ width: '2rem', height: '2rem' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Success Alert */}
        {successResult && (
          <div style={{
            margin: '1rem 1.5rem 0 1.5rem',
            padding: '1rem',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '0.75rem',
            color: '#10b981',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9375rem' }}>
              <CheckCircle2 size={18} />
              <span>Problem dispatched to maintenance committee!</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--foreground)', opacity: 0.9 }}>
              AI translation: "{successResult.translated_text}"
            </p>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Quick Category Selector */}
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2" style={{ display: 'block' }}>
                Select Issue Category
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.label;
                  return (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => handleQuickCategory(cat)}
                      style={{
                        padding: '0.45rem 0.75rem',
                        borderRadius: '0.625rem',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        border: isSelected ? `2px solid ${cat.color}` : '1px solid var(--border)',
                        backgroundColor: isSelected ? `${cat.color}20` : 'var(--muted)',
                        color: isSelected ? cat.color : 'var(--foreground)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Icon size={14} color={cat.color} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Flat Number & Priority Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }} className="md-grid-cols-1">
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1" style={{ display: 'block' }}>
                  Your Apartment / Flat *
                </label>
                <div style={{ position: 'relative' }}>
                  <Home size={16} className="text-muted" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text"
                    required
                    value={flat}
                    onChange={(e) => setFlat(e.target.value)}
                    placeholder="e.g. B-402"
                    className="input-field font-mono"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1" style={{ display: 'block' }}>
                  Perceived Urgency
                </label>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {(["Low", "Medium", "High", "Critical"] as const).map(level => {
                    const isSelected = urgency === level;
                    const colors = {
                      Low: "#10b981",
                      Medium: "#f59e0b",
                      High: "#f97316",
                      Critical: "#ef4444"
                    };
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setUrgency(level)}
                        style={{
                          flex: 1,
                          padding: '0.5rem 0.25rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textAlign: 'center',
                          border: isSelected ? `2px solid ${colors[level]}` : '1px solid var(--border)',
                          backgroundColor: isSelected ? `${colors[level]}25` : 'transparent',
                          color: isSelected ? colors[level] : 'var(--muted-foreground)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {level === "Critical" ? "🚨 SOS" : level}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Description & Voice Tool */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Describe Problem (English, Hindi, or Hinglish) *
                </label>
                <button
                  type="button"
                  onClick={handleVoiceSimulation}
                  disabled={isRecording}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    color: isRecording ? '#ef4444' : '#10b981',
                    fontWeight: 600,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '0.375rem',
                    backgroundColor: isRecording ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'
                  }}
                >
                  <Mic size={14} className={isRecording ? "spin" : ""} />
                  <span>{isRecording ? "Listening to Voice..." : "🎙️ Speak in Hinglish"}</span>
                </button>
              </div>

              <textarea 
                rows={3}
                required
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                placeholder="e.g. Lift no. 2 is stuck with sound coming from motor, please send emergency technician immediately..."
                className="input-field"
                style={{ resize: 'vertical' }}
              />

              {/* Sample Quick Prompts */}
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                <span className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>Quick examples:</span>
                {SAMPLE_VOICE_PROMPTS.slice(0, 2).map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setComplaintText(prompt)}
                    style={{
                      fontSize: '0.6875rem',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '0.35rem',
                      backgroundColor: 'var(--muted)',
                      border: '1px solid var(--border)',
                      color: 'var(--muted-foreground)'
                    }}
                  >
                    "{prompt.substring(0, 30)}..."
                  </button>
                ))}
              </div>
            </div>

            {/* Photo / Evidence Upload Simulator */}
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5" style={{ display: 'block' }}>
                Attach Photo Evidence (Optional)
              </label>
              
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {[
                  { name: "Water Leakage", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=150&auto=format&fit=crop&q=60" },
                  { name: "Elevator Door", img: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=150&auto=format&fit=crop&q=60" },
                  { name: "Blocked Bay", img: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=150&auto=format&fit=crop&q=60" }
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAttachedPhoto(attachedPhoto === sample.name ? null : sample.name)}
                    style={{
                      padding: '0.4rem 0.65rem',
                      borderRadius: '0.5rem',
                      border: attachedPhoto === sample.name ? '2px solid #10b981' : '1px dashed var(--border)',
                      backgroundColor: attachedPhoto === sample.name ? 'rgba(16, 185, 129, 0.1)' : 'var(--muted)',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: attachedPhoto === sample.name ? '#10b981' : 'var(--muted-foreground)'
                    }}
                  >
                    <Camera size={13} />
                    <span>{attachedPhoto === sample.name ? `✓ ${sample.name}` : `+ ${sample.name}`}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live AI Triage Inspector Box */}
            <div style={{
              padding: '0.875rem',
              borderRadius: '0.75rem',
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.625rem'
            }}>
              <Sparkles size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <div>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#38bdf8' }}>
                  Nivara AI Auto-Triage Active
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                  Upon submission, Groq LLM extracts Indian languages & dialect context, checks historical tickets from your flat, and pings the on-duty maintenance staff via WhatsApp.
                </p>
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button 
              type="button"
              onClick={onClose}
              className="btn-outline"
            >
              Cancel
            </button>

            <button 
              type="submit"
              disabled={isSubmitting || !complaintText.trim()}
              className="btn-primary"
              style={{
                backgroundColor: urgency === "Critical" ? '#ef4444' : '#10b981',
                boxShadow: urgency === "Critical" ? '0 4px 14px rgba(239, 68, 68, 0.35)' : undefined
              }}
            >
              <Send size={16} />
              <span>{isSubmitting ? "Triaging with AI..." : "Send Problem Now"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
