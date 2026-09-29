"use client";

import { MessageSquarePlus, Send, Camera, Sparkles, Mic, Loader2 } from "lucide-react";
import { processAndSubmitComplaint } from "@/app/actions";
import { useState, useRef, useTransition } from "react";

export default function NewComplaintPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [complaintText, setComplaintText] = useState("");
  
  const formRef = useRef<HTMLFormElement>(null);

  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setComplaintText((prev) => prev + (prev ? " " : "") + "Paani nahi aa raha hai kitchen mein.");
        setIsRecording(false);
      }, 2000);
    }
  };

  const handleAction = (formData: FormData) => {
    setError(null);
    setResult(null);
    startTransition(async () => {
      const res = await processAndSubmitComplaint(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setResult(res.aiParsed);
        formRef.current?.reset();
        setComplaintText("");
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      
      <div style={{ maxWidth: '36rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header Section */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-3" style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', margin: '0 auto 0.75rem auto' }}>
            <MessageSquarePlus size={20} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Submit a Complaint
          </h1>
          <p className="text-sm text-muted mt-1">
            Describe your issue in English or Hindi. Our AI categorizes and routes it to the committee.
          </p>
        </div>

        {/* Success Alert */}
        {result && (
          <div style={{ background: 'rgba(22, 163, 74, 0.1)', border: '1px solid rgba(22, 163, 74, 0.2)', borderRadius: '0.75rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className="flex items-center gap-2 font-medium text-sm" style={{ color: '#15803d' }}>
              <Sparkles size={16} /> AI successfully processed your ticket!
            </div>
            <div className="text-xs font-mono flex gap-3" style={{ color: 'rgba(21, 128, 61, 0.8)' }}>
              <span>Category: {result.category}</span>
              <span>Urgency: {result.urgency}</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: '0.75rem', padding: '1rem', color: '#b91c1c', fontSize: '0.875rem', fontWeight: 500 }}>
            {error}
          </div>
        )}

        {/* The Submission Form */}
        <div className="glass-card p-6">
          <form ref={formRef} action={handleAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Quick Categories */}
            <div>
              <label className="text-xs font-medium tracking-widest uppercase text-muted mb-2" style={{ display: 'block' }}>
                Quick Select (Optional)
              </label>
              <div className="flex flex-wrap gap-3">
                {["💧 Water", "🛗 Lift", "🚗 Parking", "🧹 Cleaning", "🔊 Noise"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setComplaintText(cat.substring(2) + " issue - ")}
                    className="btn-outline"
                    style={{ borderRadius: '999px', padding: '0.5rem 1rem' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Area */}
            <div>
              <label htmlFor="complaint" className="sr-only">Complaint Description</label>
              <div style={{ position: 'relative' }}>
                <textarea 
                  id="complaint"
                  name="complaint"
                  rows={5}
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  placeholder="e.g. Lift 2 in B-wing is stuck on the 4th floor. (Lift 2 kharab hai 4th floor pe)"
                  className="input-field"
                  style={{ resize: 'none', paddingBottom: '3rem', borderRadius: '0.75rem' }}
                ></textarea>
                
                {/* Formatting/Attachment utilities at bottom of textarea */}
                <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={toggleVoiceRecording}
                    title="Speak Complaint"
                    style={{ padding: '0.5rem', borderRadius: '50%', color: isRecording ? '#dc2626' : 'var(--muted-foreground)', background: isRecording ? '#fee2e2' : 'transparent', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Mic size={20} className={isRecording ? "spin" : ""} style={{ animationDuration: '3s' }} />
                  </button>
                </div>
                <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <button type="button" style={{ padding: '0.5rem', borderRadius: '50%', color: 'var(--muted-foreground)' }}>
                    <Camera size={20} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted mt-2">
                <Sparkles size={12} className="text-golden" />
                AI will process your text/voice to extract urgency and exact location.
              </div>
            </div>

            {/* Flat Number */}
            <div>
              <label htmlFor="flat" className="text-xs font-medium tracking-widest uppercase text-muted mb-2" style={{ display: 'block' }}>
                Your Flat Number
              </label>
              <input 
                type="text" 
                id="flat"
                name="flat"
                placeholder="e.g. B-405"
                className="input-field font-mono"
              />
            </div>

            {/* Submit CTA */}
            <button 
              type="submit"
              disabled={isPending}
              className="btn-primary w-full"
              style={{ padding: '1rem', fontSize: '1rem' }}
            >
              {isPending ? (
                <>
                  <Loader2 size={20} className="spin" />
                  Processing via AI...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Submit Complaint
                </>
              )}
            </button>
            
          </form>
        </div>

      </div>
    </div>
  );
}
