
import React, { useState, useEffect, useContext } from 'react';
import { Fingerprint, RotateCcw, Sparkles, Loader2, BookOpen, Scroll, Star, Shield, Activity, Calendar, Zap, ChevronRight, Info, Award } from './Icons';
import { GoogleGenAI } from "@google/genai";
import { LangContext } from '../App';
import { UI_TRANSLATIONS } from '../constants';

interface AdvancedNumerologyResults {
    lifePath: number;
    expression: number;
    soulUrge: number;
    personality: number;
    maturity: number;
    pinnacles: number[];
    challenges: number[];
    isKarmic: {
        lifePath: boolean;
        expression: boolean;
        soulUrge: boolean;
        personality: boolean;
    };
}

const Numerology: React.FC = () => {
  const { lang } = useContext(LangContext);
  const t = UI_TRANSLATIONS[lang];
  const [birthDate, setBirthDate] = useState(localStorage.getItem('soul_date') || "");
  const [fullName, setFullName] = useState(localStorage.getItem('soul_name') || "");
  const [results, setResults] = useState<AdvancedNumerologyResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [deepAnalysis, setDeepAnalysis] = useState<string | null>(null);

  const reduceNumber = (num: number, masterNumbers = [11, 22, 33]): number => {
      if (masterNumbers.includes(num)) return num;
      let s = num;
      while (s > 9 && !masterNumbers.includes(s)) {
          s = s.toString().split('').map(Number).reduce((a, b) => a + b, 0);
      }
      return s;
  };

  const isKarmicDebt = (num: number) => [13, 14, 16, 19].includes(num);

  const calculateNumerology = async () => {
    if (!birthDate || !fullName) return;
    setIsCalculating(true);
    setDeepAnalysis(null);
    
    const [year, month, day] = birthDate.split('-').map(Number);
    const rDay = reduceNumber(day);
    const rMonth = reduceNumber(month);
    const rYear = reduceNumber(year.toString().split('').map(Number).reduce((a, b) => a + b, 0));
    const lpRaw = rDay + rMonth + rYear;
    const lp = reduceNumber(lpRaw);

    const pythagoreanMap: Record<string, number> = {
        a:1, j:1, s:1, b:2, k:2, t:2, c:3, l:3, u:3, d:4, m:4, v:4, e:5, n:5, w:5, f:6, o:6, x:6, g:7, p:7, y:7, h:8, q:8, z:8, i:9, r:9
    };
    const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
    const chars = fullName.toLowerCase().replace(/[^a-z]/g, '').split('');
    
    const expRaw = chars.map(c => pythagoreanMap[c] || 0).reduce((a, b) => a + b, 0);
    const soulRaw = chars.filter(c => vowels.includes(c)).map(c => pythagoreanMap[c] || 0).reduce((a, b) => a + b, 0);
    const persRaw = chars.filter(c => !vowels.includes(c)).map(c => pythagoreanMap[c] || 0).reduce((a, b) => a + b, 0);

    const exp = reduceNumber(expRaw);
    const soul = reduceNumber(soulRaw);
    const pers = reduceNumber(persRaw);
    const mat = reduceNumber(lp + exp);

    const p1 = reduceNumber(rMonth + rDay);
    const p2 = reduceNumber(rDay + rYear);
    const p3 = reduceNumber(p1 + p2);
    const p4 = reduceNumber(rMonth + rYear);

    const c1 = Math.abs(rMonth - rDay);
    const c2 = Math.abs(rDay - rYear);
    const c3 = Math.abs(c1 - c2);
    const c4 = Math.abs(rMonth - rYear);

    setResults({
        lifePath: lp,
        expression: exp,
        soulUrge: soul,
        personality: pers,
        maturity: mat,
        pinnacles: [p1, p2, p3, p4],
        challenges: [c1, c2, c3, c4],
        isKarmic: {
            lifePath: isKarmicDebt(lpRaw),
            expression: isKarmicDebt(expRaw),
            soulUrge: isKarmicDebt(soulRaw),
            personality: isKarmicDebt(persRaw)
        }
    });

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Generer "Livsboken" (Grimoire) for ${fullName}. 
            DATA: Livsvei ${lp}, Uttrykk ${exp}, Soul Urge ${soul}, Personlighet ${pers}, Modenhet ${mat}.
            Karmiske Gjeldstall funnet: ${isKarmicDebt(lpRaw) ? '13/4' : ''} ${isKarmicDebt(expRaw) ? '14/5' : ''}.
            Pinnacles: ${p1}, ${p2}, ${p3}, ${p4}.
            SPRÅK: ${lang === 'no' ? 'Norsk' : 'Engelsk'}.
            MÅL: 2500+ ord dyp esoterisk kronike. Bruk kapitler (Prolog, Solens Vibrasjon, Skyggens Utfordring, Tidens Hjul).`,
            config: {
                systemInstruction: "Du er AstroMason - The Deep Chronicler. Din oppgave er å dechiffrere sjelens tallkode med ekstrem dybde. Aldri oppsummer. Utvid på hver eneste vibrasjon. Bruk markdown-formatering for overskrifter og fet skrift."
            }
        });
        setDeepAnalysis(response.text);
    } catch (e) {
        setDeepAnalysis("De numerologiske arkivene ble avbrutt av en kosmisk storm. Prøv igjen senere.");
    } finally {
        setIsCalculating(false);
    }
  };

  // Funksjon for å rendre tekst uten markdown-tegn, men med styling
  const renderFormattedAnalysis = (text: string) => {
    return text.split('\n').map((line, i) => {
        let content = line.trim();
        if (!content) return <div key={i} className="h-6" />;

        // Sjekk overskrifter (#)
        if (content.startsWith('#')) {
            const level = (content.match(/^#+/) || [''])[0].length;
            const cleanTitle = content.replace(/^#+\s*/, '').replace(/\*\*/g, '');
            
            if (level <= 2) {
                return <h2 key={i} className="text-4xl md:text-5xl font-serif text-white mt-16 mb-8 border-b border-indigo-500/20 pb-4">{cleanTitle}</h2>;
            }
            if (level === 3) {
                return <h3 key={i} className="text-2xl md:text-3xl font-serif text-indigo-300 mt-12 mb-6">{cleanTitle}</h3>;
            }
            return <h4 key={i} className="text-xl font-bold text-indigo-400 mt-8 mb-4 uppercase tracking-widest">{cleanTitle}</h4>;
        }

        // Håndter fet skrift (**) og vanlig tekst
        // Vi fjerner rett og slett alle ** og formaterer linjen
        const cleanLine = content.replace(/\*\*/g, '');

        // Hvis linjen starter med et kapittelnummer (f.eks 1. )
        if (/^\d+\./.test(cleanLine)) {
            return <p key={i} className="text-xl md:text-2xl font-serif text-indigo-200 mb-6 italic">{cleanLine}</p>;
        }

        return (
            <p key={i} className="mb-6 text-slate-300 leading-[2.2] font-light">
                {cleanLine}
            </p>
        );
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-16 animate-fade-in pb-32">
        <header className="text-center space-y-6">
            <div className="relative inline-block group">
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/40 transition-all"></div>
                <div className="relative w-28 h-28 mx-auto rounded-[2rem] bg-[#0a0a1a] border border-indigo-500/30 flex items-center justify-center shadow-2xl rotate-45 group-hover:rotate-0 transition-transform duration-700">
                    <Fingerprint size={56} className="text-indigo-400 -rotate-45 group-hover:rotate-0 transition-transform duration-700" />
                </div>
            </div>
            <div className="space-y-2">
                <h2 className="text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-400 leading-tight">Sjelens Tallkode</h2>
                <p className="text-indigo-500 text-xs uppercase tracking-[0.6em] font-black">Esoterisk Numerologi & Tidskart</p>
            </div>
        </header>

        <section className="bg-[#0f0f25]/60 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem] shadow-2xl flex flex-col md:flex-row gap-8 items-end no-print">
            <div className="flex-1 space-y-2">
                <label className="text-[10px] uppercase font-black text-indigo-400 tracking-widest ml-1 flex items-center gap-2">
                    <Zap size={12} /> Navn for Vibrasjon
                </label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Fullt fødselsnavn" className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:border-indigo-500 outline-none transition-all placeholder:opacity-20" />
            </div>
            <div className="flex-1 space-y-2">
                <label className="text-[10px] uppercase font-black text-indigo-400 tracking-widest ml-1 flex items-center gap-2">
                    <Calendar size={12} /> Inkarnasjonstidspunkt
                </label>
                <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:border-indigo-500 outline-none transition-all" />
            </div>
            <button onClick={calculateNumerology} disabled={isCalculating || !fullName || !birthDate} className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-indigo-900/40 disabled:opacity-30 flex items-center gap-3">
                {isCalculating ? <Loader2 size={18} className="animate-spin" /> : <><Sparkles size={18} /> Åpne Arkivene</>}
            </button>
        </section>

        {results && (
            <div className="space-y-16 animate-slide-up">
                <section className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="h-[1px] flex-1 bg-white/10"></div>
                        <h3 className="text-sm font-black uppercase tracking-[0.4em] text-indigo-400">Kjernevibrasjoner</h3>
                        <div className="h-[1px] flex-1 bg-white/10"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Livsvei', val: results.lifePath, icon: Activity, karmic: results.isKarmic.lifePath, desc: 'Sjelens retning' },
                            { label: 'Uttrykk', val: results.expression, icon: Star, karmic: results.isKarmic.expression, desc: 'Naturlige evner' },
                            { label: 'Soul Urge', val: results.soulUrge, icon: Zap, karmic: results.isKarmic.soulUrge, desc: 'Hjertets lengsel' },
                            { label: 'Personlighet', val: results.personality, icon: Shield, karmic: results.isKarmic.personality, desc: 'Ytre bilde' }
                        ].map((item, i) => (
                            <div key={i} className="bg-[#0f0f25] border border-white/10 p-8 rounded-[2.5rem] text-center space-y-4 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
                                {item.karmic && <div className="absolute top-0 right-0 bg-red-600 text-[8px] font-black px-3 py-1.5 uppercase rounded-bl-xl shadow-lg">Karmisk Gjeld</div>}
                                <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{item.label}</p>
                                <p className="text-6xl font-serif text-white group-hover:scale-110 transition-transform">{item.val}</p>
                                <p className="text-[9px] text-slate-500 italic uppercase tracking-wider">{item.desc}</p>
                                <div className="p-3 bg-white/5 rounded-full w-fit mx-auto text-indigo-300 opacity-20"><item.icon size={18} /></div>
                            </div>
                        ))}
                    </div>

                    <div className="max-w-2xl mx-auto bg-gradient-to-br from-indigo-900/20 to-[#0f0f25] p-10 rounded-[3rem] border border-indigo-500/20 text-center space-y-4 shadow-2xl">
                        <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Sjelens Modenhet</p>
                        <p className="text-5xl font-serif text-white">{results.maturity}</p>
                        <p className="text-sm text-slate-400 font-light italic max-w-md mx-auto">Denne vibrasjonen aktiveres i livets andre akt, og representerer din ultimate integrasjon.</p>
                    </div>
                </section>

                <section className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="h-[1px] flex-1 bg-white/10"></div>
                        <h3 className="text-sm font-black uppercase tracking-[0.4em] text-amber-500">Tidens Hjul & Utfordringer</h3>
                        <div className="h-[1px] flex-1 bg-white/10"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="bg-[#0a0a1a] p-10 rounded-[3.5rem] border border-white/5 space-y-8 shadow-xl">
                            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-3">
                                <Award size={16} /> De fire store Pinnacles
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                {results.pinnacles.map((p, i) => (
                                    <div key={i} className="flex flex-col items-center justify-center bg-white/5 p-6 rounded-[2rem] border border-white/5 group hover:bg-indigo-600/10 transition-all">
                                        <span className="text-[9px] font-bold text-slate-500 uppercase mb-2">Vår {i+1}</span>
                                        <span className="text-4xl font-serif text-amber-400 group-hover:scale-110 transition-transform">{p}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#0a0a1a] p-10 rounded-[3.5rem] border border-white/5 space-y-8 shadow-xl">
                            <h4 className="text-xs font-black uppercase tracking-widest text-red-400 flex items-center gap-3">
                                <Activity size={16} /> Inkarnasjonens Utfordringer
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                {results.challenges.map((c, i) => (
                                    <div key={i} className="flex flex-col items-center justify-center bg-red-500/5 border border-red-900/20 p-6 rounded-[2rem] group hover:bg-red-500/10 transition-all">
                                        <span className="text-[9px] font-bold text-red-500/50 uppercase mb-2">Hinder {i+1}</span>
                                        <span className="text-4xl font-serif text-white group-hover:scale-110 transition-transform">{c}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="pt-10">
                    <div className="bg-[#0a0a1a] p-12 md:p-24 rounded-[4rem] border border-white/5 shadow-2xl relative min-h-[800px] overflow-hidden">
                        <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
                            <Fingerprint size={400} />
                        </div>

                        {isCalculating ? (
                            <div className="flex flex-col items-center justify-center h-full py-40 space-y-10">
                                <div className="relative">
                                    <Loader2 className="animate-spin text-indigo-500 opacity-20" size={120} />
                                    <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 animate-pulse" size={48} />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-3xl font-serif text-amber-100 animate-pulse italic">AstroMason konsulterer tallenes grimoire...</p>
                                    <p className="text-xs uppercase text-slate-500 tracking-[0.4em]">Sjelens mønster dechiffreres</p>
                                </div>
                            </div>
                        ) : deepAnalysis ? (
                            <article className="max-w-5xl mx-auto space-y-12">
                                <header className="text-center space-y-8 border-b border-white/10 pb-16">
                                    <h1 className="text-6xl md:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-400 leading-tight">Sjelens Kronike</h1>
                                    <div className="flex items-center justify-center gap-6">
                                        <div className="h-[1px] w-24 bg-white/10"></div>
                                        <p className="text-indigo-400 uppercase tracking-[0.5em] text-xs font-black">Numerologisk Syntese & Livsbok</p>
                                        <div className="h-[1px] w-24 bg-white/10"></div>
                                    </div>
                                </header>

                                <div className="prose prose-invert prose-2xl max-w-none">
                                    <div className="first-letter:text-9xl first-letter:font-serif first-letter:text-indigo-500 first-letter:mr-8 first-letter:float-left first-letter:mt-4 italic">
                                        {renderFormattedAnalysis(deepAnalysis)}
                                    </div>
                                </div>

                                <footer className="pt-20 border-t border-white/5 text-center flex flex-col items-center gap-6">
                                    <Fingerprint size={60} className="text-indigo-900 opacity-30" />
                                    <div className="space-y-2">
                                        <p className="text-[10px] text-slate-700 uppercase tracking-[0.5em] font-black">Kanalisert via AstroMason Master Protocol</p>
                                        <p className="text-[9px] text-slate-800 uppercase tracking-widest italic">{new Date().toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </footer>
                            </article>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-700 space-y-8 py-32 opacity-20">
                                <BookOpen size={100} />
                                <div className="text-center space-y-2">
                                    <p className="font-serif italic text-3xl">Arkivene venter på ditt navn</p>
                                    <p className="text-xs uppercase tracking-widest">Tast inn dine data over for å generere din fullstendige Livsbok</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        )}
    </div>
  );
};

export default Numerology;
