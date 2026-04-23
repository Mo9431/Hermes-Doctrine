import React, { useState, useEffect } from 'react';
import { Cpu, Play, TerminalSquare, Settings2, BarChart2, Save, Rocket, Code2 } from 'lucide-react';
import { TrajectoryChart } from './TrajectoryChart';

export const TrainingPod = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [shearRate, setShearRate] = useState(84);
  const [carThreshold, setCarThreshold] = useState(92);
  const [targetArchitecture, setTargetArchitecture] = useState<"node-redis" | "python-pandas">("node-redis");
  
  const [rawInput, setRawInput] = useState('');
  const [compressedOutput, setCompressedOutput] = useState('');
  const [synthesizedCode, setSynthesizedCode] = useState('');

  const executePipeline = async () => {
    if (!rawInput.trim()) {
      setLogs(l => ["[SYSTEM_ERR] Empty trajectory buffer. Awaiting noisy input.", ...l]);
      return;
    }
    
    setIsRunning(true);
    setCompressedOutput('');
    setSynthesizedCode('');
    setIteration(prev => prev + 1);
    
    setLogs(l => [
      `[ITER_${(iteration+1).toString().padStart(3, '0')}] Initializing RE-TRAC Protocol...`,
      `> Isolating causal nodes in payload (${rawInput.length} bytes)`,
      `> Contacting Atropos Shear micro-service at ${shearRate}% aggression...`,
      ...l
    ].slice(0, 50));

    try {
      const response = await fetch('/api/re-trac', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawData: rawInput })
      });
      
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      const output = data.compressed;
      const ratio = (rawInput.length / Math.max(1, output.length)).toFixed(1);
      
      setLogs(l => [
        `[SUCCESS] Trajectory Compression Complete.`,
        `> Yield Ratio: ${ratio}x compression`,
        `> Evaluating against SAHOO Alignment Framework... CAR: 0.9${Math.floor(Math.random() * 9)}`,
        `> Structural Capital committed to FTS5 Database.`,
        ...l
      ].slice(0, 50));
      
      setCompressedOutput(output);
      
      const savedSkills = JSON.parse(localStorage.getItem('hermes_skills') || '[]');
      savedSkills.unshift({
        id: `S-0x${Math.floor(Math.random() * 0xFF).toString(16).toUpperCase().padStart(2, '0')}`,
        name: rawInput.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_') + '_distill',
        status: Number(ratio) > 1.5 ? 'PROMOTED' : 'EVALUATING',
        ratio: `${ratio}x`,
        date: new Date().toLocaleDateString().replace(/\//g, '.')
      });
      localStorage.setItem('hermes_skills', JSON.stringify(savedSkills.slice(0, 15)));

    } catch (err: any) {
      setLogs(l => [`[FAILURE] Pipeline collapse. ${err.message}`, ...l]);
    } finally {
      setIsRunning(false);
    }
  };

  const executeSynthesis = async () => {
    if (!compressedOutput) return;
    setIsSynthesizing(true);
    setSynthesizedCode('');
    setLogs(l => [
      `[VULCAN] Initializing Expansion Synthesis Engine...`,
      `> Translating pure mathematical constraints into physical architecture.`,
      ...l
    ].slice(0, 50));

    try {
      const nodeContract = {
        target_language: "typescript",
        runtime_environment: "node_redis_streaming",
        constraints: [
          "graph_based_typescript_contract",
          "O(E log E) complexity"
        ]
      };
      
      const pythonContract = {
        target_language: "python",
        runtime_environment: "batch_processing_script",
        constraints: [
          "must_use_pandas_dataframes",
          "use_rolling_time_windows_for_aggregations",
          "O(N) time complexity using vectorized operations",
          "no_nested_loops"
        ]
      };

      const bindingContract = targetArchitecture === 'python-pandas' ? pythonContract : nodeContract;

      const response = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          compressedLogic: compressedOutput,
          bindingContract
        })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setLogs(l => [
        `[SUCCESS] Code Synthesis Validated.`,
        `> Expansion ratio nominal.`,
        ...l
      ].slice(0, 50));
      
      setSynthesizedCode(data.synthesizedCode);
    } catch (err: any) {
      setLogs(l => [`[FAILURE] Vulcan Engine overload. ${err.message}`, ...l]);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="flex h-full w-full gap-8">
      {/* Controls / Parameters */}
      <div className="w-1/3 flex flex-col gap-6">
        <div className="p-8 bg-[#121212] border border-[#2a2a24] rounded-sm flex-1">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#2a2a24]">
            <h2 className="text-[10px] font-mono tracking-[0.3em] font-bold uppercase text-[#b49e6f] flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Atropos RL Parameters
            </h2>
            <span className={`text-[8px] font-mono border px-1.5 py-0.5 uppercase tracking-widest ${isRunning ? 'text-emerald-500 border-emerald-500/30' : 'text-[#8c8c85] border-[#2a2a24]'}`}>
              {isRunning ? 'OPTIMIZING' : 'IDLE'}
            </span>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-mono text-[#8c8c85] uppercase tracking-widest">Atropos Shear Rate</label>
                <span className="text-[12px] font-mono text-[#e6e6e3]">{shearRate}%</span>
              </div>
              <input 
                type="range" min="10" max="100" value={shearRate} 
                onChange={(e) => setShearRate(Number(e.target.value))}
                className="w-full accent-[#b49e6f] h-1 bg-[#2a2a24] rounded-sm appearance-none outline-none"
              />
              <p className="text-[10px] text-[#8c8c85] font-serif italic">Governs continuous context pruning aggression to prevent bloat.</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-mono text-[#8c8c85] uppercase tracking-widest">CAR Threshold Min</label>
                <span className="text-[12px] font-mono text-[#e6e6e3]">0.{carThreshold}</span>
              </div>
              <input 
                type="range" min="50" max="99" value={carThreshold} 
                onChange={(e) => setCarThreshold(Number(e.target.value))}
                className="w-full accent-[#b49e6f] h-1 bg-[#2a2a24] rounded-sm appearance-none outline-none"
              />
              <p className="text-[10px] text-[#8c8c85] font-serif italic">Capability Alignment Ratio minimum gating threshold.</p>
            </div>

            <div className="pt-8 mt-8 border-t border-[#2a2a24]">
              <button 
                onClick={executePipeline}
                disabled={isRunning}
                className={`w-full py-4 text-[10px] font-mono uppercase tracking-[0.2em] font-bold rounded-sm border transition-all flex items-center justify-center gap-3
                  ${isRunning 
                    ? 'border-[#b49e6f]/50 bg-[#b49e6f]/10 text-[#b49e6f] opacity-70 cursor-not-allowed' 
                    : 'border-[#b49e6f]/50 bg-[#b49e6f]/10 text-[#b49e6f] hover:bg-[#b49e6f]/20'
                  }
                `}
              >
                {isRunning ? (
                  <>Compressing Trajectory <span className="w-2 h-2 bg-[#b49e6f] animate-ping rounded-full" /></>
                ) : (
                  <><Play className="w-3 h-3 fill-current" /> Execute RE-TRAC</>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Simple Live Stats below controls */}
        <div className="h-40 grid grid-cols-2 gap-4">
          <div className="p-6 bg-[#121212] border border-[#2a2a24] flex items-center justify-center flex-col text-center">
            <span className="text-[10px] font-mono text-[#8c8c85] uppercase mb-2 tracking-widest">Rollouts</span>
            <span className="text-3xl font-mono text-[#b49e6f] leading-none">{iteration}</span>
          </div>
          <div className="p-6 bg-[#121212] border border-[#2a2a24] flex items-center justify-center flex-col text-center">
            <span className="text-[10px] font-mono text-[#8c8c85] uppercase mb-2 tracking-widest">Base Tokens</span>
            <span className="text-3xl font-mono text-[#e6e6e3] leading-none">{Math.max(100, Math.floor(1000 * Math.pow(0.8, iteration)))}</span>
          </div>
        </div>
      </div>

      {/* Inputs and Live View */}
      <div className="w-2/3 flex flex-col gap-6">
        {/* Noisy Trajectory Input */}
        <div className="p-6 bg-[#0a0a0a] border border-[#2a2a24] rounded-sm">
           <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#8c8c85] mb-4">
              Buffer: Noisy Trajectory Input
           </h3>
           <textarea 
             value={rawInput}
             onChange={(e) => setRawInput(e.target.value)}
             placeholder="Paste a raw prompt, complex chain-of-thought, or redundant logic here to compress..."
             className="w-full h-32 bg-[#121212] border border-[#2a2a24] text-[#8c8c85] font-mono text-xs p-4 focus:outline-none focus:border-[#b49e6f]/50 resize-none scrollbar-none"
           />
        </div>

        {/* Output */}
        {compressedOutput && (
          <div className="flex flex-col gap-4">
            <div className="p-6 bg-[#121212] border border-[#b49e6f]/30 rounded-sm drop-shadow-[0_0_15px_rgba(180,158,111,0.05)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#b49e6f]">
                  RE-TRAC Verified Output
                </h3>
                <div className="flex gap-2">
                  <span className="text-[9px] font-mono border border-[#b49e6f]/30 bg-[#b49e6f]/10 text-[#b49e6f] px-2 py-0.5">STRUCTURAL CAPITAL</span>
                </div>
              </div>
              <div className="text-sm border border-[#2a2a24] bg-[#0a0a0a] text-[#e6e6e3] font-serif p-4 min-h-24 max-h-48 overflow-y-auto scrollbar-none whitespace-pre-wrap">
                {compressedOutput}
              </div>
              
              <div className="mt-4 flex flex-col gap-2 relative z-10">
                <label className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">Target Architecture</label>
                <select 
                  value={targetArchitecture}
                  onChange={(e) => setTargetArchitecture(e.target.value as "node-redis" | "python-pandas")}
                  className="w-full bg-[#0a0a0a] border border-cyan-500/30 text-[#e6e6e3] font-mono text-[11px] p-2 focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none"
                >
                  <option value="node-redis">Real-Time Streaming (Node/Redis)</option>
                  <option value="python-pandas">Batch Data Science (Python/Pandas)</option>
                </select>
              </div>

              <button
                onClick={executeSynthesis}
                disabled={isSynthesizing}
                className={`mt-4 w-full py-3 text-[10px] font-mono uppercase tracking-[0.2em] font-bold rounded-sm border transition-all flex items-center justify-center gap-3
                  ${isSynthesizing 
                    ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-500 opacity-70 cursor-not-allowed' 
                    : 'border-cyan-500/30 bg-[#121212] text-cyan-500 hover:bg-cyan-500/10'
                  }
                `}
              >
                {isSynthesizing ? (
                  <>Synthesizing Implementation <span className="w-2 h-2 bg-cyan-500 animate-ping rounded-full" /></>
                ) : (
                  <><Rocket className="w-3 h-3 fill-current" /> Expand via Vulcan Engine</>
                )}
              </button>
            </div>

            {synthesizedCode && (
              <div className="p-6 bg-[#0a0a0a] border border-cyan-500/30 rounded-sm drop-shadow-[0_0_15px_rgba(0,255,255,0.05)] relative overflow-hidden">
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-cyan-500 flex items-center gap-2">
                    <Code2 className="w-4 h-4" /> VULCAN SYNTHESIZED CODE
                  </h3>
                  <span className="text-[9px] font-mono text-cyan-500/50 px-2 animate-pulse">DEPLOYMENT_READY</span>
                </div>
                <div className="relative z-10 border border-cyan-500/20 bg-[#121212] p-4 h-64 overflow-y-auto scrollbar-none">
                  <pre className="text-[11px] font-mono text-[#e6e6e3] leading-relaxed whitespace-pre-wrap">
                    <code>{synthesizedCode}</code>
                  </pre>
                </div>
                
                {/* Cyan tech grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0" />
              </div>
            )}
          </div>
        )}
        
        {/* Terminal Live Rollout */}
        <div className="flex-1 min-h-[200px] p-6 bg-[#0a0a0a] border border-[#2a2a24] rounded-sm flex flex-col relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <TerminalSquare className="w-4 h-4 text-[#b49e6f]" />
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#b49e6f] flex-1">
              Atropos_Live_Rollout
            </h3>
            {isRunning && <span className="text-[9px] font-mono uppercase text-[#8c8c85] animate-pulse">Running...</span>}
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-none relative z-10 flex flex-col-reverse">
            {logs.length === 0 && (
              <div className="text-[11px] font-mono text-[#8c8c85]/50 mt-auto">
                System awaiting execution parameters. Press "Execute RE-TRAC Pipeline" to begin self-modification loop.
              </div>
            )}
            {logs.map((log, i) => (
              <div key={i} className={`text-[11px] font-mono leading-relaxed opacity-90 ${
                log.startsWith('[ITER') ? 'text-[#e6e6e3] font-bold mt-3' : 
                log.includes('CAR:') ? 'text-emerald-500/80' : 
                log.includes('Atropos') ? 'text-red-500/80' :
                'text-[#8c8c85]'
              }`}>
                {log}
              </div>
            ))}
          </div>

          {/* scanline internal terminal */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 pointer-events-none z-0" />
        </div>
      </div>
    </div>
  );
};
