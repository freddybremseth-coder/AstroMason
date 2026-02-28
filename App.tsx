
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
import SolarReturn from './components/SolarReturn';
import Progressions from './components/Progressions';
import TransitCalendar from './components/TransitCalendar';
import AiAssistant from './components/AiAssistant';
import { AstrologyService } from './services/astrology';
import { CalculatedChart, Language, PlanetPosition, AstrologyMode } from './types';
import { UI_TRANSLATIONS } from './constants';
import { authService, profileService } from './lib/supabase';

export const LangContext = createContext<{lang: Language, setLang: (l: Language) => void}>({} as any);
export const ThemeContext = createContext<{theme: 'light' | 'dark', setTheme: (t: 'light' | 'dark') => void}>({} as any);

export default function AstroMasonApp() {
  const [lang, setLang] = useState<Language>('no');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [astrologySubTab, setAstrologySubTab] = useState<'chart' | 'horoscope' | 'livsbok' | 'solretur' | 'progresjon' | 'kalender'>('chart');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [natalChart, setNatalChart] = useState<CalculatedChart | null>(null);
  const [activeChart, setActiveChart] = useState<CalculatedChart | null>(null);
  
  const [showReport, setShowReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [reportData, setReportData] = useState<any>(null);
  const [astrologyMode, setAstrologyMode] = useState<AstrologyMode>('esoteric');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetPosition | null>(null);
  
  const [userCredits, setUserCredits] = useState<number>(0);
  const [subscription, setSubscription] = useState<string>('None');
  const [userId, setUserId] = useState<string>('');

  const t = UI_TRANSLATIONS[lang];

  const refreshNatalData = async (silent = false) => {
    const savedName = localStorage.getItem('soul_name');
    const savedDate = localStorage.getItem('soul_date');
    
    if (!savedName || !savedDate) {
        setIsInitialLoading(false);
        setIsVerifying(false);
        return;
    }

    if (!silent) setIsVerifying(true);
    try {
      const birthData = {
          name: savedName,
          date: savedDate,
          time: localStorage.getItem('soul_time') || '12:00',
          location: localStorage.getItem('soul_location') || 'Oslo, Norge',
          houseSystem: localStorage.getItem('soul_houses') || 'Placidus'
      };
      const chart = await AstrologyService.calculateChart(birthData, astrologyMode);
      setNatalChart(chart);
      setActiveChart(chart);
      // Store key chart data for AI chat context
      const sun = chart.positions.find(p => p.name === 'Solen');
      const moon = chart.positions.find(p => p.name === 'Månen');
      if (sun) localStorage.setItem('soul_sun', `${sun.sign} ${sun.degree}°, Hus ${sun.house}`);
      if (moon) localStorage.setItem('soul_moon', `${moon.sign} ${moon.degree}°, Hus ${moon.house}`);
      localStorage.setItem('soul_asc', chart.ascendant);
      localStorage.setItem('soul_chart_summary', chart.positions.slice(0, 10).map(p => `${p.name}: ${p.sign} ${p.degree}°`).join(', '));
    } catch (e) {
      console.error("Klarte ikke å laste kartdata", e);
    } finally {
      setIsInitialLoading(false);
      setIsVerifying(false);
    }
  };

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
    
    // Check for existing Supabase session or localStorage fallback
    authService.getSession().then(({ user }) => {
      if (user) {
        const uid = user.id || user.email || '';
        const emailLower = (user.email || '').toLowerCase();
        // Ensure admin always has credits when session is restored
        if (emailLower === 'freddy.bremseth@gmail.com') {
          const saved = localStorage.getItem('tarot_credits');
          if (!saved || parseInt(saved) < 1) {
            localStorage.setItem('tarot_credits', '200000');
            window.dispatchEvent(new Event('storage'));
          }
        }
        setUserId(uid);
        setIsAdmin(false);
        setIsAuthenticated(true);
        profileService.get(uid).then(({ data }) => {
          if (data?.is_admin) setIsAdmin(true);
          if (data?.subscription) setSubscription(data.subscription);
          if (data?.credits !== undefined) setUserCredits(data.credits);
        });
        refreshNatalData(true);
      } else {
        setIsInitialLoading(false);
      }
    });

    const interval = setInterval(updateStats, 2000);
    return () => {
      window.removeEventListener('storage', updateStats);
      window.removeEventListener('navigate', handleNavigate as any);
      clearInterval(interval);
    };
  }, []);

  const handleLogin = (userData: { email: string; isAdmin: boolean; userId: string }) => {
    setIsAuthenticated(true);
    setIsAdmin(userData.isAdmin);
    setUserId(userData.userId);
    const emailLower = userData.email.toLowerCase();
    localStorage.setItem('soul_email', emailLower);
    // Ensure admin always has credits
    if (emailLower === 'freddy.bremseth@gmail.com') {
      const saved = localStorage.getItem('tarot_credits');
      if (!saved || parseInt(saved) < 1) {
        localStorage.setItem('tarot_credits', '200000');
        window.dispatchEvent(new Event('storage'));
      }
    }

    const hasName = localStorage.getItem('soul_name');
    const hasDate = localStorage.getItem('soul_date');
    const isProfileComplete = hasName && hasDate;

    refreshNatalData(true);

    if (userData.isAdmin) {
      setActiveTab('crm');
    } else if (!isProfileComplete) {
      setActiveTab('profile');
    } else {
      setActiveTab('dashboard');
    }
  };

  useEffect(() => { 
    if (isAuthenticated) {
        refreshNatalData(true); 
    }
  }, [astrologyMode, isAuthenticated]);

  const generateReport = async () => {
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
    setLoadingText(t.generatingReport);
    try {
      const data = await AstrologyService.generateAIReport(
        activeChart || natalChart!,
        'natal',
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
      alert(t.connectionError);
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

        {/* Mobile top header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0a0a16]/95 backdrop-blur-lg border-b border-white/5 z-40 flex items-center justify-between px-4">
          <div onClick={() => setActiveTab('settings')} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl cursor-pointer">
            <Wallet size={14} className="text-amber-500" />
            <span className="text-xs font-black text-amber-500">
              {subscription === 'Master' ? t.masterMemberLabel : `${userCredits}`}
            </span>
          </div>
          <Logo size={28} showText={true} />
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-400 hover:text-white"
          >
            <Menu size={22} />
          </button>
        </header>

        <Sidebar
          currentView={activeTab}
          setView={(v) => {
            setShowReport(false);
            setSelectedPlanet(null);
            setActiveTab(v);
          }}
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
          onLogout={async () => {
            await authService.signOut();
            localStorage.clear();
            setIsAuthenticated(false);
            setIsAdmin(false);
            setUserId('');
            setNatalChart(null);
            setActiveChart(null);
          }}
          isAdmin={isAdmin}
        />

        {/* Mobile bottom navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a16]/95 backdrop-blur-lg border-t border-white/5 flex items-center justify-around px-2 py-2 safe-area-pb">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: t.navDashboard },
            { id: 'astrology', icon: Sun, label: t.navAstrology },
            { id: 'tarot', icon: Sparkles, label: t.navTarot },
            { id: 'numerology', icon: Fingerprint, label: t.navNumerology },
            { id: 'profile', icon: UserCircle, label: t.navProfile },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setShowReport(false); setSelectedPlanet(null); setActiveTab(item.id); }}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${isActive ? 'text-amber-500' : 'text-slate-500'}`}
              >
                <Icon size={20} />
                <span className="text-[9px] font-black uppercase tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-12 mt-14 lg:mt-0 pb-24 lg:pb-6">
          <div className="max-w-7xl mx-auto mb-6 md:mb-12 no-print hidden lg:flex justify-end">
              <div onClick={() => setActiveTab('settings')} className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl cursor-pointer hover:border-amber-500/30 transition-all group">
                  <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{t.statusLabel}</p>
                      <p className="text-sm font-serif text-amber-500">
                        {subscription === 'Master' ? t.masterMemberLabel : `${userCredits} ${t.creditsLabel}`}
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
                  <p className="font-serif text-2xl text-amber-100 italic">{t.loadingCoords}</p>
               </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard onNavigate={(view) => {
            if (view === 'horoscope') { setActiveTab('astrology'); setAstrologySubTab('horoscope'); }
            else if (view === 'livsbok') { setActiveTab('astrology'); setAstrologySubTab('livsbok'); }
            else setActiveTab(view);
          }} />}
              {activeTab === 'chinese' && <ChineseAstrology />}
              {activeTab === 'profile' && <Profile onUpdate={() => { refreshNatalData(true); setActiveTab('dashboard'); }} userId={userId} />}
              {activeTab === 'tarot' && <Tarot onNavigateToSettings={() => setActiveTab('settings')} />}
              {activeTab === 'numerology' && <Numerology />}
              {activeTab === 'crm' && isAdmin && <AdminCRM />}
              {activeTab === 'settings' && <Settings />}
              {activeTab === 'tools' && <Tools onNavigateToSettings={() => setActiveTab('settings')} />}
              
              {activeTab === 'astrology' && (
                !natalChart ? (
                   <div className="max-w-xl mx-auto py-24 text-center space-y-8 animate-fade-in">
                    <div className="w-24 h-24 bg-amber-500/5 rounded-full flex items-center justify-center mx-auto border border-amber-500/20 text-amber-500">
                        <Calendar size={48} />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-serif text-white italic">{t.noProfileTitle}</h2>
                        <p className="text-slate-400 font-light leading-relaxed">{t.noProfileDesc}</p>
                        <button onClick={() => setActiveTab('profile')} className="px-10 py-4 bg-amber-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20">
                            {t.updateProfileNow}
                        </button>
                    </div>
                  </div>
                ) : (
                <div className="space-y-12">
                   <header className="flex flex-col gap-4 mb-8 md:mb-12">
                      <div className="text-center md:text-left">
                          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">{t.astrologyHub}</h2>
                          <p className="text-slate-500 text-xs uppercase tracking-[0.4em] font-black">{t.cosmicCompass}</p>
                      </div>
                      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 no-print">
                        <div className="flex gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/10 w-max sm:w-auto">
                         {[
                             { id: 'chart', label: t.tabChart, icon: Sun },
                             { id: 'horoscope', label: t.tabHoroscope, icon: Calendar },
                             { id: 'livsbok', label: t.tabLifeBook, icon: Scroll },
                             { id: 'solretur', label: t.tabSolarReturn, icon: Zap },
                             { id: 'progresjon', label: t.tabProgression, icon: RefreshCw },
                             { id: 'kalender', label: t.tabCalendar, icon: Star },
                         ].map(tab => (
                             <button key={tab.id} onClick={() => { setAstrologySubTab(tab.id as any); setShowReport(false); }} className={`px-3 py-2.5 rounded-xl flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${astrologySubTab === tab.id ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                                 <tab.icon size={12} /> {tab.label}
                             </button>
                         ))}
                        </div>
                      </div>
                   </header>

                   {astrologySubTab === 'chart' && (
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
                        <div className="lg:col-span-7">
                           <div className="bg-white/5 p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-white/10 chart-to-print shadow-2xl">
                              {activeChart && (
                                  <ChartWheel positions={activeChart.positions} ascendantDegree={activeChart.ascendantDegree} houses={activeChart.houseCusps} aspects={activeChart.aspects} onPlanetClick={setSelectedPlanet} />
                              )}
                           </div>
                        </div>
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] space-y-4">
                                <h3 className="font-serif text-2xl text-amber-100 italic">{t.planetaryPositions}</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {activeChart?.positions.map((p, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-amber-500/30 transition-all">
                                            <span className="flex items-center gap-3">
                                                <span className="text-xl text-amber-500">{p.symbol}</span>
                                                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">{p.name}</span>
                                            </span>
                                            <span className="text-xs text-slate-400 font-light">{p.degree}° {p.sign}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Annual Profections */}
                            {natalChart && (() => {
                              const birthDate = new Date(natalChart.date);
                              const today = new Date();
                              let age = today.getFullYear() - birthDate.getFullYear();
                              const hasBirthdayPassed = today >= new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
                              if (!hasBirthdayPassed) age--;
                              const profectedHouse = (age % 12) + 1;
                              const ZODIAC_SIGNS = t.zodiacSigns as string[];
                              const HOUSE_THEMES = t.houseThemes as Record<number, string>;
                              const PLANET_RULERS: Record<number, string> = {
                                1:'♂ Mars', 2:'♀ Venus', 3:'☿ Mercury', 4:'☽ Moon', 5:'☉ Sun',
                                6:'☿ Mercury', 7:'♀ Venus', 8:'♂ Mars', 9:'♃ Jupiter',
                                10:'♄ Saturn', 11:'♄ Saturn', 12:'♃ Jupiter'
                              };
                              // Ascendant from chart is stored in Norwegian; find index by Norwegian names
                              const ZODIAC_NO = ['Væren','Tyren','Tvillingene','Krepsen','Løven','Jomfruen','Vekten','Skorpionen','Skytten','Steinbukken','Vannmannen','Fiskene'];
                              const ascSign = natalChart.ascendant || ZODIAC_NO[0];
                              const ascIdx = ZODIAC_NO.indexOf(ascSign.replace(' Ascendant','').trim());
                              const houseSigns = Array.from({length: 12}, (_, i) => ZODIAC_SIGNS[(ascIdx + i + 12) % 12]);
                              const profectedSign = houseSigns[profectedHouse - 1] || ZODIAC_SIGNS[(profectedHouse - 1) % 12];
                              return (
                                <div className="bg-gradient-to-br from-amber-900/20 to-indigo-900/10 border border-amber-500/10 p-8 rounded-[2.5rem] space-y-4">
                                  <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/70">{t.annualProfections} · {t.ageLabel} {age}</p>
                                    <span className="text-[9px] px-3 py-1 bg-amber-500/10 rounded-full text-amber-400 font-black uppercase">{t.traditionalLabel}</span>
                                  </div>
                                  <div className="flex items-center gap-6">
                                    <div className="text-center bg-black/30 rounded-2xl p-5 min-w-[70px]">
                                      <p className="text-4xl font-serif text-amber-400">{profectedHouse}</p>
                                      <p className="text-[9px] text-slate-500 uppercase font-black mt-1">{t.houseLabel}</p>
                                    </div>
                                    <div className="space-y-2 flex-1">
                                      <p className="text-sm font-bold text-white">{HOUSE_THEMES[profectedHouse]}</p>
                                      <p className="text-xs text-slate-400">{t.yearLord}: <span className="text-amber-300 font-bold">{PLANET_RULERS[profectedHouse]}</span></p>
                                      <p className="text-[10px] text-slate-500">{t.profectedSign}: <span className="text-indigo-300">{profectedSign}</span></p>
                                    </div>
                                  </div>
                                  <p className="text-[10px] text-slate-600 italic">{t.profectionYearDesc}</p>
                                </div>
                              );
                            })()}
                        </div>
                     </div>
                   )}

                   {astrologySubTab === 'horoscope' && <Horoscope natalChart={natalChart} />}
                   {astrologySubTab === 'solretur' && natalChart && <SolarReturn natalChart={natalChart} />}
                   {astrologySubTab === 'progresjon' && natalChart && (
                     <Progressions
                       natalChart={natalChart}
                     />
                   )}
                   {astrologySubTab === 'kalender' && natalChart && <TransitCalendar natalChart={natalChart} />}

                   {astrologySubTab === 'livsbok' && (
                     <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
                        {!showReport ? (
                            <div className="bg-indigo-900/10 p-12 md:p-24 rounded-[4rem] border border-indigo-500/20 text-center space-y-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                    <Scroll size={300} />
                                </div>
                                <div className="space-y-4 max-w-2xl mx-auto relative z-10">
                                    <h3 className="text-5xl font-serif text-white">{t.soulChronicle}</h3>
                                    <p className="text-slate-400 text-lg font-light leading-relaxed">
                                        {t.soulChronicleDesc}
                                    </p>
                                </div>
                                <div className="pt-8 flex flex-col items-center gap-6 relative z-10">
                                    <button onClick={generateReport} className="px-16 py-6 bg-gradient-to-r from-amber-400 to-amber-600 rounded-[2.5rem] font-black uppercase text-xs text-black shadow-2xl hover:scale-[1.05] transition-all flex items-center justify-center gap-4">
                                        <Scroll size={22} /> {t.writeLifeBookNow}
                                    </button>
                                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-indigo-400">{t.priceCredits}</p>
                                </div>
                            </div>
                        ) : reportData && (
                            <div className="bg-[#0a0a1a] p-6 md:p-20 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden animate-slide-up">
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
                                    <div key={i} className="mb-12 border-t border-white/5 pt-12">
                                    <h3 className="text-3xl font-serif text-amber-100 mb-6 uppercase tracking-widest">{chapter.planet}</h3>
                                    <div className="text-slate-400 font-light leading-relaxed">{chapter.content}</div>
                                    </div>
                                ))}
                                <div className="mt-12 pt-12 border-t border-white/5 italic text-amber-500/80 text-center text-2xl md:text-4xl font-serif">
                                    {reportData.mantra}
                                </div>
                                </article>
                            </div>
                        )}
                     </div>
                   )}
                </div>
                )
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
                      <p className="text-[10px] uppercase text-slate-500 tracking-[0.4em] font-black">{t.archivesDecoding}</p>
                   </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      <AiAssistant />
    </ThemeContext.Provider>
    </LangContext.Provider>
  );
}
