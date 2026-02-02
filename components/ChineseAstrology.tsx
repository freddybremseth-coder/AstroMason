
import React, { useState, useEffect, useContext } from 'react';
import { Sparkles, Loader2, Scroll, BookOpen, Fingerprint, Star, User, History, ChevronRight, Activity, Calendar } from './Icons';
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
  const [activeMonth, setActiveMonth] = useState<number>(0);

  const calculate = async () => {
    if (!name || !date) return;
    setIsLoading(true);
    setReport(null);
    setYearlyCycle(null);
    try {
        const cz = AstrologyService.calculateChineseZodiac(date);
        setResults(cz);
        const structuredReport = await AstrologyService.generateChineseReport(name, date, lang);
        setReport(structuredReport);
        // Automatisk last årshjulet også
        loadYearlyCycle();
    } catch (e) {
        console.error(e);
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
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div className="md:col-span-4 space-y-2">
                    <label className="text-[10px] uppercase font-black text-red-500 tracking-widest ml-1 flex items-center gap-2">
                        <User size={12} /> Sjelens Navn
                    </label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Fullt Navn" className="w-full bg-black/40 border border-red-900/20 rounded-2xl p-4 text-white focus:border-red-500 outline-none transition-all placeholder:opacity-20" />
                </div>
                <div className="md:col-span-4 space-y-2">
                    <label className="text-[10px] uppercase font-black text-red-500 tracking-widest ml-1 flex items-center gap-2">
                        <Fingerprint size={12} /> Fødselsdato
                    </label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-black/40 border border-red-900/20 rounded-2xl p-4 text-white focus:border-red-500 outline-none transition-all" />
                </div>
                <div className="md:col-span-4">
                    <button onClick={calculate} disabled={isLoading || !name || !date} className="w-full py-4 bg-gradient-to-r from-red-800 to-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:from-red-700 transition-all shadow-xl shadow-red-950/40 disabled:opacity-30 flex items-center justify-center gap-3">
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><Star size={18} /> Åpne de Østlige Arkivene</>}
                    </button>
                </div>
            </div>
        </section>

        {results && (
            <div className="flex flex-wrap justify-center gap-6 animate-slide-up">
                <div className="bg-[#1a0a0a]/40 border border-red-900/20 px-10 py-6 rounded-[2.5rem] text-center min-w-[200px] backdrop-blur-sm">
                    <p className="text-[10px] text-red-500 uppercase font-black tracking-widest mb-2">Ditt Dyretegn</p>
                    <p className="text-4xl font-serif text-white">{results.animal}</p>
                </div>
                <div className="bg-[#1a0a0a]/40 border border-red-900/20 px-10 py-6 rounded-[2.5rem] text-center min-w-[200px] backdrop-blur-sm">
                    <p className="text-[10px] text-red-500 uppercase font-black tracking-widest mb-2">Ditt Element</p>
                    <p className="text-4xl font-serif text-white">{results.element} ({results.yinYang})</p>
                </div>
            </div>
        )}

        {/* YEARLY CYCLE WHEEL SECTION */}
        {(yearlyCycle || isCycleLoading) && (
            <section className="space-y-10 animate-fade-in">
                <div className="flex justify-between items-center px-4">
                    <h3 className="text-3xl font-serif text-white border-l-4 border-red-600 pl-6">Det Sykliske Årshjulet (1 år frem)</h3>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                       <Activity size={14} className="text-red-500" /> Qi-Strøm Analyse
                    </div>
                </div>

                {isCycleLoading ? (
                    <div className="h-[500px] flex flex-col items-center justify-center space-y-6 bg-[#0a0a1a] rounded-[4rem] border border-white/5">
                        <div className="relative">
                            <Loader2 className="animate-spin text-red-500" size={80} />
                            <Logo size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <p className="text-red-100 font-serif italic text-xl animate-pulse">Spinner tidens hjul...</p>
                    </div>
                ) : yearlyCycle ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center bg-[#0a0a1a]/80 p-12 md:p-16 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-red-600/5 blur-[120px] rounded-full"></div>
                        
                        {/* Wheel Graphic */}
                        <div className="relative aspect-square max-w-[450px] mx-auto group">
                            <svg viewBox="0 0 400 400" className="w-full h-full relative z-10 drop-shadow-[0_20px_50px_rgba(220,38,38,0.2)]">
                                {yearlyCycle.map((m, i) => {
                                    const angle = (i * 30) - 90;
                                    const rad = angle * Math.PI / 180;
                                    const endRad = (angle + 30) * Math.PI / 180;
                                    const x1 = 200 + 180 * Math.cos(rad);
                                    const y1 = 200 + 180 * Math.sin(rad);
                                    const x2 = 200 + 180 * Math.cos(endRad);
                                    const y2 = 200 + 180 * Math.sin(endRad);
                                    const isActive = activeMonth === i;
                                    
                                    return (
                                        <g key={i} className="cursor-pointer group/slice" onClick={() => setActiveMonth(i)}>
                                            <path 
                                                d={`M 200 200 L ${x1} ${y1} A 180 180 0 0 1 ${x2} ${y2} Z`}
                                                fill={isActive ? 'rgba(220, 38, 38, 0.4)' : 'rgba(220, 38, 38, 0.03)'}
                                                stroke={isActive ? '#ef4444' : 'rgba(220, 38, 38, 0.2)'}
                                                strokeWidth={isActive ? "2" : "1"}
                                                className="transition-all duration-500 group-hover/slice:fill-red-600/20"
                                            />
                                            <text 
                                                x={200 + 145 * Math.cos(rad + 0.26)} 
                                                y={200 + 145 * Math.sin(rad + 0.26)}
                                                fill={isActive ? '#ffffff' : '#64748b'}
                                                fontSize="9"
                                                fontWeight="bold"
                                                textAnchor="middle"
                                                transform={`rotate(${angle + 105}, ${200 + 145 * Math.cos(rad + 0.26)}, ${200 + 145 * Math.sin(rad + 0.26)})`}
                                            >
                                                {m.monthName.toUpperCase()}
                                            </text>
                                        </g>
                                    );
                                })}
                                <circle cx="200" cy="200" r="75" fill="#050511" stroke="rgba(220, 38, 38, 0.5)" strokeWidth="1" />
                                <foreignObject x="160" y="160" width="80" height="80">
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Logo size={50} />
                                    </div>
                                </foreignObject>
                            </svg>
                        </div>

                        {/* Month Info Card */}
                        <div className="space-y-10 animate-fade-in" key={activeMonth}>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="w-12 h-[1px] bg-red-600"></span>
                                    <p className="text-red-500 font-black uppercase tracking-[0.4em] text-[10px]">{yearlyCycle[activeMonth].monthName}</p>
                                </div>
                                <h4 className="text-5xl font-serif text-white leading-tight">{yearlyCycle[activeMonth].theme}</h4>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span>Qi-Kraft Nivå</span>
                                    <span className="text-red-400">{yearlyCycle[activeMonth].qiLevel}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-red-900 to-red-500 transition-all duration-1000" 
                                        style={{ width: `${yearlyCycle[activeMonth].qiLevel}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="p-10 bg-gradient-to-br from-[#1a0a0a] to-transparent rounded-[3rem] border border-red-900/10 shadow-inner">
                                <p className="text-slate-300 leading-[2] text-xl font-light italic">
                                    "{yearlyCycle[activeMonth].guidance}"
                                </p>
                            </div>
                            
                            <div className="flex gap-4">
                                <button onClick={() => setActiveMonth((activeMonth - 1 + 12) % 12)} className="w-16 h-16 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-all text-slate-400 border border-white/5 group">
                                    <ChevronRight size={24} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                                </button>
                                <button onClick={() => setActiveMonth((activeMonth + 1) % 12)} className="w-16 h-16 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-all text-slate-400 border border-white/5 group">
                                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </section>
        )}

        {/* AI Report Section */}
        <div className="bg-[#0a0a1a] p-12 md:p-24 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden min-h-[600px]">
            <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
                <Star size={400} />
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full py-40 space-y-10">
                    <div className="relative">
                        <Loader2 className="animate-spin text-red-500 opacity-20" size={120} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Logo size={60} />
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-3xl font-serif text-red-100 animate-pulse">AstroMason søker visdom i østen...</p>
                        <p className="text-xs uppercase text-slate-500 tracking-[0.4em]">De fire søyler dechiffreres</p>
                    </div>
                </div>
            ) : report ? (
                <article className="max-w-4xl mx-auto space-y-24">
                    <header className="text-center space-y-8 border-b border-red-900/20 pb-16">
                        <h1 className="text-6xl md:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-red-400 leading-tight">{report.title}</h1>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[1px] w-12 bg-red-900/50"></div>
                            <p className="text-red-500 uppercase tracking-[0.3em] text-xs font-black">Den Østlige Kronike</p>
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

                    <footer className="pt-20 border-t border-white/5 text-center flex flex-col items-center gap-6">
                        <Logo size={60} className="opacity-40 grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer" />
                        <p className="text-[10px] text-slate-700 uppercase tracking-[0.5em] font-black">Kanalisert av AstroMason Intelligence • {new Date().toLocaleDateString('no-NO')}</p>
                    </footer>
                </article>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-700 space-y-8 py-32 opacity-20">
                    <BookOpen size={100} />
                    <div className="text-center space-y-2">
                        <p className="font-serif italic text-3xl">Arkivene venter på ditt avtrykk</p>
                        <p className="text-xs uppercase tracking-widest">Tast inn dine data for å dechiffrere de fire søyler</p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default ChineseAstrology;
