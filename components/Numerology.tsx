
import React, { useState, useEffect } from 'react';
import { Fingerprint, RotateCcw, Sparkles, Loader2, BookOpen, Scroll, Star } from './Icons';
import { GoogleGenAI } from "@google/genai";

interface NumerologyProps {
  initialDate?: string;
  initialName?: string;
}

const Numerology: React.FC<NumerologyProps> = ({ initialDate, initialName }) => {
  const [birthDate, setBirthDate] = useState(initialDate || "");
  const [fullName, setFullName] = useState(initialName || "");
  const [results, setResults] = useState<{ lifePath: number; expression: number } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [deepAnalysis, setDeepAnalysis] = useState<string | null>(null);

  const calculateNumerology = async () => {
    if (!birthDate || !fullName) return;
    setIsCalculating(true);
    setDeepAnalysis(null);
    
    // 1. Calculate Life Path (Date)
    const dateDigits = birthDate.replace(/-/g, '').split('').map(Number);
    let lpSum = dateDigits.reduce((a, b) => a + b, 0);
    while (lpSum > 9 && ![11, 22, 33].includes(lpSum)) {
        lpSum = lpSum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    }

    // 2. Calculate Expression Number (Name) - Pythagorean System
    const pythagoreanMap: Record<string, number> = {
        a:1, j:1, s:1, b:2, k:2, t:2, c:3, l:3, u:3, d:4, m:4, v:4, e:5, n:5, w:5, f:6, o:6, x:6, g:7, p:7, y:7, h:8, q:8, z:8, i:9, r:9
    };
    const nameDigits = fullName.toLowerCase().replace(/[^a-z]/g, '').split('').map(char => pythagoreanMap[char] || 0);
    let expSum = nameDigits.reduce((a, b) => a + b, 0);
    while (expSum > 9 && ![11, 22, 33].includes(expSum)) {
        expSum = expSum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    }

    setResults({ lifePath: lpSum, expression: expSum });

    // 3. AI Deep Analysis (AstroMason Persona)
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Som AstroMason - The Deep Chronicler, gi en omfattende numerologisk analyse på NORSK for ${fullName}. 
            Livsvei-nummer: ${lpSum}. Uttrykks-nummer (Navn): ${expSum}. 
            Bruk et esoterisk og arketypsk språk. Forklar hvordan disse to tallene interagerer. 
            Følg Nivå 3 (Livsboken) stilen med dype innsikter. Minst 600 ord.`,
            config: {
                systemInstruction: "Du er en mester-numerolog som ser sammenhengen mellom tall, sjel og kosmos. Skriv poetisk, men med substans."
            }
        });
        setDeepAnalysis(response.text);
    } catch (e) {
        console.error("AI analysis failed", e);
        setDeepAnalysis("De kosmiske arkivene for numerologi er midlertidig utilgjengelige, men dine tall står sterkt i lyset.");
    } finally {
        setIsCalculating(false);
    }
  };

  useEffect(() => {
    if (initialDate && initialName) {
        calculateNumerology();
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in py-12 px-6">
        <header className="text-center mb-12 space-y-4">
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full"></div>
                <div className="relative w-24 h-24 mx-auto rounded-full bg-[#0a0a1a] border border-indigo-500/30 flex items-center justify-center shadow-2xl">
                    <Fingerprint size={48} className="text-indigo-400" />
                </div>
            </div>
            <div>
                <h2 className="text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-300">Sjelens Tallkode</h2>
                <p className="text-indigo-400 text-xs uppercase tracking-[0.4em] mt-2 font-bold italic">"Dechiffrer ditt kosmiske fotavtrykk"</p>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-[#0f0f25]/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
                    <h3 className="text-amber-200 text-xs uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                        <Scroll size={14} /> Dine Date
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">Fullt Navn</label>
                            <input 
                                type="text" 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Navn for vibrasjon"
                                className="w-full bg-[#050511] border border-white/10 rounded-2xl p-4 text-white focus:border-amber-500/50 outline-none transition-all placeholder:opacity-20"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">Fødselsdato</label>
                            <input 
                                type="date" 
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full bg-[#050511] border border-white/10 rounded-2xl p-4 text-white focus:border-amber-500/50 outline-none transition-all" 
                            />
                        </div>
                        <button 
                            onClick={calculateNumerology}
                            disabled={!birthDate || !fullName || isCalculating}
                            className="w-full py-5 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white rounded-2xl uppercase tracking-widest text-[10px] font-black transition-all shadow-xl shadow-indigo-900/40 disabled:opacity-30"
                        >
                            {isCalculating ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin" size={16} /> Analyserer...
                                </span>
                            ) : 'Åpne Tallenes Arkiv'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Analysis Content */}
            <div className="lg:col-span-2 space-y-8">
                {!results ? (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] p-12 text-center group">
                        <div className="space-y-4 opacity-30 group-hover:opacity-50 transition-opacity">
                            <Star size={48} className="mx-auto text-indigo-400" />
                            <p className="font-serif italic text-xl">Skriv inn dine data for å avdekke din numerologiske profil...</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-slide-up">
                        {/* Summary Circles */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-[#0f0f25]/60 p-8 rounded-[3rem] border border-white/5 text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -z-10"></div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-black mb-4">Livsvei</p>
                                <div className="text-6xl font-serif text-amber-100 mb-2 drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">{results.lifePath}</div>
                                <p className="text-[10px] text-slate-500 italic">Sjelens overordnede formål</p>
                            </div>
                            <div className="bg-[#0f0f25]/60 p-8 rounded-[3rem] border border-white/5 text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -z-10"></div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-indigo-400 font-black mb-4">Uttrykk</p>
                                <div className="text-6xl font-serif text-indigo-100 mb-2 drop-shadow-[0_0_15px_rgba(129,140,248,0.2)]">{results.expression}</div>
                                <p className="text-[10px] text-slate-500 italic">Dine talenter og verktøy</p>
                            </div>
                        </div>

                        {/* AI Deep Analysis Section */}
                        <div className="bg-[#0a0a1a] p-10 md:p-14 rounded-[4rem] border border-white/5 shadow-inner relative">
                            <div className="absolute top-8 right-10 opacity-10">
                                <Sparkles size={120} />
                            </div>
                            
                            {isCalculating && !deepAnalysis ? (
                                <div className="py-20 flex flex-col items-center justify-center space-y-6">
                                    <Loader2 className="animate-spin text-amber-500" size={48} />
                                    <p className="font-serif text-2xl text-amber-100 animate-pulse">AstroMason dechiffrerer tallenes dypeste mysterier...</p>
                                </div>
                            ) : deepAnalysis ? (
                                <article className="prose prose-invert max-w-none">
                                    <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                                        <BookOpen className="text-amber-500" size={24} />
                                        <h3 className="text-3xl font-serif text-white m-0">Sjelens Kronike</h3>
                                    </div>
                                    <div className="text-slate-300 leading-[2] text-lg font-light first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-3 first-letter:float-left whitespace-pre-wrap">
                                        {deepAnalysis}
                                    </div>
                                    <div className="mt-12 pt-8 border-t border-white/5 text-center italic text-slate-500 text-sm">
                                        Generert av AstroMason Intelligence • Tallene lyver aldri.
                                    </div>
                                </article>
                            ) : null}
                        </div>

                        <button 
                            onClick={() => { setResults(null); setDeepAnalysis(null); }} 
                            className="text-xs text-indigo-500 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors font-bold uppercase tracking-widest"
                        >
                            <RotateCcw size={12} /> Start på nytt
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Numerology;
