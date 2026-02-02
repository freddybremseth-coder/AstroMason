
import React, { useState, useEffect, useContext } from 'react';
import { Sparkles, Loader2, Scroll, BookOpen, Fingerprint, Star, User, History } from './Icons';
import { AstrologyService } from '../services/astrology';
import { Language } from '../types';
import { LangContext } from '../App';
import { UI_TRANSLATIONS } from '../constants';

interface ChineseReportData {
    title: string;
    introduction: string;
    chapters: Array<{ heading: string; content: string }>;
    conclusion: string;
}

const ChineseAstrology: React.FC = () => {
  const { lang } = useContext(LangContext);
  const t = UI_TRANSLATIONS[lang];
  const [name, setName] = useState(localStorage.getItem('soul_name') || '');
  const [date, setDate] = useState(localStorage.getItem('soul_date') || '');
  const [results, setResults] = useState<any>(null);
  const [report, setReport] = useState<ChineseReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculate = async () => {
    if (!name || !date) return;
    setIsLoading(true);
    setReport(null);
    try {
        const cz = AstrologyService.calculateChineseZodiac(date);
        setResults(cz);
        const structuredReport = await AstrologyService.generateChineseReport(name, date, lang);
        setReport(structuredReport);
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoading(false);
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
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 animate-fade-in pb-32">
        <header className="text-center space-y-4">
            <h2 className="text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-red-500">{t.chineseTitle}</h2>
            <p className="text-slate-500 text-xs uppercase tracking-[0.5em] font-black">{t.chineseSubtitle}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 no-print">
                <div className="bg-[#1a0a0a]/60 backdrop-blur-xl border border-red-900/20 p-8 rounded-[3rem] shadow-2xl space-y-6">
                    <h3 className="text-red-400 text-xs uppercase tracking-widest font-black flex items-center gap-2">
                        <Fingerprint size={14} /> Dine Detaljer
                    </h3>
                    <div className="space-y-4">
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Fullt Navn" className="w-full bg-black/40 border border-red-900/20 rounded-2xl p-4 text-white focus:border-red-500 outline-none transition-all" />
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-black/40 border border-red-900/20 rounded-2xl p-4 text-white focus:border-red-500 outline-none transition-all" />
                        <button onClick={calculate} disabled={isLoading || !name || !date} className="w-full py-5 bg-gradient-to-r from-red-800 to-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:from-red-700 transition-all shadow-xl shadow-red-950/40 disabled:opacity-30">
                            {isLoading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Åpne Portalen'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
                {results && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#1a0a0a]/40 border border-red-900/20 p-6 rounded-[2.5rem] text-center">
                            <p className="text-[10px] text-red-500 uppercase font-black tracking-widest mb-2">Ditt Dyretegn</p>
                            <p className="text-3xl font-serif text-white">{results.animal}</p>
                        </div>
                        <div className="bg-[#1a0a0a]/40 border border-red-900/20 p-6 rounded-[2.5rem] text-center">
                            <p className="text-[10px] text-red-500 uppercase font-black tracking-widest mb-2">Ditt Element</p>
                            <p className="text-3xl font-serif text-white">{results.element} ({results.yinYang})</p>
                        </div>
                    </div>
                )}

                <div className="bg-[#0a0a1a] p-10 md:p-16 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden min-h-[500px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full py-20 space-y-8">
                            <Loader2 className="animate-spin text-red-500" size={64} />
                            <p className="text-2xl font-serif text-red-100 animate-pulse">AstroMason søker visdom i østen...</p>
                        </div>
                    ) : report ? (
                        <article className="max-w-none space-y-16">
                            <div className="text-center space-y-4 border-b border-red-900/20 pb-12">
                                <h1 className="text-5xl font-serif text-white">{report.title}</h1>
                                <div className="w-12 h-1 px-1 bg-red-600 mx-auto"></div>
                            </div>

                            <div className="space-y-6">
                                <p className="text-slate-300 leading-[2.2] text-xl font-light first-letter:text-7xl first-letter:font-serif first-letter:text-red-500 first-letter:mr-4 first-letter:float-left first-letter:mt-1">
                                    {report.introduction}
                                </p>
                            </div>

                            {report.chapters.map((chapter, i) => (
                                <section key={i} className="space-y-6 pt-12 border-t border-red-900/10">
                                    <h3 className="text-3xl font-serif text-red-100">{chapter.heading}</h3>
                                    <div className="text-slate-400 leading-[2.2] text-lg font-light whitespace-pre-wrap">
                                        {chapter.content}
                                    </div>
                                </section>
                            ))}

                            <div className="bg-red-950/20 p-10 rounded-[3rem] border border-red-900/20 space-y-6">
                                <h4 className="text-sm font-black uppercase tracking-widest text-red-400 flex items-center gap-2">
                                    <Star size={16} /> Visdom fra De Fire Søyler
                                </h4>
                                <p className="text-red-100 font-serif italic text-2xl leading-relaxed">
                                    {report.conclusion}
                                </p>
                            </div>

                            <footer className="pt-10 border-t border-white/5 text-center">
                                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-black">Kanalisert av AstroMason Intelligence • {new Date().toLocaleDateString()}</p>
                            </footer>
                        </article>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-4 opacity-30">
                            <BookOpen size={64} />
                            <p className="font-serif italic text-xl text-center">Tast inn dine data for å dechiffrere de fire søyler</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default ChineseAstrology;
