"use client";

import React, { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { X, Save, Upload, User, Calendar, Linkedin, Briefcase, Loader2 } from "lucide-react";

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: any; // Using any for flexibility with Firestore data shapes
  onSave: (id: string, data: any) => Promise<void>;
}

export function EditMemberModal({ isOpen, onClose, member, onSave }: EditMemberModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    linkedInUrl: "",
    startDate: "",
    imageUrl: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || "",
        role: member.role || "",
        linkedInUrl: member.linkedInUrl || "",
        startDate: member.startDate || "",
        imageUrl: member.imageUrl || ""
      });
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(member.id, formData);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <GlassCard className="w-full max-w-lg border-white/20 shadow-2xl relative flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <User className="text-cyan-400" size={24} />
              Edit Profile
            </h2>
            <p className="text-gray-400 text-sm mt-1">Update team member details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto py-6 space-y-6 flex-1 pr-2">

          {/* Profile Photo Section */}
          <div className="flex items-start gap-6">
            <div className="relative group shrine-0">
              <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-white/10 overflow-hidden flex items-center justify-center relative shadow-lg group-hover:border-cyan-500/50 transition-colors">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-gray-600" />
                )}
                {/* Overlay for upload */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <Upload size={24} className="text-white" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
              </div>
              <p className="text-xs text-center mt-2 text-gray-500">Click to upload</p>
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-bold"
                  placeholder="e.g. Alice Smith"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1">
                  <Briefcase size={12} /> Role / Title
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
                  placeholder="e.g. Senior Engineer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1">
                <Linkedin size={12} /> LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.linkedInUrl}
                onChange={e => setFormData({ ...formData, linkedInUrl: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-cyan-400 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all text-sm"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1">
                <Calendar size={12} /> Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all text-sm [color-scheme:dark]"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 rounded-lg text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Save Changes
          </button>
        </div>

      </GlassCard>
    </div>
  );
}
