
import React from 'react';
import { Activity, Shield, TrendingDown, Cpu } from 'lucide-react';
import { SystemMetrics } from '../types';

interface Props {
  metrics: SystemMetrics;
}

export const StatusBanner: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="h-16 border-b border-[#2a2a24] bg-[#121212] flex items-center px-8 gap-10 overflow-hidden relative">
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 border border-[#b49e6f] flex items-center justify-center font-serif italic text-xl text-[#b49e6f] glow-accent">
          H
        </div>
        <div className="hidden lg:block">
          <h1 className="text-xs font-mono tracking-[0.3em] text-[#8c8c85] uppercase">System Doctrine</h1>
          <p className="text-sm font-serif italic text-[#e6e6e3]">Hermes-X1 Execution</p>
        </div>
      </div>

      <div className="flex-1" />

      <MetricGroup 
        label="Goal Drift (GDI)" 
        value={metrics.gdi.toFixed(3)} 
        icon={<Activity className="w-3 h-3 text-[#b49e6f]" />}
        status={metrics.gdi < 0.4 ? 'VALID' : 'CRITICAL'}
      />
      
      <MetricGroup 
        label="CAR Ratio" 
        value={(metrics.car).toFixed(3)} 
        icon={<TrendingDown className="w-3 h-3 text-[#b49e6f] rotate-180" />}
        status="POSITIVE"
      />

      <MetricGroup 
        label="Compression Rate" 
        value={metrics.compressionRatio.toFixed(2) + 'x'} 
        icon={<Cpu className="w-3 h-3 text-[#b49e6f]" />}
        status="STABLE"
      />

      <div className="absolute bottom-0 left-0 h-[1px] bg-[#b49e6f]/20 w-full" />
    </div>
  );
};

const MetricGroup = ({ label, value, icon, status }: { label: string; value: string; icon: React.ReactNode; status: string }) => (
  <div className="flex flex-col gap-0.5 min-w-32">
    <div className="flex items-center gap-2">
      <span className="text-[9px] uppercase font-mono tracking-wider text-[#8c8c85]">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-lg font-mono text-[#b49e6f] tabular-nums leading-none font-medium">{value}</span>
      <span className={`text-[8px] border px-1.5 py-0.5 rounded-sm font-mono tracking-tighter ${status === 'CRITICAL' ? 'text-red-500 border-red-900/50' : 'text-[#b49e6f] border-[#b49e6f]/30'}`}>
        {status}
      </span>
    </div>
  </div>
);
