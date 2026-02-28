
import React, { useState, useEffect, useContext } from 'react';
import { Sparkles, Loader2, Scroll, BookOpen, Fingerprint, Star, User, History, ChevronRight, Activity, Calendar, Printer, Wallet, Zap } from './Icons';
import { AstrologyService } from '../services/astrology';
import { Language } from '../types';
import { LangContext } from '../App';
import { UI_TRANSLATIONS } from '../constants';
import Logo from './Logo';

interface ChineseReportData {
    title: string;
    introduction: string;
    chapters: Array<{ heading: string; content: string }>;
    conclusion: string;
}

interface MonthlyEnergy {
    monthName: string;
    theme: string;
    qiLevel: number;
    guidance: string;
}

const ChineseAstrology: React.FC = () => {
  const { lang } = useContext(LangContext);
  const t = UI_TRANSLATIONS[lang];
  const [name, setName] = useState(localStorage.getItem('soul_name') || '');
  const [date, setDate] = useState(localStorage.getItem('soul_date') || '');
  const [results, setResults] = useState<any>(null);
  const [report, setReport] = useState<ChineseReportData | null>(null);
  const [yearlyCycle, setYearlyCycle] = useState<MonthlyEnergy[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCycleLoading, setIsCycleLoading] = useState(false);
  
  const COST = 3;

  useEffect(() => {
    setReport(null);
    setYearlyCycle(null);
    setResults(null);
  }, [lang]);

  const calculate = async () => {
    if (!name || !date) return;

    const sub = localStorage.getItem('soul_subscription');
    const credits = parseInt(localStorage.getItem('tarot_credits') || '0');

    if (sub !== 'Master' && credits < COST) {
        alert((t.chineseCreditsNeeded || '').replace('{n}', String(COST)));
        window.dispatchEvent(new CustomEvent('navigate', { detail: 'settings' }));
        return;
    }

    setIsLoading(true);
    setReport(null);
    setYearlyCycle(null);
    try {
        const cz = AstrologyService.calculateChineseZodiac(date);
        setResults(cz);
        const structuredReport = await AstrologyService.generateChineseReport(name, date, lang);
        
        if (sub !== 'Master') {
            localStorage.setItem('tarot_credits', (credits - COST).toString());
            window.dispatchEvent(new Event('storage'));
        }

        setReport(structuredReport);
        loadYearlyCycle();
    } catch (e) {
        console.error(e);
        alert(t.chineseConnectionError || 'Connection error');
    } finally {
        setIsLoading(false);
    }
  };

  const loadYearlyCycle = async () => {
    if (!name || !date) return;
    setIsCycleLoading(true);
    try {
        const cycle = await AstrologyService.generateChineseYearlyCycle(name, date, lang);
        setYearlyCycle(cycle.months);
    } catch (e) {
        console.error(e);
    } finally {
        setIsCycleLoading(false);
    }
  };

  useEffect(() => {
    const savedName = localStorage.getItem('soul_name');
    const savedDate = localStorage.getItem('soul_date');
    if (savedName && savedDate) {
        setName(savedName);
        setDate(savedDate);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12 animate-fade-in pb-32">
        <header className="flex flex-col items-center gap-6 mb-16">
            <Logo size={100} className="mb-2 ring-4 ring-red-500/20 ring-offset-4 ring-offset-[#050511]" />
            <div className="text-center space-y-2">
                <h2 className="text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-red-500">Astro Mason</h2>
                <p className="text-slate-500 text-sm uppercase tracking-[0.6em] font-black">{t.chineseTitle}</p>
            </div>
        </header>

        {/* Input Bar */}
        <section className="bg-[#1a0a0a]/60 backdrop-blur-xl border border-red-900/20 p-8 rounded-[3rem] shadow-2xl no-print">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-4 space-y-3">
                    <label className="text-[10px] uppercase font-black text-red-500 tracking-widest ml-1 flex items-center gap-2">
                        <User size={12} /> Sjelens Navn
                    </label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Fullt Navn" className="w-full bg-black/40 border border-red-900/20 rounded-2xl p-4 text-white focus:border-red-500 outline-none transition-all placeholder:opacity-20" />
                </div>
                <div className="md:col-span-4 space-y-3">
                    <label className="text-[10px] uppercase font-black text-red-500 tracking-widest ml-1 flex items-center gap-2">
                        <Fingerprint size={12} /> Fødselsdato
                    </label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-black/40 border border-red-900/20 rounded-2xl p-4 text-white focus:border-red-500 outline-none transition-all" />
                </div>
                <div className="md:col-span-4 space-y-3">
                    <button onClick={calculate} disabled={isLoading || !name || !date} className="w-full py-4 bg-gradient-to-r from-red-800 to-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:from-red-700 transition-all shadow-xl shadow-red-950/40 disabled:opacity-30 flex items-center justify-center gap-3">
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><Star size={18} /> Analyser Østlig Sjel</>}
                    </button>
                    <p className="text-[9px] text-center text-slate-500 font-black uppercase tracking-widest">{COST} Kreditter</p>
                </div>
            </div>
        </section>

        {results && (
            <div className="flex flex-wrap justify-center gap-6 animate-slide-up">
                <div className="bg-[#1a0a0a]/40 border border-red-900/20 px-10 py-6 rounded-[2.5rem] text-center min-w-[220px] backdrop-blur-sm">
                    <p className="text-[10px] text-red-500 uppercase font-black tracking-widest mb-2">Ditt Dyretegn</p>
                    <p className="text-4xl font-serif text-white">{results.animal}</p>
                </div>
                <div className="bg-[#1a0a0a]/40 border border-red-900/20 px-10 py-6 rounded-[2.5rem] text-center min-w-[220px] backdrop-blur-sm">
                    <p className="text-[10px] text-red-500 uppercase font-black tracking-widest mb-2">Ditt Element</p>
                    <p className="text-4xl font-serif text-white">{results.element} ({results.yinYang})</p>
                </div>
            </div>
        )}

        {/* AI Report Section */}
        {(report || isLoading) && (
            <div className="bg-[#0a0a1a] p-12 md:p-24 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden min-h-[600px]">
                <div className="absolute top-8 right-8 flex gap-3 no-print">
                    <button onClick={() => window.print()} className="p-3 bg-red-500/10 rounded-full hover:bg-red-500/20 transition-all text-red-500 flex items-center gap-2 px-6">
                        <Printer size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">PDF / Utskrift</span>
                    </button>
                </div>
                
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-40 space-y-8">
                        <Loader2 size={64} className="animate-spin text-red-500" />
                        <p className="font-serif text-2xl text-red-100 italic">Østlige arkiver dechiffreres...</p>
                    </div>
                )}

                {report && (
                    <article className="max-w-4xl mx-auto space-y-24">
                        <header className="text-center space-y-8 border-b border-red-900/20 pb-16">
                            <h1 className="text-5xl md:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-red-400 leading-tight">{report.title}</h1>
                            <div className="flex items-center justify-center gap-4">
                                <div className="h-[1px] w-12 bg-red-900/50"></div>
                                <p className="text-red-500 uppercase tracking-[0.3em] text-[10px] font-black">Den Østlige Kronike</p>
                                <div className="h-[1px] w-12 bg-red-900/50"></div>
                            </div>
                        </header>

                        <div className="space-y-12">
                            <p className="text-slate-300 leading-[2.4] text-2xl font-light first-letter:text-9xl first-letter:font-serif first-letter:text-red-500 first-letter:mr-6 first-letter:float-left first-letter:mt-2 italic">
                                {report.introduction}
                            </p>
                        </div>

                        {report.chapters.map((chapter, i) => (
                            <section key={i} className="space-y-10 pt-20 border-t border-red-900/10 group">
                                <div className="flex items-center gap-6">
                                    <span className="text-5xl font-serif text-red-900/30 group-hover:text-red-500/30 transition-colors">0{i+1}</span>
                                    <h3 className="text-4xl font-serif text-red-100">{chapter.heading}</h3>
                                </div>
                                <div className="text-slate-400 leading-[2.4] text-xl font-light whitespace-pre-wrap">
                                    {chapter.content}
                                </div>
                            </section>
                        ))}

                        <div className="bg-red-950/20 p-16 rounded-[4rem] border border-red-900/30 space-y-8 relative overflow-hidden group shadow-inner">
                            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                                <Sparkles size={200} />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-red-400 flex items-center gap-3">
                                <Star size={16} /> Visdom fra De Fire Søyler
                            </h4>
                            <p className="text-red-100 font-serif italic text-3xl md:text-4xl leading-relaxed relative z-10">
                                "{report.conclusion}"
                            </p>
                        </div>

                        {/* 12 Month Energy Cycle Display */}
                        <div className="pt-32 space-y-12">
                            <div className="text-center space-y-2">
                                <h3 className="text-5xl font-serif text-white">Ditt Kosmiske Årshjul</h3>
                                <p className="text-[10px] uppercase font-black text-red-500 tracking-[0.4em]">Sjelelig energiprognose</p>
                            </div>

                            {isCycleLoading ? (
                                <div className="py-20 text-center space-y-4">
                                    <Loader2 className="animate-spin text-red-500 mx-auto" size={40} />
                                    <p className="text-xs italic text-slate-500 font-light">Kanaliserer månedlige strømninger...</p>
                                </div>
                            ) : yearlyCycle ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                                    {yearlyCycle.map((month, i) => (
                                        <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-6 hover:bg-white/[0.04] transition-all group">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{month.monthName}</p>
                                                    <h4 className="text-2xl font-serif text-red-100">{month.theme}</h4>
                                                </div>
                                                <div className="bg-red-500/10 px-3 py-1 rounded-full text-red-500 text-[10px] font-bold border border-red-500/20">
                                                    Qi: {month.qiLevel}/10
                                                </div>
                                            </div>
                                            
                                            <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-red-900 to-red-500" style={{ width: `${month.qiLevel * 10}%` }}></div>
                                            </div>

                                            <p className="text-slate-400 text-sm font-light leading-relaxed italic">
                                                {month.guidance}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </article>
                )}
            </div>
        )}
    </div>
  );
};

export default ChineseAstrology;
