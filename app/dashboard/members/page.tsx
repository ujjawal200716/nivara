import { Plus, Home, Phone, Mail, Search } from "lucide-react";
import { addMember } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { MembersNavbar } from "./MembersNavbar";

export default async function ManageMembersPage() {
  const supabase = await createClient();
  
  // Fetch members from Supabase
  const { data: members } = await supabase
    .from("Nivara")
    .select("*")
    .order("created_at", { ascending: false });

  const safeMembers = members || [];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Top Navbar */}
      <MembersNavbar membersCount={safeMembers.length} />

      <main className="container flex-1" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage Members</h1>
          <p className="text-sm text-muted mt-1">
            Add and manage society residents. Members will receive updates via WhatsApp.
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Add Member
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Left Column: Member List */}
        <div style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Search/Filter Bar */}
          <div className="glass-card" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} className="text-muted" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search by name, flat, or phone..." 
                className="input-field"
                style={{ border: 'none', background: 'transparent', paddingLeft: '2.5rem', boxShadow: 'none' }}
              />
            </div>
          </div>

          {/* Data List */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="flex" style={{ padding: '1rem', borderBottom: '1px solid var(--border)', background: 'rgba(var(--muted), 0.5)', fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
              <div style={{ flex: 2 }}>Resident</div>
              <div style={{ flex: 1 }}>Flat</div>
              <div style={{ flex: 2 }}>Contact</div>
              <div style={{ flex: 1, textAlign: 'right' }}>Status</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {safeMembers.map((member) => (
                <div key={member.id} className="flex items-center" style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-3" style={{ flex: 2 }}>
                    <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(161, 161, 170, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>
                      {member.full_name.substring(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.full_name}</p>
                      <p className="text-xs text-muted">{member.type}</p>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span className="badge badge-zinc font-mono" style={{ textTransform: 'none', letterSpacing: 'normal' }}>
                      <Home size={12} style={{ marginRight: '0.25rem' }} /> {member.flat}
                    </span>
                  </div>
                  <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Phone size={12} /> <span className="font-mono">{member.whatsapp_number}</span>
                    </div>
                    {member.email && (
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <Mail size={12} /> <span>{member.email}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <span className="badge badge-green">Active</span>
                  </div>
                </div>
              ))}
              
              {safeMembers.length === 0 && (
                <div className="p-6 text-center text-sm text-muted">
                  No members added yet. Use the form to add a resident.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Add Member Form */}
        <div style={{ flex: '1 1 30%' }}>
          <div className="glass-card p-6" style={{ position: 'sticky', top: '6rem' }}>
            <h3 className="text-lg font-semibold tracking-tight mb-1">Add New Resident</h3>
            <p className="text-xs text-muted mb-6">Create a profile to allow them to log complaints via WhatsApp or Web.</p>

            <form action={async (formData) => { "use server"; await addMember(formData); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="text-xs font-medium mb-1" style={{ display: 'block' }}>Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  placeholder="e.g. Jane Smith"
                  className="input-field"
                />
              </div>
              
              <div className="flex gap-4">
                <div style={{ flex: 1 }}>
                  <label className="text-xs font-medium mb-1" style={{ display: 'block' }}>Flat / Unit</label>
                  <input 
                    type="text" 
                    name="flat"
                    required
                    placeholder="e.g. B-204"
                    className="input-field font-mono"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="text-xs font-medium mb-1" style={{ display: 'block' }}>Type</label>
                  <select name="type" className="input-field">
                    <option value="Owner">Owner</option>
                    <option value="Tenant">Tenant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-1" style={{ display: 'block' }}>WhatsApp Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} className="text-muted" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="tel" 
                    name="whatsappNumber"
                    required
                    placeholder="+91"
                    className="input-field font-mono"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
                <p className="text-xs text-muted mt-1" style={{ fontSize: '0.625rem' }}>Required for automated Triage updates.</p>
              </div>

              <div>
                <label className="text-xs font-medium mb-1" style={{ display: 'block' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} className="text-muted" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="jane@example.com"
                    className="input-field"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary mt-2">
                Create Member Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
);
}
