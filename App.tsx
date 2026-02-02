
import React, { useState, useEffect, createContext, useRef } from 'react';
import { Sparkles, Sun, Loader2, X, ChevronRight, Download, Save, Scroll, RefreshCw, Fingerprint, Heart, Zap, Compass, Star, Printer, Lock, Shield, CheckCircle, Info, Users, User, LayoutDashboard, History, UserCircle, Activity, MapPin, Calendar, Globe, Clock as ClockIcon } from './components/Icons';
import Tarot from './components/Tarot';
import Numerology from './components/Numerology';
import ChartWheel from './components/ChartWheel';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import Horoscope from './components/Horoscope';
import ChineseAstrology from './components/ChineseAstrology';
import LandingPage from './components/LandingPage';
import { AstrologyService } from './services/astrology';
import { CalculatedChart, Language, PlanetPosition, AstrologyMode } from './types';
import { UI_TRANSLATIONS } from './constants';

export const LangContext = createContext<{lang: Language, setLang: (l: Language) => void}>({} as any);
export const ThemeContext = createContext<{theme: 'light' | 'dark', setTheme: (t: 'light' | 'dark') => void}>({} as any);

export default function AstroMasonApp() {
  const [lang, setLang] = useState<Language>('no');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [natalChart, setNatalChart] = useState<CalculatedChart | null>(null);
  const [activeChart, setActiveChart] = useState<CalculatedChart | null>(null);
  const [relocatedChart, setRelocatedChart] = useState<CalculatedChart | null>(null);
  const [transitChart, setTransitChart] = useState<CalculatedChart | null>(null);
  
  const [showReport, setShowReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Konsulterer arkivene...');
  const [reportData, setReportData] = useState<any>(null);
  const [isArchiving, setIsArchiving] = useState(false);
  const [subMode, setSubMode] = useState<string>('natal');
  const [astrologyMode, setAstrologyMode] = useState<AstrologyMode>('esoteric');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [relocationCity, setRelocationCity] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetPosition | null>(null);
  
  // Timeline State
  const [transitAge, setTransitAge] = useState(0);
  const [transitDate, setTransitDate] = useState(new Date().toISOString().split('T')[0]);
  const [isCalculatingTransit, setIsCalculatingTransit] = useState(false);

  const t = UI_TRANSLATIONS[lang];

  const TRADITION_OPTIONS = [
    { id: 'esoteric', label: t.esotericTitle, icon: Sparkles },
    { id: 'classical', label: t.classicalTitle, icon: Scroll },
    { id: 'merged', label: t.modernTitle, icon: Sun },
    { id: 'vedic', label: t.vedicTitle, icon: Globe },
  ];

  const ANALYSIS_OPTIONS = [
    { id: 'natal', label: t.natalTitle, icon: UserCircle },
    { id: 'transit', label: t.transitTitle, icon: Activity },
    { id: 'relocation', label: t.relocationTitle, icon: MapPin },
  ];

  const refreshNatalData = async () => {
    const savedName = localStorage.getItem('soul_name');
    if (savedName) {
      const birthData = {
          name: savedName,
          date: localStorage.getItem('soul_date') || '',
          time: localStorage.getItem('soul_time') || '',
          location: localStorage.getItem('soul_location') || '',
          houseSystem: localStorage.getItem('soul_houses') || 'Placidus'
      };
      if (birthData.name && birthData.date) {
          const chart = await AstrologyService.calculateChart(birthData, astrologyMode);
          setNatalChart(chart);
          if (subMode === 'natal') setActiveChart(chart);
          
          // Calculate initial age and date
          const birthDate = new Date(birthData.date);
          const current = new Date();
          const age = current.getFullYear() - birthDate.getFullYear();
          setTransitAge(Math.max(0, age));
          setTransitDate(current.toISOString().split('T')[0]);
      }
    }
    setIsInitialLoading(false);
  };

  useEffect(() => { refreshNatalData(); }, [astrologyMode]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    const hasData = localStorage.getItem('soul_name');
    if (!hasData) {
      setActiveTab('profile');
    } else {
      setActiveTab('dashboard');
    }
  };

  const calculateTransitsForDate = async (dateStr: string) => {
    if (!natalChart) return;
    setIsCalculatingTransit(true);
    try {
      const birthDate = new Date(natalChart.date);
      const targetDate = new Date(dateStr);
      
      // Update Age
      const age = targetDate.getFullYear() - birthDate.getFullYear();
      setTransitAge(Math.max(0, age));

      const transitData = await AstrologyService.calculateChart({
        name: `Livsløp: ${dateStr}`,
        date: dateStr,
        time: natalChart.time || '12:00',
        location: natalChart.location,
        houseSystem: localStorage.getItem('soul_houses') || 'Placidus'
      }, astrologyMode);
      
      setTransitChart(transitData);
      setActiveChart(transitData);
    } catch (e) {
      console.error("Transit calculation failed", e);
    } finally {
      setIsCalculatingTransit(false);
    }
  };

  const handleAgeChange = (age: number) => {
    if (!natalChart) return;
    setTransitAge(age);
    const birthDate = new Date(natalChart.date);
    const targetDate = new Date(birthDate);
    targetDate.setFullYear(birthDate.getFullYear() + age);
    const dateStr = targetDate.toISOString().split('T')[0];
    setTransitDate(dateStr);
    calculateTransitsForDate(dateStr);
  };

  // Sync transit age when subMode changes to transit
  useEffect(() => {
    if (subMode === 'transit' && natalChart) {
      calculateTransitsForDate(transitDate);
    }
  }, [subMode]);

  const generateReport = async (type: string) => {
    if (!activeChart || !natalChart) return;
    setIsLoading(true);
    setLoadingText('Skriver din livsbok...');
    try {
      const data = await AstrologyService.generateAIReport(activeChart, type, astrologyMode, lang, natalChart);
      setReportData(data);
      setShowReport(true);
    } catch (e) {
      setErrorMsg("Rapportgenerering feilet.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) return (
    <LangContext.Provider value={{ lang, setLang }}>
        <LandingPage onLogin={handleLogin} />
    </LangContext.Provider>
  );

  return (
    <LangContext.Provider value={{ lang, setLang }}>
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-[#050511] text-white' : 'bg-slate-50 text-slate-900'} selection:bg-indigo-500/30 font-sans`}>
        <Sidebar currentView={activeTab} setView={(v) => { setShowReport(false); setSelectedPlanet(null); setActiveTab(v); if(v === 'astrology') refreshNatalData(); }} isMobileOpen={false} setIsMobileOpen={() => {}} onLogout={() => setIsAuthenticated(false)} />

        <main className="flex-1 overflow-y-auto p-6 md:p-12">
          {isInitialLoading ? (
            <div className="flex flex-col items-center justify-center h-[80vh] space-y-8">
               <Loader2 className="animate-spin text-amber-500" size={64} />
               <p className="font-serif text-xl text-amber-100 animate-pulse">Sjekker sjelens arkiver...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
              {activeTab === 'horoscope' && <Horoscope natalChart={natalChart} />}
              {activeTab === 'chinese' && <ChineseAstrology />}

              {activeTab === 'astrology' && !natalChart && (
                <div className="max-w-xl mx-auto py-12 animate-fade-in no-print text-center">
                   <div className="bg-[#0f0f25]/80 p-12 rounded-[4rem] border border-white/5 space-y-10 backdrop-blur-md">
                     <UserCircle size={80} className="mx-auto text-indigo-400 opacity-20" />
                     <div className="space-y-4">
                        <h2 className="text-4xl font-serif text-amber-100">Identitet mangler</h2>
                        <p className="text-slate-400">Vi kunne ikke finne fødselsdataene dine. Gå til Sjelssenteret for å koble deg til de kosmiske strømmene.</p>
                     </div>
                     <button onClick={() => setActiveTab('profile')} className="px-12 py-5 bg-indigo-600 rounded-2xl font-black uppercase text-xs text-white hover:bg-indigo-500 transition-all">Gå til Sjelssenteret</button>
                   </div>
                </div>
              )}

              {activeTab === 'astrology' && natalChart && !showReport && (
                <div className="max-w-7xl mx-auto space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 no-print">
                     <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-amber-500">{t.traditionLabel}</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {TRADITION_OPTIONS.map(opt => (
                                <button key={opt.id} onClick={() => {setAstrologyMode(opt.id as any); setSelectedPlanet(null);}} className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${astrologyMode === opt.id ? 'bg-amber-500 border-amber-400 text-black' : 'bg-black/20 border-white/5 text-slate-500 hover:bg-white/5'}`}>
                                    <opt.icon size={18} />
                                    <div className="leading-tight">
                                        <p className="text-[10px] font-black uppercase">{opt.label}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                     </div>

                     <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400">{t.analysisLabel}</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {ANALYSIS_OPTIONS.map(opt => (
                                <button key={opt.id} onClick={() => { 
                                    setSubMode(opt.id);
                                    setSelectedPlanet(null);
                                    if (opt.id === 'natal') setActiveChart(natalChart);
                                    if (opt.id === 'relocation' && relocatedChart) setActiveChart(relocatedChart);
                                    if (opt.id === 'transit') calculateTransitsForDate(transitDate);
                                }} className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${subMode === opt.id ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-black/20 border-white/5 text-slate-500 hover:bg-white/5'}`}>
                                    <opt.icon size={18} />
                                    <div className="leading-tight">
                                        <p className="text-[10px] font-black uppercase">{opt.label}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 print-container">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 relative overflow-hidden chart-to-print shadow-2xl">
                           <div className="absolute top-10 left-12 z-10">
                              <h4 className="text-xl font-serif text-amber-100">{activeChart?.clientName}</h4>
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest">{subMode === 'transit' ? `Livsløp: ${transitDate} (${transitAge} år)` : activeChart?.location}</p>
                           </div>
                           <div className="absolute top-10 right-12 z-10 no-print">
                              <button onClick={() => window.print()} className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-amber-500 transition-all shadow-xl">
                                 <Printer size={20} />
                              </button>
                           </div>
                           {activeChart && (
                             <div className={isCalculatingTransit ? 'opacity-20 transition-opacity' : 'opacity-100'}>
                                <ChartWheel positions={activeChart.positions} ascendantDegree={activeChart.ascendantDegree} houses={activeChart.houseCusps} aspects={activeChart.aspects} onPlanetClick={setSelectedPlanet} />
                             </div>
                           )}
                           {isCalculatingTransit && (
                             <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="animate-spin text-amber-500" size={48} />
                             </div>
                           )}
                        </div>
                        
                        {subMode === 'transit' && (
                            <div className="bg-[#0f0f25]/80 backdrop-blur-md p-8 rounded-[3rem] border border-indigo-500/30 space-y-6 no-print">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest ml-1">Velg Spesifikk Dato</label>
                                        <input 
                                          type="date" 
                                          value={transitDate} 
                                          onChange={(e) => {
                                            setTransitDate(e.target.value);
                                            calculateTransitsForDate(e.target.value);
                                          }}
                                          className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-amber-500 outline-none"
                                        />
                                    </div>
                                    <div className="text-right">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Livets Fase</h4>
                                        <span className="text-4xl font-serif text-amber-400">{transitAge} år</span>
                                    </div>
                                 </div>

                                 <div className="space-y-4 pt-4 border-t border-white/5">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={transitAge} 
                                        onChange={(e) => handleAgeChange(parseInt(e.target.value))}
                                        className="w-full h-2 bg-indigo-900/50 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                        <span>Fødsel</span>
                                        <span>Livets Midtvei</span>
                                        <span>Fullbyrdelse</span>
                                    </div>
                                 </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-5 space-y-8 no-print">
                      {selectedPlanet ? (
                        <div className="bg-[#0f0f25] p-10 rounded-[3rem] border border-amber-500/30 space-y-6 animate-slide-up shadow-2xl relative overflow-hidden">
                          <div className="absolute -top-10 -right-10 opacity-5">
                            <Sparkles size={140} />
                          </div>
                          <button onClick={() => setSelectedPlanet(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={20}/></button>
                          <div className="flex items-center gap-4">
                             <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-4xl text-amber-500 border border-amber-500/20">{selectedPlanet.symbol}</div>
                             <div>
                                <h4 className="text-2xl font-serif text-white">{selectedPlanet.name}</h4>
                                <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest">{selectedPlanet.sign} {selectedPlanet.degree}° {selectedPlanet.minute}'</p>
                             </div>
                          </div>
                          <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="bg-black/30 p-4 rounded-xl">
                               <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Hus-plassering</p>
                               <p className="text-sm text-indigo-200">Plassert i ditt {selectedPlanet.house}. hus</p>
                            </div>
                            <div className="text-slate-300 text-sm leading-relaxed font-light italic">
                               {selectedPlanet.isRetrograde && <p className="text-red-400 text-[10px] font-black uppercase mb-2">● Retrograd - Indre refleksjon påkrevd</p>}
                               <span>Dette indikerer en dyp kobling til sjelens {selectedPlanet.house}. livsområde. Se etter aspekter i kartet for å forstå hvordan denne energien flyter.</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#0f0f25]/40 p-10 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px] border-dashed">
                           {subMode === 'transit' ? (
                             <>
                               <ClockIcon size={48} className="text-indigo-500/40" />
                               <div className="space-y-2">
                                  <p className="font-serif italic text-slate-400 text-lg">Livets Porter ved {transitAge} år</p>
                                  <div className="flex flex-col gap-2">
                                    <span className={`text-[10px] px-3 py-1 rounded-full border ${transitAge >= 28 && transitAge <= 30 ? 'bg-amber-500/20 border-amber-500 text-amber-200' : 'bg-white/5 border-white/5 text-slate-600'}`}>SATURN RETUR (28-30 år)</span>
                                    <span className={`text-[10px] px-3 py-1 rounded-full border ${transitAge >= 40 && transitAge <= 44 ? 'bg-amber-500/20 border-amber-500 text-amber-200' : 'bg-white/5 border-white/5 text-slate-600'}`}>URANUS OPPOSISJON (40-44 år)</span>
                                    <span className={`text-[10px] px-3 py-1 rounded-full border ${transitAge >= 50 && transitAge <= 52 ? 'bg-amber-500/20 border-amber-500 text-amber-200' : 'bg-white/5 border-white/5 text-slate-600'}`}>CHIRON RETUR (50-52 år)</span>
                                  </div>
                               </div>
                             </>
                           ) : (
                             <>
                               <Compass size={48} className="text-slate-700" />
                               <p className="font-serif italic text-slate-500">Trykk på en planet for å lese sjelens melding</p>
                             </>
                           )}
                        </div>
                      )}

                      <button onClick={() => generateReport(subMode)} className="w-full py-8 bg-gradient-to-r from-amber-400 to-amber-600 rounded-[2.5rem] font-black uppercase text-xs text-black shadow-2xl hover:scale-[1.02] transition-all">
                        <Scroll size={20} className="inline mr-2" /> {subMode === 'transit' ? `Skriv Livsbok for år ${transitAge}` : t.writeBook}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && <Profile />}
              {activeTab === 'tarot' && <Tarot />}
              {activeTab === 'numerology' && <Numerology />}
            </>
          )}
        </main>

        {isLoading && (
          <div className="fixed inset-0 z-[500] bg-[#050511]/90 backdrop-blur-3xl flex flex-col items-center justify-center space-y-8">
            <div className="relative">
              <Loader2 className="animate-spin text-amber-500" size={120} />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-200 animate-pulse" size={48} />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-serif text-amber-100">{loadingText}</h2>
              <p className="text-slate-500 text-xs uppercase tracking-[0.5em] font-black">Dekrypterer kosmos...</p>
            </div>
          </div>
        )}
      </div>
    </ThemeContext.Provider>
    </LangContext.Provider>
  );
}
