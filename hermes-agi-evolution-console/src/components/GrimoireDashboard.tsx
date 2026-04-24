import React, { useState, useEffect } from 'react';
import { Database, Shield, Activity, ChevronDown, ChevronUp, Code2, Cpu, Trash2, RefreshCw, Scissors, Folder, FolderOpen, ChevronRight, FileCode, GripVertical, Plus } from 'lucide-react';

interface Skill {
  id: string;
  folderId: string;
  name: string;
  domain: string;
  incidentReport: string;
  fol: string;
  code: string;
  language: string;
}

interface FolderType {
  id: string;
  name: string;
  parentId: string | null;
}

interface GrimoireData {
  parentPattern: string;
  clauses: string[];
  folders: FolderType[];
  skills: Skill[];
}

const SkillCard: React.FC<{ skill: any; onPrune: () => void }> = ({ skill, onPrune }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#121212] border border-[#2a2a24] rounded flex flex-col flex-shrink-0 mb-4 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-[#2a2a24] bg-[#0a0a0a]">
        <div className="flex items-center gap-4">
          <span className="px-2 py-1 text-[9px] font-mono tracking-widest uppercase border border-emerald-500/30 text-emerald-500 bg-emerald-500/10 rounded-sm">
            {skill.domain}
          </span>
          <h3 className="font-mono text-[12px] font-bold text-[#e6e6e3] tracking-wider">{skill.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrune}
            className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
            title="Prune skill"
          >
            <Trash2 size={14} />
          </button>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-[#8c8c85] hover:text-[#b49e6f] transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 flex flex-col gap-6 flex-shrink-0">
          <div>
            <h4 className="text-[10px] font-mono text-[#8c8c85] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <Activity className="w-3 h-3 text-[#b49e6f]" /> Incident Report
            </h4>
            <p className="text-[11px] font-serif text-[#e6e6e3] italic leading-relaxed pl-5 border-l border-[#b49e6f]/30">
              "{skill.incidentReport}"
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-mono text-[#8c8c85] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <Cpu className="w-3 h-3 text-cyan-500" /> Extracted FOL
            </h4>
            <div className="bg-[#050505] border border-[#2a2a24] p-3 rounded-sm font-mono text-[10px] text-cyan-400">
              {skill.fol}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-mono text-[#8c8c85] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <Code2 className="w-3 h-3 text-emerald-500" /> Vulcan Compiled Code
            </h4>
            <div className="relative">
              <div className="absolute top-2 right-2 text-[8px] font-mono uppercase bg-[#2a2a24] px-1.5 py-0.5 rounded text-[#8c8c85]">{skill.language}</div>
              <pre className="bg-[#050505] border border-[#2a2a24] p-4 rounded-sm overflow-x-auto text-[11px] font-mono text-[#e6e6e3] leading-relaxed scrollbar-none">
                <code>{skill.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const GrimoireDashboard = () => {
  const [data, setData] = useState<GrimoireData | null>(null);
  const [organizing, setOrganizing] = useState(false);
  const [organizeResult, setOrganizeResult] = useState<any>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('unsorted');

  const loadGrimoire = () => {
    fetch('/api/grimoire')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setOrganizeResult(null);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadGrimoire();
  }, []);

  const handlePrune = async (skillId: string) => {
    if (!confirm('Prune this skill from memory?')) return;
    
    try {
      const res = await fetch(`/api/grimoire/skills/${skillId}`, { method: 'DELETE' });
      const result = await res.json();
      
      if (res.ok) {
        loadGrimoire();
      } else {
        alert(result.error || 'Failed to prune skill');
      }
    } catch (err) {
      console.error('Prune error:', err);
    }
  };

  const handleOrganize = async () => {
    setOrganizing(true);
    setOrganizeResult(null);
    
    try {
      const res = await fetch('/api/grimoire/organize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aggression: 0.3 })
      });
      const result = await res.json();
      setOrganizeResult(result);
      loadGrimoire();
    } catch (err) {
      console.error('Organize error:', err);
    } finally {
      setOrganizing(false);
    }
  };

  const handleClear = async () => {
    if (!confirm('Clear ALL skills from memory? This cannot be undone.')) return;
    
    try {
      await fetch('/api/grimoire/clear', { method: 'POST' });
      loadGrimoire();
    } catch (err) {
      console.error('Clear error:', err);
    }
  };

  const handleDragStart = (e: React.DragEvent, skillId: string) => {
    e.dataTransfer.setData('skillId', skillId);
  };

  const handleDrop = async (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    const skillId = e.dataTransfer.getData('skillId');
    if (!skillId) return;

    try {
      const res = await fetch(`/api/grimoire/skills/${skillId}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId })
      });
      if (res.ok) {
        loadGrimoire();
      }
    } catch (err) {
      console.error('Move error:', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCreateFolder = async () => {
    const name = prompt('Folder name:');
    if (!name) return;

    try {
      const res = await fetch('/api/grimoire/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parentId: selectedFolderId === 'unsorted' ? null : selectedFolderId })
      });
      if (res.ok) {
        loadGrimoire();
      }
    } catch (err) {
      console.error('Create folder error:', err);
    }
  };

  if (!data) return <div className="text-white p-4 font-mono text-xs">Loading FTS5...</div>;

  const filteredSkills = data.skills.filter(s => s.folderId === selectedFolderId);

  return (
    <div className="flex flex-col h-full w-full gap-6">
      <div className="flex h-full gap-6 overflow-hidden">
        {/* Sidebar Explorer */}
        <div className="w-64 flex flex-col bg-[#0a0a0a] border border-[#2a2a24] rounded-sm overflow-hidden">
          <div className="p-4 border-b border-[#2a2a24] bg-[#121212] flex justify-between items-center">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8c8c85] flex items-center gap-2">
              <Folder className="w-3 h-3" /> Skill Explorer
            </h3>
            <button onClick={handleCreateFolder} className="text-[#8c8c85] hover:text-[#b49e6f]" title="New Folder">
              <Plus size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {data.folders.map(folder => (
              <div
                key={folder.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, folder.id)}
                onClick={() => setSelectedFolderId(folder.id)}
                className={`flex items-center gap-2 p-2 rounded-sm cursor-pointer transition-all ${
                  selectedFolderId === folder.id 
                    ? 'bg-[#b49e6f]/20 border border-[#b49e6f]/30 text-[#b49e6f]' 
                    : 'text-[#8c8c85] hover:bg-[#121212] border border-transparent'
                }`}
              >
                {selectedFolderId === folder.id ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                <span className="text-xs font-mono">{folder.name}</span>
                <span className="ml-auto text-[10px] opacity-50">
                  {data.skills.filter(s => s.folderId === folder.id).length}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* Organize/Prune Controls */}
          <div className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#2a2a24] rounded-sm">
            <div className="flex items-center gap-4">
              <button
                onClick={handleOrganize}
                disabled={organizing}
                className="flex items-center gap-2 px-4 py-2 bg-[#b49e6f]/10 border border-[#b49e6f]/30 text-[#b49e6f] text-[10px] font-mono uppercase tracking-widest hover:bg-[#b49e6f]/20 transition-all disabled:opacity-50"
              >
                {organizing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Scissors className="w-3 h-3" />}
                {organizing ? 'Analyzing...' : 'Atropos Shear'}
              </button>
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-500/70 text-[10px] font-mono uppercase tracking-widest hover:bg-red-500/20 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-3 h-3" />
                Clear All
              </button>
            </div>
            <div className="text-[10px] font-mono text-[#8c8c85]">
              {data.skills.length} skills in memory
            </div>
          </div>

          {/* Children Cards Level 2 */}
          <div className="flex-1 overflow-hidden flex flex-col gap-2 min-h-0">
            <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#8c8c85] mb-2 flex items-center gap-2 flex-shrink-0">
              <Shield className="w-4 h-4 text-[#8c8c85]" /> 
              {data.folders.find(f => f.id === selectedFolderId)?.name} / Verified Implementations
            </h2>
            
            <div className="flex-1 overflow-y-auto pb-12 scrollbar-none">
              {filteredSkills.map((skill: any) => (
                <div key={skill.id} draggable onDragStart={(e) => handleDragStart(e, skill.id)}>
                  <SkillCard skill={skill} onPrune={() => handlePrune(skill.id)} />
                </div>
              ))}
              {filteredSkills.length === 0 && (
                <div className="text-center py-12 text-[#8c8c85] font-mono text-xs border border-dashed border-[#2a2a24] rounded-sm">
                  Folder is empty. Drag skills here to organize.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
