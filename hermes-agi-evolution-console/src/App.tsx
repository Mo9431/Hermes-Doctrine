import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { StatusBanner } from './components/StatusBanner';
import { Dashboard } from './components/Dashboard';
import { KnowledgeHub } from './components/KnowledgeHub';
import { TrainingPod } from './components/TrainingPod';
import { SkillGrimoire } from './components/SkillGrimoire';
import { WorkshopView } from './components/WorkshopView';
import { SystemMetrics, EvolutionStage, ViewMode } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    gdi: 0.142,
    car: 0.941,
    compressionRatio: 4.12,
    epistemicStability: 0.88,
    testTimeCompute: 1240
  });

  const [stage, setStage] = useState<EvolutionStage>('II_STRUCTURAL_COMPOUNDING');
  const [activeView, setActiveView] = useState<ViewMode>('DASHBOARD');
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    // Initial boot sequence simulation
    const timer = setTimeout(() => setBooting(false), 2000);

    // Fetch live telemetry from the external agent (via backend)
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/telemetry', {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        // Prevent trying to parse the HTML fallback Vite injects on broken proxy
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          const liveMetrics = await res.json();
          setMetrics(liveMetrics);
        }
      } catch (e) {
        console.error("Telemetry fetch failed", e);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#080808] font-sans selection:bg-[#b49e6f]/30">
      <AnimatePresence>
        {booting && (
          <motion.div 
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[100] bg-[#080808] flex items-center justify-center flex-col gap-8"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-20 h-20 border border-[#2a2a24] flex items-center justify-center relative"
            >
              <div className="absolute inset-x-0 h-[1px] bg-[#b49e6f] animate-pulse" />
              <div className="text-2xl font-serif italic text-[#b49e6f]">H</div>
            </motion.div>
            <div className="text-center">
              <h2 className="text-xl font-serif italic text-[#e6e6e3] mb-2 tracking-tight">The Hermes Doctrine</h2>
              <p className="text-[10px] font-mono text-[#8c8c85] animate-pulse tracking-[0.4em] uppercase">Structural Engineering Active</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="scanline" />
        <div className="tech-grid absolute inset-0 opacity-20 pointer-events-none" />
        
        <StatusBanner metrics={metrics} />

        <main className="flex-1 overflow-hidden relative z-10 flex flex-col">
          {activeView === 'DASHBOARD' && (
            <div className="flex-1 overflow-y-auto">
              <Dashboard stage={stage} setStage={setStage} />
            </div>
          )}
          {activeView === 'KNOWLEDGE_HUB' && (
            <div className="flex-1 overflow-hidden p-4 md:p-8">
              <KnowledgeHub />
            </div>
          )}
          {activeView === 'TRAINING_POD' && (
            <div className="flex-1 overflow-hidden p-4 md:p-8">
              <TrainingPod />
            </div>
          )}
          {activeView === 'GRIMOIRE' && (
            <div className="flex-1 min-h-0 overflow-hidden p-4 md:p-8 flex flex-col">
              <SkillGrimoire />
            </div>
          )}
          {activeView === 'WORKSHOP' && (
            <div className="flex-1 overflow-y-auto">
              <WorkshopView />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
