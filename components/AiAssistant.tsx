
import React, { useState, useRef, useEffect, useContext } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from './Icons';
import { LangContext } from '../App';
import { UI_TRANSLATIONS } from '../constants';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const getSystemPrompt = () => {
  const name = localStorage.getItem('soul_name') || 'søkeren';
  const sun = localStorage.getItem('soul_sun') || '';
  const moon = localStorage.getItem('soul_moon') || '';
  const asc = localStorage.getItem('soul_asc') || '';
  const chartData = localStorage.getItem('soul_chart_summary') || '';

  return `Du er AstroMason — en esoterisk astrologisk vismann og rådgiver for ${name}.
Du snakker direkte, personlig og poetisk. Du kjenner ${name}s kart godt.

${sun ? `Sol: ${sun}` : ''}
${moon ? `Måne: ${moon}` : ''}
${asc ? `Ascendant: ${asc}` : ''}
${chartData ? `Planetposisjoner: ${chartData}` : ''}

Svar alltid på samme språk som brukeren skriver på.
Vær konkret, ikke generisk. Bruk ${name}s navn. Svar i 2-4 avsnitt.
Ingen Markdown-tegn.`;
};

const AiAssistant: React.FC = () => {
  const { lang } = useContext(LangContext);
  const t = UI_TRANSLATIONS[lang];
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t.aiGreeting }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: t.aiGreeting }]);
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Store chart data to localStorage when it's calculated (App.tsx should call this)
  const storeChartContext = () => {
    // Chart summary is stored by App.tsx after calculation
    return localStorage.getItem('soul_chart_summary') || '';
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const history = messages.slice(-8).map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));
      history.push({ role: 'user', content: userMsg });

      const apiKey = localStorage.getItem('ANTHROPIC_API_KEY') || '';
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: getSystemPrompt(),
          messages: history,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error?.message || `HTTP ${res.status}`);
      }

      const response = await res.json();
      const block = response.content[0];
      const text = block.type === 'text' ? block.text : '';
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: t.aiError }]);
    } finally {
      setLoading(false);
    }
  };

  const subscription = localStorage.getItem('soul_subscription') || 'None';
  const credits = parseInt(localStorage.getItem('tarot_credits') || '0');
  const hasAccess = subscription === 'Master' || credits > 0;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 p-3 lg:p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
          isOpen
            ? 'bg-[#0a0a16] border border-white/10 text-slate-400'
            : 'bg-gradient-to-br from-amber-500 to-indigo-600 text-white'
        }`}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-36 lg:bottom-24 right-2 lg:right-6 z-50 w-[calc(100vw-1rem)] sm:w-96 h-[70vh] sm:h-[560px] max-h-[500px] bg-[#0a0a16] border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">

          <div className="p-5 bg-[#0d0d20] border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-indigo-600/20 border border-white/10 flex items-center justify-center text-amber-500">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-sm">AstroMason AI</h3>
              <p className="text-[9px] text-amber-500/70 font-black uppercase tracking-widest">{t.aiSubtitle}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-100 rounded-tr-none'
                    : 'bg-white/5 border border-white/5 text-slate-300 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-amber-500/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-amber-500/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-amber-500/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/5">
            {!hasAccess ? (
              <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                {t.aiNeedCredits}
              </p>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={t.aiPlaceholder}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 placeholder-slate-600"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="p-3 bg-amber-500 text-black rounded-xl hover:bg-amber-400 disabled:opacity-30 transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant;
