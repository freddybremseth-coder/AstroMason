
import React, { useState } from 'react';
import { MethodologyType } from '../types';
import { METHODOLOGY_DESCRIPTIONS } from '../constants';
import { Compass, Scroll, Activity, Eye, Globe, Star, Sparkles, ExternalLink, FileText } from './Icons';

interface MethodologyProps {
  onNavigate?: (view: string) => void;
  onSelectCourse?: (courseId: string) => void;
}

const Methodology: React.FC<MethodologyProps> = ({ onNavigate, onSelectCourse }) => {
  const [activeMethod, setActiveMethod] = useState<MethodologyType>(MethodologyType.WESTERN_CLASSICAL);

  const icons: Record<MethodologyType, React.ReactNode> = {
    [MethodologyType.WESTERN_CLASSICAL]: <Scroll />,
    [MethodologyType.HELLENISTIC]: <Star />,
    [MethodologyType.VEDIC]: <Globe />,
    [MethodologyType.PSYCHOLOGICAL]: <Eye />,
    [MethodologyType.EVOLUTIONARY]: <Compass />,
    [MethodologyType.ESOTERIC]: <Sparkles />,
    [MethodologyType.SPECIALIZED]: <Activity />,
  };

  const handleStartModule = (moduleId: number) => {
      // Map methodology to specific course ID
      // C1: Classical/Hellenistic/Western
      // C2: Esoteric
      // C3: Psychological/Evolutionary
      
      let courseId = '';
      if (activeMethod === MethodologyType.ESOTERIC) courseId = 'c2';
      else if (activeMethod === MethodologyType.WESTERN_CLASSICAL || activeMethod === MethodologyType.HELLENISTIC) courseId = 'c1';
      else if (activeMethod === MethodologyType.PSYCHOLOGICAL || activeMethod === MethodologyType.EVOLUTIONARY) courseId = 'c3';
      
      if (courseId && onSelectCourse) {
          onSelectCourse(courseId);
      } else if (onNavigate) {
          onNavigate('courses');
      }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 animate-fade-in">
      {/* Sidebar for Methods */}
      <div className="w-full lg:w-1/3 space-y-2">
        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-6 px-2">Metodisk Tilnærming</h2>
        {Object.values(MethodologyType).map((method) => (
          <button
            key={method}
            onClick={() => setActiveMethod(method)}
            className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-200 flex items-center gap-4 border ${
              activeMethod === method
                ? 'bg-white dark:bg-space-800 border-gold-500/50 shadow-lg shadow-black/5 dark:shadow-black/20'
                : 'bg-gray-50 dark:bg-space-900/50 border-transparent hover:bg-white dark:hover:bg-space-800 text-gray-500 dark:text-gray-400'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeMethod === method ? 'bg-gold-50 dark:bg-gold-500/10 text-gold-600 dark:text-gold-400' : 'bg-gray-100 dark:bg-space-800 text-gray-500'}`}>
              {icons[method]}
            </div>
            <span className={`font-medium ${activeMethod === method ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
              {method}
            </span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white dark:bg-space-900 border border-gray-200 dark:border-space-800 rounded-2xl p-8 shadow-xl shadow-black/5 dark:shadow-black/20 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-gray-100 dark:bg-space-800 rounded-xl text-gold-500">
               {icons[activeMethod]}
             </div>
             <div>
                <h3 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">{activeMethod}</h3>
                <p className="text-gold-600 dark:text-gold-500/80 text-sm uppercase tracking-wider font-semibold mt-1">Kjerneinnhold</p>
             </div>
          </div>
          
          <div className="prose prose-slate dark:prose-invert dark:prose-gold max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8 border-l-4 border-gold-500 pl-6 py-2 bg-gray-50 dark:bg-space-800/30">
              {METHODOLOGY_DESCRIPTIONS[activeMethod]}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <div className="bg-gray-50 dark:bg-space-950 p-6 rounded-xl border border-gray-200 dark:border-space-800">
                 <h4 className="text-lg font-serif text-gray-900 dark:text-gray-200 mb-4">Nøkkelkonsepter</h4>
                 <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                   {activeMethod === MethodologyType.ESOTERIC ? (
                      <>
                        <li className="flex items-start gap-2"><span className="text-gold-500 mt-1">•</span> <strong>Sjelens formål:</strong> Fokus på "hvorfor" vi er her, ikke bare "hva" som skjer.</li>
                        <li className="flex items-start gap-2"><span className="text-gold-500 mt-1">•</span> <strong>Syv Stråler:</strong> Energistrømmer som former sjel, personlighet og fysisk kropp.</li>
                        <li className="flex items-start gap-2"><span className="text-gold-500 mt-1">•</span> <strong>Esoteriske Herskere:</strong> Bruk av alternative planetherskere for å vise sjelens vei.</li>
                      </>
                   ) : (
                      <>
                        <li className="flex items-start gap-2"><span className="text-gold-500 mt-1">•</span> Dyptgående analyse av fundamentale prinsipper.</li>
                        <li className="flex items-start gap-2"><span className="text-gold-500 mt-1">•</span> Historisk og filosofisk kontekst.</li>
                        <li className="flex items-start gap-2"><span className="text-gold-500 mt-1">•</span> Praktisk anvendelse for moderne astrologer.</li>
                      </>
                   )}
                 </ul>
               </div>
               <div className="bg-gray-50 dark:bg-space-950 p-6 rounded-xl border border-gray-200 dark:border-space-800">
                 <h4 className="text-lg font-serif text-gray-900 dark:text-gray-200 mb-4">Fokusområder</h4>
                 <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                   {activeMethod === MethodologyType.ESOTERIC ? (
                      <>
                        <li className="flex items-start gap-2"><span className="text-purple-500 dark:text-purple-400 mt-1">→</span> Transformasjon fra personlighet til sjel.</li>
                        <li className="flex items-start gap-2"><span className="text-purple-500 dark:text-purple-400 mt-1">→</span> Kollektiv evolusjon og tjeneste.</li>
                        <li className="flex items-start gap-2"><span className="text-purple-500 dark:text-purple-400 mt-1">→</span> Syntese av østlig visdom og vestlig vitenskap.</li>
                      </>
                   ) : (
                      <>
                        <li className="flex items-start gap-2"><span className="text-blue-500 dark:text-blue-400 mt-1">→</span> Kalkulering av verdigheter.</li>
                        <li className="flex items-start gap-2"><span className="text-blue-500 dark:text-blue-400 mt-1">→</span> Tolkning av hus og aspekter.</li>
                        <li className="flex items-start gap-2"><span className="text-blue-500 dark:text-blue-400 mt-1">→</span> Prediksjonsmetoder.</li>
                      </>
                   )}
                 </ul>
               </div>
            </div>

            {activeMethod === MethodologyType.ESOTERIC && (
              <div className="mb-8 bg-gray-50 dark:bg-space-950 border border-gray-200 dark:border-space-800 rounded-xl p-6">
                <h4 className="text-xl font-serif text-gray-900 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-purple-500 dark:text-purple-400" />
                  Esoteriske Herskere & Sjelens Vei
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                  I esoterisk astrologi skifter herskerskapet fra de tradisjonelle (ortodokse) planetene til esoteriske herskere når individet begynner å respondere på sjelens kall. Dette markerer et skifte fra personlighetsfokus til sjelens formål.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-gold-600 dark:text-gold-500 font-bold text-sm uppercase tracking-wider mb-3">Forskjellen</h5>
                    <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <li className="bg-white dark:bg-space-900 p-3 rounded border border-gray-200 dark:border-space-800 shadow-sm">
                        <strong className="block text-gray-900 dark:text-gray-200 mb-1">Klassisk Hersker (Personlighet)</strong>
                        Styrer det ytre livet, egoets ønsker, instinkter og fysiske omstendigheter. Brukes for å forstå inkarnasjonens form.
                      </li>
                      <li className="bg-white dark:bg-space-900 p-3 rounded border border-gray-200 dark:border-space-800 shadow-sm">
                        <strong className="block text-gray-900 dark:text-gray-200 mb-1">Esoterisk Hersker (Sjel)</strong>
                        Styrer indre vekst, sjelens intensjon og hvordan vi tjener helheten. Aktiveres når disippelen trår inn på "The Path".
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-gold-600 dark:text-gold-500 font-bold text-sm uppercase tracking-wider mb-3">Eksempler på Skifte</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-space-800">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Væren</span>
                        <div className="text-right">
                          <span className="text-xs text-gray-500 block">Mars (Klassisk)</span>
                          <span className="text-sm text-purple-500 dark:text-purple-400 font-medium">Merkur (Esoterisk)</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-space-800">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Tvillingene</span>
                        <div className="text-right">
                          <span className="text-xs text-gray-500 block">Merkur (Klassisk)</span>
                          <span className="text-sm text-purple-500 dark:text-purple-400 font-medium">Venus (Esoterisk)</span>
                        </div>
                      </div>
                       <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-space-800">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Fiskene</span>
                        <div className="text-right">
                          <span className="text-xs text-gray-500 block">Jupiter (Klassisk)</span>
                          <span className="text-sm text-purple-500 dark:text-purple-400 font-medium">Pluto (Esoterisk)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <h4 className="text-xl font-serif text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-gold-500" />
              Interaktiv Studieplan
            </h4>
            <div className="space-y-4">
               {[1, 2, 3].map((i) => {
                 let title = '';
                 let available = false;

                 if (activeMethod === MethodologyType.ESOTERIC) {
                    title = i === 1 ? 'De Syv Stråler' : i === 2 ? 'Esoteriske Herskere' : 'Sjelens Vei';
                    available = true;
                 } else if (activeMethod === MethodologyType.WESTERN_CLASSICAL) {
                    title = i === 1 ? 'Essensielle Verdigheter' : i === 2 ? 'Hus og Sekt' : 'Prediksjon';
                    available = true;
                 } else {
                    title = 'Grunnleggende Teori';
                    available = i === 1;
                 }

                 return (
                   <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 dark:bg-space-800/50 rounded-lg border border-gray-200 dark:border-space-700/50 hover:border-gold-500/30 transition-colors">
                     <div className="flex items-center gap-4 flex-1">
                       <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-space-700 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-300">{i}</span>
                       <div>
                         <p className="text-gray-800 dark:text-gray-200 font-medium">Modul {i}: {title}</p>
                         <p className="text-xs text-gray-500">Varighet: 4 timer • Avansert nivå</p>
                       </div>
                     </div>
                     {available && (
                         <button 
                            onClick={() => handleStartModule(i)}
                            className="mt-2 sm:mt-0 px-4 py-2 bg-gold-600 text-white text-sm font-bold rounded-lg hover:bg-gold-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                         >
                            Start Modul <ExternalLink size={14} />
                         </button>
                     )}
                   </div>
                 );
               })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Methodology;
