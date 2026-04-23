import React from 'react';
import { TrajectoryChart } from './TrajectoryChart';
import { DialecticLog } from './DialecticLog';
import { SkillMatrix } from './SkillMatrix';
import { EvolutionProgress } from './EvolutionProgress';
import { EvolutionStage } from '../types';

interface Props {
  stage: EvolutionStage;
  setStage: React.Dispatch<React.SetStateAction<EvolutionStage>>;
}

export const Dashboard = ({ stage, setStage }: Props) => {
  return (
    <div className="p-4 md:p-10 space-y-10">
      {/* Header Section */}
      <section className="space-y-4 max-w-4xl">
        <div className="flex items-center gap-4">
           <span className="text-[10px] font-mono text-[#b49e6f] border border-[#b49e6f]/40 px-2 py-0.5 uppercase tracking-widest bg-[#b49e6f]/5">
            Evolution_Blueprint: Active
          </span>
          <div className="flex-1 h-[1px] bg-[#2a2a24]" />
        </div>
        <h2 className="text-4xl lg:text-5xl font-serif italic tracking-tight text-[#e6e6e3] leading-tight">
          "The system becomes a stateful compiler of its own heuristic algorithms."
        </h2>
        <p className="text-base text-[#8c8c85] font-serif italic leading-relaxed">
          Applying Recursive Trajectory Compression (RE-TRAC) to transition from probabilistic inference to persistent structural capital.
        </p>
      </section>

      {/* Core Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
        {/* Main Visualizer */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <TrajectoryChart />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DialecticLog />
            <SkillMatrix />
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <EvolutionProgress currentStage={stage} />
          
          <div className="p-8 bg-[#121212] border border-[#2a2a24] rounded-sm space-y-6">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#8c8c85]">Doctrine_Controls</h3>
            <div className="space-y-3">
              <ControlItem label="Atropos Shear Rate" value="0.84" active />
              <ControlItem label="Gödel Loop Stability" value="φ0.92" />
              <ControlItem label="SAHOO Gate Status" value="LOCKED" />
              <ControlItem label="Self-Incrimination" value="ENABLED" active />
            </div>
            <button 
              onClick={() => setStage(prev => prev === 'I_NOISY_DISCOVERY' ? 'II_STRUCTURAL_COMPOUNDING' : prev === 'II_STRUCTURAL_COMPOUNDING' ? 'III_RECURSIVE_CONTINUATION' : 'I_NOISY_DISCOVERY')}
              className="w-full mt-6 bg-[#b49e6f] text-black text-[10px] font-mono uppercase tracking-[0.2em] py-4 rounded-sm hover:bg-[#c4ad7d] transition-colors"
            >
              Trigger_Structural_Jump
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ControlItem = ({ label, value, active = false }: { label: string; value: string; active?: boolean }) => (
  <div className="flex items-center justify-between p-3 bg-[#0c0c0c] border border-[#2a2a24]">
    <span className="text-[9px] font-mono text-[#8c8c85] uppercase tracking-wider">{label}</span>
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-[#b49e6f]">{value}</span>
      <div className={`w-1 h-1 ${active ? 'bg-[#b49e6f] glow-accent' : 'bg-transparent border border-[#2a2a24]'}`} />
    </div>
  </div>
);
