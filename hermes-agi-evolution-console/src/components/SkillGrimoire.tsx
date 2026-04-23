import React, { useState, useEffect } from 'react';
import { Database, Download, TerminalSquare, Trash2, Cpu } from 'lucide-react';
import { Skill } from '../types';
import { GrimoireDashboard } from './GrimoireDashboard';

export const SkillGrimoire = () => {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-end mb-4 border-b border-[#2a2a24] pb-6">
        <div>
          <h2 className="text-xl font-serif italic text-[#e6e6e3] flex items-center gap-3 mb-2">
            <Database className="w-6 h-6 text-[#b49e6f]" />
            The Grimoire
          </h2>
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#8c8c85]">
            Persistent Repository of Distilled Logic Constructs
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden min-h-0">
        <GrimoireDashboard />
      </div>
    </div>
  );
};
