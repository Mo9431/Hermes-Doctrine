import React, { useState, useRef, useEffect } from 'react';
import { DOCTRINE_SECTIONS } from '../data/doctrine';
import { BookOpen, ChevronRight, Hash, Terminal, Send } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const KnowledgeHub = () => {
  const [activeSectionId, setActiveSectionId] = useState(DOCTRINE_SECTIONS[0].id);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useLocalStorage<{role: 'user'|'assistant', text: string}[]>('hermes_architect_messages', [
    { role: 'assistant', text: "Hermes Architect online. State your dialectic query." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const activeSection = DOCTRINE_SECTIONS.find(s => s.id === activeSectionId) || DOCTRINE_SECTIONS[0];

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userMessage = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/dialectic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage, 
          doctrineContext: DOCTRINE_SECTIONS.map(s => s.content).join('\\n\\n')
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', text: `[SYSTEM_ERR] Dialectic inversion failed: ${error.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full w-full border border-[#2a2a24] bg-[#0c0c0c] rounded-sm overflow-hidden">
      {/* Sidebar / Index */}
      <div className="hidden lg:flex w-64 border-r border-[#2a2a24] bg-[#080808] flex-col">
        <div className="p-6 border-b border-[#2a2a24]">
          <h2 className="text-[10px] font-mono tracking-[0.3em] font-bold uppercase text-[#8c8c85] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#b49e6f]" />
            Doctrine Index
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-none">
          {DOCTRINE_SECTIONS.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              className={`w-full text-left p-4 transition-all flex items-start gap-3 border ${
                activeSectionId === section.id
                  ? 'border-[#b49e6f]/30 bg-[#121212] glow-accent'
                  : 'border-transparent hover:border-[#2a2a24] hover:bg-[#121212]'
              }`}
            >
              <span className={`font-mono text-[10px] mt-0.5 ${activeSectionId === section.id ? 'text-[#b49e6f]' : 'text-[#8c8c85]'}`}>
                {(idx).toString().padStart(2, '0')}
              </span>
              <span className={`text-sm font-serif italic ${activeSectionId === section.id ? 'text-[#e6e6e3]' : 'text-[#8c8c85]'}`}>
                {section.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#121212] p-8 md:p-16 scrollbar-none relative">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Hash className="w-4 h-4 text-[#b49e6f]" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#b49e6f]">Knowledge Hub / Substrate</span>
            <ChevronRight className="w-3 h-3 text-[#555]" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#8c8c85]">{activeSectionId}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif italic text-[#e6e6e3] mb-12 leading-tight">
            {activeSection.title}
          </h1>

          <div className="prose prose-invert max-w-none text-lg text-[#8c8c85] font-serif leading-relaxed space-y-6">
            {activeSection.content.split('\\n\\n').map((paragraph, i) => {
              if (paragraph.trim().startsWith('###')) {
                return <h3 key={i} className="text-2xl font-serif text-[#e6e6e3] mt-12 mb-6 border-b border-[#2a2a24] pb-2">{paragraph.replace('###', '').trim()}</h3>;
              }
              if (paragraph.trim().startsWith('**')) {
                return <p key={i} className="font-sans text-[#b49e6f] uppercase text-xs tracking-widest mt-8 mb-2 font-bold">{paragraph.replace(/\\*\\*/g, '')}</p>;
              }
              return (
                <p key={i} dangerouslySetInnerHTML={{__html: paragraph.replace(/\\*\\*(.*?)\\*\\*/g, '<strong class="text-[#e6e6e3] font-normal italic">$1</strong>')}} />
              );
            })}
          </div>

          <div className="mt-24 pt-8 border-t border-[#2a2a24] flex items-center justify-between">
            <span className="text-[9px] font-mono tracking-[0.2em] text-[#8c8c85] uppercase">
              End of Chapter
            </span>
            <div className="w-1.5 h-1.5 bg-[#b49e6f] glow-accent" />
          </div>
        </div>
      </div>

      {/* Dialectic Engine */}
      <div className="w-[400px] hidden md:flex flex-col bg-[#0a0a0a] border-l border-[#2a2a24]">
        <div className="p-6 border-b border-[#2a2a24] bg-[#121212]">
          <h2 className="text-[10px] font-mono tracking-[0.3em] font-bold uppercase text-[#b49e6f] flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Dialectic Engine
          </h2>
        </div>
        
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col gap-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <span className={`text-[8px] font-mono uppercase tracking-widest ${m.role === 'user' ? 'text-[#8c8c85]' : 'text-[#b49e6f]'}`}>
                {m.role === 'user' ? 'Operator' : 'Architect'}
              </span>
              <div className={`p-4 border ${m.role === 'user' ? 'border-[#2a2a24] bg-[#121212] text-[#e6e6e3] rounded-tl-lg rounded-bl-lg rounded-br-lg max-w-[85%]' : 'border-[#b49e6f]/20 bg-[#b49e6f]/5 text-[#b49e6f] rounded-tr-lg rounded-br-lg rounded-bl-lg font-serif italic text-sm'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex flex-col gap-2 items-start">
              <span className="text-[8px] font-mono uppercase tracking-widest text-[#b49e6f]">Architect</span>
              <div className="p-4 border border-[#b49e6f]/20 bg-[#b49e6f]/5 rounded-tr-lg rounded-br-lg rounded-bl-lg">
                <span className="animate-pulse w-1.5 h-1.5 bg-[#b49e6f] inline-block rounded-full" />
                <span className="animate-pulse delay-75 w-1.5 h-1.5 bg-[#b49e6f] inline-block rounded-full ml-1" />
                <span className="animate-pulse delay-150 w-1.5 h-1.5 bg-[#b49e6f] inline-block rounded-full ml-1" />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleChatSubmit} className="p-4 border-t border-[#2a2a24] bg-[#121212] flex gap-2">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={isTyping}
            placeholder="Query the Doctrine..."
            className="flex-1 bg-[#080808] border border-[#2a2a24] text-[#e6e6e3] text-sm font-mono px-4 py-3 focus:outline-none focus:border-[#b49e6f]/50"
          />
          <button 
            type="submit"
            disabled={isTyping}
            className="px-4 bg-[#b49e6f] text-[#080808] hover:bg-[#c4ad7d] disabled:opacity-50 transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
