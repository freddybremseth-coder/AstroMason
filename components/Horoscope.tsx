
import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, Sun, Moon, Activity, Sparkles, Loader2, Scroll, BookOpen, Fingerprint } from './Icons';
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

  const periods = [
    { id: 'day', label: t.periodDay, icon: Clock },
    { id: 'week', label: t.periodWeek, icon: Calendar },
    { id: 'month', label: t.periodMonth, icon: Moon },
    { id: 'year', label: t.periodYear, icon: Sun }
  ];

  const fetchHoroscope = async (selectedPeriod: string) => {
    if (!natalChart) return;
    setIsLoading(true);
    setReport(null);
    try {
      const text = await AstrologyService.generatePersonalizedHoroscope(natalChart, selectedPeriod, lang);
      setReport(text);
    } catch (e) {
      setReport("Kunne ikke hente de kosmiske meldingene akkurat nå.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (natalChart) {
      fetchHoroscope(period);
    }
  }, [period, natalChart]);

  if (!natalChart) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-8 animate-fade-in">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 opacity-20">
            <Fingerprint size={48} />
        </div>
        <div className="space-y-2">
            <h2 className="text-3xl font-serif text-white">Identitet mangler</h2>
            <p className="text-slate-500 font-light">Du må beregne ditt fødselshoroskop i Astrologi-fanen før AstroMason kan lese dine transitter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 animate-fade-in">
      <header className="text-center space-y-4">
        <h2 className="text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-amber-500">{t.horoscopeTitle}</h2>
        <p className="text-slate-500 text-xs uppercase tracking-[0.5em] font-black">{t.horoscopeSubtitle}</p>
      </header>

      <div className="flex flex-wrap justify-center gap-3">
        {periods.map(p => (
            <button key={p.id} onClick={() => setPeriod(p.id)} className={`px-6 py-4 rounded-2xl border flex items-center gap-3 transition-all font-black uppercase text-[10px] tracking-widest ${period === p.id ? 'bg-amber-500 border-amber-400 text-black shadow-xl shadow-amber-500/20' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}>
                <p.icon size={16} /> {p.label}
            </button>
        ))}
      </div>

      <div className="bg-[#0a0a1a] p-10 md:p-16 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden min-h-[500px]">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Sparkles size={200} />
        </div>

        {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-8 py-24">
                <Loader2 className="animate-spin text-amber-500" size={64} />
                <div className="text-center space-y-2">
                    <p className="font-serif text-2xl text-amber-100 animate-pulse">AstroMason konsulterer planetenes nåværende bane...</p>
                    <p className="text-[10px] uppercase text-slate-500 tracking-widest">Kalkulerer aspekter mot ditt natal-kart</p>
                </div>
            </div>
        ) : report ? (
            <article className="prose prose-invert prose-xl max-w-none relative z-10">
                <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Scroll size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif text-white m-0">Din sjelelige tidslinje</h3>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Periode: {periods.find(p => p.id === period)?.label}</p>
                    </div>
                </div>
                <div className="text-slate-300 leading-[2.2] font-light whitespace-pre-wrap first-letter:text-7xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-4 first-letter:float-left first-letter:mt-1">
                    {report}
                </div>
                <div className="mt-20 pt-10 border-t border-white/5 text-center italic text-slate-500 text-sm font-light">
                   Kanalisert av AstroMason Intelligence • {new Date().toLocaleDateString()}
                </div>
            </article>
        ) : null}
      </div>
    </div>
  );
};

export default Horoscope;
