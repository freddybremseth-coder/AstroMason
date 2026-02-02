
import React, { useContext } from 'react';
import { LayoutDashboard, Sun, Globe, ExternalLink, LogOut, Sparkles, Fingerprint, UserCircle, Calendar, Star } from './Icons';
import { NavItem, Language } from '../types';
import { UI_TRANSLATIONS } from '../constants';
import { LangContext } from '../App';
import Logo from './Logo';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  setView, 
  isMobileOpen, 
  setIsMobileOpen,
  onLogout
}) => {
  
  const { lang, setLang } = useContext(LangContext);
  const t = UI_TRANSLATIONS[lang];
  const [showLangMenu, setShowLangMenu] = React.useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'profile', label: t.navProfile, icon: UserCircle },
    { id: 'horoscope', label: t.navHoroscope, icon: Calendar },
    { id: 'chinese', label: t.navChineseAstrology, icon: Star },
    { id: 'astrology', label: t.navAstrology, icon: Sun },
    { id: 'numerology', label: t.navNumerology, icon: Fingerprint },
    { id: 'tarot', label: t.navTarot, icon: Sparkles },
  ];

  const languages: {code: Language, label: string, flag: string}[] = [
    { code: 'no', label: 'Norsk', flag: '🇳🇴' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-[#0a0a16] border-r border-white/5 transition-all duration-300 ease-in-out flex flex-col lg:translate-x-0 lg:static ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-8 border-b border-white/5">
            <div className="flex items-center gap-4">
               <Logo size={42} />
               <h1 className="font-serif text-lg font-bold text-white tracking-widest leading-tight">Astro<br/>Mason</h1>
            </div>
          </div>

          <nav className="flex-1 py-8 space-y-2 px-4 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button key={item.id} onClick={() => { setView(item.id); setIsMobileOpen(false); }}
                  className={`w-full flex items-center gap-4 px-5 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all ${isActive ? 'bg-amber-500 text-black shadow-xl shadow-amber-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-6 border-t border-white/5 space-y-4">
            <div className="relative">
              <button onClick={() => setShowLangMenu(!showLangMenu)} className="w-full flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2"><Globe size={14} /> {languages.find(l => l.code === lang)?.label}</span>
                <ExternalLink size={12} className="rotate-90" />
              </button>
              {showLangMenu && (
                <div className="absolute bottom-full left-0 w-full mb-2 bg-[#0f0f25] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {languages.map(l => (
                    <button key={l.code} onClick={() => { setLang(l.code); setShowLangMenu(false); }} className="w-full text-left flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase text-slate-300 hover:bg-white/5 transition-colors">
                      <span>{l.flag}</span> {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={onLogout} className="w-full flex items-center gap-3 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-400/10 rounded-xl transition-colors">
              <LogOut size={16} /> {t.navLogout}
            </button>
          </div>
      </aside>
    </>
  );
};

export default Sidebar;
