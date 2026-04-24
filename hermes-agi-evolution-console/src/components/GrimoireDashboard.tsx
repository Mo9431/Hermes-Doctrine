import React, { useState } from 'react';
import { Database, Shield, Activity, ChevronDown, ChevronUp, Code2, Cpu, Trash2, RefreshCw, Scissors } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  domain: string;
  incidentReport: string;
  fol: string;
  code: string;
  language: string;
}

const mockData = {
  parentPattern: "Sybil_Aggregation_Rotation",
  clauses: [
    "Identity Disjointness",
    "Shared Sink",
    "Sub-Threshold Actions",
    "Coordinated Timing",
    "Orchestrated Sequence",
    "Signal Manipulation"
  ],
  children: [
    {
      id: "sk_1",
      name: "Crypto_Sybil_Swarm",
      domain: "Crypto",
      incidentReport: "Multiple fresh wallets deposit exact sub-threshold amounts to a central exchange address within a narrow time window.",
      fol: "∀w_i, w_j ∈ W: (addr(w_i) ≠ addr(w_j)) ∧ (sink(w_i) = sink(w_j)) ∧ (val(w_i) < τ)",
      code: "function detectSybilSwarm(deposits) { return false; } // Simplified for dashboard",
      language: "typescript"
    },
    {
      id: "sk_2",
      name: "Ticketmaster_Cart_Hold",
      domain: "E-Commerce",
      incidentReport: "User A places tickets in cart. Drops them precisely 1 second before expiration. User B immediately picks them up.",
      fol: "∃t_a, t_b: (user(t_a) ≠ user(t_b)) ∧ (|time_drop(t_a) - time_add(t_b)| < δ)",
      code: "function detectCartDaisyChain(events, delta) { return false; } // Simplified for dashboard",
      language: "typescript"
    },
    {
      id: "sk_3",
      name: "AML_Smurf_Structuring",
      domain: "Finance",
      incidentReport: "Multiple individuals use different IDs but share the same address/last name to deposit $9,500 each, avoiding the $10k reporting limit. Funds are immediately wired out.",
      fol: "∀x (AML(x) → ∃y Structuring(x,y))",
      code: `import pandas as pd
from collections import defaultdict

def detect_coordinated_mule_activity(deposits: pd.DataFrame, outbounds: pd.DataFrame) -> bool:
    deposits_filtered = deposits[deposits['amount'] == 9500].copy()
    if len(deposits_filtered) < 2: return False
    
    outbounds_filtered = outbounds.copy()
    if len(outbounds_filtered) == 0: return False
    
    deposits_filtered = deposits_filtered.sort_values('time').reset_index(drop=True)
    outbounds_filtered = outbounds_filtered.sort_values('time').reset_index(drop=True)
    outbound_times = outbounds_filtered['time'].tolist()
    outbound_amounts = outbounds_filtered['amount'].tolist()
    
    left = 0
    actor_freq = defaultdict(int)
    address_freq = defaultdict(int)
    last_name_freq = defaultdict(int)
    actor_count = address_count = last_name_count = outbound_idx = 0
    n = len(deposits_filtered)
    
    for right in range(n):
        row = deposits_filtered.iloc[right]
        actor, addr, lname = row['actor'], row['address'], row['last_name']
        
        actor_freq[actor] += 1
        if actor_freq[actor] == 1:
            actor_count += 1
            address_freq[addr] += 1
            if address_freq[addr] == 1: address_count += 1
            last_name_freq[lname] += 1
            if last_name_freq[lname] == 1: last_name_count += 1
            
        while left <= right and (deposits_filtered.iloc[right]['time'] - deposits_filtered.iloc[left]['time'] > 24):
            l_row = deposits_filtered.iloc[left]
            l_actor, l_addr, l_lname = l_row['actor'], l_row['address'], l_row['last_name']
            
            actor_freq[l_actor] -= 1
            if actor_freq[l_actor] == 0:
                actor_count -= 1
                address_freq[l_addr] -= 1
                if address_freq[l_addr] == 0: address_count -= 1
                last_name_freq[l_lname] -= 1
                if last_name_freq[l_lname] == 0: last_name_count -= 1
            left += 1
            
        max_time = deposits_filtered.iloc[right]['time']
        window_sum = actor_count * 9500
        
        # STRICT IDENTITY BINDING
        if actor_count < 2 or address_count != actor_count or last_name_count != actor_count:
            continue
            
        while outbound_idx < len(outbound_times) and outbound_times[outbound_idx] <= max_time:
            outbound_idx += 1
            
        if (outbound_idx < len(outbound_times) and
            outbound_times[outbound_idx] <= max_time + 2 and
            outbound_amounts[outbound_idx] == window_sum):
            return True
            
    return False`,
      language: "python"
    }
  ]
};

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
  const [data, setData] = useState<any>(null);
  const [organizing, setOrganizing] = useState(false);
  const [organizeResult, setOrganizeResult] = useState<any>(null);

  const loadGrimoire = () => {
    fetch('/api/grimoire')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setOrganizeResult(null);
      })
      .catch(console.error);
  };

  React.useEffect(() => {
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

  if (!data) return <div className="text-white p-4 font-mono text-xs">Loading FTS5...</div>;

  return (
    <div className="flex flex-col h-full w-full gap-6">
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
          {data.children.length} skills in memory
        </div>
      </div>

      {/* Organize Result */}
      {organizeResult && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-sm">
          <div className="text-[10px] font-mono text-emerald-500">
            Atropos Shear Results: Pruned {organizeResult.prunedCount} skills. Reason: {organizeResult.reason}
          </div>
        </div>
      )}

      {/* Header Level 1 */}
      <div className="p-6 bg-[#0a0a0a] border border-[#b49e6f]/30 rounded-sm drop-shadow-[0_0_15px_rgba(180,158,111,0.05)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(180,158,111,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(180,158,111,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-mono font-bold uppercase tracking-[0.2em] text-[#b49e6f] flex items-center gap-3">
              <Database className="w-6 h-6" />
              Intelligence Pattern: {data.parentPattern}
            </h1>
            <span className="px-3 py-1 bg-[#121212] border border-[#2a2a24] rounded-sm text-[10px] font-mono text-[#8c8c85] tracking-widest uppercase">
              Level 1 Abstraction
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {data.clauses.map((clause: string, idx: number) => (
              <div key={idx} className="flex items-center gap-3 bg-[#121212] border border-[#2a2a24] rounded-sm p-3">
                <span className="text-[#b49e6f] font-mono text-[10px] opacity-50">{(idx + 1).toString().padStart(2, '0')}</span>
                <span className="text-[11px] font-mono text-[#e6e6e3] uppercase tracking-wider">{clause}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Children Cards Level 2 */}
      <div className="flex-1 overflow-y-auto scrollbar-none pr-2 flex flex-col gap-2 min-h-0">
        <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#8c8c85] mb-2 flex items-center gap-2 flex-shrink-0">
          <Shield className="w-4 h-4 text-[#8c8c85]" /> Verified Implementations (Level 2)
        </h2>
        
        <div className="flex-1 min-h-0 overflow-y-auto pb-12">
          {data.children.map((skill: any) => (
            <SkillCard key={skill.id} skill={skill} onPrune={() => handlePrune(skill.id)} />
          ))}
          {data.children.length === 0 && (
            <div className="text-center py-12 text-[#8c8c85] font-mono text-xs">
              No skills in memory. Use RE-TRAC to compress trajectories or configure the Workshop domain.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
