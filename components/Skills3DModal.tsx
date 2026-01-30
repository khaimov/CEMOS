"use client";

import React from 'react';
import { X, Brain } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import SkillsGalaxy from './SkillsGalaxy';

interface Skills3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: { name: string; level: number }[];
  userName: string;
}

export function Skills3DModal({ isOpen, onClose, skills, userName }: Skills3DModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl h-[80vh]">
        <GlassCard className="h-full flex flex-col p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Brain className="text-cyan-400" />
              Neural Skill Matrix: {userName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/40">
            <SkillsGalaxy skills={skills} userName={userName} />
          </div>

          <div className="mt-4 flex justify-end">
            <p className="text-xs text-gray-400">
              Interactive 3D Visualization via Three.js
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
