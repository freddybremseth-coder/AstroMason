
import React, { useState, useContext } from 'react';
import { Star, Sparkles, CircleCheck, Shield, X, Lock, ChevronRight, Sun, Fingerprint, Globe } from './Icons';
import { LangContext } from '../App';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../constants';

interface LandingPageProps {
  onLogin: (role: any) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const { lang, setLang } = useContext(LangContext);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = UI_TRANSLATIONS[lang].landing;

  const languages: {code: Language, label: string, flag: string}[] = [
    { code: 'no', label: 'Norsk', flag: '🇳🇴' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  return (
    <div className="min-h-screen bg-[#050511] text-gray-100 font-sans selection:bg-gold-500/30 overflow-x-hidden">
      
      <nav className="fixed top-0 w-full z-50 bg-[#050511]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://i.imgur.com/M7z6g3A.jpeg" alt="Logo" className="w-10 h-10 rounded-full border border-amber-500/30" />
            <span className="text-xl font-serif font-bold text-white tracking-widest">Astro Mason</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
                <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all">
                    <Globe size={14} /> {languages.find(l => l.code === lang)?.label}
                </button>
                {showLangMenu && (
                    <div className="absolute top-full right-0 mt-2 bg-[#0a0a16] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[120px]">
                        {languages.map(l => (
                            <button key={l.code} onClick={() => { setLang(l.code); setShowLangMenu(false); }} className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase text-slate-300 hover:bg-white/5 transition-colors">
                                {l.flag} {l.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">{t.login}</button>
            <button onClick={() => { setAuthMode('register'); setShowAuthModal(true); }} className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl">{t.startBtn}</button>
          </div>
        </div>
      </nav>

      <header className="relative pt-48 pb-32 overflow-hidden text-center px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
        <h1 className="text-7xl md:text-9xl font-serif font-bold text-white mb-8 tracking-tighter leading-none">
          {t.heroTitle} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 italic">{t.heroSubtitle}</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          {t.heroDesc}
        </p>
        <button onClick={() => setShowAuthModal(true)} className="px-12 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-400 transition-all shadow-2xl flex items-center gap-3 mx-auto">
          {t.createArchive} <ChevronRight size={16} />
        </button>
      </header>

      <section className="py-32 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20 space-y-2">
            <h2 className="text-5xl font-serif font-bold">{t.investmentTitle}</h2>
            <p className="text-amber-500 uppercase tracking-[0.4em] text-[10px] font-black">{t.investmentDesc}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="bg-[#0a0a16] p-16 rounded-[4rem] border border-white/5 flex flex-col items-center group hover:border-indigo-500/30 transition-all text-center">
                <span className="text-indigo-400 font-black tracking-widest uppercase text-[10px] mb-8">{t.singleTitle}</span>
                <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-7xl font-serif text-white">{t.singlePrice}</span>
                    <span className="text-slate-500 text-sm">{t.singleUnit}</span>
                </div>
                <p className="text-slate-400 text-sm mb-12 font-light leading-relaxed">{t.singleDesc}</p>
                <ul className="space-y-4 mb-12 text-left w-full">
                  {t.singleFeatures.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-xs text-slate-300"><CircleCheck size={16} className="text-indigo-500" /> {item}</li>
                  ))}
                </ul>
                <button onClick={() => setShowAuthModal(true)} className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">{t.selectPlan}</button>
             </div>
             
             <div className="bg-[#0f0f25] p-16 rounded-[4rem] border border-amber-500/30 flex flex-col items-center relative overflow-hidden group hover:scale-[1.02] transition-all text-center">
                <div className="absolute top-0 right-0 p-3 bg-amber-500 text-black text-[10px] font-black uppercase rounded-bl-xl shadow-2xl">{t.bestValue}</div>
                <span className="text-amber-500 font-black tracking-widest uppercase text-[10px] mb-8">{t.masterTitle}</span>
                <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-7xl font-serif text-white">{t.masterPrice}</span>
                    <span className="text-slate-500 text-sm">{t.masterUnit}</span>
                </div>
                <p className="text-slate-300 text-sm mb-12 font-light leading-relaxed">{t.masterDesc}</p>
                <ul className="space-y-4 mb-12 text-left w-full">
                  {t.masterFeatures.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-xs text-white"><CircleCheck size={16} className="text-amber-500" /> {item}</li>
                  ))}
                </ul>
                <button onClick={() => setShowAuthModal(true)} className="w-full py-5 bg-amber-500 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-all shadow-2xl shadow-amber-500/20">{t.selectMaster}</button>
             </div>
          </div>
        </div>
      </section>

      <footer className="py-20 text-center text-[10px] text-slate-700 uppercase tracking-[0.4em] font-black">
          © 2025 Astro Mason • The Deep Archives
      </footer>

      {showAuthModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-[#0a0a16] border border-white/10 w-full max-w-md rounded-[3rem] p-12 relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-bold text-white mb-2">{authMode === 'login' ? t.authTitleLogin : t.authTitleReg}</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{t.authDesc}</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onLogin('client'); }} className="space-y-6">
              <div className="space-y-4">
                <input type="email" placeholder={t.emailLabel} className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 text-sm" required />
                <input type="password" placeholder={t.passLabel} className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 text-sm" required />
              </div>
              <button type="submit" className="w-full bg-white text-black font-black uppercase tracking-widest py-5 rounded-2xl text-[10px] hover:bg-amber-400 transition-all shadow-xl">
                {authMode === 'login' ? t.loginBtn : t.regBtn}
              </button>
            </form>
            <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {authMode === 'login' ? t.noAccount : t.hasAccount} <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-amber-500 ml-1 hover:underline underline-offset-8">{t.clickHere}</button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
