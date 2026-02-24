
import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, Sun, Moon, Activity, Sparkles, Loader2, Scroll, BookOpen, Fingerprint, Printer, Wallet } from './Icons';
import { AstrologyService } from '../services/astrology';
import { CalculatedChart, Language } from '../types';
import { LangContext } from '../App';
import { UI_TRANSLATIONS } from '../constants';

interface HoroscopeProps {
  natalChart: CalculatedChart | null;
}

const Horoscope: React.FC<HoroscopeProps> = ({ natalChart }) => {
  const { lang } = useContext(LangContext);
  const t = UI_TRANSLATIONS[lang];
  const [period, setPeriod] = useState<string>('day');
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const periods = [
    { id: 'day', label: t.periodDay, icon: Clock },
    { id: 'week', label: t.periodWeek, icon: Calendar },
    { id: 'month', label: t.periodMonth, icon: Moon },
    { id: 'year', label: t.periodYear, icon: Sun }
  ];

  const fetchHoroscope = async (selectedPeriod: string) => {
    if (!natalChart) return;

    const sub = localStorage.getItem('soul_subscription');
    const credits = parseInt(localStorage.getItem('tarot_credits') || '0');
    const COST = 1;

    if (sub !== 'Master' && credits < COST) {
        setShowDemo(true);
        setReport(null);
        return;
    }

    setShowDemo(false);
    setIsLoading(true);
    setReport(null);
    try {
      const text = await AstrologyService.generatePersonalizedHoroscope(natalChart, selectedPeriod, lang);
      
      if (sub !== 'Master') {
          const newCredits = credits - COST;
          localStorage.setItem('tarot_credits', newCredits.toString());
          window.dispatchEvent(new Event('storage'));
      }

      setReport(text);
    } catch (e) {
      setReport("Kunne ikke hente de kosmiske meldingene akkurat nå.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setReport(null);
    setShowDemo(false);
  }, [lang]);

  const handleGenerate = () => {
      fetchHoroscope(period);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
      <div className="flex flex-col items-center gap-8 no-print">
        <div className="flex flex-wrap justify-center gap-3">
            {periods.map(p => (
                <button key={p.id} onClick={() => { setPeriod(p.id); setReport(null); setShowDemo(false); }} className={`px-6 py-4 rounded-2xl border flex items-center gap-3 transition-all font-black uppercase text-[10px] tracking-widest ${period === p.id ? 'bg-amber-500 border-amber-400 text-black shadow-xl shadow-amber-500/20' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}>
                    <p.icon size={16} /> {p.label}
                </button>
            ))}
        </div>

        <button 
            onClick={handleGenerate} 
            disabled={isLoading}
            className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-indigo-900/40 flex items-center gap-3"
        >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><Sparkles size={18} /> Generer Personlig Tolkning</>}
        </button>
        <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Koster 1 Kreditt</p>
      </div>

      <div className="bg-[#0a0a1a] p-10 md:p-16 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden min-h-[400px]">
        <div className="absolute top-8 right-8 no-print">
            {report && (
                <button onClick={() => window.print()} className="p-3 bg-amber-500/10 rounded-full hover:bg-amber-500/20 transition-all text-amber-500 flex items-center gap-2 px-6">
                    <Printer size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">PDF / Utskrift</span>
                </button>
            )}
        </div>

        {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-8 py-24">
                <Loader2 className="animate-spin text-amber-500" size={64} />
                <div className="text-center space-y-2">
                    <p className="font-serif text-2xl text-amber-100 animate-pulse">AstroMason konsulterer planetene...</p>
                    <p className="text-[10px] uppercase text-slate-500 tracking-widest">Kalkulerer aspekter for {periods.find(p => p.id === period)?.label}</p>
                </div>
            </div>
        ) : showDemo ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
                <div className="p-6 bg-white/5 rounded-full text-amber-500/30">
                    <Wallet size={64} />
                </div>
                <div className="space-y-4 max-w-md">
                    <h3 className="text-3xl font-serif text-white">Personlig tolkning krever kreditter</h3>
                    <p className="text-slate-400 font-light leading-relaxed">
                        AstroMason AI bruker dype nevrale nettverk for å tolke dine spesifikke transitter. Denne prosessen krever kosmiske kreditter.
                    </p>
                </div>
                <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'settings' }))}
                    className="px-10 py-4 bg-amber-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-amber-400 transition-all"
                >
                    Gå til arkivet og fyll på
                </button>
            </div>
        ) : report ? (
            <article className="prose prose-invert prose-xl max-w-none relative z-10">
                <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Scroll size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-white m-0 uppercase tracking-widest">SJELELIG TIDSLINJE</h3>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Periode: {periods.find(p => p.id === period)?.label}</p>
                    </div>
                </div>
                <div className="text-slate-300 leading-[2.2] font-light whitespace-pre-wrap">
                    {report}
                </div>
                <div className="mt-20 pt-10 border-t border-white/5 text-center italic text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                   Kanalisert av AstroMason Intelligence • {new Date().toLocaleDateString()}
                </div>
            </article>
        ) : (
            <div className="h-full flex flex-col items-center justify-center py-32 opacity-10 space-y-6">
                <Sparkles size={100} />
                <p className="font-serif italic text-2xl">Velg en periode og generer din tolkning</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Horoscope;
