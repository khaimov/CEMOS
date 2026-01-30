"use client";

import React from "react";
import { useTalentData } from "@/hooks/useTalentData";
import { GlassCard } from "@/components/ui/GlassCard";
import { Check, Search, Filter, Database, Brain, Globe, Shield, Cpu, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

import { TalentUploadModal } from "@/components/TalentUploadModal";
import { Skills3DModal } from "@/components/Skills3DModal";
import { EditMemberModal } from "@/components/EditMemberModal"; // Import Edit Modal
import { addToTeam, deleteTeamMember, updateTeamMember } from "@/app/actions/talent"; // Import updateTeamMember
import { TeamMember } from "@/lib/talent-data";

export default function TalentPage() {
  const { skills, team, loading, seedData, error } = useTalentData();
  const [isGenericUploadOpen, setIsGenericUploadOpen] = React.useState(false);

  // 3D View State
  const [view3DMember, setView3DMember] = React.useState<{ name: string; skills: any } | null>(null);

  // Edit State
  const [editTarget, setEditTarget] = React.useState<TeamMember | null>(null); // State for editing

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; name: string } | null>(null);

  // Target for PDF Upload/Analysis
  const [uploadTarget, setUploadTarget] = React.useState<TeamMember | null>(null);

  // Helper to get icon component
  const getIcon = (skillName: string, iconName: string) => {
    const normalized = skillName.toLowerCase();

    // Vendor/Tech specific overrides
    if (normalized.includes("kubernetes") || normalized.includes("gke")) return LucideIcons.Container;
    if (normalized.includes("docker")) return LucideIcons.Container;
    if (normalized.includes("cloud") || normalized.includes("gcp") || normalized.includes("aws")) return LucideIcons.Cloud;
    if (normalized.includes("react") || normalized.includes("angular") || normalized.includes("vue") || normalized.includes("next")) return LucideIcons.Code2;
    if (normalized.includes("python") || normalized.includes("java") || normalized.includes("go") || normalized.includes("node")) return LucideIcons.Terminal;
    if (normalized.includes("data") || normalized.includes("sql") || normalized.includes("query")) return LucideIcons.Database;
    if (normalized.includes("ai") || normalized.includes("brain") || normalized.includes("neural") || normalized.includes("vision")) return LucideIcons.Brain;
    if (normalized.includes("security") || normalized.includes("iam")) return LucideIcons.Shield;
    if (normalized.includes("arch") || normalized.includes("strategy")) return LucideIcons.Layers;

    // Fallback to DB stored icon or generic
    // @ts-ignore
    return LucideIcons[iconName] || LucideIcons.Hexagon;
  };

  const initiateDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    setDeleteTarget(null);
    await deleteTeamMember(id);
    window.location.reload();
  };

  const handleEditSave = async (id: string, data: any) => {
    const res = await updateTeamMember(id, data);
    if (res.success) {
      setEditTarget(null);
      window.location.reload(); // Refresh to show updated data
    } else {
      alert("Failed to update: " + res.error);
    }
  };

  const handleUploadSuccess = () => {
    setUploadTarget(null);
    window.location.reload(); // Refresh to show updated data
  };

  const open3DView = (member: any) => {
    // Map IDs back to Names
    const galaxySkills = Object.entries(member.skills || {}).map(([id, level]) => {
      const def = skills.find(s => s.id === id);
      return {
        name: def ? def.name : "Unknown Skill",
        level: Number(level)
      };
    });
    setView3DMember({ name: member.name, skills: galaxySkills });
  };

  // Group Skills by Category
  const groupedSkills = React.useMemo(() => {
    const groups: Record<string, typeof skills> = {};
    skills.forEach(skill => {
      const cat = skill.category || "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(skill);
    });
    return groups;
  }, [skills]);

  // Sort Categories (Priority Order)
  const categoryOrder = ["AI", "Data", "Infra", "AppMod", "Security", "Strategy", "Industry", "Other"];
  const sortedCategories = Object.keys(groupedSkills).sort((a, b) => {
    const idxA = categoryOrder.indexOf(a);
    const idxB = categoryOrder.indexOf(b);
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });

  // Calculate Tenure
  const getTenure = (startDate?: string) => {
    if (!startDate) return null;
    try {
      const start = new Date(startDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const years = Math.floor(diffDays / 365);

      if (years > 0) return `${years}y`;
      return `<1y`;
    } catch (e) {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-cyan-400">
          <Loader2 className="animate-spin" size={32} />
          <span className="text-sm uppercase tracking-widest font-bold">Connecting to Nexus...</span>
        </div>
      </div>
    );
  }

  // Show Seeder if empty
  if (skills.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-6">
        <h1 className="text-3xl font-bold text-white">System Offline</h1>
        <p className="text-gray-400">No matrix data found in the core.</p>
        <button
          onClick={seedData}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl flex items-center gap-2 transition-all">
          <RefreshCw size={20} /> Initialize Default Protocol
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <TalentUploadModal
        isOpen={isGenericUploadOpen}
        onClose={() => setIsGenericUploadOpen(false)}
        onSuccess={() => window.location.reload()}
      />

      <EditMemberModal
        isOpen={!!editTarget}
        member={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={handleEditSave}
      />

      {view3DMember && (
        <Skills3DModal
          isOpen={!!view3DMember}
          onClose={() => setView3DMember(null)}
          skills={view3DMember.skills}
          userName={view3DMember.name}
        />
      )}

      {/* Upload/Analyze Modal */}
      {uploadTarget && (
        <TalentUploadModal
          isOpen={!!uploadTarget}
          onClose={() => setUploadTarget(null)}
          onSuccess={handleUploadSuccess}
          initialMemberId={uploadTarget.id}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <GlassCard className="w-full max-w-md border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 text-red-500">
                <div className="p-3 bg-red-500/10 rounded-full">
                  <LucideIcons.AlertTriangle size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Confirm Deletion</h3>
                  <p className="text-sm text-red-400/80">Permanent Action</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-gray-300">
                  Are you sure you want to remove <strong className="text-white">{deleteTarget.name}</strong> from the matrix?
                </p>
                <p className="text-xs text-gray-500">
                  This action cannot be undone. All skill data and profile information for this user will be permanently erased.
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 rounded-lg text-sm font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
                >
                  <LucideIcons.Trash2 size={16} /> Delete User
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col gap-6">
        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-red-400 text-sm font-medium">
              <Shield size={16} />
              {error}
            </div>
            <span className="text-xs text-red-400/60 font-mono">Read-Only</span>
          </div>
        )}

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              Talent Matrix
            </h1>
            <p className="text-gray-400 mt-2">
              Team Capabilities & Gaps
            </p>
          </div>
          {/* Header buttons removed as requested */}
        </div>

        {/* TRANSPOSED MATRIX */}
        <GlassCard className="w-full max-w-[calc(100vw-120px)] mx-auto overflow-x-auto p-0 border border-white/10 relative custom-scrollbar [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-thumb]:bg-cyan-500/20 [&::-webkit-scrollbar-track]:bg-white/5 pb-2">
          <div className="min-w-max pr-12">
            {/* 1. Header Row (Team Members) */}
            <div className="flex border-b border-white/10 sticky top-0 z-50 bg-[#0a0a0a] backdrop-blur-xl">
              <div className="w-[300px] shrink-0 p-4 font-bold text-gray-400 flex flex-col justify-end pb-3 sticky left-0 z-[60] bg-[#0a0a0a] border-r border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.4)]">
                <span className="uppercase text-xs tracking-widest text-white/40">Skill / Competency</span>
              </div>
              <div className="flex">
                {team.map(member => (
                  <div key={member.id} className="w-[110px] p-2 py-4 flex flex-col items-center justify-start border-l border-white/5 relative group transition-all hover:bg-white/5">
                    <div className="relative mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black p-[2px] ring-1 ring-white/10 group-hover:ring-cyan-500/50 transition-all shadow-lg overflow-hidden relative">
                        {member.imageUrl ? (
                          <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400 text-xs font-bold">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </div>
                        )}
                      </div>
                      {getTenure(member.startDate) && (
                        <div className="absolute -bottom-1 -right-1 bg-black/80 rounded px-1 py-0.5 text-[8px] font-mono text-cyan-400 border border-cyan-500/30">
                          {getTenure(member.startDate)}
                        </div>
                      )}
                    </div>

                    <div className="text-center w-full relative flex flex-col items-center gap-1">
                      {/* Delete Button (Hidden by default, shown on group hover) */}
                      <button
                        onClick={() => member.id && initiateDelete(member.id, member.name)}
                        className="absolute -top-[52px] -right-1 p-1 text-red-500/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Member"
                      >
                        <LucideIcons.Trash2 size={12} />
                      </button>

                      <p className="text-[10px] font-bold text-white truncate w-full px-1">{member.name.split(" ")[0]}</p>
                      <p className="text-[8px] text-gray-400 uppercase tracking-widest truncate w-full mb-1">{member.name.split(" ").slice(1).join(" ")}</p>

                      {/* Actions Row */}
                      <div className="flex items-center gap-3 mt-2 opacity-60 group-hover:opacity-100 transition-opacity justify-center w-full">
                        {/* 3D Link */}
                        <button
                          onClick={() => open3DView(member)}
                          className="flex items-center justify-center text-cyan-500 hover:text-cyan-300 transition-colors uppercase tracking-wider font-bold"
                          title="View 3D Galaxy"
                        >
                          <LucideIcons.Box size={14} />
                        </button>

                        {/* Edit Button - Uses Pencil */}
                        <button
                          onClick={() => setEditTarget(member)}
                          className="flex items-center justify-center text-green-500 hover:text-green-300 transition-colors uppercase tracking-wider font-bold"
                          title="Update Profile"
                        >
                          <LucideIcons.Pencil size={14} />
                        </button>

                        {/* Analyze Button - Uses Upload */}
                        <button
                          onClick={() => setUploadTarget(member)}
                          className="flex items-center justify-center text-blue-500 hover:text-blue-300 transition-colors uppercase tracking-wider font-bold"
                          title="Upload LinkedIn PDF for Analysis"
                        >
                          <LucideIcons.Upload size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Data Rows (Skills Grouped) */}
            <div className="divide-y divide-white/5 bg-[#0a0a0a]">
              {sortedCategories.map(category => (
                <React.Fragment key={category}>
                  {/* Category Divider */}
                  <div className="bg-[#0a0a0a] px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-cyan-300/80 sticky left-0 z-40 flex items-center gap-2 border-y border-white/5 w-full shadow-[4px_0_10px_rgba(0,0,0,0.2)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> {category}
                  </div>

                  {groupedSkills[category].map(skill => {
                    const Icon = getIcon(skill.name, skill.iconName);
                    return (
                      <div key={skill.id} className="flex hover:bg-white/[0.02] transition-colors group">
                        {/* Skill Header */}
                        <div className="w-[300px] shrink-0 p-3 pl-6 flex items-center gap-3 border-r border-white/5 sticky left-0 z-30 bg-[#0a0a0a] group-hover:bg-[#121212] transition-colors shadow-[4px_0_10px_rgba(0,0,0,0.2)]">
                          <div className={cn("p-1.5 rounded-lg bg-white/5 text-gray-400 group-hover:text-cyan-400 transition-colors shadow-inner", skill.demand > 0.8 && "text-cyan-400 bg-cyan-400/10")}>
                            <Icon size={14} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">{skill.name}</span>
                          </div>
                        </div>

                        {/* Team Proficiencies - Modern Battery/Bar Style */}
                        <div className="flex">
                          {team.map(member => {
                            const level = member.skills?.[skill.id] || 0;
                            return (
                              <div key={`${member.id}-${skill.id}`} className="w-[110px] border-l border-white/5 p-2 flex items-center justify-center">
                                {level > 0 ? (
                                  <div className="flex items-center gap-0.5 w-full justify-center">
                                    {[...Array(5)].map((_, i) => (
                                      <div
                                        key={i}
                                        className={cn(
                                          "h-3 w-2.5 rounded-[1px] transition-all",
                                          i < level
                                            ? level >= 4
                                              ? "bg-cyan-500"
                                              : "bg-blue-600"
                                            : "bg-white/5"
                                        )}
                                      />
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-gray-800 text-[10px] opacity-20">·</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

          </div>
        </GlassCard>

        {/* Legend - Compact Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <div className="flex items-center gap-8 text-sm">
            <span className="text-gray-500 font-mono text-xs uppercase tracking-widest">Proficiency Levels</span>
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5"><div className="h-2.5 w-2 bg-blue-600 rounded-[1px]" /><div className="h-2.5 w-2 bg-blue-600 rounded-[1px]" /><div className="h-2.5 w-2 bg-blue-600 rounded-[1px]" /><div className="h-2.5 w-2 bg-white/5 rounded-[1px]" /><div className="h-2.5 w-2 bg-white/5 rounded-[1px]" /></div>
              <span className="text-xs text-gray-400">Competent</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5"><div className="h-2.5 w-2 bg-cyan-500 rounded-[1px]" /><div className="h-2.5 w-2 bg-cyan-500 rounded-[1px]" /><div className="h-2.5 w-2 bg-cyan-500 rounded-[1px]" /><div className="h-2.5 w-2 bg-cyan-500 rounded-[1px]" /><div className="h-2.5 w-2 bg-cyan-500 rounded-[1px]" /></div>
              <span className="text-xs text-cyan-400 font-bold">Expert Lead</span>
            </div>
          </div>

          <div className="text-xs text-gray-600 flex items-center gap-2">
            <LucideIcons.ShieldCheck size={12} />
            <span>Secure Nexus Protocol v2.5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
