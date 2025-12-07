import { useState, useRef, useEffect } from 'react';
import { SparklesIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string}[]>([
    { role: 'assistant', content: 'Hei! Jeg er ChatGenius AI. Spør meg om våre tjenester eller last opp dokumentasjon du lurer på.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null); // Husker samtalen
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll til bunn ved ny melding
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      // VIKTIG: Bytt ut URL med adressen til din PHP-fil på Hostinger
      const response = await fetch('https://chatgenius.pro/api/chat_api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: userMsg,
            threadId: threadId // Vi sender med tråd-ID hvis vi har den
        })
      });
      
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      // Lagre tråd-ID for neste melding
      if (data.threadId) setThreadId(data.threadId);

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Beklager, jeg mistet forbindelsen. Prøv igjen senere." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Vindu */}
      {isOpen && (
        <div className="mb-4 w-[350px] h-[500px] bg-[#0a0a0a] border border-purple-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900 to-black p-4 flex justify-between items-center border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-yellow-400 p-[1px]">
                 <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                    <SparklesIcon className="w-4 h-4 text-purple-400" />
                 </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">ChatGenius</h3>
                <span className="text-green-400 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Meldinger */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/90">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white rounded-tr-none' 
                    : 'bg-gray-800 text-gray-200 rounded-tl-none border border-white/10'
                }`}>
                  {/* Her kan du legge til Markdown-støtte senere for penere tekst */}
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-white/10 flex gap-1 items-center">
                    <span className="text-xs text-gray-400 mr-2">Tenker</span>
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-200"></span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input felt */}
          <div className="p-4 bg-black border-t border-white/10">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Spør om våre tjenester..."
                className="w-full bg-gray-900 text-white rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 border border-white/10 placeholder-gray-500"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 rounded-full hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <PaperAirplaneIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flytende Knapp */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg shadow-purple-900/40 flex items-center justify-center hover:scale-110 transition-transform group relative"
        >
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          <SparklesIcon className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
}