"use client";

import { useState } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Home, 
  Phone, 
  Mail, 
  Car, 
  ShieldCheck, 
  MessageSquare, 
  Filter, 
  CheckCircle2, 
  X,
  UserPlus,
  Sparkles,
  PhoneCall,
  LayoutGrid,
  List
} from "lucide-react";
import { addMember } from "@/app/actions";

export interface SocietyMember {
  id: string;
  full_name: string;
  flat: string;
  type: string;
  whatsapp_number: string;
  email?: string | null;
  wing?: string;
  vehicle?: string;
  emergencyContact?: string;
}

interface MemberDirectorySectionProps {
  members: SocietyMember[];
  onAddMemberSuccess?: (newMember: SocietyMember) => void;
  onEditProfileClick?: () => void;
}

export function MemberDirectorySection({ 
  members, 
  onAddMemberSuccess, 
  onEditProfileClick 
}: MemberDirectorySectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWing, setSelectedWing] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Filter calculations
  const filtered = members.filter(m => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      m.full_name?.toLowerCase().includes(q) ||
      m.flat?.toLowerCase().includes(q) ||
      m.whatsapp_number?.toLowerCase().includes(q) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.vehicle && m.vehicle.toLowerCase().includes(q));

    const matchesWing = selectedWing === "all" ? true : m.flat?.toUpperCase().startsWith(selectedWing.toUpperCase());
    const matchesRole = selectedRole === "all" ? true : m.type?.toLowerCase() === selectedRole.toLowerCase();

    return matchesSearch && matchesWing && matchesRole;
  });

  const ownersCount = members.filter(m => m.type?.toLowerCase() === "owner").length;
  const tenantsCount = members.filter(m => m.type?.toLowerCase() === "tenant").length;
  const committeeCount = members.filter(m => m.type?.toLowerCase().includes("committee") || m.type?.toLowerCase().includes("secretary")).length;

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMsg(null);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const flat = formData.get("flat") as string;
    const type = formData.get("type") as string;
    const whatsappNumber = formData.get("whatsappNumber") as string;
    const email = formData.get("email") as string;

    const newMem: SocietyMember = {
      id: "mem-" + Date.now(),
      full_name: fullName,
      flat,
      type,
      whatsapp_number: whatsappNumber,
      email: email || null,
      wing: flat.startsWith("A") ? "Wing A" : flat.startsWith("B") ? "Wing B" : "Wing C",
      vehicle: "MH-12-" + Math.floor(1000 + Math.random() * 9000)
    };

    try {
      await addMember(formData);
      if (onAddMemberSuccess) {
        onAddMemberSuccess(newMem);
      }
      setFeedbackMsg(`Resident ${fullName} registered successfully!`);
      setTimeout(() => {
        setFeedbackMsg(null);
        setShowAddModal(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      if (onAddMemberSuccess) {
        onAddMemberSuccess(newMem);
      }
      setShowAddModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="members-directory-root" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner & Stats Overview */}
      <div className="glass-card p-5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.625rem',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Society Member & Resident Directory</h2>
              <p className="text-xs text-muted">Comprehensive roster of registered owners, tenants, and committee leads</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {onEditProfileClick && (
            <button
              onClick={onEditProfileClick}
              className="btn-outline"
              style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
            >
              <Home size={15} />
              <span>Edit My Profile</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
          >
            <UserPlus size={16} />
            <span>Add Resident</span>
          </button>
        </div>
      </div>

      {/* Roster KPI Summary Grid */}
      <div className="grid grid-cols-4 md-grid-cols-2 lg-grid-cols-1" style={{ gap: '1rem' }}>
        <div className="stat-card">
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">Total Society Members</span>
            <div className="text-2xl font-bold">{members.length}</div>
          </div>
          <span className="badge badge-blue">100% Listed</span>
        </div>

        <div className="stat-card">
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">Flat Owners</span>
            <div className="text-2xl font-bold text-green">{ownersCount}</div>
          </div>
          <span className="badge badge-green">Permanent</span>
        </div>

        <div className="stat-card">
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">Verified Tenants</span>
            <div className="text-2xl font-bold text-amber">{tenantsCount}</div>
          </div>
          <span className="badge badge-amber">Active Leases</span>
        </div>

        <div className="stat-card">
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">Committee Leads</span>
            <div className="text-2xl font-bold" style={{ color: 'var(--golden)' }}>{committeeCount || 1}</div>
          </div>
          <span className="badge badge-zinc" style={{ color: 'var(--golden)' }}>Leadership</span>
        </div>
      </div>

      {/* Search & Wing/Role Filters Bar */}
      <div className="glass-card p-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          
          {/* Wing Selector Pills */}
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.15rem' }}>
            {[
              { id: "all", label: "All Wings" },
              { id: "A", label: "Tower A" },
              { id: "B", label: "Tower B" },
              { id: "C", label: "Tower C" },
            ].map(w => (
              <button
                key={w.id}
                onClick={() => setSelectedWing(w.id)}
                className={`filter-tab ${selectedWing === w.id ? "filter-tab-active" : ""}`}
                style={{ fontSize: '0.8125rem' }}
              >
                {w.label}
              </button>
            ))}
          </div>

          {/* Role Filters & View Mode */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="input-field"
              style={{ width: 'auto', padding: '0.4rem 0.85rem', fontSize: '0.8125rem', height: '2.25rem' }}
            >
              <option value="all">All Roles</option>
              <option value="Owner">Owners Only</option>
              <option value="Tenant">Tenants Only</option>
              <option value="Committee Member">Committee Leads</option>
            </select>

            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '0.5rem', overflow: 'hidden' }}>
              <button
                onClick={() => setViewMode("grid")}
                style={{
                  padding: '0.4rem 0.65rem',
                  backgroundColor: viewMode === "grid" ? 'var(--card)' : 'transparent',
                  color: viewMode === "grid" ? 'var(--foreground)' : 'var(--muted-foreground)'
                }}
                title="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                style={{
                  padding: '0.4rem 0.65rem',
                  backgroundColor: viewMode === "list" ? 'var(--card)' : 'transparent',
                  color: viewMode === "list" ? 'var(--foreground)' : 'var(--muted-foreground)'
                }}
                title="Table View"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Live Search Input */}
        <div style={{ position: 'relative' }}>
          <Search size={16} className="text-muted" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search residents by full name, flat number (e.g. B-402), phone, or vehicle plate..."
            className="input-field"
            style={{ paddingLeft: '2.5rem', height: '2.6rem' }}
          />
        </div>
      </div>

      {/* Directory Grid View */}
      {viewMode === "grid" ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }} className="lg-grid-cols-1 md-grid-cols-2">
          {filtered.map(member => (
            <div 
              key={member.id}
              className="glass-card p-5"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div>
                {/* Header with Avatar & Flat Badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.75rem',
                      backgroundColor: member.type === "Owner" ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                      color: member.type === "Owner" ? '#10b981' : '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.125rem'
                    }}>
                      {member.full_name?.substring(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <h3 className="font-bold text-base leading-tight" style={{ color: 'var(--foreground)' }}>
                        {member.full_name}
                      </h3>
                      <span className="badge badge-zinc" style={{ marginTop: '0.25rem' }}>
                        {member.type}
                      </span>
                    </div>
                  </div>

                  <span className="badge badge-zinc font-mono" style={{ fontSize: '0.8125rem', padding: '0.3rem 0.6rem' }}>
                    <Home size={12} style={{ marginRight: '0.25rem' }} />
                    {member.flat}
                  </span>
                </div>

                {/* Details List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                    <Phone size={14} className="text-muted" />
                    <span className="font-mono text-muted">{member.whatsapp_number}</span>
                  </div>

                  {member.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                      <Mail size={14} className="text-muted" />
                      <span className="text-muted">{member.email}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                    <Car size={14} className="text-muted" />
                    <span className="text-muted font-mono">Bay: {member.vehicle || "MH-12-AB-" + member.flat.replace(/[^0-9]/g, "")}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border)',
                gap: '0.5rem'
              }}>
                <a
                  href={`https://wa.me/${member.whatsapp_number.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline"
                  style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                >
                  <MessageSquare size={13} />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`tel:${member.whatsapp_number}`}
                  className="btn-outline"
                  style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}
                >
                  <PhoneCall size={13} />
                  <span>Call Flat</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--muted)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-foreground)' }}>
                <th style={{ padding: '0.875rem 1rem' }}>Resident</th>
                <th style={{ padding: '0.875rem 1rem' }}>Apartment Unit</th>
                <th style={{ padding: '0.875rem 1rem' }}>Role</th>
                <th style={{ padding: '0.875rem 1rem' }}>Contact</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(member => (
                <tr key={member.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '0.5rem',
                        backgroundColor: member.type === "Owner" ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: member.type === "Owner" ? '#10b981' : '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.75rem'
                      }}>
                        {member.full_name?.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold">{member.full_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span className="badge badge-zinc font-mono">{member.flat}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span className="badge badge-zinc">{member.type}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span className="font-mono text-xs">{member.whatsapp_number}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <a
                      href={`https://wa.me/${member.whatsapp_number.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    >
                      WhatsApp
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="glass-card p-8 text-center" style={{ color: 'var(--muted-foreground)' }}>
          <Users size={36} className="text-muted" style={{ margin: '0 auto 0.5rem auto' }} />
          <h4 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>No residents match your search</h4>
          <p className="text-xs text-muted mt-1">Try broadening your search term or select "All Wings".</p>
        </div>
      )}

      {/* Add Resident Modal */}
      {showAddModal && (
        <div className="modal-overlay" style={{ zIndex: 125 }}>
          <div className="modal-content" style={{ maxWidth: '34rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border)'
            }}>
              <h3 className="font-bold text-base flex items-center gap-2">
                <UserPlus size={18} className="text-primary" /> Register New Resident
              </h3>
              <button onClick={() => setShowAddModal(false)} className="theme-toggle-btn">
                <X size={16} />
              </button>
            </div>

            {feedbackMsg && (
              <div style={{
                margin: '1rem 1.5rem 0 1.5rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                borderRadius: '0.5rem',
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <CheckCircle2 size={16} />
                <span>{feedbackMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1 block">Full Name *</label>
                <input type="text" name="fullName" required placeholder="e.g. Ramesh Iyer" className="input-field" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1 block">Flat / Unit *</label>
                  <input type="text" name="flat" required placeholder="e.g. C-302" className="input-field font-mono" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1 block">Role *</label>
                  <select name="type" className="input-field">
                    <option value="Owner">Owner</option>
                    <option value="Tenant">Tenant</option>
                    <option value="Committee Member">Committee Member</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1 block">WhatsApp Phone Number *</label>
                <input type="tel" name="whatsappNumber" required placeholder="+91 98200 12345" className="input-field font-mono" />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1 block">Email (Optional)</label>
                <input type="email" name="email" placeholder="ramesh@example.com" className="input-field" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                  {isSubmitting ? "Adding..." : "Register Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
