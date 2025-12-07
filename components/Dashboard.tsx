
import React from 'react';
import { Sun, Moon, ExternalLink, FileText, Activity, Star, Sparkles, Users, GraduationCap } from './icons';
import { UserRole } from '../types';

interface DashboardProps {
  onNavigate: (view: string) => void;
  userRole: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, userRole }) => {
  
  const isPro = userRole === 'professional';

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
            {isPro ? 'Velkommen tilbake' : 'Hei, Astrid'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {isPro 
              ? 'Dagens transitter og faglige oppdateringer.' 
              : 'Her er din daglige oversikt og anbefalinger.'}
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-2xl font-serif text-gold-600 dark:text-gold-400">14:32</p>
          <p className="text-sm text-gray-500">Oslo, Norge</p>
        </div>
      </div>

      {/* Planetary Status Bar - Simplified for Client */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-space-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-space-700 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-500 dark:text-amber-400">
            <Sun size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Solen</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-200">15° 42' Løven</p>
            {!isPro && <p className="text-xs text-gray-500">Fokus på kreativitet</p>}
          </div>
        </div>
        <div className="bg-white dark:bg-space-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-space-700 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-slate-100 dark:bg-slate-700/30 rounded-full text-slate-500 dark:text-slate-300">
            <Moon size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Månen</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-200">04° 12' Tyren</p>
            {!isPro && <p className="text-xs text-gray-500">Behov for ro</p>}
          </div>
        </div>
        <div className="bg-white dark:bg-space-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-space-700 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-500 dark:text-purple-400">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{isPro ? 'Retrograd' : 'Utfordring'}</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-200">{isPro ? 'Merkur, Saturn' : 'Kommunikasjon'}</p>
            {!isPro && <p className="text-xs text-gray-500">Vær tydelig i dag</p>}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pro Specific: Library Recommendations */}
          {isPro && (
            <div className="bg-white dark:bg-space-900 border border-gray-200 dark:border-space-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-serif text-gray-900 dark:text-gray-200 mb-4 flex items-center gap-2">
                <FileText className="text-gold-500" size={20} />
                Anbefalt i dag
              </h3>
              <div className="space-y-4">
                <div 
                  onClick={() => onNavigate('library')}
                  className="p-4 bg-gray-50 dark:bg-space-800/50 rounded-lg border border-gray-200 dark:border-space-700/50 hover:border-gold-500/30 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-200">Fordypning i Tetrabiblos, Bok III</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">En kritisk analyse av Ptolemys teknikker for livslengde.</p>
                    </div>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-2 py-1 rounded">Klassisk</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Client Specific: Daily Advice */}
          {!isPro && (
             <div className="bg-white dark:bg-space-900 border border-gray-200 dark:border-space-800 rounded-xl p-6 shadow-sm">
               <h3 className="text-xl font-serif text-gray-900 dark:text-gray-200 mb-4 flex items-center gap-2">
                 <Sparkles className="text-gold-500" size={20} />
                 Dagens Tips
               </h3>
               <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                 Med Månen i Tyren er det en utmerket dag for å ta vare på deg selv og nyte livets enkle gleder. Unngå store økonomiske beslutninger akkurat nå, da Merkur Retrograd kan skape forvirring i detaljene. Fokuser på stabilitet.
               </p>
               <button onClick={() => onNavigate('tools')} className="mt-4 text-gold-600 dark:text-gold-400 hover:text-gold-700 dark:hover:text-gold-300 text-sm font-medium flex items-center gap-1">
                 Les ditt fulle horoskop <ExternalLink size={14} />
               </button>
             </div>
          )}

          {/* CTA Button - Different for Roles */}
          <button 
             onClick={() => onNavigate(isPro ? 'tools' : 'courses')}
             className="w-full text-left bg-gradient-to-r from-gold-500 to-amber-500 dark:from-gold-600 dark:to-amber-600 hover:from-gold-400 hover:to-amber-400 border border-gold-400/30 dark:border-gold-500/30 rounded-xl p-6 relative overflow-hidden shadow-lg shadow-gold-500/20 dark:shadow-gold-900/20 group transition-all duration-300 transform hover:-translate-y-1"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
             <div className="relative z-10 flex items-center justify-between">
               <div>
                 <h3 className="text-2xl font-serif font-bold text-white mb-2 flex items-center gap-2">
                    {isPro ? <Sparkles size={24} className="text-gold-100" /> : <GraduationCap size={24} className="text-gold-100" />}
                    {isPro ? 'Ny Konsultasjon' : 'Fortsett på Kurset'}
                 </h3>
                 <p className="text-gold-50 max-w-md font-medium">
                   {isPro 
                     ? 'Start en ny analyse. Velg mellom Natal, Synastri, Solar Return eller Karmisk rapport.' 
                     : 'Du er 35% ferdig med "Esoterisk Astrologi". Ta neste leksjon nå.'}
                 </p>
               </div>
               <div className="bg-white/20 p-4 rounded-full text-white group-hover:bg-white/30 transition-colors">
                 {isPro ? <Star size={32} fill="currentColor" className="text-gold-100" /> : <FileText size={32} className="text-gold-100" />}
               </div>
             </div>
          </button>
        </div>

        {/* Right Column - Quick Stats/Feed */}
        <div className="space-y-6">
          
          {/* Upcoming Courses / Events */}
          <div className="bg-white dark:bg-space-900 border border-gray-200 dark:border-space-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-serif text-gray-900 dark:text-gray-200 mb-4">{isPro ? 'Nylige hendelser' : 'Din Fremgang'}</h3>
            <ul className="space-y-4">
              {isPro ? (
                <>
                  <li className="flex gap-3">
                    <div className="mt-1 min-w-[8px] h-2 rounded-full bg-gold-500"></div>
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Seminar: "The Joy of the Planets"</p>
                      <p className="text-xs text-gray-500">For 2 timer siden • Demetra George</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1 min-w-[8px] h-2 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Ny oversettelse lagt til: Paulus Alexandrinus</p>
                      <p className="text-xs text-gray-500">I går • Bibliotek</p>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex gap-3">
                    <div className="mt-1 min-w-[8px] h-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Fullførte "Modul 1: De Syv Stråler"</p>
                      <p className="text-xs text-gray-500">I går</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1 min-w-[8px] h-2 rounded-full bg-gold-500"></div>
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Nytt kurs tilgjengelig: "Transitter"</p>
                      <p className="text-xs text-gray-500">Anbefalt for deg</p>
                    </div>
                  </li>
                </>
              )}
            </ul>
            <button 
              onClick={() => onNavigate(isPro ? 'library' : 'courses')}
              className="w-full mt-6 text-sm text-gray-600 dark:text-space-400 hover:text-gold-600 dark:hover:text-gold-400 flex items-center justify-center gap-1 transition-colors"
            >
              Se alt <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
