
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Sparkles, Star, FileText, Download, Save, History, X, Wallet, CreditCard, Shield, CheckCircle, Loader2, Scroll, Heart, Briefcase, Zap, Info, Printer, ChevronRight, RotateCcw } from './Icons';
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
        if (userEmail === 'freddy.bremseth@gmail.com') return 200000;
        return 0;
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
        if (userEmail === 'freddy.bremseth@gmail.com' && credits <= 100000) {
            setCredits(prev => prev + 100000);
        }
        localStorage.setItem('tarot_credits', credits.toString());
    }, [credits, userEmail]);

    const handleDraw = () => {
        if (credits < 1) {
            if (confirm("Du har 0 kosmiske kreditter. Vil du gå til innstillinger for å fylle på?")) {
                onNavigateToSettings?.();
            }
            return;
        }

        setIsShuffling(true);
        setReport('');
        setCredits(prev => prev - 1);

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
        <div className="max-w-7xl mx-auto py-12 px-6 animate-fade-in space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-center gap-8 bg-indigo-950/20 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/5 shadow-2xl">
                <div className="space-y-3 text-center md:text-left">
                    <h2 className="text-5xl font-serif font-bold text-white flex items-center justify-center md:justify-start gap-4">
                        <Sparkles className="text-amber-400" /> Tarot-Syntese
                    </h2>
                    <p className="text-indigo-300 text-xs uppercase tracking-[0.4em] font-black italic">Speilet av din underbevissthet</p>
                </div>
                
                <div onClick={onNavigateToSettings} className="flex items-center gap-6 bg-[#050511]/60 px-8 py-5 rounded-[2.5rem] border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer group no-print">
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Dine Kreditter</p>
                        <p className="text-2xl font-serif text-amber-100">{credits.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-amber-500 rounded-2xl text-black shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                        <Wallet size={24} />
                    </div>
                </div>
            </header>

            {!report && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start no-print">
                    <div className="lg:col-span-4 space-y-6">
                        <section className="bg-[#0f0f25]/60 border border-white/5 p-8 rounded-[3rem] space-y-8 shadow-xl">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-indigo-400 tracking-widest ml-1">Velg Legg</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {SPREADS.map(s => (
                                        <button key={s.id} onClick={() => setSelectedSpread(s)} className={`p-4 rounded-2xl border text-left transition-all ${selectedSpread.id === s.id ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-black/20 border-white/5 text-slate-400 hover:bg-white/5'}`}>
                                            <p className="text-sm font-bold">{s.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-indigo-400 tracking-widest ml-1">Tolkningstil</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {STYLES.map(s => (
                                        <button key={s.id} onClick={() => setSelectedStyle(s.id)} className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${selectedStyle === s.id ? 'bg-amber-500 border-amber-400 text-black shadow-lg' : 'bg-black/20 border-white/5 text-slate-500 hover:bg-white/5'}`}>
                                            <span className="text-[9px] font-black uppercase">{s.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-indigo-400 tracking-widest ml-1">Kontekst (valgfritt)</label>
                                <textarea value={userContext} onChange={e => setUserContext(e.target.value)} placeholder="Hva søker du innsikt i?" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none h-32 resize-none transition-all placeholder:opacity-20" />
                            </div>

                            <button onClick={handleDraw} disabled={isShuffling} className="w-full py-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-indigo-900/40 hover:scale-[1.02] transition-all disabled:opacity-30">
                                {isShuffling ? 'Blander Arkivene...' : `Trekk Kortene (1 Kreditt)`}
                            </button>
                        </section>
                    </div>

                    <div className="lg:col-span-8 bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[4rem] p-12 min-h-[600px] flex flex-col items-center justify-center">
                        {cards.length === 0 ? (
                            <div className="text-center space-y-6 opacity-30 group">
                                <div className="w-32 h-32 mx-auto rounded-full border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Zap size={48} className="text-indigo-400" />
                                </div>
                                <p className="font-serif italic text-2xl text-slate-300">Bruk dine kreditter for å se inn i fremtiden...</p>
                            </div>
                        ) : (
                            <div className="w-full space-y-12">
                                <div className={`grid gap-6 justify-center ${cards.length > 5 ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-1 md:grid-cols-3'}`}>
                                    {cards.map((c, i) => (
                                        <div key={i} className="space-y-3 text-center">
                                            <p className="text-[8px] font-black uppercase tracking-widest text-amber-500/60">{selectedSpread.positions[i]}</p>
                                            <div onClick={() => revealCard(i)} className="relative aspect-[2/3] w-full max-w-[160px] mx-auto perspective-1000 cursor-pointer">
                                                <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${revealed[i] ? 'rotate-y-180' : ''}`}>
                                                    <div className="absolute inset-0 backface-hidden"><CardBack /></div>
                                                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden border border-amber-500/20 bg-[#0a0a16] shadow-2xl">
                                                        <img src={c.card.img} alt={c.card.name} className={`w-full h-full object-cover ${c.isReversed ? 'rotate-180' : ''}`} />
                                                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                                                            <p className="text-[10px] font-serif text-white leading-tight">{c.card.name}</p>
                                                            {c.isReversed && <span className="text-[8px] text-red-400 font-black uppercase">Reversert</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {revealed.every(v => v) && (
                                    <div className="flex justify-center animate-fade-in">
                                        <button 
                                            onClick={requestAnalysis} 
                                            disabled={isGenerating}
                                            className="px-12 py-5 bg-amber-500 text-black font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-amber-500/20 hover:scale-[1.05] transition-all flex items-center gap-3 disabled:opacity-50"
                                        >
                                            {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Scroll size={20} />}
                                            {isGenerating ? 'Kanaliserer...' : 'Utfør Dyp Analyse'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {report && (
                <div className="animate-slide-up space-y-12">
                    <div className="bg-[#0a0a1a] p-12 md:p-20 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-8 right-8 flex gap-3 no-print">
                            <button onClick={() => window.print()} className="p-3 bg-amber-500/10 rounded-full hover:bg-amber-500/20 transition-all text-amber-500 flex items-center gap-2 px-6">
                                <Printer size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">PDF / Utskrift</span>
                            </button>
                        </div>
                        <header className="text-center space-y-4 mb-16 relative z-10">
                            <h1 className="text-6xl md:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-amber-500 leading-tight">Sjelens Speil</h1>
                            <p className="text-xl italic text-slate-400 font-light border-l-2 border-amber-500/30 pl-6 inline-block">Analyse utført av AstroMason • {new Date().toLocaleDateString('no-NO')}</p>
                        </header>
                        <article className="prose prose-invert prose-xl max-w-none text-slate-300 leading-[2.2] font-light whitespace-pre-wrap first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-3 first-letter:float-left relative z-10">
                            {report}
                        </article>
                        
                        <div className="mt-20 flex flex-wrap justify-center gap-6 relative z-10 no-print">
                            <button onClick={saveToArchive} className={`px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all ${isSaved ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl'}`}>
                                <Save size={18} /> {isSaved ? 'Arkivert i Sjelssenteret' : 'Lagre i mitt Arkiv'}
                            </button>
                            <button onClick={() => {setReport(''); setCards([]);}} className="px-10 py-5 bg-red-950/20 text-red-400 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-red-900/20 transition-all">
                                <RotateCcw size={18} /> Start ny seanse
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tarot;
