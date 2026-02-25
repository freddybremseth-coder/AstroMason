
import React, { useState, useContext } from 'react';
import { Star, Sparkles, CircleCheck, Shield, X, Lock, ChevronRight, Sun, Fingerprint, Globe, Mail, Loader2 } from './Icons';
import { LangContext } from '../App';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../constants';
import Logo from './Logo';
import { authService, profileService, isSupabaseConfigured } from '../lib/supabase';

interface LandingPageProps {
  onLogin: (userData: { email: string; isAdmin: boolean; userId: string }) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  const { lang, setLang } = useContext(LangContext);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = UI_TRANSLATIONS[lang].landing;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    const cleanEmail = email.toLowerCase().trim();

    try {
      if (authMode === 'forgot') {
        const { error: resetErr, isDemo } = await authService.resetPassword(cleanEmail);
        if (resetErr) {
          setError('Kunne ikke sende gjenopprettingslenke. Sjekk e-postadressen.');
        } else {
          setForgotSent(true);
          if (isDemo) {
            setError('Demo-modus: ingen e-post sendt. Koble til Supabase for ekte e-post.');
          }
        }
        setIsProcessing(false);
        return;
      }

      if (authMode === 'register') {
        const { user, error: signUpErr, isDemo } = await authService.signUp(cleanEmail, password, name);
        if (signUpErr) {
          const msg = (signUpErr as any).message || '';
          if (msg.includes('already registered')) {
            setError('E-posten er allerede registrert. Logg inn i stedet.');
          } else if (msg.includes('Password')) {
            setError('Passordet må være minst 6 tegn.');
          } else {
            setError(msg || 'Registrering mislyktes. Prøv igjen.');
          }
          setIsProcessing(false);
          return;
        }
        if (user) {
          const userId = user.id || cleanEmail;
          if (!isDemo && isSupabaseConfigured) {
            // Wait for trigger to create profile, then check admin
            const isAdmin = await profileService.isAdmin(userId);
            onLogin({ email: cleanEmail, isAdmin, userId });
          } else {
            onLogin({ email: cleanEmail, isAdmin: false, userId: userId });
          }
        }
      } else {
        // Login
        const { user, error: signInErr, isDemo } = await authService.signIn(cleanEmail, password);
        if (signInErr) {
          const msg = (signInErr as any).message || '';
          if (msg.includes('Invalid login') || msg.includes('invalid_credentials')) {
            setError('Feil e-post eller passord.');
          } else if (msg.includes('Email not confirmed')) {
            setError('Bekreft e-postadressen din først. Sjekk innboksen.');
          } else {
            setError(msg || 'Innlogging mislyktes. Prøv igjen.');
          }
          setIsProcessing(false);
          return;
        }
        if (user) {
          const userId = user.id || cleanEmail;
          const isAdmin = isDemo ? false : await profileService.isAdmin(userId);
          // Load profile into localStorage
          await profileService.get(userId);
          onLogin({ email: cleanEmail, isAdmin, userId });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Noe gikk galt. Prøv igjen.');
    } finally {
      setIsProcessing(false);
    }
  };

  const languages: {code: Language, label: string, flag: string}[] = [
    { code: 'no', label: 'Norsk', flag: '🇳🇴' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  return (
    <div className="min-h-screen bg-[#050511] text-gray-100 font-sans selection:bg-gold-500/30 overflow-x-hidden">

      <nav className="fixed top-0 w-full z-50 bg-[#050511]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={40} showText={true} />
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
            <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); setError(null); setForgotSent(false); }} className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">{t.login}</button>
            <button onClick={() => { setAuthMode('register'); setShowAuthModal(true); setError(null); setForgotSent(false); }} className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl">{t.startBtn}</button>
          </div>
        </div>
      </nav>

      <header className="relative pt-56 pb-32 overflow-hidden text-center px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
        <div className="mb-12">
            <Logo size={140} showText={true} />
        </div>
        <h1 className="text-7xl md:text-9xl font-serif font-bold text-white mb-8 tracking-tighter leading-none">
          {t.heroTitle} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 italic">{t.heroSubtitle}</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          {t.heroDesc}
        </p>
        <button onClick={() => { setAuthMode('register'); setShowAuthModal(true); }} className="px-12 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-400 transition-all shadow-2xl flex items-center gap-3 mx-auto">
          {t.createArchive} <ChevronRight size={16} />
        </button>
      </header>

      {showAuthModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="bg-[#0a0a16] border border-white/10 w-full max-w-md rounded-[3rem] p-12 relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-bold text-white mb-2">
                {authMode === 'login' ? t.authTitleLogin : authMode === 'register' ? t.authTitleReg : 'Gjenopprett Tilgang'}
              </h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{t.authDesc}</p>
            </div>

            {forgotSent ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                  <CircleCheck size={32} className="text-green-500" />
                </div>
                <p className="text-slate-300">Gjenopprettingslenke er sendt til <span className="text-amber-400">{email}</span></p>
                <button onClick={() => { setForgotSent(false); setAuthMode('login'); }} className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:underline">Tilbake til innlogging</button>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-bold text-center">
                      {error}
                  </div>
              )}

              {!isSupabaseConfigured && (
                <div className="bg-amber-500/5 border border-amber-500/20 text-amber-500/80 p-3 rounded-xl text-[10px] font-bold text-center uppercase tracking-wider">
                  Demo-modus · Koble til Supabase for ekte auth
                </div>
              )}

              <div className="space-y-4">
                {authMode === 'register' && (
                    <input type="text" placeholder="Ditt Navn" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 text-sm" required />
                )}
                <input type="email" placeholder={t.emailLabel} value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 text-sm" required />
                {authMode !== 'forgot' && (
                    <input type="password" placeholder={t.passLabel} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 text-sm" required minLength={6} />
                )}
              </div>

              <button type="submit" disabled={isProcessing} className="w-full bg-white text-black font-black uppercase tracking-widest py-5 rounded-2xl text-[10px] hover:bg-amber-400 transition-all shadow-xl flex items-center justify-center gap-3">
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : (authMode === 'login' ? t.loginBtn : authMode === 'register' ? t.regBtn : 'Send Gjenoppretting')}
              </button>
            </form>
            )}

            {!forgotSent && (
            <div className="mt-8 space-y-4 text-center">
                {authMode === 'login' && (
                    <button onClick={() => { setAuthMode('forgot'); setError(null); }} className="text-[9px] text-slate-500 hover:text-amber-500 uppercase font-black tracking-widest transition-colors block mx-auto">
                        Glemt passord?
                    </button>
                )}
                {authMode !== 'forgot' && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {authMode === 'login' ? t.noAccount : t.hasAccount}
                <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setError(null); }} className="text-amber-500 ml-1 hover:underline underline-offset-8">
                    {t.clickHere}
                </button>
                </p>
                )}
                {authMode === 'forgot' && (
                  <button onClick={() => { setAuthMode('login'); setError(null); }} className="text-[9px] text-slate-500 hover:text-amber-500 uppercase font-black tracking-widest transition-colors block mx-auto">
                    ← Tilbake til innlogging
                  </button>
                )}
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
