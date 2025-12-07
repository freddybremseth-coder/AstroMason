
import React, { useState } from 'react';
import { Star, Sparkles, GraduationCap, ExternalLink, CircleCheck, CirclePlay, Globe, Shield, X, User, Lock } from './icons';
import { UserRole } from '../types';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [selectedPlan, setSelectedPlan] = useState<UserRole>('client');

  const handleAuthAction = (role?: UserRole) => {
    if (role) setSelectedPlan(role);
    setAuthMode('register'); // Default to register for action buttons
    setShowAuthModal(true);
  };

  const handleLoginClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  }

  const handleSubmitAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call/Auth
    setTimeout(() => {
        onLogin(selectedPlan);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-space-950 text-gray-100 font-sans selection:bg-gold-500/30 selection:text-gold-200 overflow-x-hidden">
      
      {/* Navbar - Fixed Dark Mode Style for consistency on Landing */}
      <nav className="fixed top-0 w-full z-50 bg-space-950/80 backdrop-blur-md border-b border-space-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://i.imgur.com/M7z6g3A.jpeg" alt="Logo" className="w-10 h-10 rounded-full border border-gold-500/50" />
            <span className="text-xl font-serif font-bold text-gold-400 tracking-wider">Astro Mason</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">Funksjoner</a>
            <a href="#pricing" className="hover:text-white transition-colors">Priser</a>
            <a href="#courses" className="hover:text-white transition-colors">Kurs</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLoginClick}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Logg inn
            </button>
            <button 
              onClick={() => handleAuthAction('client')}
              className="bg-gold-600 hover:bg-gold-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-gold-900/20"
            >
              Start Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-space-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-gold-600/10 rounded-full blur-[100px] pointer-events-none opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-space-900/50 border border-space-700 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
            <Sparkles size={16} className="text-gold-400" />
            <span className="text-xs font-medium text-gold-100 uppercase tracking-wider">Profesjonell Astrologi & Utdanning</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            Oppdag Universets <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-amber-600">Skjulte Språk</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Astro Mason forener klassisk visdom med moderne teknologi. Enten du søker personlig innsikt eller profesjonell utdanning, er dette din plattform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => handleAuthAction('client')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-space-950 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-xl shadow-white/5"
            >
              Få ditt Horoskop <ExternalLink size={20} />
            </button>
            <button 
              onClick={() => handleAuthAction('professional')}
              className="w-full sm:w-auto px-8 py-4 bg-space-800/50 border border-space-700 text-white rounded-xl font-bold text-lg hover:bg-space-800 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              For Astrologer
            </button>
          </div>
        </div>
      </header>

      {/* Features Split */}
      <section id="features" className="py-24 bg-space-900/50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* For Users */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-3xl -m-4 blur-xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
              <div className="relative bg-space-950 border border-space-800 p-8 md:p-10 rounded-2xl h-full">
                <div className="w-14 h-14 bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                  <User size={32} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-white mb-4">For Deg</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Få klarhet i livets store spørsmål. Vår teknologi kombinerer presisjonen fra Swiss Ephemeris med dype, forståelige tolkninger.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    'Personlig dagshoroskop & transitter',
                    'Dybdeanalyse av kjærlighet & karriere',
                    'Karmisk innsikt og sjelsformål',
                    'Brukervennlig og lettlest språk'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <CircleCheck size={18} className="text-blue-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => handleAuthAction('client')}
                  className="w-full py-3 rounded-lg border border-blue-500/30 text-blue-400 font-medium hover:bg-blue-500/10 transition-colors"
                >
                  Start din reise (€9/mnd)
                </button>
              </div>
            </div>

            {/* For Professionals */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-transparent rounded-3xl -m-4 blur-xl group-hover:bg-gold-500/20 transition-all duration-500"></div>
              <div className="relative bg-space-950 border border-space-800 p-8 md:p-10 rounded-2xl h-full">
                <div className="w-14 h-14 bg-gold-900/30 rounded-xl flex items-center justify-center text-gold-400 mb-6">
                  <GraduationCap size={32} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-white mb-4">For Astrologer & Studenter</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Et kraftsenter for profesjonelle. Få tilgang til avanserte beregninger, kildemateriell og sertifiseringskurs.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    'Ubegrenset antall klient-kart & rapporter',
                    'Avanserte teknikker (Progresjoner, Solar Return)',
                    'Tilgang til digitalt bibliotek & forskning',
                    'Verktøy for coaching & konsultasjon'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <CircleCheck size={18} className="text-gold-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => handleAuthAction('professional')}
                  className="w-full py-3 rounded-lg bg-gold-600 text-white font-medium hover:bg-gold-700 transition-colors shadow-lg shadow-gold-900/20"
                >
                  Bli Profesjonell (€39/mnd)
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Course Teaser */}
      <section id="courses" className="py-24 relative overflow-hidden bg-space-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-white mb-4">Sertifisert Utdanning</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Bygg kompetanse trinn for trinn. Våre kurs gir deg diplom og dyp faglig tyngde, enten du er nybegynner eller viderekommen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Klassisk Astrologi",
                desc: "Lær fundamentet fra Ptolemy til Lilly. Tegn, hus, planeter og aspekter.",
                level: "Nybegynner",
                img: "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&q=80&w=600"
              },
              {
                title: "Esoterisk Astrologi",
                desc: "Forstå sjelens reise, de syv stråler og dypere spirituell tolkning.",
                level: "Videregående",
                img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=600"
              },
              {
                title: "Evolusjonær Astrologi",
                desc: "Dybdepsykologi og karma. Måneknuter og sjelens evolusjon.",
                level: "Ekspert",
                img: "https://images.unsplash.com/photo-1505506874110-6a7a69069a08?auto=format&fit=crop&q=80&w=600"
              }
            ].map((course, i) => (
              <div key={i} className="bg-space-900 rounded-xl overflow-hidden border border-space-800 hover:border-gold-500/30 transition-all group cursor-pointer" onClick={() => handleAuthAction()}>
                <div className="h-48 overflow-hidden relative">
                  <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gold-400 border border-gold-500/20">
                    {course.level}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{course.desc}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-space-800">
                    <span className="text-gold-400 font-bold">€62 <span className="text-gray-500 text-xs font-normal">/ kurs</span></span>
                    <span className="text-xs text-gray-400 flex items-center gap-1 group-hover:text-white transition-colors">
                      Les mer <ExternalLink size={14} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / CTA Final */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-space-900 to-space-950 border-t border-space-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif font-bold text-white mb-8">Klar for å starte din reise?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <div className="flex-1 bg-space-950 p-8 rounded-2xl border border-space-800 flex flex-col items-center">
                <span className="text-blue-400 font-medium tracking-wider uppercase text-sm mb-2">Standard Klient</span>
                <span className="text-4xl font-bold text-white mb-1">€9<span className="text-lg text-gray-500 font-normal">/mnd</span></span>
                <p className="text-gray-400 text-sm mb-6">For personlig vekst og innsikt.</p>
                <button onClick={() => handleAuthAction('client')} className="w-full py-3 bg-space-800 text-white rounded-lg hover:bg-space-700 transition-colors font-medium">Velg Standard</button>
             </div>
             <div className="flex-1 bg-space-950 p-8 rounded-2xl border border-gold-500/30 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gold-500"></div>
                <span className="text-gold-500 font-medium tracking-wider uppercase text-sm mb-2">Profesjonell</span>
                <span className="text-4xl font-bold text-white mb-1">€39<span className="text-lg text-gray-500 font-normal">/mnd</span></span>
                <p className="text-gray-400 text-sm mb-6">For studenter og astrologer.</p>
                <button onClick={() => handleAuthAction('professional')} className="w-full py-3 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors font-medium shadow-lg">Velg Profesjonell</button>
             </div>
          </div>
          <p className="mt-8 text-sm text-gray-500 flex items-center justify-center gap-2">
            <Lock size={14} /> Sikker betaling via Stripe. Ingen bindingstid.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-space-950 py-12 border-t border-space-800 text-center md:text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
              <img src="https://i.imgur.com/M7z6g3A.jpeg" alt="Logo" className="w-8 h-8 rounded-full" />
              <span className="font-serif font-bold text-white">Astro Mason</span>
            </div>
            <p className="text-sm text-gray-500">
              Din portal til universets visdom. Kombinerer tradisjon og teknologi for fremtidens astrologi.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Utforsk</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-gold-400">Funksjoner</a></li>
              <li><a href="#" className="hover:text-gold-400">Kurskatalog</a></li>
              <li><a href="#" className="hover:text-gold-400">Bibliotek</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Juridisk</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-gold-400">Personvern</a></li>
              <li><a href="#" className="hover:text-gold-400">Vilkår</a></li>
              <li><a href="#" className="hover:text-gold-400">Kontakt Oss</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Språk</h4>
            <div className="flex items-center gap-2 text-gray-400 text-sm justify-center md:justify-start">
              <Globe size={16} />
              <span>Norsk (Bokmål)</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-space-800 text-center text-xs text-gray-600">
          © 2025 Astro Mason Institute. Alle rettigheter reservert.
        </div>
      </footer>

      {/* Auth Modal - Keeps Dark Theme for Modal for consistency */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-space-900 border border-space-700 w-full max-w-md rounded-2xl p-8 relative shadow-2xl">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <X size={24} />
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold text-white mb-2">
                {authMode === 'login' ? 'Logg Inn' : 'Opprett Konto'}
              </h2>
              <p className="text-sm text-gray-400">
                {authMode === 'login' ? 'Velkommen tilbake til Astro Mason' : 'Start din reise i dag'}
              </p>
            </div>

            {/* Quick Demo Login Buttons */}
            <div className="mb-6 p-4 bg-space-800/50 border border-space-700 rounded-lg">
                <p className="text-xs text-gray-400 uppercase text-center mb-3 tracking-wider">Hurtig Demo Tilgang</p>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => onLogin('professional')}
                        className="bg-gold-900/20 border border-gold-500/30 hover:bg-gold-900/40 text-gold-400 text-sm font-bold py-2 rounded transition-colors flex items-center justify-center gap-2"
                    >
                        <GraduationCap size={16} /> Demo: Pro
                    </button>
                    <button 
                        onClick={() => onLogin('client')}
                        className="bg-blue-900/20 border border-blue-500/30 hover:bg-blue-900/40 text-blue-400 text-sm font-bold py-2 rounded transition-colors flex items-center justify-center gap-2"
                    >
                        <User size={16} /> Demo: Klient
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-space-700 flex-1"></div>
                <span className="text-xs text-gray-500 uppercase">Eller</span>
                <div className="h-px bg-space-700 flex-1"></div>
            </div>

            <form onSubmit={handleSubmitAuth} className="space-y-4">
              {authMode === 'register' && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                   <div 
                     className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${selectedPlan === 'client' ? 'border-blue-500 bg-blue-900/20 text-white' : 'border-space-700 text-gray-500 hover:border-gray-500'}`}
                     onClick={() => setSelectedPlan('client')}
                   >
                      <p className="font-bold text-sm">Klient</p>
                      <p className="text-xs opacity-70">€9/mnd</p>
                   </div>
                   <div 
                     className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${selectedPlan === 'professional' ? 'border-gold-500 bg-gold-900/20 text-white' : 'border-space-700 text-gray-500 hover:border-gray-500'}`}
                     onClick={() => setSelectedPlan('professional')}
                   >
                      <p className="font-bold text-sm">Profesjonell</p>
                      <p className="text-xs opacity-70">€39/mnd</p>
                   </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">E-post</label>
                <input type="email" className="w-full bg-space-950 border border-space-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500" placeholder="din@epost.no" required />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Passord</label>
                <input type="password" className="w-full bg-space-950 border border-space-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500" placeholder="••••••••" required />
              </div>

              <button type="submit" className="w-full bg-gold-600 hover:bg-gold-700 text-white font-bold py-3 rounded-lg transition-colors mt-4">
                {authMode === 'login' ? 'Logg Inn' : `Registrer som ${selectedPlan === 'professional' ? 'Pro' : 'Bruker'}`}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              {authMode === 'login' ? (
                <p className="text-gray-400">
                  Har du ikke konto? <button onClick={() => setAuthMode('register')} className="text-gold-400 hover:underline font-medium">Registrer deg</button>
                </p>
              ) : (
                <p className="text-gray-400">
                  Har du allerede konto? <button onClick={() => setAuthMode('login')} className="text-gold-400 hover:underline font-medium">Logg inn</button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
