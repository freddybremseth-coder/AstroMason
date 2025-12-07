
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, User } from './Icons';

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Hei! Jeg er Astro Mason AI. Jeg kan svare på spørsmål om horoskopet ditt basert på eksperter som Steven Forrest og Liz Greene. Hva lurer du på?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
        const savedCharts = localStorage.getItem('astroMasonCharts');
        let chartContext = {};
        if (savedCharts) {
            const charts = JSON.parse(savedCharts);
            if (charts.length > 0) {
                const latest = charts[0];
                chartContext = {
                    ascendant: latest.ascendant,
                    positions: latest.positions
                };
            }
        }

        // Simulate API response for now since we don't have a live backend in this environment
        // In production, this would hit http://127.0.0.1:8000/api/chat
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simple heuristic response simulation
        const response = "Dette er en simulert AI-respons. Koble til en backend med Gemini API-nøkkel for ekte svar.";
        
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Beklager, jeg har problemer med å nå stjernene akkurat nå.' }]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-white dark:bg-space-800 text-gray-500 dark:text-gray-400 rotate-90 border border-gray-200 dark:border-space-700' : 'bg-gold-600 text-white'}`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white dark:bg-space-950 border border-gray-200 dark:border-gold-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="p-4 bg-gray-50 dark:bg-space-900 border-b border-gray-200 dark:border-space-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-500/50 flex items-center justify-center text-gold-600 dark:text-gold-500">
                <Sparkles size={20} />
            </div>
            <div>
                <h3 className="font-serif font-bold text-gray-900 dark:text-gray-100">Astro Mason AI</h3>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
                </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-space-950/50">
            {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-gold-600 text-white rounded-tr-none shadow-md' 
                        : 'bg-gray-100 dark:bg-space-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-space-700 rounded-tl-none shadow-sm'
                    }`}>
                        {msg.content}
                    </div>
                </div>
            ))}
            {loading && (
                <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-space-800 p-3 rounded-xl rounded-tl-none border border-gray-200 dark:border-space-700">
                        <Loader2 size={16} className="animate-spin text-gold-500" />
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-gray-50 dark:bg-space-900 border-t border-gray-200 dark:border-space-800">
            <div className="relative">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Spør om ditt horoskop..."
                    className="w-full bg-white dark:bg-space-950 border border-gray-300 dark:border-space-700 rounded-full py-3 pl-4 pr-12 text-sm text-gray-900 dark:text-gray-200 focus:border-gold-500 focus:outline-none shadow-inner"
                />
                <button 
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gold-600 text-white rounded-full hover:bg-gold-700 disabled:opacity-50 disabled:hover:bg-gold-600 transition-colors shadow-sm"
                >
                    <Send size={16} />
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant;
