
import React, { useState, useEffect, createContext, useRef } from 'react';
import { Sparkles, Sun, Loader2, X, ChevronRight, Download, Save, Scroll, RefreshCw, Fingerprint, Heart, Zap, Compass, Star, Printer, Lock, Shield, CheckCircle, Info, Users, User, LayoutDashboard, History, UserCircle, Activity, MapPin, Calendar, Globe, Clock as ClockIcon, Settings as SettingsIcon, Menu } from './components/Icons';
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
  
  const [transitAge, setTransitAge] = useState(0);
  const [transitDate, setTransitDate] = useState(new Date().toISOString().split('T')[0]);

  const t = UI_TRANSLATIONS[lang];

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
            if (subMode === 'natal') setActiveChart(chart);
            
            const birthDate = new Date(birthData.date);
            const current = new Date();
            const age = current.getFullYear() - birthDate.getFullYear();
            setTransitAge(Math.max(0, age));
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
        if (confirm(`En komplett Livsbok koster ${cost} kreditter. Vil du fylle på i innstillinger?`)) {
            setActiveTab('settings');
        }
        return;
    }

    if (!activeChart) return;
    setIsLoading(true);
    setLoadingText('AstroMason dechiffrerer din sjel...');
    try {
      const data = await AstrologyService.generateAIReport(
        activeChart,
        type,
        astrologyMode,
        lang,
        natalChart || undefined
      );
      
      if (sub !== 'Master') {
        localStorage.setItem('tarot_credits', (credits - cost).toString());
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
          {isInitialLoading || isVerifying ? (
            <div className="flex flex-col items-center justify-center h-[80vh] space-y-8 animate-fade-in">
               <div className="relative">
                  <Loader2 className="animate-spin text-amber-500" size={80} />
                  <Star className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-200/40 animate-pulse" size={32} />
               </div>
               <div className="text-center space-y-2">
                  <p className="font-serif text-2xl text-amber-100 italic">Sjekker fødselsdata i arkivene...</p>
                  <p className="text-[10px] uppercase text-slate-500 tracking-[0.4em] font-black">Dechiffrerer dine kosmiske koordinater</p>
               </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
              {activeTab === 'horoscope' && <Horoscope natalChart={natalChart} />}
              {activeTab === 'chinese' && <ChineseAstrology />}
              {activeTab === 'profile' && <Profile onUpdate={() => refreshNatalData(true)} />}
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
                            <h3 className="font-serif text-2xl text-white">Din Sjels Kronike</h3>
                            <p className="text-slate-400 text-sm font-light leading-relaxed">
                                En dyptgående analyse på 4000+ ord som dechiffrerer din sjel, dine karmiske bånd og ditt fulle potensial.
                            </p>
                            <div className="pt-4 flex items-center justify-between border-t border-white/5">
                                <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400">Pris for analyse</span>
                                <span className="text-xl font-serif text-amber-500">5 Kreditter</span>
                            </div>
                         </div>
                         <button onClick={() => generateReport(subMode)} className="w-full py-8 bg-gradient-to-r from-amber-400 to-amber-600 rounded-[2.5rem] font-black uppercase text-xs text-black shadow-2xl hover:scale-[1.02] transition-all">
                            <Scroll size={20} className="inline mr-2" /> Skriv Min Livsbok
                         </button>
                      </div>
                   </div>
                </div>
              )}
              {activeTab === 'astrology' && !natalChart && (
                <div className="max-w-xl mx-auto py-12 animate-fade-in no-print text-center">
                   <div className="bg-[#0f0f25]/80 p-12 rounded-[4rem] border border-white/5 space-y-10 backdrop-blur-md">
                     <UserCircle size={80} className="mx-auto text-indigo-400 opacity-20" />
                     <div className="space-y-4">
                        <h2 className="text-4xl font-serif text-amber-100">Identitet mangler</h2>
                        <p className="text-slate-400">Vi kunne ikke finne dine fødselsdata. Du må konfigurere din profil i Sjelssenteret før stjernene kan tale.</p>
                     </div>
                     <button onClick={() => setActiveTab('profile')} className="px-12 py-5 bg-indigo-600 rounded-2xl font-black uppercase text-xs text-white hover:bg-indigo-500 transition-all flex items-center gap-3 mx-auto shadow-xl shadow-indigo-900/40">
                        Gå til Sjelssenteret <ChevronRight size={16} />
                     </button>
                   </div>
                </div>
              )}
              {activeTab === 'astrology' && showReport && reportData && (
                <div className="max-w-4xl mx-auto py-12 animate-fade-in space-y-12 pb-32">
                  <div className="bg-[#0a0a1a] p-6 md:p-20 rounded-[2.5rem] md:rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
                    <button onClick={() => setShowReport(false)} className="absolute top-8 left-8 p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all text-slate-400 no-print">
                      <X size={20} />
                    </button>
                    <header className="text-center space-y-4 mb-16">
                      <h1 className="text-4xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-amber-500 leading-tight">
                        {reportData.title}
                      </h1>
                      <p className="text-xs md:text-sm uppercase tracking-widest text-slate-500 font-black">
                        {new Date().toLocaleDateString()} • {subMode.toUpperCase()}
                      </p>
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
