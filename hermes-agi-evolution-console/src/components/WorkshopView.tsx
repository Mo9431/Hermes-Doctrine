import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, AlertCircle } from 'lucide-react';
import { WorkshopConfig } from '../types';

export const WorkshopView = () => {
  const [config, setConfig] = useState<WorkshopConfig>({
    domain: "Cybersecurity & Fraud Detection",
    context: "Focus on identifying coordinated attacks, identity fraud, and financial crimes where actors appear disjoint but target a shared sink within tight temporal windows.",
    parentPattern: "Sybil_Aggregation_Rotation",
    clauses: [
      "Identity Disjointness",
      "Shared Sink",
      "Sub-Threshold Actions",
      "Coordinated Timing",
      "Orchestrated Sequence",
      "Signal Manipulation"
    ],
    description: "Detects scenarios where multiple seemingly separate entities coordinate to exploit system thresholds or anonymity."
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newClause, setNewClause] = useState('');

  useEffect(() => {
    fetch('/api/workshop/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        setMessage({ type: 'error', text: 'Failed to load workshop config' });
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const res = await fetch('/api/workshop/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      if (!res.ok) throw new Error('Failed to save configuration');
      
      setMessage({ type: 'success', text: 'Workshop configuration updated successfully. All system prompts will now use the new domain context.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const addClause = () => {
    if (newClause.trim()) {
      setConfig(prev => ({
        ...prev,
        clauses: [...prev.clauses, newClause.trim()]
      }));
      setNewClause('');
    }
  };

  const removeClause = (index: number) => {
    setConfig(prev => ({
      ...prev,
      clauses: prev.clauses.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[#8c8c85] font-mono text-sm animate-pulse">Loading workshop configuration...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full p-8 gap-8 overflow-y-auto scrollbar-none">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-[#121212] border border-[#2a2a24] rounded-sm">
          <Settings className="w-6 h-6 text-[#b49e6f]" />
        </div>
        <div>
          <h1 className="text-2xl font-serif italic text-[#e6e6e3]">Hermes Workshop</h1>
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#8c8c85]">
            Configure Domain Context & Parent Abstraction Patterns
          </p>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`p-4 border rounded-sm flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
            : 'bg-red-500/10 border-red-500/30 text-red-500'
        }`}>
          {message.type === 'error' ? <AlertCircle className="w-4 h-4" /> : null}
          <span className="text-xs font-mono">{message.text}</span>
        </div>
      )}

      {/* Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Core Configuration */}
        <div className="space-y-6">
          <div className="p-6 bg-[#0a0a0a] border border-[#2a2a24] rounded-sm">
            <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#b49e6f] mb-6 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Core Domain Configuration
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-mono text-[#8c8c85] uppercase tracking-widest mb-2">
                  Domain Name
                </label>
                <input
                  type="text"
                  value={config.domain}
                  onChange={(e) => setConfig(prev => ({ ...prev, domain: e.target.value }))}
                  className="w-full bg-[#121212] border border-[#2a2a24] text-[#e6e6e3] font-mono text-sm p-3 focus:outline-none focus:border-[#b49e6f]/50"
                  placeholder="e.g., Healthcare, Finance, Supply Chain"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#8c8c85] uppercase tracking-widest mb-2">
                  Parent Pattern Name
                </label>
                <input
                  type="text"
                  value={config.parentPattern}
                  onChange={(e) => setConfig(prev => ({ ...prev, parentPattern: e.target.value }))}
                  className="w-full bg-[#121212] border border-[#2a2a24] text-[#e6e6e3] font-mono text-sm p-3 focus:outline-none focus:border-[#b49e6f]/50"
                  placeholder="e.g., Temporal_Arbitrage_Exploit"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#8c8c85] uppercase tracking-widest mb-2">
                  Domain Context
                </label>
                <textarea
                  value={config.context}
                  onChange={(e) => setConfig(prev => ({ ...prev, context: e.target.value }))}
                  rows={4}
                  className="w-full bg-[#121212] border border-[#2a2a24] text-[#e6e6e3] font-mono text-xs p-3 focus:outline-none focus:border-[#b49e6f]/50 resize-none"
                  placeholder="Describe the domain context and what patterns you're looking for..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#8c8c85] uppercase tracking-widest mb-2">
                  Pattern Description
                </label>
                <textarea
                  value={config.description}
                  onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-[#121212] border border-[#2a2a24] text-[#e6e6e3] font-mono text-xs p-3 focus:outline-none focus:border-[#b49e6f]/50 resize-none"
                  placeholder="What does this parent pattern detect?"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Clauses */}
        <div className="space-y-6">
          <div className="p-6 bg-[#0a0a0a] border border-[#2a2a24] rounded-sm">
            <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#b49e6f] mb-6 flex items-center gap-2">
              Pattern Clauses
            </h2>
            
            <div className="space-y-3 mb-4">
              {config.clauses.map((clause, index) => (
                <div key={index} className="flex items-center gap-3 bg-[#121212] border border-[#2a2a24] p-3 rounded-sm">
                  <span className="text-[#b49e6f] font-mono text-xs w-6">{index + 1}.</span>
                  <span className="flex-1 text-[#e6e6e3] font-mono text-xs">{clause}</span>
                  <button
                    onClick={() => removeClause(index)}
                    className="text-red-500/50 hover:text-red-500 transition-colors text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newClause}
                onChange={(e) => setNewClause(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addClause()}
                className="flex-1 bg-[#121212] border border-[#2a2a24] text-[#e6e6e3] font-mono text-xs p-3 focus:outline-none focus:border-[#b49e6f]/50"
                placeholder="Add a new clause..."
              />
              <button
                onClick={addClause}
                className="px-4 py-2 bg-[#b49e6f]/10 border border-[#b49e6f]/30 text-[#b49e6f] text-xs font-mono hover:bg-[#b49e6f]/20 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Preset Templates */}
          <div className="p-6 bg-[#0a0a0a] border border-[#2a2a24] rounded-sm">
            <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#8c8c85] mb-4">
              Quick Templates
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Cyber/Fraud', pattern: 'Sybil_Aggregation_Rotation', clauses: ['Identity Disjointness', 'Shared Sink', 'Sub-Threshold Actions', 'Coordinated Timing'] },
                { name: 'Healthcare', pattern: 'Temporal_Claim_Cluster', clauses: ['Provider Clustering', 'Diagnosis Codes', 'Time Window', 'Billing Anomaly'] },
                { name: 'Trading', pattern: 'Market_Manipulation', clauses: ['Volume Spike', 'Price Correlation', 'Volume-Price Divergence', 'Wash Trading'] },
                { name: 'Supply Chain', pattern: 'Fraudulent_Chain', clauses: ['False Transit', 'Ghost Vendors', 'Price Inflation', 'Duplicate Invoices'] }
              ].map((template) => (
                <button
                  key={template.name}
                  onClick={() => setConfig(prev => ({
                    ...prev,
                    domain: template.name,
                    parentPattern: template.pattern,
                    clauses: template.clauses,
                    context: `Configuration for ${template.name} domain pattern detection.`
                  }))}
                  className="p-3 bg-[#121212] border border-[#2a2a24] text-[#8c8c85] text-[10px] font-mono hover:border-[#b49e6f]/50 hover:text-[#e6e6e3] transition-all text-left"
                >
                  <div className="font-bold mb-1">{template.name}</div>
                  <div className="opacity-60">{template.pattern}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-[#2a2a24]">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-3 px-6 py-3 bg-[#b49e6f]/10 border border-[#b49e6f]/50 text-[#b49e6f] text-xs font-mono uppercase tracking-widest hover:bg-[#b49e6f]/20 transition-all disabled:opacity-50"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Apply Configuration
            </>
          )}
        </button>
      </div>

      {/* Agent Endpoints Reference */}
      <div className="p-6 bg-[#0a0a0a] border border-[#2a2a24] rounded-sm">
        <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#8c8c85] mb-4">
          Agent-Endpoints Reference
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#121212] border border-[#2a2a24] rounded-sm">
            <div className="text-[10px] font-mono text-[#b49e6f] mb-2">GET /api/workshop/config</div>
            <div className="text-[10px] font-mono text-[#8c8c85]">Read current workshop configuration</div>
          </div>
          <div className="p-4 bg-[#121212] border border-[#2a2a24] rounded-sm">
            <div className="text-[10px] font-mono text-[#b49e6f] mb-2">POST /api/workshop/config</div>
            <div className="text-[10px] font-mono text-[#8c8c85]">Update domain/pattern configuration</div>
          </div>
          <div className="p-4 bg-[#121212] border border-[#2a2a24] rounded-sm">
            <div className="text-[10px] font-mono text-[#b49e6f] mb-2">DELETE /api/grimoire/skills/:id</div>
            <div className="text-[10px] font-mono text-[#8c8c85]">Prune a specific skill by ID</div>
          </div>
          <div className="p-4 bg-[#121212] border border-[#2a2a24] rounded-sm">
            <div className="text-[10px] font-mono text-[#b49e6f] mb-2">POST /api/grimoire/organize</div>
            <div className="text-[10px] font-mono text-[#8c8c85]">Atropos Shear - analyze & prune memory</div>
          </div>
          <div className="p-4 bg-[#121212] border border-[#2a2a24] rounded-sm">
            <div className="text-[10px] font-mono text-[#b49e6f] mb-2">POST /api/grimoire/clear</div>
            <div className="text-[10px] font-mono text-[#8c8c85]">Clear all skills from memory</div>
          </div>
        </div>
      </div>
    </div>
  );
};