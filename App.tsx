
import React, { useState, useEffect, createContext, useRef } from 'react';
import { Sparkles, Sun, Loader2, X, ChevronRight, Download, Save, Scroll, RefreshCw, Fingerprint, Heart, Zap, Compass, Star, Printer, Lock, Shield, CheckCircle, Info, Users, User, LayoutDashboard, History, UserCircle, Activity, MapPin, Calendar, Globe, Clock as ClockIcon, Settings as SettingsIcon, Menu, Wallet } from './components/Icons';
import Tarot from './components/Tarot';
import Numerology from './components/Numerology';
import ChartWheel from './components/ChartWheel';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import Horoscope from './components/Horoscope';
import ChineseAstrology from './components/ChineseAstrology';
import LandingPage from './components/LandingPage';
import AdminCRM from './components/AdminCRM';
import Settings from './components/Settings';
import Tools from './components/Tools';
import Logo from './components/Logo';
import { AstrologyService } from './services/astrology';
import { CalculatedChart, Language, PlanetPosition, AstrologyMode } from './types';
import { UI_TRANSLATIONS } from './constants';

export const LangContext = createContext<{lang: Language, setLang: (l: Language) => void}>({} as any);
export const ThemeContext = createContext<{theme: 'light' | 'dark', setTheme: (t: 'light' | 'dark') => void}>({} as any);

export default function AstroMasonApp() {
  const [lang, setLang] = useState<Language>('no');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [natalChart, setNatalChart] = useState<CalculatedChart | null>(null);
  const [activeChart, setActiveChart] = useState<CalculatedChart | null>(null);
  
  const [showReport, setShowReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loadingText, setLoadingText] = useState('Konsulterer arkivene...');
  const [reportData, setReportData] = useState<any>(null);
  const [subMode, setSubMode] = useState<string>('natal');
  const [astrologyMode, setAstrologyMode] = useState<AstrologyMode>('esoteric');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetPosition | null>(null);
  
  const [userCredits, setUserCredits] = useState<number>(0);
  const [subscription, setSubscription] = useState<string>('None');

  const t = UI_TRANSLATIONS[lang];

  useEffect(() => {
    const updateStats = () => {
      const creds = parseInt(localStorage.getItem('tarot_credits') || '0');
      const sub = localStorage.getItem('soul_subscription') || 'None';
      setUserCredits(creds);
      setSubscription(sub);
    };

    const handleNavigate = (e: any) => {
      if (e.detail) setActiveTab(e.detail);
    };

    updateStats();
    window.addEventListener('storage', updateStats);
    window.addEventListener('navigate', handleNavigate as any);
    
    const interval = setInterval(updateStats, 2000);
    return () => {
      window.removeEventListener('storage', updateStats);
      window.removeEventListener('navigate', handleNavigate as any);
      clearInterval(interval);
    };
  }, []);

  const handleLogin = (userData: { email: string; isAdmin: boolean }) => {
    setIsAuthenticated(true);
    setIsAdmin(userData.isAdmin);
    localStorage.setItem('soul_email', userData.email.toLowerCase());
    
    const hasName = localStorage.getItem('soul_name');
    const hasDate = localStorage.getItem('soul_date');
    const isProfileComplete = hasName && hasDate;

    if (userData.isAdmin) {
      setActiveTab('crm');
    } else if (!isProfileComplete) {
      setActiveTab('profile');
    } else {
      setActiveTab('dashboard');
    }
  };

  const refreshNatalData = async (silent = false) => {
    if (!silent) setIsVerifying(true);
    try {
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
            setActiveChart(chart);
        }
      }
    } catch (e) {
      console.error("Klarte ikke å laste kartdata", e);
    } finally {
      setIsInitialLoading(false);
      setIsVerifying(false);
    }
  };

  useEffect(() => { refreshNatalData(true); }, [astrologyMode]);

  const generateReport = async (type: string) => {
    const sub = localStorage.getItem('soul_subscription');
    const credits = parseInt(localStorage.getItem('tarot_credits') || '0');
    const cost = 5;

    if (sub !== 'Master' && credits < cost) {
        setActiveTab('settings');
        return;
    }

    if (!activeChart) {
      await refreshNatalData();
    }
    
    setIsLoading(true);
    setLoadingText('AstroMason dechiffrerer din sjel...');
    try {
      const data = await AstrologyService.generateAIReport(
        activeChart || natalChart!,
        type,
        astrologyMode,
        lang,
        natalChart || undefined
      );
      
      if (sub !== 'Master') {
        const newCredits = credits - cost;
        localStorage.setItem('tarot_credits', newCredits.toString());
        window.dispatchEvent(new Event('storage'));
      }
      
      setReportData(data);
      setShowReport(true);
    } catch (e) {
      console.error(e);
      alert("Kunne ikke koble til de dype arkivene akkurat nå.");
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
      <div className={`min-h-screen flex flex-col lg:flex-row ${theme === 'dark' ? 'bg-[#050511] text-white' : 'bg-slate-50 text-slate-900'} selection:bg-indigo-500/30 font-sans`}>
        
        {/* Mobile Top Bar */}
        <header className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-[#0a0a16]/90 backdrop-blur-lg border-b border-white/5 z-40 flex items-center justify-between px-6 py-2">
          <div className="flex-1"></div>
          <div className="flex-1 flex justify-center">
             <Logo size={40} showText={true} />
          </div>
          <div className="flex-1 flex justify-end">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        <Sidebar 
          currentView={activeTab} 
          setView={(v) => { 
            setShowReport(false); 
            setSelectedPlanet(null); 
            setActiveTab(v); 
            if(v === 'astrology') refreshNatalData(); 
          }} 
          isMobileOpen={isMobileMenuOpen} 
          setIsMobileOpen={setIsMobileMenuOpen} 
          onLogout={() => { 
            localStorage.clear(); 
            setIsAuthenticated(false); 
            setIsAdmin(false); 
          }}
          isAdmin={isAdmin}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-12 mt-20 lg:mt-0">
          {/* Header Status Bar */}
          <div className="max-w-7xl mx-auto mb-12 no-print flex justify-end">
              <div onClick={() => setActiveTab('settings')} className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl cursor-pointer hover:border-amber-500/30 transition-all group">
                  <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Status</p>
                      <p className="text-sm font-serif text-amber-500">
                        {subscription === 'Master' ? 'Master-medlem' : `${userCredits} Kreditter`}
                      </p>
                  </div>
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 group-hover:scale-110 transition-transform">
                      <Wallet size={18} />
                  </div>
              </div>
          </div>

          {isInitialLoading || isVerifying ? (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-8 animate-fade-in">
               <div className="relative">
                  <Loader2 className="animate-spin text-amber-500" size={80} />
                  <Star className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-200/40 animate-pulse" size={32} />
               </div>
               <div className="text-center space-y-2">
                  <p className="font-serif text-2xl text-amber-100 italic">Dechiffrerer dine kosmiske koordinater...</p>
               </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
              {activeTab === 'horoscope' && <Horoscope natalChart={natalChart} />}
              {activeTab === 'chinese' && <ChineseAstrology />}
              {activeTab === 'profile' && <Profile onUpdate={() => { refreshNatalData(true); setActiveTab('dashboard'); }} />}
              {activeTab === 'tarot' && <Tarot onNavigateToSettings={() => setActiveTab('settings')} />}
              {activeTab === 'numerology' && <Numerology />}
              {activeTab === 'crm' && isAdmin && <AdminCRM />}
              {activeTab === 'settings' && <Settings />}
              
              {activeTab === 'astrology' && natalChart && !showReport && (
                <div className="space-y-12">
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                      <div className="lg:col-span-7">
                         <div className="bg-white/5 p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-white/10 chart-to-print shadow-2xl">
                            {activeChart && (
                                <ChartWheel positions={activeChart.positions} ascendantDegree={activeChart.ascendantDegree} houses={activeChart.houseCusps} aspects={activeChart.aspects} onPlanetClick={setSelectedPlanet} />
                            )}
                         </div>
                      </div>
                      <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
                         <div className="bg-indigo-900/10 p-10 rounded-[3rem] border border-indigo-500/20 space-y-4">
                            <div className="flex justify-between items-start">
                                <h3 className="font-serif text-3xl text-white">Din Sjels Kronike</h3>
                                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><Scroll size={24} /></div>
                            </div>
                            <p className="text-slate-400 text-sm font-light leading-relaxed">
                                En dyptgående analyse på 4000+ ord som dechiffrerer din sjel, dine karmiske bånd og ditt fulle potensial.
                            </p>
                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400">Pris for analyse</span>
                                <span className="text-xl font-serif text-amber-500">5 Kreditter</span>
                            </div>
                         </div>
                         
                         <div className="space-y-4">
                             {subscription !== 'Master' && userCredits < 5 ? (
                                <button onClick={() => setActiveTab('settings')} className="w-full py-8 bg-white/5 border border-white/10 rounded-[2.5rem] font-black uppercase text-xs text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                                   <Wallet size={20} className="text-amber-500" /> Kjøp Kreditter for å Skrive
                                </button>
                             ) : (
                                <button onClick={() => generateReport(subMode)} className="w-full py-8 bg-gradient-to-r from-amber-400 to-amber-600 rounded-[2.5rem] font-black uppercase text-xs text-black shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                                   <Scroll size={20} /> Skriv Min Livsbok Nå
                                </button>
                             )}
                             <p className="text-center text-[9px] text-slate-500 uppercase tracking-widest font-black">
                                Analysen tar ca. 20-30 sekunder å generere
                             </p>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {isLoading && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center space-y-10">
                   <div className="relative">
                      <Loader2 className="animate-spin text-amber-500" size={100} />
                      <Logo size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
                   </div>
                   <div className="space-y-4 max-w-md">
                      <h2 className="text-4xl font-serif text-white italic">{loadingText}</h2>
                      <div className="h-[2px] w-48 bg-white/5 mx-auto rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 animate-[loading_2s_ease-in-out_infinite]"></div>
                      </div>
                      <p className="text-[10px] uppercase text-slate-500 tracking-[0.4em] font-black">Arkivene dechiffreres...</p>
                   </div>
                </div>
              )}

              {activeTab === 'astrology' && showReport && reportData && (
                <div className="max-w-4xl mx-auto py-12 animate-fade-in space-y-12 pb-32">
                  <div className="bg-[#0a0a1a] p-6 md:p-20 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
                    <button onClick={() => setShowReport(false)} className="absolute top-8 left-8 p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all text-slate-400 no-print">
                      <X size={20} />
                    </button>
                    <header className="text-center space-y-4 mb-16">
                      <h1 className="text-4xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-amber-500 leading-tight">
                        {reportData.title}
                      </h1>
                    </header>
                    <article className="prose prose-invert prose-lg md:prose-xl max-w-none text-slate-300 leading-[2.2] font-light whitespace-pre-wrap">
                      <div className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-3 first-letter:float-left mb-12">
                        {reportData.essenceSummary}
                      </div>
                      {reportData.planetChapters?.map((chapter: any, i: number) => (
                        <div key={i} className="mb-12">
                          <h3 className="text-2xl font-serif text-amber-100 mb-4">{chapter.planet}</h3>
                          <div className="text-slate-400 font-light">{chapter.content}</div>
                        </div>
                      ))}
                      <div className="mt-12 pt-12 border-t border-white/5 italic text-amber-500/80 text-center text-2xl md:text-3xl font-serif">
                        {reportData.mantra}
                      </div>
                    </article>
                  </div>
                </div>
              )}
              {activeTab === 'tools' && <Tools onNavigateToSettings={() => setActiveTab('settings')} />}
            </div>
          )}
        </main>
      </div>
    </ThemeContext.Provider>
    </LangContext.Provider>
  );
}
