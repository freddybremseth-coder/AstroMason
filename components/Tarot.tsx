
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Sparkles, Star, FileText, Download, Save, History, X, Wallet, CreditCard, Shield, CheckCircle, Loader2, Scroll, Heart, Briefcase, Zap, Info, Printer, ChevronRight, RotateCcw, Calendar } from './Icons';
import { CalculatedChart } from '../types';
import { MAJOR_ARCANA } from '../constants';
import { AstrologyService } from '../services/astrology';
import { LangContext } from '../App';

interface TarotProps {
    onNavigateToSettings?: () => void;
}

const CardBack = () => (
  <div className="w-full h-full bg-gradient-to-br from-indigo-950 to-purple-950 rounded-2xl border border-indigo-500/30 flex items-center justify-center relative overflow-hidden shadow-2xl group cursor-pointer transform transition-transform hover:scale-[1.02]">
    <div className="absolute inset-0 bg-stardust opacity-20"></div>
    <div className="w-20 h-20 border-2 border-indigo-300/10 rotate-45 flex items-center justify-center backdrop-blur-sm">
      <Star className="text-indigo-200/30 w-10 h-10" />
    </div>
  </div>
);

const SPREADS = [
    { id: 'one', name: 'Dagens Kort (1 Kort)', count: 1, positions: ['Sjelens Budskap'] },
    { id: 'three_time', name: 'Tiden (3 Kort)', count: 3, positions: ['Fortid', 'Nåtid', 'Fremtid'] },
    { id: 'relationship', name: 'Relasjonen (3 Kort)', count: 3, positions: ['Deg', 'Den Andre', 'Dynamikken'] },
    { id: 'celtic_cross', name: 'Keltisk Kors (10 Kort)', count: 10, positions: ['Kjernen', 'Utfordring', 'Mål', 'Røtter', 'Fortid', 'Fremtid', 'Selvet', 'Omgivelser', 'Frykt', 'Utfall'] }
];

const STYLES = [
    { id: 'esoteric', label: 'Esoterisk', desc: 'Sjelens skjulte språk' },
    { id: 'psychological', label: 'Psykologisk', desc: 'Jungiansk dybde' },
    { id: 'classical', label: 'Klassisk', desc: 'Tradisjonell innsikt' }
];

const Tarot: React.FC<TarotProps> = ({ onNavigateToSettings }) => {
    const { lang } = useContext(LangContext);
    const userEmail = localStorage.getItem('soul_email') || '';
    
    const [credits, setCredits] = useState<number>(() => {
        const saved = localStorage.getItem('tarot_credits');
        if (saved !== null) return parseInt(saved);
        return userEmail === 'freddy.bremseth@gmail.com' ? 200000 : 0;
    });

    const [selectedSpread, setSelectedSpread] = useState(SPREADS[1]);
    const [selectedStyle, setSelectedStyle] = useState('esoteric');
    const [userContext, setUserContext] = useState('');
    const [cards, setCards] = useState<any[]>([]);
    const [revealed, setRevealed] = useState<boolean[]>([]);
    const [isShuffling, setIsShuffling] = useState(false);
    const [report, setReport] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const update = () => {
            const creds = parseInt(localStorage.getItem('tarot_credits') || '0');
            setCredits(creds);
        };
        window.addEventListener('storage', update);
        return () => window.removeEventListener('storage', update);
    }, []);

    useEffect(() => {
        setReport('');
        setCards([]);
    }, [lang]);

    const handleDraw = () => {
        const sub = localStorage.getItem('soul_subscription');
        if (sub !== 'Master' && credits < 1) {
            if (confirm("Du har 0 kosmiske kreditter. Vil du fylle på i arkivet?")) {
                onNavigateToSettings?.();
            }
            return;
        }

        setIsShuffling(true);
        setReport('');
        
        if (sub !== 'Master') {
            const newCredits = credits - 1;
            setCredits(newCredits);
            localStorage.setItem('tarot_credits', newCredits.toString());
            window.dispatchEvent(new Event('storage'));
        }

        const shuffled = [...MAJOR_ARCANA].sort(() => 0.5 - Math.random());
        const draw = shuffled.slice(0, selectedSpread.count).map(c => ({
            card: c,
            isReversed: Math.random() > 0.8
        }));
        
        setTimeout(() => {
            setCards(draw);
            setRevealed(new Array(selectedSpread.count).fill(false));
            setIsShuffling(false);
        }, 1500);
    };

    const handleDailyDraw = async () => {
        const sub = localStorage.getItem('soul_subscription');
        if (sub !== 'Master' && credits < 1) {
            if (confirm("Dagens Tarot krever 1 kreditt. Vil du fylle på?")) {
                onNavigateToSettings?.();
            }
            return;
        }

        setSelectedSpread(SPREADS[0]); 
        setUserContext("Dagens energi og veiledning");
        setIsShuffling(true);
        setReport('');

        if (sub !== 'Master') {
            const newCredits = credits - 1;
            setCredits(newCredits);
            localStorage.setItem('tarot_credits', newCredits.toString());
            window.dispatchEvent(new Event('storage'));
        }

        const shuffled = [...MAJOR_ARCANA].sort(() => 0.5 - Math.random());
        const dailyCard = {
            card: shuffled[0],
            isReversed: Math.random() > 0.8
        };

        setTimeout(async () => {
            setCards([dailyCard]);
            setRevealed([true]);
            setIsShuffling(false);
            setIsGenerating(true);
            
            try {
                const clientData = {
                    clientName: localStorage.getItem('soul_name') || 'Søkende Sjel',
                    ascendant: 'Ukjent'
                };
                const text = await AstrologyService.generateTarotReport([dailyCard], SPREADS[0], 'esoteric', 'Generelt', clientData, "Dagens energi", lang);
                setReport(text);
            } catch (e) {
                alert("Oraklet er midlertidig stumt.");
            } finally {
                setIsGenerating(false);
            }
        }, 1200);
    };

    const revealCard = (index: number) => {
        const newRevealed = [...revealed];
        newRevealed[index] = true;
        setRevealed(newRevealed);
    };

    const requestAnalysis = async () => {
        setIsGenerating(true);
        try {
            const clientData = {
                clientName: localStorage.getItem('soul_name') || 'Søkende Sjel',
                ascendant: 'Ukjent'
            };
            const text = await AstrologyService.generateTarotReport(cards, selectedSpread, selectedStyle, 'Generelt', clientData, userContext, lang);
            setReport(text);
        } catch (e) {
            alert("De kosmiske strømmene ble avbrutt. Prøv igjen.");
        } finally {
            setIsGenerating(false);
        }
    };

    const saveToArchive = () => {
        const saved = JSON.parse(localStorage.getItem('astromason_reports') || '[]');
        const newEntry = {
            id: Date.now().toString(),
            title: `Tarot: ${selectedSpread.name}`,
            date: new Date().toISOString(),
            type: 'Tarot',
            content: report
        };
        localStorage.setItem('astromason_reports', JSON.stringify([newEntry, ...saved]));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 animate-fade-in space-y-12 pb-32">
            <header className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-5xl font-serif font-bold text-white flex items-center justify-center md:justify-start gap-4">
                        <Sparkles className="text-amber-400" /> Tarot-Syntese
                    </h2>
                    <p className="text-indigo-300 text-[11px] uppercase tracking-[0.4em] font-black italic">Speilet av din underbevissthet</p>
                </div>
            </header>

            {!report && cards.length === 0 && (
                <section className="bg-gradient-to-r from-amber-900/20 to-indigo-900/20 border border-amber-500/10 p-10 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-10 animate-fade-in no-print">
                    <div className="space-y-4 max-w-xl text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                            <Calendar size={14} /> Dagens mulighet
                        </div>
                        <h3 className="text-4xl font-serif text-white">Hent ditt Dagens Tarot</h3>
                        <p className="text-slate-400 font-light leading-relaxed">
                            Start dagen med kosmisk klarhet. Ett kort, tolket med esoterisk dybde, for å belyse din vei de neste 24 timene.
                        </p>
                    </div>
                    <button 
                        onClick={handleDailyDraw}
                        disabled={isShuffling}
                        className="px-12 py-6 bg-amber-500 text-black font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-amber-500/20 hover:scale-[1.05] transition-all flex items-center gap-4 text-xs shrink-0"
                    >
                        {isShuffling ? <Loader2 size={20} className="animate-spin" /> : <Star size={20} />}
                        Trekke Dagens Kort
                    </button>
                </section>
            )}

            {!report && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start no-print">
                    <div className="lg:col-span-4 space-y-8">
                        <section className="bg-[#0f0f25]/60 border border-white/5 p-10 rounded-[3rem] space-y-10 shadow-xl">
                            <div className="space-y-3">
                                <label className="text-[11px] uppercase font-black text-indigo-400 tracking-widest ml-1">Velg Sjelens Legg</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {SPREADS.map(s => (
                                        <button key={s.id} onClick={() => { setSelectedSpread(s); setCards([]); }} className={`p-5 rounded-2xl border text-left transition-all ${selectedSpread.id === s.id ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-black/20 border-white/5 text-slate-400 hover:bg-white/5'}`}>
                                            <p className="text-sm font-bold tracking-wide">{s.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <label className="text-[11px] uppercase font-black text-indigo-400 tracking-widest ml-1">Kanaliserings-stil</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {STYLES.map(s => (
                                        <button key={s.id} onClick={() => setSelectedStyle(s.id)} className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${selectedStyle === s.id ? 'bg-amber-500 border-amber-400 text-black shadow-lg' : 'bg-black/20 border-white/5 text-slate-500 hover:bg-white/5'}`}>
                                            <span className="text-[10px] font-black uppercase tracking-tighter">{s.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] uppercase font-black text-indigo-400 tracking-widest ml-1">Søkelsens Kontekst</label>
                                <textarea value={userContext} onChange={e => setUserContext(e.target.value)} placeholder="Hvilket område av livet søker du klarhet i?" className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm leading-relaxed text-white focus:border-indigo-500 outline-none h-36 resize-none transition-all placeholder:opacity-20" />
                            </div>

                            <div className="space-y-4">
                                <button onClick={handleDraw} disabled={isShuffling} className="w-full py-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-indigo-900/40 hover:scale-[1.02] transition-all disabled:opacity-30 flex items-center justify-center gap-3">
                                    {isShuffling ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                                    {isShuffling ? 'Blander...' : `Trekk Kortene`}
                                </button>
                                <p className="text-center text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">Koster 1 Kreditt</p>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-8 bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[4rem] p-12 min-h-[650px] flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-24 opacity-[0.02] pointer-events-none">
                            <Sparkles size={400} />
                        </div>

                        {cards.length === 0 ? (
                            <div className="text-center space-y-8 opacity-20 group relative z-10">
                                <div className="w-32 h-32 mx-auto rounded-full border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                                    <Zap size={48} className="text-indigo-400" />
                                </div>
                                <div className="space-y-2">
                                    <p className="font-serif italic text-3xl text-slate-300">Arkivene er forseglet</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Velg et legg eller trekk Dagens Tarot for å begynne</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full space-y-16 relative z-10">
                                <div className={`grid gap-10 justify-center ${cards.length > 5 ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-1 md:grid-cols-3'}`}>
                                    {cards.map((c, i) => (
                                        <div key={i} className="space-y-4 text-center group">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/60 transition-opacity group-hover:text-amber-500">{selectedSpread.positions[i]}</p>
                                            <div onClick={() => revealCard(i)} className="relative aspect-[2/3] w-full max-w-[170px] mx-auto perspective-1000 cursor-pointer">
                                                <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${revealed[i] ? 'rotate-y-180' : 'group-hover:scale-105'}`}>
                                                    <div className="absolute inset-0 backface-hidden"><CardBack /></div>
                                                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden border border-amber-500/20 bg-[#0a0a16] shadow-2xl">
                                                        <img src={c.card.img} alt={c.card.name} className={`w-full h-full object-cover ${c.isReversed ? 'rotate-180' : ''}`} />
                                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                                                            <p className="text-[11px] font-serif text-white leading-tight font-bold">{c.card.name}</p>
                                                            {c.isReversed && <span className="text-[9px] text-red-500 font-black uppercase mt-1 block">Reversert</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {revealed.every(v => v) && !isGenerating && !report && (
                                    <div className="flex justify-center animate-fade-in pt-8">
                                        <button 
                                            onClick={requestAnalysis} 
                                            disabled={isGenerating}
                                            className="px-16 py-6 bg-amber-500 text-black font-black uppercase tracking-[0.4em] rounded-[2.5rem] shadow-2xl shadow-amber-500/20 hover:scale-[1.05] transition-all flex items-center gap-3 disabled:opacity-50 text-[11px]"
                                        >
                                            <Scroll size={22} /> Utfør Dyp Analyse
                                        </button>
                                    </div>
                                )}
                                {isGenerating && (
                                    <div className="flex flex-col items-center gap-6 animate-pulse pt-8">
                                        <Loader2 size={40} className="animate-spin text-amber-500" />
                                        <p className="text-amber-100 font-serif italic text-xl">Kanaliserer dyp innsikt...</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {report && (
                <div className="animate-slide-up space-y-12 pb-32">
                    <div className="bg-[#0a0a1a] p-12 md:p-24 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-8 right-8 flex gap-3 no-print">
                            <button onClick={() => window.print()} className="p-3 bg-amber-500/10 rounded-full hover:bg-amber-500/20 transition-all text-amber-500 flex items-center gap-2 px-6">
                                <Printer size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">PDF / Utskrift</span>
                            </button>
                            <button onClick={() => {setReport(''); setCards([]);}} className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-slate-500"><X size={20}/></button>
                        </div>
                        
                        <div className="absolute -top-24 -left-24 p-48 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

                        <header className="text-center space-y-6 mb-24 relative z-10 border-b border-white/5 pb-16">
                            <h1 className="text-6xl md:text-9xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-amber-500 leading-tight">Sjelens Speil</h1>
                            <div className="flex items-center justify-center gap-6">
                                <div className="h-[1px] w-20 bg-white/10"></div>
                                <p className="text-xl italic text-slate-400 font-light">Analyse utført av AstroMason Intelligence</p>
                                <div className="h-[1px] w-20 bg-white/10"></div>
                            </div>
                        </header>

                        <article className="prose prose-invert prose-2xl max-w-none text-slate-300 leading-[2.4] font-light whitespace-pre-wrap first-letter:text-9xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-8 first-letter:float-left first-letter:mt-4 relative z-10 text-xl md:text-2xl">
                            {report}
                        </article>
                        
                        <div className="mt-24 pt-16 border-t border-white/5 flex flex-wrap justify-center gap-8 relative z-10 no-print">
                            <button onClick={saveToArchive} className={`px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-4 transition-all ${isSaved ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-2xl shadow-indigo-900/40'}`}>
                                {isSaved ? <CheckCircle size={22} /> : <Save size={22} />}
                                {isSaved ? 'Innsikt Arkivert' : 'Lagre i de Dype Arkivene'}
                            </button>
                            <button onClick={() => {setReport(''); setCards([]);}} className="px-12 py-6 bg-red-950/20 text-red-500 border border-red-900/10 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-4 hover:bg-red-900/20 transition-all">
                                <RotateCcw size={22} /> Start Ny Seanse
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tarot;
