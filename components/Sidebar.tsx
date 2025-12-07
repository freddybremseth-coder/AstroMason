
import React, { useContext } from 'react';
import { LayoutDashboard, Library, GraduationCap, Sun, Settings, FileText, UserCircle, Users, Globe, ExternalLink, CircleCheck, LogOut, Sparkles, Fingerprint } from './Icons';
import { UserRole, NavItem, Language } from '../types';
import { UI_TRANSLATIONS } from '../constants';
import { LangContext } from '../App';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  setView, 
  isMobileOpen, 
  setIsMobileOpen,
  userRole,
  setUserRole,
  onLogout
}) => {
  
  const { lang, setLang } = useContext(LangContext);
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['no'];
  const [showLangMenu, setShowLangMenu] = React.useState(false);

  // Define navigation items with updated names and visibility rules
  const navItems: NavItem[] = [
    { 
      id: 'dashboard', 
      label: t?.navDashboard || 'Dashboard', 
      icon: LayoutDashboard,
      roles: ['professional', 'client']
    },
    { 
      id: 'courses', 
      label: t?.navCourses || 'Kurs', 
      icon: FileText,
      roles: ['professional', 'client'] 
    },
    { 
      id: 'library', 
      label: t?.navLibrary || 'Bibliotek', 
      icon: Library,
      roles: ['professional'] // Library is typically Pro only
    },
    { 
      id: 'methods', 
      label: t?.navMethodology || 'Metodikk', 
      icon: GraduationCap,
      roles: ['professional'] // Methodology is typically Pro only
    },
    { 
      id: 'astrology', 
      label: t?.navAstrology || 'Astrologi', 
      icon: Sun,
      roles: ['professional', 'client'] 
    },
    { 
      id: 'numerology', 
      label: 'Numerologi', // New Item
      icon: Fingerprint,
      roles: ['professional', 'client'] 
    },
    { 
      id: 'tarot', 
      label: t?.navTarot || 'Tarot', 
      icon: Sparkles,
      roles: ['professional', 'client'] 
    },
    { 
      id: 'settings', 
      label: t?.navSettings || 'Innstillinger', 
      icon: Settings,
      roles: ['professional', 'client']
    },
  ];

  const languages: {code: Language, label: string, flag: string}[] = [
    { code: 'no', label: 'Norsk', flag: '🇳🇴' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-space-950 border-r border-gray-200 dark:border-space-800 transition-all duration-300 ease-in-out flex flex-col shadow-xl lg:shadow-none
        lg:translate-x-0 lg:static
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
          <div className="p-6 border-b border-gray-200 dark:border-space-800">
            <div className="flex items-center gap-3">
               <img 
                 src="https://i.imgur.com/M7z6g3A.jpeg" 
                 alt="Astro Mason Logo" 
                 className="w-12 h-12 rounded-full border border-gold-500/50 shadow-lg shadow-gold-900/20 object-cover"
               />
               <div>
                 <h1 className="font-serif text-xl font-bold text-gray-900 dark:text-gold-400 tracking-wider leading-tight">
                   Astro<br/>Mason
                 </h1>
               </div>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-space-400 mt-3 uppercase tracking-widest text-center font-semibold">
              {userRole === 'professional' ? 'Professional Edition' : 'Personal Edition'}
            </p>
          </div>

          <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
            {navItems.filter(item => item.roles.includes(userRole)).map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-gray-100 dark:bg-space-800 text-gold-600 dark:text-gold-400 shadow-sm dark:shadow-black/20 border-l-4 border-gold-500' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-space-900 hover:text-gray-900 dark:hover:text-gray-200'}
                  `}
                >
                  <Icon size={20} className={isActive ? 'text-gold-600 dark:text-gold-400' : 'text-gray-500 dark:text-gray-500'} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200 dark:border-space-800 space-y-4">
            
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="w-full flex items-center justify-between bg-gray-50 dark:bg-space-900 p-2 rounded-lg border border-gray-200 dark:border-space-800 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Globe size={14} />
                  {languages.find(l => l.code === lang)?.flag} {languages.find(l => l.code === lang)?.label}
                </span>
                <ExternalLink size={12} className="rotate-90" />
              </button>

              {showLangMenu && (
                <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-space-900 border border-gray-200 dark:border-space-700 rounded-lg shadow-xl max-h-48 overflow-y-auto z-50">
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setShowLangMenu(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-space-800"
                    >
                      <span>{l.flag}</span>
                      <span className="flex-1">{l.label}</span>
                      {lang === l.code && <CircleCheck size={12} className="text-gold-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
            >
              <LogOut size={18} />
              Logg ut
            </button>
          </div>
        
      </aside>
    </>
  );
};

export default Sidebar;
