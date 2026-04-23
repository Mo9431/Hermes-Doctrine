
import React, { useEffect, useState, useRef } from 'react';
import { Terminal } from 'lucide-react';

const MESSAGES = [
  "INFERRING COGNITIVE BOUNDARIES...",
  "DETECTING DRIFT IN SEMANTIC VECTOR 0.38 - STABILIZING",
  "SYTHESIZING PEER PROFILE V4.2 - CROSS-TRAJECTORY ALIGNMENT ACTIVE",
  "SELF-DIALECTIC INVERSION: DETECTED REDUNDANT SKILL CLUSTER 'TREE_SEARCH_V2'",
  "INITIATING ATROPOS SHEAR - PRUNING CAUSAL NODES [0x4F, 0x91]",
  "GÖDEL LOOP ACTIVE: MONKEY-PATCHING LOCAL HEURISTICS...",
  "VALIDATING CAR 0.942 AGAINST ADVERSARIAL RE-ROLLS",
  "RECURSIVE TRAJECTORY COMPRESSION: 41.2% REDUCTION ACHIEVED",
  "MEMORY.MD UPDATED - NEW PROCEDURAL PLAYBOOK COMMITTED",
  "HONCHO DIALECTIC CADENCE: 120ms - LATENCY OPTIMAL",
  "SYSTEM STATE: MONOTONIC CAPABILITY EXPANSION CONFIRMED"
];

export const DialecticLog = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${MESSAGES[i % MESSAGES.length]}`].slice(-12));
      i++;
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="p-8 bg-[#121212] border border-[#2a2a24] rounded-sm h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#b49e6f]">Inversion_Feed</h3>
        <div className="flex-1 h-[1px] bg-[#2a2a24]" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-none">
        {logs.map((log, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-[8px] font-mono text-[#8c8c85] opacity-50">{log.split(']')[0]}]</span>
            <span className={`text-[11px] font-mono leading-relaxed ${log.includes('CRITICAL') || log.includes('DRIFT') ? 'text-red-800' : 'text-[#e6e6e3]'}`}>
              {log.split(']')[1]}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-[#2a2a24] flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-[#b49e6f] glow-accent" />
            <span className="text-[9px] font-mono text-[#8c8c85] uppercase tracking-widest">Core_Recursive: active</span>
        </div>
        <span className="text-[9px] font-mono text-[#8c8c85]/40 text-right uppercase tracking-tighter">FTS5_PROTO: connected</span>
      </div>
    </div>
  );
};
