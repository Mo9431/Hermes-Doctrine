
import React from 'react';
import { motion } from 'motion/react';

export const TrajectoryChart = () => {
  // Mock data for 10 iterations
  const points = Array.from({ length: 12 }, (_, i) => ({
    iteration: i + 1,
    tokens: Math.max(100, 1000 * Math.pow(0.7, i)),
    efficiency: Math.min(100, 20 + i * 8),
    entropy: Math.max(0.1, 0.8 * Math.pow(0.85, i))
  }));

  const maxTokens = 1000;
  const height = 200;
  const width = 600;

  return (
    <div className="p-8 bg-[#121212] border border-[#2a2a24] rounded-sm relative overflow-hidden group">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#b49e6f] mb-2 flex items-center gap-2">
            RE-TRAC_VIZ_MODULE_v1.0
          </h3>
          <p className="text-xl font-serif italic text-[#e6e6e3]">Recursive Compression Efficiency</p>
        </div>
        <div className="flex gap-6">
          <Legend label="Compute Trace" color="bg-[#b49e6f]" />
          <Legend label="Structural Load" color="bg-[#8c8c85]" />
        </div>
      </div>

      <div className="relative h-48 w-full">
        {/* Token Decline Curve */}
        <svg className="absolute inset-0 w-full h-full preserve-3d" viewBox={`0 0 ${width} ${height}`}>
          <path
            d={`M ${points.map((p, i) => `${(i / (points.length - 1)) * width},${height - (p.tokens / maxTokens) * height}`).join(' L ')}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-[#b49e6f]/20 blur-sm"
          />
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            d={`M ${points.map((p, i) => `${(i / (points.length - 1)) * width},${height - (p.tokens / maxTokens) * height}`).join(' L ')}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-[#b49e6f]"
          />

          {/* Efficiency Curve */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            d={`M ${points.map((p, i) => `${(i / (points.length - 1)) * width},${height - (p.efficiency / 100) * height}`).join(' L ')}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-[#8c8c85]"
            strokeDasharray="2 2"
          />

          {/* Grid lines */}
          {Array.from({ length: 5 }, (_, i) => (
            <line 
              key={i} 
              x1="0" y1={(i / 4) * height} 
              x2={width} y2={(i / 4) * height} 
              stroke="currentColor" 
              className="text-[#2a2a24]" 
              strokeWidth="0.5"
            />
          ))}
        </svg>

        {/* Data Points */}
        <div className="absolute inset-0 flex justify-between">
          {points.map((p, i) => (
            <div key={i} className="group/dot relative" style={{ height: '100%' }}>
               <div 
                className="absolute w-1.5 h-1.5 bg-zinc-950 border border-[#b49e6f] transition-transform hover:scale-150"
                style={{ 
                  left: '-3px',
                  top: `${height - (p.tokens / maxTokens) * height - 3}px` 
                }}
              />
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#8c8c85] opacity-0 group-hover:opacity-100 transition-opacity">
                TX_{i+100}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-4 gap-6 border-t border-[#2a2a24] pt-6">
        <Stat label="Trajectory Offset" value="-84.2%" trend="DOWN" />
        <Stat label="Epistemic Yield" value="φ412.0" trend="UP" />
        <Stat label="DAG Integrity" value="OPTIMAL" trend="STABLE" />
        <Stat label="Atropos Shear" value="ACTIVE" trend="NORM" />
      </div>
    </div>
  );
};

const Legend = ({ label, color }: { label: string; color: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-1.5 h-1.5 ${color}`} />
    <span className="text-[10px] uppercase font-mono tracking-widest text-[#8c8c85]">{label}</span>
  </div>
);

const Stat = ({ label, value, trend }: { label: string; value: string; trend: 'UP' | 'DOWN' | 'STABLE' | 'NORM' }) => (
  <div className="space-y-1">
    <div className="text-[10px] uppercase font-mono text-[#8c8c85] tracking-widest">{label}</div>
    <div className={`text-lg font-mono leading-none ${trend === 'UP' ? 'text-emerald-600' : trend === 'DOWN' ? 'text-[#b49e6f]' : 'text-[#e6e6e3]'}`}>
      {value}
    </div>
  </div>
);
