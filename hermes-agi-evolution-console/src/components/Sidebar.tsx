
import React from 'react';
import { 
  BarChart3, 
  Database, 
  Terminal, 
  Settings, 
  Waypoints, 
  Cpu, 
  Zap,
  BookOpen
} from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  return (
    <div className="w-16 md:w-64 border-r border-[#2a2a24] flex flex-col h-full bg-[#080808]">
      <div className="p-6 border-b border-[#2a2a24]">
        <div className="hidden md:flex flex-col">
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#8c8c85] uppercase mb-1">Infrastructure V.7</span>
          <span className="text-lg font-serif italic text-[#b49e6f]">Hermes Doctrine</span>
        </div>
      </div>

      <div className="flex-1 mt-6 px-3 space-y-2">
        <NavItem disabled={false} icon={<BarChart3 />} label="Dashboard" active={activeView === 'DASHBOARD'} onClick={() => onViewChange('DASHBOARD')} />
        <NavItem disabled={false} icon={<BookOpen />} label="Knowledge Hub" active={activeView === 'KNOWLEDGE_HUB'} onClick={() => onViewChange('KNOWLEDGE_HUB')} />
        <NavItem disabled={false} icon={<Database />} label="Skill Grimoire" active={activeView === 'GRIMOIRE'} onClick={() => onViewChange('GRIMOIRE')} />
        <NavItem disabled icon={<Waypoints />} label="Trajectories [Locked]" />
        <NavItem disabled icon={<Terminal />} label="Dialectic Log [Locked]" />
        <NavItem disabled={false} icon={<Cpu />} label="Training Pod (Atropos)" active={activeView === 'TRAINING_POD'} onClick={() => onViewChange('TRAINING_POD')} />
      </div>

      <div className="p-6 border-t border-[#2a2a24] mt-auto">
        <div className="text-[9px] font-mono text-[#8c8c85] uppercase tracking-widest leading-loose">
          Security Protocol: Level 7-Sahoo<br/>
          FTS5: [CONNECTED]<br/>
          DIALECTIC: 0.14Hz
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, disabled = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; disabled?: boolean; onClick?: () => void }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`
      w-full flex items-center gap-3 px-3 py-2 transition-all flex-col md:flex-row text-left
      ${active ? 'text-[#b49e6f] border-l-2 border-[#b49e6f] bg-[#121212]' : 'border-l-2 border-transparent text-[#8c8c85] hover:text-[#e6e6e3] hover:bg-[#121212]'}
      ${disabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : 'cursor-pointer'}
    `}
  >
    {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4 flex-shrink-0' })}
    <span className="hidden md:block text-xs uppercase tracking-widest font-mono font-medium">{label}</span>
  </button>
);
