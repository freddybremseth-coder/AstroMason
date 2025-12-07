import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, CircleHelp, Star, FileText, Heart, Briefcase, Zap, RefreshCw, Save, MessageSquare, User, Fingerprint, Eye, Compass, RotateCw, X, RotateCcw, Brain, ArrowUpRight, CheckCircle, ChevronRight } from './icons';
import { CalculatedChart } from '../types';
import { MAJOR_ARCANA } from '../constants';
import { AstrologyService } from '../services/astrology';

// --- Assets & Icons Mockup ---
const CardBack = () => (
  <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl border border-indigo-400/30 flex items-center justify-center relative overflow-hidden shadow-2xl group cursor-pointer transform transition-transform hover:scale-105">
    <div className="absolute inset-0 bg-stardust opacity-30"></div>
    <div className="w-16 h-16 border-2 border-indigo-300/20 rotate-45 flex items-center justify-center backdrop-blur-sm">
      <Star className="text-indigo-200/50 w-8 h-8" />
    </div>
  </div>
);

// --- Data Constants ---

const SPREADS = [
    { id: 'one', name: 'Dagens Kort (1 Kort)', count: 1, positions: ['Fokus / Råd'] },
    { id: 'three_time', name: 'Tiden (3 Kort)', count: 3, positions: ['Fortid (Grunnlaget)', 'Nåtid (Utfordringen)', 'Fremtid (Utfallet)'] },
    { id: 'five_decision', name: 'Veivalget (5 Kort)', count: 5, positions: ['Nåsituasjonen', 'Utfordringen', 'Det Skjulte', 'Råd', 'Sannsynlig Utfall'] },
    { id: 'celtic_cross', name: 'Keltisk Kors (10 Kort)', count: 10, positions: ['Nåsituasjonen', 'Utfordringen', 'Det Bevisste', 'Det Ubevisste', 'Fortid', 'Fremtid', 'Selvet', 'Omgivelser', 'Håp & Frykt', 'Endelig Utfall'] }
];

const READING_STYLES = [
    { id: 'psychological', name: 'Jungiansk Dybdepsykologi' },
    { id: 'general', name: 'Helhetlig & Balansert' },
    { id: 'esoteric', name: 'Esoterisk / Sjelelig' },
];

const THEMES = [
    { id: 'general', name: 'Generelt' },
    { id: 'love', name: 'Kjærlighet' },
    { id: 'career', name: 'Karriere' }
];

interface TarotCardData {
    card: typeof MAJOR_ARCANA[0];
    isReversed: boolean;
}

const Tarot: React.FC = () => {
    // Client & Configuration States
    const [savedClients, setSavedClients] = useState<CalculatedChart[]>([]);
    const [selectedClient, setSelectedClient] = useState<CalculatedChart | null>(null);
    const [readingStyle, setReadingStyle] = useState(READING_STYLES[0]);

    // Selection States
    const [selectedSpread, setSelectedSpread] = useState(SPREADS[1]); 
    const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
    const [userContext, setUserContext] = useState('');
    const [allowReversals, setAllowReversals] = useState(false);

    // Game States
    const [cards, setCards] = useState<TarotCardData[]>([]);
    const [revealed, setRevealed] = useState<boolean[]>([]);
    const [isShuffling, setIsShuffling] = useState(false);
    
    // Report State
    const [report, setReport] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Load clients from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('astroMasonCharts');
        if (saved) {
            try {
                setSavedClients(JSON.parse(saved));
            } catch (e) { console.error("Could not load clients", e); }
        }
    }, []);

    // Reset when spread changes
    useEffect(() => {
        setCards([]);
        setRevealed([]);
        setReport('');
    }, [selectedSpread]);

    const drawCards = () => {
        setIsShuffling(true);
        setCards([]);
        setRevealed(new Array(selectedSpread.count).fill(false));
        setReport('');
        
        // Simulate shuffle delay with visual feedback
        setTimeout(() => {
            const shuffled = [...MAJOR_ARCANA].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, selectedSpread.count).map(card => ({
                card,
                isReversed: allowReversals ? Math.random() > 0.5 : false
            }));
            setCards(selected);
            setIsShuffling(false);
        }, 1500);
    };

    const handleReveal = (index: number) => {
        if (!revealed[index]) {
            const newRevealed = [...revealed];
            newRevealed[index] = true;
            setRevealed(newRevealed);

            // Check if all cards are revealed to generate "report"
            if (newRevealed.every(r => r === true)) {
                generateDeepReport(newRevealed, cards);
            }
        }
    };

    const generateDeepReport = async (currentRevealed: boolean[], currentCards: TarotCardData[]) => {
        setIsGenerating(true);
        // Use the advanced Astrology Service generator
        const generatedText = await AstrologyService.generateTarotReport(
            currentCards, 
            selectedSpread, 
            readingStyle.id, 
            selectedTheme.id, 
            selectedClient, 
            userContext
        );
        
        setReport(generatedText);
        setIsGenerating(false);
    };

    const handleCloseReport = () => {
        setReport('');
        setCards([]);
        setRevealed([]);
    };

    const getGridClass = () => {
        const count = selectedSpread.count;
        if (count === 1) return 'grid-cols-1 place-items-center max-w-sm mx-auto';
        if (count === 3) return 'grid-cols-1 md:grid-cols-3';
        if (count === 5) return 'grid-cols-2 md:grid-cols-5';
        if (count === 7) return 'grid-cols-2 md:grid-cols-4';
        if (count === 10) return 'grid-cols-2 md:grid-cols-5';
        return 'grid-cols-1 md:grid-cols-3';
    };

    return (
        <div className="min-h-screen bg-[#050511] text-white p-6 md:p-8 animate-fade-in relative rounded-2xl overflow-hidden border border-gray-800 font-sans">
            
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-stardust opacity-30"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <Sparkles className="text-amber-200" size={24} />
                            <h2 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-white to-indigo-100">
                                Det Hellige Rommet
                            </h2>
                        </div>
                        <p className="text-indigo-200/60 text-sm uppercase tracking-[0.2em] font-medium">
                            Profesjonell Tarot Syntese
                        </p>
                    </div>

                    <button 
                        onClick={drawCards}
                        disabled={isShuffling || cards.length > 0}
                        className="group relative px-8 py-3 bg-[#13132b] rounded-full border border-indigo-500/30 hover:bg-[#1a1a35] hover:border-indigo-400/50 transition-all overflow-hidden shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <span className="flex items-center justify-center gap-3 text-indigo-100 uppercase tracking-[0.2em] text-xs font-bold">
                            <RefreshCw size={16} className={isShuffling ? 'animate-spin' : ''} />
                            {isShuffling ? 'Blander Energiene...' : 'Trekk Nye Kort'}
                        </span>
                    </button>
                </div>

                {/* Configuration Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 bg-indigo-950/20 backdrop-blur-md p-6 rounded-2xl border border-white/5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                            <FileText size={12} /> Spredning
                        </label>
                        <select 
                            value={selectedSpread.id}
                            onChange={(e) => setSelectedSpread(SPREADS.find(s => s.id === e.target.value) || SPREADS[0])}
                            className="w-full bg-[#050511] border border-indigo-500/20 rounded-lg px-3 py-2.5 text-xs text-indigo-100 focus:outline-none focus:border-amber-500/50 transition-colors"
                        >
                            {SPREADS.map(spread => (
                                <option key={spread.id} value={spread.id}>{spread.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                            <Fingerprint size={12} /> Lesestil
                        </label>
                        <select 
                            value={readingStyle.id}
                            onChange={(e) => setReadingStyle(READING_STYLES.find(s => s.id === e.target.value) || READING_STYLES[0])}
                            className="w-full bg-[#050511] border border-indigo-500/20 rounded-lg px-3 py-2.5 text-xs text-indigo-100 focus:outline-none focus:border-amber-500/50 transition-colors"
                        >
                            {READING_STYLES.map(style => (
                                <option key={style.id} value={style.id}>{style.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                            <User size={12} /> Klient (Valgfri)
                        </label>
                        <select 
                            value={selectedClient ? selectedClient.clientName : ''}
                            onChange={(e) => {
                                const client = savedClients.find(c => c.clientName === e.target.value);
                                setSelectedClient(client || null);
                            }}
                            className="w-full bg-[#050511] border border-indigo-500/20 rounded-lg px-3 py-2.5 text-xs text-indigo-100 focus:outline-none focus:border-amber-500/50 transition-colors"
                        >
                            <option value="">Ingen (Generell)</option>
                            {savedClients.map((c, i) => (
                                <option key={i} value={c.clientName}>{c.clientName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                            <MessageSquare size={12} /> Spørsmål
                        </label>
                        <input
                            type="text"
                            value={userContext}
                            onChange={(e) => setUserContext(e.target.value)}
                            placeholder="Hva vil du vite?"
                            className="w-full bg-[#050511] border border-indigo-500/20 rounded-lg px-3 py-2.5 text-xs text-indigo-100 focus:outline-none focus:border-amber-500/50 placeholder:text-indigo-500/50"
                        />
                    </div>
                </div>

                {/* Main Card Area */}
                <div className="min-h-[500px] flex items-center justify-center">
                    {cards.length === 0 && !isShuffling ? (
                        <div className="text-center space-y-6 opacity-60 animate-pulse">
                            <div className="w-24 h-24 mx-auto rounded-full border border-indigo-500/30 flex items-center justify-center">
                                <CircleHelp size={40} className="text-indigo-300" />
                            </div>
                            <p className="font-serif text-xl text-indigo-200">Klar til å konsultere orakelet...</p>
                        </div>
                    ) : (
                        <div className={`grid gap-8 w-full max-w-6xl mx-auto transition-all duration-700 ${getGridClass()}`}>
                            {isShuffling && Array.from({length: selectedSpread.count}).map((_, i) => (
                                 <div key={i} className="aspect-[2/3] bg-indigo-950/20 rounded-xl border border-indigo-500/20 flex items-center justify-center animate-pulse shadow-lg">
                                     <div className="w-8 h-8 border-2 border-indigo-400/30 rotate-45"></div>
                                 </div>
                            ))}
                            
                            {!isShuffling && cards.map((data, index) => (
                                <div key={index} className="flex flex-col items-center w-full max-w-[240px] mx-auto group perspective-1000">
                                    <div className="mb-4">
                                        <span className="text-[10px] font-bold text-amber-200 uppercase tracking-[0.2em] bg-amber-900/20 px-3 py-1.5 rounded-full border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                                            {selectedSpread.positions[index] || `Posisjon ${index + 1}`}
                                        </span>
                                    </div>
                                    
                                    <div 
                                        className="relative aspect-[2/3] w-full cursor-pointer hover:scale-[1.03] transition-transform duration-500 ease-out"
                                        onClick={() => handleReveal(index)}
                                    >
                                        <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d shadow-2xl rounded-xl ${revealed[index] ? 'rotate-y-180' : ''}`}>
                                            
                                            {/* Back of Card */}
                                            <div className="absolute inset-0 backface-hidden">
                                                <CardBack />
                                            </div>

                                            {/* Front of Card */}
                                            <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl overflow-hidden border border-white/10 bg-[#0a0a16] shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
                                                <div className={`w-full h-full transition-transform duration-500 ${data.isReversed ? 'rotate-180' : ''}`}>
                                                    <img src={data.card.img} alt={data.card.name} className="w-full h-full object-cover" />
                                                </div>
                                                
                                                {/* Card Label Overlay */}
                                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
                                                    <h3 className="text-lg font-serif font-bold text-amber-50 mb-1 leading-tight flex items-center gap-2">
                                                        {data.card.name}
                                                    </h3>
                                                    {data.isReversed && (
                                                        <span className="text-[9px] bg-red-900/60 border border-red-500/30 px-2 py-0.5 rounded text-red-200 uppercase tracking-widest font-bold">
                                                            Reversert
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Insight (Visible after reveal) */}
                                    <div className={`mt-4 w-full text-center transition-all duration-1000 delay-300 ${revealed[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                        <p className="text-indigo-200/80 text-xs font-medium leading-relaxed italic border-t border-indigo-500/20 pt-2">
                                            "{data.card.keywords[0]} & {data.card.keywords[1]}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* IMMERSIVE REPORT OVERLAY */}
            {(report || isGenerating) && revealed.every(Boolean) && cards.length > 0 && (
                <div className="fixed inset-0 z-[100] bg-[#050511]/95 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-500">
                    <div className="max-w-3xl mx-auto p-6 md:p-12 pb-32">
                        
                        {/* Close Button */}
                        <button 
                            onClick={handleCloseReport}
                            className="fixed top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5 group"
                        >
                            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        <div className="text-center space-y-6 mb-16 mt-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-900/10 text-amber-200 text-[10px] tracking-[0.2em] uppercase font-bold shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                                <Sparkles size={12} />
                                Astro Mason Intelligence
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-white to-indigo-200 leading-tight">
                                {selectedSpread.name}
                            </h1>
                            <p className="text-indigo-300 text-sm font-light tracking-wide">
                                En dybdeanalyse for {selectedClient ? selectedClient.clientName : 'Gjest'}
                            </p>
                        </div>

                        {isGenerating ? (
                            <div className="flex flex-col items-center justify-center space-y-8 py-20">
                                <div className="relative">
                                    <div className="w-24 h-24 border border-indigo-500/20 rounded-full"></div>
                                    <div className="absolute inset-0 w-24 h-24 border-t-2 border-amber-400 rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Sparkles className="text-amber-200 animate-pulse" size={24} />
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-indigo-100 font-serif text-xl animate-pulse">Syntetiserer arketyper...</p>
                                    <p className="text-indigo-400/60 text-xs uppercase tracking-[0.2em]">Kobler elementer og dignities</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-12 animate-slide-up">
                                {/* Main Report Card */}
                                <div className="relative p-8 md:p-12 rounded-3xl bg-[#0a0a16] border border-white/10 shadow-2xl overflow-hidden group">
                                    {/* Shining Edge */}
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-50"></div>
                                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] group-hover:bg-indigo-600/20 transition-colors duration-1000"></div>
                                    
                                    <div className="relative z-10 prose prose-invert prose-lg max-w-none 
                                        prose-headings:font-serif prose-headings:text-amber-100 
                                        prose-p:text-slate-300 prose-p:font-light prose-p:leading-8
                                        prose-strong:text-white prose-strong:font-semibold
                                        prose-li:text-slate-300">
                                        <div className="whitespace-pre-wrap">
                                            {report}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button 
                                        className="p-5 rounded-2xl bg-[#0f0f25] border border-white/5 hover:border-amber-500/30 hover:bg-[#151530] transition-all text-left group flex items-center gap-4"
                                    >
                                        <div className="p-3 bg-indigo-900/30 rounded-xl text-amber-200 group-hover:scale-110 transition-transform">
                                            <Save size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-white text-lg group-hover:text-amber-100 transition-colors">Lagre i Journal</h3>
                                            <p className="text-xs text-slate-500">Bevar innsikten for ettertiden.</p>
                                        </div>
                                    </button>
                                    
                                    <button 
                                        onClick={handleCloseReport}
                                        className="p-5 rounded-2xl bg-[#0f0f25] border border-white/5 hover:border-indigo-500/30 hover:bg-[#151530] transition-all text-left group flex items-center gap-4"
                                    >
                                        <div className="p-3 bg-indigo-900/30 rounded-xl text-indigo-200 group-hover:scale-110 transition-transform">
                                            <RotateCcw size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-white text-lg group-hover:text-indigo-100 transition-colors">Ny Lesning</h3>
                                            <p className="text-xs text-slate-500">Start på nytt med blanke ark.</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tarot;