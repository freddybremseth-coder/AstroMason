
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Sparkles, Star, FileText, Download, Save, History, X, Wallet, CreditCard, Shield, CheckCircle, Loader2, Scroll, Heart, Briefcase, Zap, Info } from './Icons';
import { CalculatedChart } from '../types';
import { MAJOR_ARCANA } from '../constants';
import { AstrologyService } from '../services/astrology';
import { LangContext } from '../App';

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

const Tarot: React.FC = () => {
    const { lang } = useContext(LangContext);
    const [credits, setCredits] = useState<number>(parseInt(localStorage.getItem('tarot_credits') || '0'));
    const [showPayment, setShowPayment] = useState(false);
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
        localStorage.setItem('tarot_credits', credits.toString());
    }, [credits]);

    const handleDraw = () => {
        setIsShuffling(true);
        setReport('');
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
        if (credits <= 0) {
            setShowPayment(true);
            return;
        }

        setIsGenerating(true);
        try {
            const clientData = {
                clientName: localStorage.getItem('soul_name') || 'Søkende Sjel',
                ascendant: 'Ukjent'
            };
            // Fixed: Added lang as the 7th argument to generateTarotReport
            const text = await AstrologyService.generateTarotReport(cards, selectedSpread, selectedStyle, 'Generelt', clientData, userContext, lang);
            setReport(text);
            setCredits(prev => prev - 1);
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

    const downloadReport = () => {
        const blob = new Blob([report], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AstroMason_Tarot_${selectedSpread.id}.txt`;
        a.click();
    };

    const buyCredits = (amount: number) => {
        setCredits(prev => prev + amount);
        setShowPayment(false);
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
                
                <div onClick={() => setShowPayment(true)} className="flex items-center gap-6 bg-[#050511]/60 px-8 py-5 rounded-[2.5rem] border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer group">
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Dine Analyser</p>
                        <p className="text-2xl font-serif text-amber-100">{credits}</p>
                    </div>
                    <div className="p-4 bg-amber-500 rounded-2xl text-black shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                        <Wallet size={24} />
                    </div>
                </div>
            </header>

            {!report && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Controls */}
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
                                <label className="text-[10px] uppercase font-black text-indigo-400 tracking-widest ml-1">Spørsmål eller Kontekst</label>
                                <textarea value={userContext} onChange={e => setUserContext(e.target.value)} placeholder="Hva søker du innsikt i?" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none h-32 resize-none transition-all placeholder:opacity-20" />
                            </div>

                            <button onClick={handleDraw} disabled={isShuffling} className="w-full py-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-indigo-900/40 hover:scale-[1.02] transition-all disabled:opacity-30">
                                {isShuffling ? 'Blander Arkivene...' : 'Trekk Kortene'}
                            </button>
                        </section>
                    </div>

                    {/* Cards Display */}
                    <div className="lg:col-span-8 bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[4rem] p-12 min-h-[600px] flex flex-col items-center justify-center">
                        {cards.length === 0 ? (
                            <div className="text-center space-y-6 opacity-30 group">
                                <div className="w-32 h-32 mx-auto rounded-full border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Zap size={48} className="text-indigo-400" />
                                </div>
                                <p className="font-serif italic text-2xl">Bland kortene for å starte en ny seanse...</p>
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
                                        <button onClick={requestAnalysis} className="px-12 py-5 bg-amber-500 text-black font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-amber-500/20 hover:scale-[1.05] transition-all flex items-center gap-3">
                                            <Scroll size={20} /> Utfør Dyp Analyse (1 Kreditt)
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* AI Report View */}
            {report && (
                <div className="animate-slide-up space-y-12">
                    <div className="bg-[#0a0a1a] p-12 md:p-20 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px]"></div>
                        <header className="text-center space-y-4 mb-16 relative z-10">
                            <h1 className="text-6xl md:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-amber-500 leading-tight">Sjelens Speil</h1>
                            <p className="text-xl italic text-slate-400 font-light border-l-2 border-amber-500/30 pl-6 inline-block">Analyse utført av AstroMason • {new Date().toLocaleDateString('no-NO')}</p>
                        </header>
                        <article className="prose prose-invert prose-xl max-w-none text-slate-300 leading-[2.2] font-light whitespace-pre-wrap first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-3 first-letter:float-left relative z-10">
                            {report}
                        </article>
                        
                        <div className="mt-20 flex flex-wrap justify-center gap-6 relative z-10">
                            <button onClick={saveToArchive} className={`px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all ${isSaved ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl'}`}>
                                <Save size={18} /> {isSaved ? 'Arkivert i Sjelssenteret' : 'Lagre i mitt Arkiv'}
                            </button>
                            <button onClick={downloadReport} className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-white/10 transition-all">
                                <Download size={18} /> Last ned som tekstfil
                            </button>
                            <button onClick={() => {setReport(''); setCards([]);}} className="px-10 py-5 bg-red-950/20 text-red-400 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-red-900/20 transition-all">
                                <X size={18} /> Start ny seanse
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPayment && (
                <div className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
                   <div className="bg-[#0a0a16] border border-white/10 w-full max-w-xl rounded-[4rem] p-12 text-center space-y-10 relative shadow-2xl overflow-hidden animate-flip-in">
                      <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
                      <button onClick={() => setShowPayment(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
                      <header className="space-y-3">
                         <div className="w-16 h-16 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-500 mx-auto border border-amber-500/20 mb-4">
                            <CreditCard size={32} />
                         </div>
                         <h2 className="text-3xl font-serif font-bold text-white">Lås opp Orakelsvarene</h2>
                         <p className="text-sm text-slate-400 max-w-xs mx-auto">AstroMason krever et bidrag for å kanalisere de dypere energiene for deg.</p>
                      </header>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div onClick={() => buyCredits(1)} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] hover:border-indigo-500/50 transition-all cursor-pointer group text-center">
                            <p className="text-[10px] uppercase font-black text-indigo-400 tracking-widest mb-4">Enkel Innsikt</p>
                            <div className="text-5xl font-serif text-white mb-2">€4</div>
                            <p className="text-[10px] text-slate-500 font-bold mb-6">1 Dyp Analyse</p>
                            <div className="py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-amber-400 transition-colors">Velg Enkel</div>
                         </div>
                         <div onClick={() => buyCredits(10)} className="bg-indigo-500/5 border border-amber-500/30 p-8 rounded-[2.5rem] hover:scale-[1.03] transition-all cursor-pointer group relative overflow-hidden text-center">
                            <div className="absolute top-0 right-0 p-3 bg-amber-500 text-black text-[9px] font-black uppercase rounded-bl-xl">Best Verdi</div>
                            <p className="text-[10px] uppercase font-black text-amber-400 tracking-widest mb-4">Sjelepakke</p>
                            <div className="text-5xl font-serif text-white mb-2">€25</div>
                            <p className="text-[10px] text-slate-300 font-bold mb-6">10 Dype Analyser</p>
                            <div className="py-3 bg-amber-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-amber-400 transition-colors">Velg Mester</div>
                         </div>
                      </div>
                      <div className="flex items-center justify-center gap-6 text-[10px] text-slate-600 font-bold uppercase tracking-widest pt-4">
                         <span className="flex items-center gap-1"><Shield size={12} /> Sikker Betaling</span>
                         <span className="flex items-center gap-1"><CheckCircle size={12} /> Umiddelbar Tilgang</span>
                      </div>
                   </div>
                </div>
            )}

            {isGenerating && (
                <div className="fixed inset-0 z-[300] bg-[#050511]/95 backdrop-blur-3xl flex flex-col items-center justify-center space-y-10">
                    <div className="relative">
                        <Loader2 className="animate-spin text-amber-500 opacity-20" size={160} />
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-400 animate-pulse" size={64} />
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-amber-100 font-serif text-4xl">AstroMason dechiffrerer mønsteret...</h2>
                        <p className="text-slate-500 text-xs uppercase tracking-[0.5em] font-black">Arkivene åpnes for din sjel</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tarot;
