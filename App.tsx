import React, { useState, createContext } from 'react';
import { Sparkles, Sun, BookOpen, Fingerprint, ChevronRight, X, RotateCcw, CheckCircle, ArrowUpRight, Zap, Calendar, Layers, Hourglass, Clock, MapPin, SquareCheck } from './components/icons';
import Tarot from './components/Tarot';
import Numerology from './components/Numerology';
import { AstrologyService } from './services/astrology';
import { Language } from './types';
// --- ChatBot Import ---
import ChatBot from './components/ChatBot'; 

export const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}>({ theme: 'dark', setTheme: () => {} });

export const LangContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
}>({ lang: 'no', setLang: () => {} });

const LifeTimeline = ({ events }: { events: any[] }) => (
  <div className="relative border-l border-indigo-500/30 ml-3 space-y-8 py-4">
    {events.map((event, idx) => (
      <div key={idx} className="relative pl-8 group">
        <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border border-indigo-900 ${event.major ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)] scale-125' : 'bg-indigo-600'} transition-all group-hover:scale-150`}></div>
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
             <span className={`text-xs font-bold tracking-widest ${event.major ? 'text-amber-300' : 'text-indigo-300'}`}>{event.year}</span>
             <span className="text-xs uppercase tracking-widest text-slate-500 hidden sm:inline">|</span>
             <h4 className={`font-serif text-lg ${event.major ? 'text-white' : 'text-slate-300'}`}>{event.title}</h4>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed max-w-lg">{event.desc}</p>
      </div>
    ))}
  </div>
);

export default function AstroMasonApp() {
  const [activeTab, setActiveTab] = useState('home'); 
  const [showReport, setShowReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [reportDepth, setReportDepth] = useState('medium'); 
  
  // Input States
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isTimeUnknown, setIsTimeUnknown] = useState(false);
  const [location, setLocation] = useState('');
  
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [lang, setLang] = useState<Language>('no');

  const generateReading = async (type: string) => {
    setIsLoading(true);
    if (type === 'astro') {
        const timeToUse = isTimeUnknown ? '12:00' : time;
        
        const dummyChart = await AstrologyService.calculateChart({
            name: name || 'Gjest', 
            date: date || '1990-01-01', 
            time: timeToUse || '12:00', 
            location: location || 'Oslo', 
            houseSystem: 'Whole Sign'
        });
        
        const data = await AstrologyService.generateAIReport(dummyChart, 'natal', { 
            date: new Date().toISOString(), 
            location: location || 'Oslo',
            depth: reportDepth 
        });
        setReportData(data);
        setIsLoading(false);
        setShowReport(true);
    }
  };

  const resetApp = () => {
    setShowReport(false);
    setActiveTab('home');
    setReportData(null);
  };

  const Navbar = () => (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto h-16 bg-[#0a0a16]/90 backdrop-blur-xl border-t md:border-b border-indigo-500/10 z-50 flex justify-around md:justify-center md:gap-16 items-center px-6 shadow-2xl">
      <button onClick={() => setActiveTab('astro')} className={`flex flex-col md:flex-row items-center gap-2 ${activeTab === 'astro' ? 'text-amber-200' : 'text-slate-500 hover:text-slate-300'} transition-colors`}>
        <Sun size={20} />
        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium">Astro</span>
      </button>
      <button onClick={() => setActiveTab('timeline')} className={`flex flex-col md:flex-row items-center gap-2 ${activeTab === 'timeline' ? 'text-amber-200' : 'text-slate-500 hover:text-slate-300'} transition-colors`}>
        <Hourglass size={20} />
        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium">Tidslinje</span>
      </button>
      <button onClick={() => setActiveTab('home')} className={`relative -top-6 md:top-0 p-4 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-600 shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-300/20 text-white transform transition-transform hover:scale-110 active:scale-95`}>
        <Sparkles size={24} />
      </button>
      <button onClick={() => setActiveTab('tarot')} className={`flex flex-col md:flex-row items-center gap-2 ${activeTab === 'tarot' ? 'text-amber-200' : 'text-slate-500 hover:text-slate-300'} transition-colors`}>
        <BookOpen size={20} />
        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium">Tarot</span>
      </button>
      <button onClick={() => setActiveTab('numerology')} className={`flex flex-col md:flex-row items-center gap-2 ${activeTab === 'numerology' ? 'text-amber-200' : 'text-slate-500 hover:text-slate-300'} transition-colors`}>
         <Fingerprint size={20} />
         <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium">Tall</span>
      </button>
    </nav>
  );

  const ReportView = () => {
    if (!reportData) return null;
    return (
      <div className="min-h-screen bg-[#050511] text-slate-100 p-6 pt-24 pb-24 font-sans animate-fade-in relative z-20">
        <div className="max-w-3xl mx-auto space-y-12">
          <button onClick={resetApp} className="fixed top-6 right-6 p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-50">
            <X size={20} />
          </button>
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-900/10 text-green-300 text-[10px] tracking-[0.2em] uppercase">
              <CheckCircle size={12} />
              <span>{reportDepth === 'long' ? 'Livsbok Generert' : 'Analyse Fullført'}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-indigo-100 to-purple-200 leading-tight">
              {reportData.title}
            </h1>
          </div>
          <div className="relative p-8 rounded-2xl bg-[#0f0f25] border border-indigo-500/20 backdrop-blur-sm overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <h2 className="text-amber-200 font-serif text-lg mb-4 flex items-center gap-2">
              <Sparkles size={16} /> Kjernen
            </h2>
            <p className="text-lg leading-relaxed text-slate-300 italic">"{reportData.essence}"</p>
          </div>
          {reportData.timeline && reportData.timeline.length > 0 ? (
              <div className="space-y-12 animate-fade-in">
                  <div className="bg-indigo-950/20 rounded-xl p-6 border border-white/5">
                      <h3 className="text-xl font-serif text-indigo-200 mb-6 flex items-center gap-2">
                          <Hourglass size={20} /> Din Kosmiske Tidslinje
                      </h3>
                      <LifeTimeline events={reportData.timeline} />
                  </div>
                  <div className="space-y-8">
                    {reportData.chapters.map((chapter: any, idx: number) => (
                        <div key={idx} className="prose prose-invert max-w-none">
                            <h3 className="text-2xl font-serif text-amber-100 border-b border-white/10 pb-2 mb-4">{chapter.title}</h3>
                            <div className="text-slate-300 leading-8 text-lg whitespace-pre-wrap">{chapter.content}</div>
                        </div>
                    ))}
                  </div>
              </div>
          ) : (
              <>
                <div className="space-y-6">
                    {reportData.dignities.map((d: any, i: number) => (
                    <div key={i} className={`flex gap-4 p-4 rounded-lg border backdrop-blur-sm ${d.type === 'conflict' ? 'bg-red-950/10 border-red-500/20' : 'bg-emerald-950/10 border-emerald-500/20'}`}>
                        <div className="mt-1 shrink-0">
                            {d.type === 'conflict' ? <X size={16} className="text-red-400" /> : <RotateCcw size={16} className="text-emerald-400" />}
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{d.text}</p>
                    </div>
                    ))}
                </div>
                <div className="prose prose-invert prose-p:text-slate-300 prose-headings:font-serif prose-headings:text-indigo-200 max-w-none">
                    <h3 className="text-xl font-serif flex items-center gap-2"><ArrowUpRight size={20} className="text-indigo-400" /> Reisen & Historien</h3>
                    <div className="text-base leading-7 opacity-90 whitespace-pre-wrap">{reportData.narrative}</div>
                </div>
              </>
          )}
          <div className="bg-gradient-to-br from-[#13132b] to-[#0a0a16] p-8 rounded-2xl border border-amber-500/10 text-center space-y-6 shadow-2xl relative overflow-hidden mt-8">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
            <h3 className="text-amber-400 text-[10px] uppercase tracking-[0.2em] font-bold">AstroMason Råd</h3>
            <p className="text-xl text-white font-serif">{reportData.advice}</p>
            <div className="pt-6 border-t border-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-2">Ditt Mantra</p>
              <p className="text-lg italic text-indigo-300 font-serif">"{reportData.mantra}"</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LoadingScreen = () => (
    <div className="fixed inset-0 z-[60] bg-[#050511] flex flex-col items-center justify-center space-y-8 animate-fade-in">
      <div className="relative">
        <div className="w-24 h-24 border border-indigo-500/10 rounded-full"></div>
        <div className="absolute inset-0 w-24 h-24 border-t-2 border-indigo-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Hourglass className="text-amber-200 animate-pulse" size={24} />
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-indigo-100 font-serif text-xl animate-pulse">
            {reportDepth === 'long' ? "Skriver livets bok..." : "Konsulterer stjernene..."}
        </p>
        <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">
            {reportDepth === 'long' ? "Dette kan ta 10-20 sekunder for full dybde..." : "Analyserer aspekter"}
        </p>
      </div>
    </div>
  );

  if (isLoading) return <LoadingScreen />;
  if (showReport) return <ReportView />;

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <LangContext.Provider value={{ lang, setLang }}>
        <div className="min-h-screen bg-[#050511] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
          <style>{`
            @keyframes flip-in { 0% { transform: rotateY(90deg); opacity: 0; } 100% { transform: rotateY(0deg); opacity: 1; } }
            .animate-flip-in { animation: flip-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
            @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
          `}</style>
          
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-950/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-950/20 rounded-full blur-[120px]"></div>
            <div className="absolute top-[30%] left-[50%] transform -translate-x-1/2 w-[30%] h-[30%] bg-amber-900/10 rounded-full blur-[100px]"></div>
          </div>

          <Navbar />

          <main className="container mx-auto px-6 pt-12 pb-32 relative z-10">
            
            {activeTab === 'home' && (
              <div className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-10 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-400/20 flex items-center justify-center mb-4 ring-1 ring-white/5">
                  <Sparkles className="text-amber-100 w-8 h-8" />
                </div>
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-indigo-900/50 tracking-tight">AstroMason</h1>
                    <p className="text-sm md:text-base text-indigo-200/60 uppercase tracking-[0.3em]">Elite Astrologi & Livsdesign</p>
                </div>
                <p className="text-lg text-slate-400 max-w-md font-light leading-relaxed">Dyp innsikt i hvem du er, og et kart over hvem du blir.</p>
                <div className="flex flex-col md:flex-row gap-4 pt-8 w-full md:w-auto">
                  <button onClick={() => setActiveTab('astro')} className="px-8 py-4 rounded-full bg-white text-slate-900 font-medium hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                    <BookOpen size={18} />
                    <span>Start Livsboken</span>
                  </button>
                </div>
              </div>
            )}

            {(activeTab === 'astro' || activeTab === 'timeline') && (
              <div className="max-w-xl mx-auto animate-fade-in">
                <header className="mb-10 text-center">
                    <h2 className="text-3xl font-serif text-indigo-100">Din Livsreise</h2>
                    <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-[0.2em]">Velg dybden på din analyse</p>
                </header>
                
                <div className="bg-[#0f0f25]/80 backdrop-blur-md rounded-2xl p-8 border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                          { id: 'short', title: 'Essens', pages: 'ca 500 ord', icon: Zap },
                          { id: 'medium', title: 'Årshoroskop', pages: 'ca 1500 ord', icon: Calendar },
                          { id: 'long', title: 'Livsboken', pages: '3000+ ord', icon: Layers }
                      ].map((opt) => (
                          <button 
                            key={opt.id}
                            onClick={() => setReportDepth(opt.id)}
                            className={`p-4 rounded-xl border text-left transition-all ${reportDepth === opt.id ? 'bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-900/50' : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'}`}
                          >
                              <opt.icon size={20} className={reportDepth === opt.id ? 'text-white' : 'text-slate-400'} />
                              <div className="mt-3 font-medium text-sm text-white">{opt.title}</div>
                              <div className={`text-[10px] mt-1 ${reportDepth === opt.id ? 'text-indigo-200' : 'text-slate-500'}`}>{opt.pages}</div>
                          </button>
                      ))}
                   </div>

                   {/* Complete Input Form */}
                   <div className="space-y-4 pt-4 border-t border-white/5">
                       <div className="space-y-2">
                           <label className="block text-[10px] uppercase tracking-[0.2em] text-indigo-300/70">Navn</label>
                           <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#050511] border border-slate-800 rounded-lg p-3 text-white focus:border-indigo-500/50 outline-none" placeholder="Ditt navn" />
                       </div>
                       
                       <div className="flex gap-4">
                           <div className="flex-1 space-y-2">
                               <label className="block text-[10px] uppercase tracking-[0.2em] text-indigo-300/70">Fødselsdato</label>
                               <div className="relative">
                                   <Calendar className="absolute left-3 top-3 text-slate-500" size={16} />
                                   <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-[#050511] border border-slate-800 rounded-lg p-3 pl-10 text-white focus:border-indigo-500/50 outline-none" />
                               </div>
                           </div>
                           <div className="flex-1 space-y-2">
                               <div className="flex justify-between items-center">
                                   <label className="block text-[10px] uppercase tracking-[0.2em] text-indigo-300/70">Tidspunkt</label>
                                   <label className="flex items-center gap-1 cursor-pointer">
                                       <div className={`w-3 h-3 border rounded-sm flex items-center justify-center ${isTimeUnknown ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'}`}>
                                           {isTimeUnknown && <SquareCheck size={10} className="text-white" />}
                                       </div>
                                       <input type="checkbox" checked={isTimeUnknown} onChange={e => setIsTimeUnknown(e.target.checked)} className="hidden" />
                                       <span className="text-[9px] text-slate-500 uppercase">Vet ikke</span>
                                   </label>
                               </div>
                               <div className="relative">
                                   <Clock className={`absolute left-3 top-3 ${isTimeUnknown ? 'text-slate-700' : 'text-slate-500'}`} size={16} />
                                   <input 
                                     type="time" 
                                     value={time} 
                                     onChange={e => setTime(e.target.value)} 
                                     disabled={isTimeUnknown}
                                     className={`w-full bg-[#050511] border border-slate-800 rounded-lg p-3 pl-10 text-white focus:border-indigo-500/50 outline-none ${isTimeUnknown ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                   />
                               </div>
                           </div>
                       </div>

                       <div className="space-y-2">
                           <label className="block text-[10px] uppercase tracking-[0.2em] text-indigo-300/70">Fødested</label>
                           <div className="relative">
                               <MapPin className="absolute left-3 top-3 text-slate-500" size={16} />
                               <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-[#050511] border border-slate-800 rounded-lg p-3 pl-10 text-white focus:border-indigo-500/50 outline-none" placeholder="Oslo, Norge" />
                           </div>
                       </div>
                   </div>

                   <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-500/20">
                       <p className="text-xs text-indigo-200 leading-relaxed flex gap-2">
                           <Sparkles size={14} className="shrink-0 mt-0.5" />
                           {reportDepth === 'long' 
                             ? "Inkluderer: Omfattende dybdeanalyse (3000+ ord). Full fødselsanalyse, skyggearbeid, progresjoner og livssykluser." 
                             : reportDepth === 'medium' 
                             ? "Inkluderer: Fødselskart og årshoroskop (1500 ord)."
                             : "En konsis analyse av din sjel og kjerneenergi akkurat nå (500 ord)."}
                       </p>
                   </div>

                   <button 
                    onClick={() => generateReading('astro')}
                    disabled={!name || !date || (!time && !isTimeUnknown) || !location}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-lg uppercase tracking-[0.2em] text-xs font-bold shadow-lg shadow-indigo-900/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Generer {reportDepth === 'long' ? 'Livsboken' : 'Analyse'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'tarot' && (
              <Tarot />
            )}

            {activeTab === 'numerology' && (
              <Numerology />
            )}

          </main>
          
          {/* ChatBot lagt til nederst i strukturen */}
          <ChatBot />

        </div>
      </LangContext.Provider>
    </ThemeContext.Provider>
  );
}