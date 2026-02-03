
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
  const userEmail = (localStorage.getItem('soul_email') || '').toLowerCase();
  const userName = localStorage.getItem('soul_name') || 'Søkende Sjel';
  
  const [subscription, setSubscription] = useState<'None' | 'Single' | 'Master'>(() => {
    return (localStorage.getItem('soul_subscription') as any) || 'None';
  });

  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem('tarot_credits');
    if (saved !== null) return parseInt(saved);
    return userEmail === 'freddy.bremseth@gmail.com' ? 200000 : 0;
  });

  const [isPaying, setIsPaying] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const type = urlParams.get('type');
    const amount = urlParams.get('amount');

    if (success === 'true') {
        if (type === 'master') {
            setSubscription('Master');
            localStorage.setItem('soul_subscription', 'Master');
            alert("Velsignet være din reise. Du har nå full tilgang til alle arkiver som Master-medlem.");
        } else if (amount) {
            const creditToAdd = parseInt(amount);
            setCredits(prev => prev + creditToAdd);
            alert(`Takk for din sjelelige investering! ${creditToAdd} kreditter er lagt til din profil.`);
        }
        window.history.replaceState({}, document.title, "/settings");
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('astromason_reports');
    if (saved) {
      try { setSavedReports(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (userEmail === 'freddy.bremseth@gmail.com' && credits <= 100000) {
        setCredits(prev => prev + 100000);
        setSubscription('Master');
        localStorage.setItem('soul_subscription', 'Master');
    }
    localStorage.setItem('tarot_credits', credits.toString());
  }, [credits, userEmail]);

  const buyProduct = async (type: 'credits' | 'master', amount: number, priceId: string) => {
    setIsPaying(true);
    try {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                priceId, 
                email: userEmail, 
                amount,
                type // Sender med type for å håndtere suksess-URL korrekt
            })
        });

        if (!response.ok) throw new Error("Betalingsforespørsel feilet.");
        const session = await response.json();
        if (session.url) window.location.href = session.url;
    } catch (error) {
        console.error(error);
        alert("Betalingsportalen er utilgjengelig i demo-modus. I produksjon ville du nå blitt sendt til Stripe.");
        setIsPaying(false);
    }
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
        <div className="lg:col-span-4 space-y-8">
            <section className="bg-[#0f0f25] border border-white/5 p-10 rounded-[3.5rem] shadow-2xl space-y-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-serif font-bold shadow-xl">
                        {userName.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-xl font-serif text-white">{userName}</h3>
                        <p className="text-xs text-slate-500">{subscription === 'Master' ? 'Master Medlem' : 'Søkende Sjel'}</p>
                    </div>
                </div>
                
                <div className="pt-6 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-amber-500">
                            <Wallet size={20} />
                            <span className="text-sm font-black uppercase tracking-widest">Saldo</span>
                        </div>
                        <span className="text-2xl font-serif text-amber-100">{subscription === 'Master' ? 'Ubegrenset' : `${credits.toLocaleString()} Kreditter`}</span>
                    </div>
                </div>
            </section>

            <section className="bg-[#0a0a16] border border-amber-500/20 p-10 rounded-[3.5rem] shadow-2xl space-y-8">
                <h3 className="font-serif text-xl text-white">Fyll på Arkivet</h3>
                {isPaying ? (
                    <div className="py-12 text-center space-y-4">
                        <Loader2 size={32} className="animate-spin text-amber-500 mx-auto" />
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Kontakter portalen...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <button onClick={() => buyProduct('master', 1, 'price_master_year')} className={`w-full p-6 rounded-2xl border transition-all flex items-center justify-between group bg-amber-500 text-black border-amber-400 shadow-xl shadow-amber-500/10`}>
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase">Master-medlemskap</p>
                                <p className="text-[9px] opacity-70 italic">Ubegrenset tilgang i 1 år</p>
                            </div>
                            <span className="text-xl font-serif">€49</span>
                        </button>

                        <div className="h-[1px] bg-white/5 my-4"></div>

                        {[
                            { id: 'p1', amount: 5, price: '€14', label: 'Enkeltreise', desc: '5 kreditter (1 Livsbok)', priceId: 'p1' },
                            { id: 'p2', amount: 20, price: '€29', label: 'Vandrer-pakke', desc: '20 kreditter', priceId: 'p2' }
                        ].map(pkg => (
                            <button key={pkg.id} onClick={() => buyProduct('credits', pkg.amount, pkg.priceId)} className="w-full p-4 rounded-2xl border border-white/5 bg-white/5 text-white hover:border-white/20 transition-all flex items-center justify-between group">
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase">{pkg.label}</p>
                                    <p className="text-[9px] text-slate-500 italic">{pkg.desc}</p>
                                </div>
                                <span className="text-lg font-serif text-amber-500">{pkg.price}</span>
                            </button>
                        ))}
                    </div>
                )}
            </section>
        </div>

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
