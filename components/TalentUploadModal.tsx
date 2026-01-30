"use client";

import React, { useState } from 'react';
import { Upload, X, Loader2, Check, Brain, FileText } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';
import { TeamMember } from '@/lib/talent-data';
import SkillsGalaxy from './SkillsGalaxy';
import { addToTeam } from '@/app/actions/talent';

interface TalentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMemberId?: string; // Optional ID to force update specific member
}

export function TalentUploadModal({ isOpen, onClose, onSuccess, initialMemberId }: TalentUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const analyzeProfile = async () => {
    if (!file) return;

    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/analyze-profile', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        alert('Analysis failed: ' + data.error);
      }
    } catch (e) {
      console.error(e);
      alert('Error uploading file');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      // If we have an initialMemberId, force it in the payload to ensure update
      const payload = { ...result };
      if (initialMemberId) {
        payload.id = initialMemberId;
      }

      const response = await addToTeam(payload);
      if (response.success) {
        onSuccess();
        onClose();
        setResult(null);
        setFile(null);
      } else {
        alert('Failed to save to matrix: ' + response.error);
      }
    } catch (e) {
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  // Convert result skills object to array for 3D viz
  const galaxySkills = result ? Object.entries(result.skills || {}).map(([name, level]) => ({
    name,
    level: Number(level)
  })) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <GlassCard className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Brain className="text-cyan-400" />
            AI Profile Analysis
          </h2>

          {!result ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/10 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
              />

              {!file ? (
                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Upload size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">Upload LinkedIn PDF</p>
                    <p className="text-sm text-gray-400">Drag and drop or click to browse</p>
                  </div>
                </label>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <FileText size={32} />
                  </div>
                  <p className="text-lg font-bold text-white">{file.name}</p>
                  <button
                    onClick={analyzeProfile}
                    disabled={analyzing}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 flex items-center gap-2"
                  >
                    {analyzing ? <Loader2 className="animate-spin" /> : <Brain size={18} />}
                    {analyzing ? "Analyzing Profile..." : "Run Analysis"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-6">
                {/* Header & Avatar Edit */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 to-black p-[2px] ring-1 ring-white/10 relative overflow-hidden group">
                      {result.imageUrl ? (
                        <img src={result.imageUrl} alt={result.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400 text-xs font-bold">
                          {result.name?.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{result.name}</h3>
                      <p className="text-cyan-400 text-sm font-mono">{result.role}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setResult(null)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-green-500/20"
                    >
                      {saving ? <Loader2 className="animate-spin" /> : <Check size={18} />}
                      Confirm & Add
                    </button>
                  </div>
                </div>

                {/* Profile Enrichment Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Profile Photo URL</label>
                    <input
                      type="text"
                      value={result.imageUrl || ''}
                      onChange={(e) => setResult({ ...result, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">LinkedIn URL</label>
                    <input
                      type="text"
                      value={result.linkedInUrl || ''}
                      onChange={(e) => setResult({ ...result, linkedInUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Start Date</label>
                    <input
                      type="date"
                      value={result.startDate || ''}
                      onChange={(e) => setResult({ ...result, startDate: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 3D Visualization */}
              <SkillsGalaxy skills={galaxySkills} userName={result.name} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 p-4 rounded-xl">
                  <h4 className="text-sm font-bold text-gray-400 uppercase mb-3">Detected Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(result.skills || {}).map(([skill, level]: [string, any]) => (
                      <span key={skill} className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-md text-xs text-cyan-300 flex items-center gap-2">
                        {skill}
                        <span className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">{level}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Human Factor</h4>
                    <p className="text-sm text-gray-300">{result.outsideInterests?.join(", ")}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Experience</h4>
                    <ul className="text-sm text-gray-300 list-disc pl-4 space-y-1">
                      {result.experience?.slice(0, 3).map((exp: string, i: number) => (
                        <li key={i}>{exp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
