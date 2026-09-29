"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Home, 
  Car, 
  Shield, 
  Check, 
  AlertCircle, 
  Bell, 
  Save, 
  Sparkles,
  PhoneCall
} from "lucide-react";

export interface UserProfile {
  name: string;
  flat: string;
  wing: string;
  type: "Owner" | "Tenant" | "Committee Member" | "Secretary";
  phone: string;
  email: string;
  vehicleCar: string;
  vehicleBike: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  intercom: string;
  avatarColor: string;
  notificationsEnabled: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Vikram Malhotra",
  flat: "B-402",
  wing: "Wing B",
  type: "Committee Member",
  phone: "+91 98201 12345",
  email: "vikram.malhotra@nivara.com",
  vehicleCar: "MH-12-AB-4020",
  vehicleBike: "MH-12-CD-1002",
  emergencyContactName: "Pooja Malhotra (Spouse)",
  emergencyContactPhone: "+91 98201 99999",
  intercom: "4021",
  avatarColor: "#10b981",
  notificationsEnabled: true
};

const AVATAR_COLORS = [
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#06b6d4", // Cyan
];

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (updated: UserProfile) => void;
}

export function EditProfileModal({ isOpen, onClose, onProfileUpdated }: EditProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "society" | "preferences">("personal");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nivara_user_profile");
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not load stored profile:", e);
    }
  }, []);

  if (!isOpen) return null;

  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("nivara_user_profile", JSON.stringify(profile));
      if (onProfileUpdated) {
        onProfileUpdated(profile);
      }
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 900);
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 120 }}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '38rem', 
          maxHeight: '90vh', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: 'var(--card)',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Modal Header */}
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
              borderRadius: '50%',
              backgroundColor: profile.avatarColor,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              {profile.name ? profile.name.substring(0, 2).toUpperCase() : "ME"}
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>Edit Resident Profile</span>
                <span className="badge badge-green" style={{ fontSize: '0.625rem' }}>Verified</span>
              </h2>
              <p className="text-xs text-muted">Update your apartment details, emergency contacts, and vehicles</p>
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
        {savedSuccess && (
          <div style={{
            margin: '1rem 1.5rem 0 1.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '0.5rem',
            color: '#10b981',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Check size={18} />
            <span>Profile changes saved successfully! Syncing with society ledger...</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem 0 1.5rem',
          borderBottom: '1px solid var(--border)'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`filter-tab ${activeTab === "personal" ? "filter-tab-active" : ""}`}
            style={{ fontSize: '0.8125rem' }}
          >
            <User size={14} /> Personal & Contact
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("society")}
            className={`filter-tab ${activeTab === "society" ? "filter-tab-active" : ""}`}
            style={{ fontSize: '0.8125rem' }}
          >
            <Home size={14} /> Unit & Vehicles
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preferences")}
            className={`filter-tab ${activeTab === "preferences" ? "filter-tab-active" : ""}`}
            style={{ fontSize: '0.8125rem' }}
          >
            <Bell size={14} /> Emergency & Alerts
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {activeTab === "personal" && (
              <>
                {/* Full Name */}
                <div>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1" style={{ display: 'block' }}>
                    Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} className="text-muted" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="e.g. Vikram Malhotra"
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>

                {/* Avatar Color Picker */}
                <div>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2" style={{ display: 'block' }}>
                    Avatar Color Theme
                  </label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {AVATAR_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleChange("avatarColor", color)}
                        style={{
                          width: '2rem',
                          height: '2rem',
                          borderRadius: '50%',
                          backgroundColor: color,
                          border: profile.avatarColor === color ? '3px solid #ffffff' : '2px solid transparent',
                          boxShadow: profile.avatarColor === color ? '0 0 10px ' + color : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff'
                        }}
                      >
                        {profile.avatarColor === color && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phone & Email Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }} className="md-grid-cols-1">
                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1" style={{ display: 'block' }}>
                      WhatsApp / Phone *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} className="text-muted" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input 
                        type="tel"
                        required
                        value={profile.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+91 98201 12345"
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1" style={{ display: 'block' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} className="text-muted" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input 
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="resident@society.com"
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "society" && (
              <>
                {/* Flat & Wing Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }} className="md-grid-cols-1">
                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1" style={{ display: 'block' }}>
                      Flat / Unit *
                    </label>
                    <input 
                      type="text"
                      required
                      value={profile.flat}
                      onChange={(e) => handleChange("flat", e.target.value)}
                      placeholder="e.g. B-402"
                      className="input-field font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1" style={{ display: 'block' }}>
                      Tower / Wing
                    </label>
                    <select
                      value={profile.wing}
                      onChange={(e) => handleChange("wing", e.target.value)}
                      className="input-field"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="Wing A">Wing A</option>
                      <option value="Wing B">Wing B</option>
                      <option value="Wing C">Wing C</option>
                      <option value="Wing D">Wing D</option>
                      <option value="Penthouse Block">Penthouse Block</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1" style={{ display: 'block' }}>
                      Resident Role
                    </label>
                    <select
                      value={profile.type}
                      onChange={(e) => handleChange("type", e.target.value as any)}
                      className="input-field"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="Owner">Owner</option>
                      <option value="Tenant">Tenant</option>
                      <option value="Committee Member">Committee Member</option>
                      <option value="Secretary">Secretary</option>
                    </select>
                  </div>
                </div>

                {/* Vehicles */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }} className="md-grid-cols-1">
                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1" style={{ display: 'block' }}>
                      Primary 4-Wheeler Car Bay
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Car size={16} className="text-muted" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input 
                        type="text"
                        value={profile.vehicleCar}
                        onChange={(e) => handleChange("vehicleCar", e.target.value)}
                        placeholder="e.g. MH-12-AB-4020"
                        className="input-field font-mono"
                        style={{ paddingLeft: '2.5rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1" style={{ display: 'block' }}>
                      2-Wheeler / Bike Bay
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Car size={16} className="text-muted" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input 
                        type="text"
                        value={profile.vehicleBike}
                        onChange={(e) => handleChange("vehicleBike", e.target.value)}
                        placeholder="e.g. MH-12-CD-1002"
                        className="input-field font-mono"
                        style={{ paddingLeft: '2.5rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Intercom Extension */}
                <div>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1" style={{ display: 'block' }}>
                    Intercom Direct Extension
                  </label>
                  <input 
                    type="text"
                    value={profile.intercom}
                    onChange={(e) => handleChange("intercom", e.target.value)}
                    placeholder="e.g. 4021"
                    className="input-field font-mono"
                  />
                  <p className="text-xs text-muted mt-1">Allows Gate Security to call your flat directly.</p>
                </div>
              </>
            )}

            {activeTab === "preferences" && (
              <>
                {/* Emergency Contact */}
                <div>
                  <h3 className="font-semibold text-sm mb-1 text-primary flex items-center gap-1.5">
                    <Shield size={16} /> Emergency SOS Contact Person
                  </h3>
                  <p className="text-xs text-muted mb-3">Notified immediately if a critical medical or lift alert is raised for your flat.</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }} className="md-grid-cols-1">
                    <div>
                      <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1" style={{ display: 'block' }}>
                        Contact Name & Relation
                      </label>
                      <input 
                        type="text"
                        value={profile.emergencyContactName}
                        onChange={(e) => handleChange("emergencyContactName", e.target.value)}
                        placeholder="e.g. Pooja Malhotra (Spouse)"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1" style={{ display: 'block' }}>
                        Emergency Phone
                      </label>
                      <input 
                        type="tel"
                        value={profile.emergencyContactPhone}
                        onChange={(e) => handleChange("emergencyContactPhone", e.target.value)}
                        placeholder="+91 98201 99999"
                        className="input-field font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Automated Notification Preference */}
                <div style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'var(--muted)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h4 className="font-semibold text-sm">WhatsApp AI Triage Notifications</h4>
                    <p className="text-xs text-muted mt-0.5">Receive immediate status updates when your ticket is triaged or resolved.</p>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '2.75rem', height: '1.5rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={profile.notificationsEnabled}
                      onChange={(e) => handleChange("notificationsEnabled", e.target.checked)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: profile.notificationsEnabled ? '#10b981' : 'rgba(161, 161, 170, 0.4)',
                      borderRadius: '9999px',
                      transition: '0.3s'
                    }}>
                      <span style={{
                        position: 'absolute',
                        height: '1.125rem',
                        width: '1.125rem',
                        left: profile.notificationsEnabled ? '1.35rem' : '0.2rem',
                        bottom: '0.1875rem',
                        backgroundColor: '#ffffff',
                        borderRadius: '50%',
                        transition: '0.3s'
                      }} />
                    </span>
                  </label>
                </div>
              </>
            )}

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
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Save size={16} />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
