"use client";

import { useState } from "react";
import { 
  Bell, 
  Pin, 
  Calendar, 
  AlertCircle, 
  Plus, 
  CheckCircle2, 
  Sparkles, 
  X,
  Megaphone,
  Wrench,
  Users
} from "lucide-react";

export interface SocietyNotice {
  id: string;
  title: string;
  content: string;
  category: "Urgent" | "Maintenance" | "General" | "Event";
  date: string;
  pinned: boolean;
  author: string;
}

const INITIAL_NOTICES: SocietyNotice[] = [
  {
    id: "not-1",
    title: "Overhead Water Tank Cleaning (A & B Wings)",
    content: "Both overhead tanks will be flushed and sanitized on Saturday, 10:00 AM to 2:00 PM. Please store adequate drinking water in advance.",
    category: "Maintenance",
    date: "Today, 10:00 AM",
    pinned: true,
    author: "Facility Management"
  },
  {
    id: "not-2",
    title: "Emergency Fire Alarm & Drill Testing",
    content: "Mandatory bi-annual fire drill and smoke detector testing will be conducted this Sunday at 11:30 AM. Intercom sirens will buzz for 30 seconds.",
    category: "Urgent",
    date: "Yesterday",
    pinned: true,
    author: "Safety Committee"
  },
  {
    id: "not-3",
    title: "Annual General Body Meeting (AGM) Notice",
    content: "Agenda covers solar rooftop installation, CCTV camera upgrades, and election of new management committee members in Clubhouse Hall.",
    category: "General",
    date: "3 days ago",
    pinned: false,
    author: "Hon. Secretary"
  },
  {
    id: "not-4",
    title: "Community Festival & Cultural Night",
    content: "Registrations are now open for children's dance performances and evening dinner buffet at the central amphitheater.",
    category: "Event",
    date: "5 days ago",
    pinned: false,
    author: "Cultural Committee"
  }
];

export function NoticeBoard() {
  const [notices, setNotices] = useState<SocietyNotice[]>(INITIAL_NOTICES);
  const [filter, setFilter] = useState<"all" | "Urgent" | "Maintenance" | "General" | "Event">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<"Urgent" | "Maintenance" | "General" | "Event">("Maintenance");

  const filteredNotices = notices.filter(n => filter === "all" ? true : n.category === filter);

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newNotice: SocietyNotice = {
      id: "not-" + Date.now(),
      title: newTitle,
      content: newContent,
      category: newCategory,
      date: "Just now",
      pinned: newCategory === "Urgent",
      author: "Managing Committee"
    };

    setNotices([newNotice, ...notices]);
    setNewTitle("");
    setNewContent("");
    setShowAddModal(false);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Urgent":
        return <span className="badge badge-red"><AlertCircle size={12} /> Urgent Notice</span>;
      case "Maintenance":
        return <span className="badge badge-amber"><Wrench size={12} /> Maintenance</span>;
      case "Event":
        return <span className="badge badge-green"><Sparkles size={12} /> Society Event</span>;
      default:
        return <span className="badge badge-blue"><Megaphone size={12} /> Announcement</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Notice Board Header */}
      <div className="glass-card p-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.625rem',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--golden)'
          }}>
            <Bell size={20} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Official Society Notice Board</h2>
            <p className="text-xs text-muted">Broadcast notices, maintenance schedules, and committee announcements</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-golden"
            style={{ padding: '0.45rem 0.875rem', fontSize: '0.8125rem' }}
          >
            <Plus size={15} />
            <span>Post Notice</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {(["all", "Urgent", "Maintenance", "General", "Event"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`filter-tab ${filter === tab ? "filter-tab-active" : ""}`}
            style={{ textTransform: 'capitalize' }}
          >
            {tab === "all" ? `All Notices (${notices.length})` : tab}
          </button>
        ))}
      </div>

      {/* Notices Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }} className="md-grid-cols-1">
        {filteredNotices.map(notice => (
          <div 
            key={notice.id} 
            className="glass-card p-5"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderLeft: notice.pinned ? '4px solid var(--golden)' : undefined,
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getCategoryBadge(notice.category)}
                  {notice.pinned && (
                    <span className="badge badge-zinc" style={{ color: 'var(--golden)', borderColor: 'rgba(212, 175, 55, 0.4)' }}>
                      <Pin size={11} /> Pinned
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted font-mono" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} /> {notice.date}
                </span>
              </div>

              <h3 className="font-bold text-base mb-2" style={{ color: 'var(--foreground)' }}>
                {notice.title}
              </h3>

              <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
                {notice.content}
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1.25rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border)',
              fontSize: '0.75rem',
              color: 'var(--muted-foreground)'
            }}>
              <span>Issued by: <strong style={{ color: 'var(--foreground)' }}>{notice.author}</strong></span>
              <span className="badge badge-green" style={{ fontSize: '0.625rem' }}>Verified Notice</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Notice Modal */}
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
                <Megaphone size={18} className="text-golden" /> Post Society Notice
              </h3>
              <button onClick={() => setShowAddModal(false)} className="theme-toggle-btn">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddNotice} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1" style={{ display: 'block' }}>
                  Notice Title *
                </label>
                <input 
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Swimming Pool Filter Maintenance on Monday"
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1" style={{ display: 'block' }}>
                  Category
                </label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="input-field"
                >
                  <option value="Maintenance">Maintenance Alert</option>
                  <option value="Urgent">Urgent / Emergency</option>
                  <option value="General">General Announcement</option>
                  <option value="Event">Community Event</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1" style={{ display: 'block' }}>
                  Notice Content *
                </label>
                <textarea 
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Enter detailed notice message for residents..."
                  className="input-field"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-golden">
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
