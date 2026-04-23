
import React from 'react';
import { EvolutionStage } from '../types';

interface Props {
  currentStage: EvolutionStage;
}

export const EvolutionProgress: React.FC<Props> = ({ currentStage }) => {
  const stages = [
    { id: 'I_NOISY_DISCOVERY', label: 'Stage I', title: 'Noisy Discovery', desc: 'High Variance / High Risk' },
    { id: 'II_STRUCTURAL_COMPOUNDING', label: 'Stage II', title: 'Structural Compounding', desc: 'Medium Variance / High Yield' },
    { id: 'III_RECURSIVE_CONTINUATION', label: 'Stage III', title: 'Recursive Continuation', desc: 'Low Variance / Exponential' },
  ];

  const activeIndex = stages.findIndex(s => s.id === currentStage);

  return (
    <div className="p-8 bg-[#121212] border border-[#2a2a24] rounded-sm h-full flex flex-col">
      <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#8c8c85] mb-8">Maturation Trajectory</h3>
      
      <div className="relative space-y-12 flex-1">
        {/* Connection Line */}
        <div className="absolute left-[11px] top-4 bottom-4 w-[1px] bg-[#2a2a24]" />
        <div 
          className="absolute left-[11px] top-4 w-[1px] bg-[#b49e6f] transition-all duration-1000" 
          style={{ height: `${(activeIndex / (stages.length - 1)) * 100}%` }}
        />

        {stages.map((stage, i) => {
          const isActive = stage.id === currentStage;
          const isPassed = i < activeIndex;

          return (
            <div key={stage.id} className={`flex items-start gap-8 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`
                relative z-10 w-6 h-6 border flex items-center justify-center font-mono text-[9px]
                ${isActive ? 'border-[#b49e6f] bg-[#b49e6f] text-black glow-accent scale-110' : isPassed ? 'border-[#b49e6f] bg-[#b49e6f]/10 text-[#b49e6f]' : 'border-[#2a2a24] bg-[#0c0c0c] text-[#8c8c85]'}
              `}>
                0{i + 1}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isActive ? 'text-[#b49e6f]' : 'text-[#8c8c85]'}`}>{stage.label}</span>
                </div>
                <h4 className="text-base font-serif italic text-[#e6e6e3]">{stage.title}</h4>
                <p className="text-[10px] text-[#8c8c85] font-sans uppercase tracking-tight">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 p-4 bg-[#080808] border border-[#2a2a24] text-[10px] text-[#8c8c85] font-serif italic leading-relaxed">
        "A system cannot forcibly leap from Stage I to Stage III. The transformation requires rigid mathematical validation of the directionality of execution edges."
      </div>
    </div>
  );
};
