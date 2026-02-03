
import React, { useState, useContext, useEffect } from 'react';
import { User, Shield, Save, Key, Moon, Sun, Monitor, Wallet, ChevronRight, Loader2, History, BookOpen, Trash2, X, Printer, Star, Zap, Activity, MessageCircle, Sparkles } from './Icons';
import { ThemeContext, LangContext } from '../App';

interface SavedReport {
  id: string;
  title: string;
  date: string;
  type: string;
  content: string; 
}

const Settings: React.FC = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { lang } = useContext(LangContext);
  const userEmail = localStorage.getItem('soul_email') || '';
  const userName = localStorage.getItem('soul_name') || 'Søkende Sjel';
  
  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem('tarot_credits');
    return saved !== null ? parseInt(saved) : (userEmail === 'freddy.bremseth@gmail.com' ? 200000 : 0);
  });

  const [isPaying, setIsPaying] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('astromason_reports');
    if (saved) {
      try { setSavedReports(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    // Freddy-regel: Hvis balansen er 100 000 eller mindre, legg til 100 000
    if (userEmail === 'freddy.bremseth@gmail.com' && credits <= 100000) {
        setCredits(prev => prev + 100000);
    }
    localStorage.setItem('tarot_credits', credits.toString());
  }, [credits, userEmail]);

  const buyCredits = (amount: number) => {
    setIsPaying(true);
    setTimeout(() => {
        setCredits(prev => prev + amount);
        setIsPaying(false);
    }, 1500);
  };

  const deleteReport = (id: string) => {
    if(confirm("Er du sikker på at du vil slette denne innsikten fra arkivet?")) {
        const updated = savedReports.filter(r => r.id !== id);
        setSavedReports(updated);
        localStorage.setItem('astromason_reports', JSON.stringify(updated));
    }
  };

  const openReport = (saved: SavedReport) => {
    try {
        const parsed = JSON.parse(saved.content);
        setSelectedReport({ ...parsed, meta: saved });
    } catch (e) {
        setSelectedReport({
            report: { title: saved.title, essenceSummary: saved.content },
            meta: saved
        });
    }
  };

  if (selectedReport) return (
    <div className="max-w-4xl mx-auto py-12 animate-fade-in space-y-12 pb-32">
        <div className="bg-[#0a0a1a] p-12 md:p-20 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <button onClick={() => setSelectedReport(null)} className="absolute top-8 left-8 p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all text-slate-400 no-print">
                <X size={20} />
            </button>
            <div className="absolute top-8 right-8 flex gap-3 no-print">
                <button onClick={() => window.print()} className="p-3 bg-amber-500/10 rounded-full hover:bg-amber-500/20 transition-all text-amber-500 flex items-center gap-2 px-6">
                    <Printer size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">PDF / Utskrift</span>
                </button>
            </div>
            <header className="text-center space-y-4 mb-16">
                <h1 className="text-5xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-amber-500 leading-tight">
                    {selectedReport.report?.title || selectedReport.meta.title}
                </h1>
                <p className="text-sm uppercase tracking-widest text-slate-500 font-black">
                    {new Date(selectedReport.meta.date).toLocaleDateString()} • {selectedReport.meta.type}
                </p>
            </header>
            <article className="prose prose-invert prose-xl max-w-none text-slate-300 leading-[2.2] font-light whitespace-pre-wrap">
                <div className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-3 first-letter:float-left mb-12">
                    {selectedReport.report?.essenceSummary}
                </div>
            </article>
        </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-32">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <h2 className="text-5xl font-serif font-bold text-white">Sjelelig Kontroll</h2>
          <p className="text-slate-500 text-sm uppercase tracking-widest font-black">Administrer dine kosmiske data og ressurser</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* User & Credit Store */}
        <div className="lg:col-span-4 space-y-8">
            <section className="bg-[#0f0f25] border border-white/5 p-10 rounded-[3.5rem] shadow-2xl space-y-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-serif font-bold shadow-xl">
                        {userName.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-xl font-serif text-white">{userName}</h3>
                        <p className="text-xs text-slate-500">{userEmail}</p>
                    </div>
                </div>
                
                <div className="pt-6 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-amber-500">
                            <Wallet size={20} />
                            <span className="text-sm font-black uppercase tracking-widest">Kreditt-balanse</span>
                        </div>
                        <span className="text-2xl font-serif text-amber-100">{credits.toLocaleString()}</span>
                    </div>
                </div>
            </section>

            <section className="bg-[#0a0a16] border border-amber-500/20 p-10 rounded-[3.5rem] shadow-2xl space-y-8">
                <h3 className="font-serif text-xl text-white">Kjøp Kreditter</h3>
                {isPaying ? (
                    <div className="py-12 text-center space-y-4">
                        <Loader2 size={32} className="animate-spin text-amber-500 mx-auto" />
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Behandler transaksjon...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {[
                            { id: 1, amount: 1, price: '€2', label: '1 Reise' },
                            { id: 5, amount: 5, price: '€5', label: '5 Reiser (Populær)', best: true },
                            { id: 20, amount: 20, price: '€10', label: '20 Reiser (Verdi)' },
                            { id: 200, amount: 200, price: '€50', label: 'Mester-pakke' }
                        ].map(pkg => (
                            <button key={pkg.id} onClick={() => buyCredits(pkg.amount)} className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${pkg.best ? 'bg-amber-500/10 border-amber-500/50' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase text-white">{pkg.label}</p>
                                    <p className="text-[9px] text-slate-500 italic">Spar opptil 40%</p>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                    <span className="text-lg font-serif text-amber-500">{pkg.price}</span>
                                    <ChevronRight size={14} className="text-slate-700 group-hover:text-amber-500" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </section>

            <section className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Kosmisk Prisliste</h4>
                <ul className="space-y-3">
                    {[
                        { icon: Sparkles, label: 'Tarot-legg', cost: '1 Kreditt' },
                        { icon: Activity, label: 'Relokasjons-analyse', cost: '1 Kreditt' },
                        { icon: Zap, label: '7-Dagers Prognose', cost: '1 Kreditt' },
                        { icon: MessageCircle, label: 'Dyp AI-tolkning', cost: '1 Kreditt' },
                        { icon: BookOpen, label: 'Komplett Livsbok', cost: '5 Kreditter' },
                    ].map((item, i) => (
                        <li key={i} className="flex items-center justify-between text-[11px]">
                            <span className="flex items-center gap-2 text-slate-400"><item.icon size={12} className="text-indigo-500" /> {item.label}</span>
                            <span className="text-white font-bold">{item.cost}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </div>

        {/* Reports Archive */}
        <div className="lg:col-span-8 space-y-8">
            <section className="bg-white/[0.02] border border-white/5 p-10 rounded-[4rem] shadow-2xl min-h-[600px] flex flex-col">
                <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-4 text-indigo-400">
                        <History size={32} />
                        <h3 className="font-serif text-3xl">Dine Lagrede Innsikter</h3>
                    </div>
                </div>

                {savedReports.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-10 space-y-6 text-center">
                        <BookOpen size={100} />
                        <p className="font-serif italic text-2xl">Arkivet er foreløpig tomt</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[650px] pr-4 custom-scrollbar">
                        {savedReports.map((report) => (
                            <div key={report.id} className="bg-[#0a0a1a]/80 border border-white/5 p-6 rounded-[2.5rem] group hover:border-amber-500/30 transition-all flex flex-col justify-between">
                                <div className="space-y-1 mb-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">{report.type}</span>
                                        <span className="text-[9px] text-slate-600 font-black uppercase">{new Date(report.date).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="text-lg font-serif text-white group-hover:text-amber-100 transition-colors">{report.title}</h4>
                                </div>
                                <div className="flex gap-2 border-t border-white/5 pt-4">
                                    <button onClick={() => openReport(report)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Åpne</button>
                                    <button onClick={() => deleteReport(report.id)} className="p-3 bg-red-900/10 hover:bg-red-900/20 border border-red-900/20 rounded-xl text-red-500 transition-all"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
