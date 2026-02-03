
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, User, Wallet } from './Icons';

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userEmail = localStorage.getItem('soul_email') || '';
  
  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem('tarot_credits');
    if (saved !== null) return parseInt(saved);
    // Kun kreditt for Freddy
    return userEmail === 'freddy.bremse@gmail.com' ? 200000 : 0;
  });

  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Hei! Jeg er Astro Mason AI. Jeg kan gi deg dype tolkninger av ditt kart og transitter. Hver dype analyse koster 1 kreditt.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Kun kreditt for Freddy
    if (userEmail === 'freddy.bremse@gmail.com' && credits <= 100000) {
        setCredits(prev => prev + 100000);
    }
    localStorage.setItem('tarot_credits', credits.toString());
  }, [credits, userEmail]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    if (credits < 1) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Du har dessverre 0 kreditter. Gå til innstillinger for å fylle på slik at vi kan fortsette samtalen.' }]);
        return;
    }

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
        setCredits(prev => prev - 1);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = "Dine stjerner indikerer en kraftig transformasjon i ditt 4. hus akkurat nå. Pluto beveger seg sakte gjennom Steinbukken, noe som krever at du ser på dine røtter med nye øyne. Dette er en tid for å gi slipp på gamle strukturer for å gi plass til en mer autentisk grunnmur.";
        
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Beklager, de kosmiske forbindelsene er midlertidig nede.' }]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-white dark:bg-space-800 text-gray-500 rotate-90 border border-gray-200' : 'bg-indigo-600 text-white'}`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[550px] bg-white dark:bg-space-950 border border-gray-200 dark:border-indigo-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          
          <div className="p-4 bg-gray-50 dark:bg-space-900 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h3 className="font-serif font-bold text-gray-900 dark:text-gray-100">AstroMason AI</h3>
                    <p className="text-[9px] text-green-600 font-black uppercase">Deep Analyzer</p>
                </div>
            </div>
            <div className="text-right pr-2">
                <p className="text-[8px] uppercase font-black text-slate-500">Kreditter</p>
                <p className="text-sm font-serif text-amber-600">{credits.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-space-950/50">
            {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                        : 'bg-gray-100 dark:bg-space-800 text-gray-800 dark:text-gray-200 border border-gray-200 rounded-tl-none'
                    }`}>
                        {msg.content}
                    </div>
                </div>
            ))}
            {loading && (
                <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-space-800 p-4 rounded-2xl rounded-tl-none border border-gray-200">
                        <Loader2 size={16} className="animate-spin text-indigo-500" />
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-gray-50 dark:bg-space-900 border-t border-gray-200">
            <div className="relative">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Spør om ditt horoskop (1 kreditt)..."
                    className="w-full bg-white dark:bg-space-950 border border-gray-300 dark:border-space-700 rounded-full py-3 pl-4 pr-12 text-sm focus:border-indigo-500 outline-none"
                />
                <button 
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors"
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
