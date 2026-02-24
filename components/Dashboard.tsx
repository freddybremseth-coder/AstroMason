
import React, { useEffect, useState } from 'react';
import { Sun, Moon, Activity, Star, Sparkles, Fingerprint, ChevronRight, Calendar, Zap } from './Icons';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

const ZODIAC_NO = [
  'Væren', 'Tyren', 'Tvillingene', 'Krepsen', 'Løven', 'Jomfruen',
  'Vekten', 'Skorpionen', 'Skytten', 'Steinbukken', 'Vannmannen', 'Fiskene'
];

const getSign = (lon: number) => ZODIAC_NO[Math.floor(((lon % 360) + 360) % 360 / 30)];

interface CosmicSnapshot {
  sunDeg: string;
  sunSign: string;
  moonSign: string;
  retrogradeNote: string;
  retrogradeDesc: string;
  lunarPhase: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const today = new Date().toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' });

  const [cosmic, setCosmic] = useState<CosmicSnapshot>({
    sunDeg: '—',
    sunSign: '...',
    moonSign: '...',
    retrogradeNote: 'Kosmisk Balanse',
    retrogradeDesc: 'Planetene beveger seg fremover',
    lunarPhase: '...',
  });

  useEffect(() => {
    const attempt = (tries = 0) => {
      const astro = (window as any).Astronomy;
      if (!astro) {
        if (tries < 10) setTimeout(() => attempt(tries + 1), 600);
        return;
      }
      try {
        const now = new Date();
        const time = astro.MakeTime(now);
        const yesterday = astro.MakeTime(new Date(now.getTime() - 86400000));

        const sunVec = astro.GeoVector(astro.Body.Sun, time, true);
        const sunLon = astro.Ecliptic(sunVec).elon;
        const sunSign = getSign(sunLon);
        const sunDeg = `${Math.floor(sunLon % 30)}°`;

        const moonVec = astro.GeoVector(astro.Body.Moon, time, true);
        const moonLon = astro.Ecliptic(moonVec).elon;
        const moonSign = getSign(moonLon);

        // Moon phase (0=ny, 0.5=full)
        const moonPhaseAngle = ((moonLon - sunLon) + 360) % 360;
        const phaseIndex = Math.floor(moonPhaseAngle / 45);
        const phaseNames = ['Nymåne', 'Voksende halvmåne', 'Første kvarter', 'Voksende gibbous', 'Fullmåne', 'Avtagende gibbous', 'Siste kvarter', 'Avtagende halvmåne'];
        const lunarPhase = phaseNames[phaseIndex] || 'Ukjent fase';

        // Retrograde check: Mercury, Venus, Mars
        const rxPlanets: string[] = [];
        const rxBodies: [string, string][] = [['Mercury', 'Merkur'], ['Venus', 'Venus'], ['Mars', 'Mars']];
        for (const [eng, no] of rxBodies) {
          const now_ = astro.Ecliptic(astro.GeoVector(astro.Body[eng], time, true)).elon;
          const prev_ = astro.Ecliptic(astro.GeoVector(astro.Body[eng], yesterday, true)).elon;
          const diff = now_ - prev_;
          if (diff < 0 && Math.abs(diff) < 5) rxPlanets.push(no);
        }

        setCosmic({
          sunDeg,
          sunSign,
          moonSign,
          retrogradeNote: rxPlanets.length > 0 ? `${rxPlanets.join(', ')} Retrograd` : 'Fremovergang',
          retrogradeDesc: rxPlanets.length > 0
            ? `${rxPlanets.join(' og ')} beveger seg bakover — tid for revisjon`
            : 'Alle indre planeter beveger seg fremover',
          lunarPhase,
        });
      } catch (_) {}
    };
    attempt();
  }, []);

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/60">{today}</p>
          <h2 className="text-5xl font-serif font-bold text-white">Sjelens Oversikt</h2>
          <p className="text-slate-500 text-sm uppercase tracking-[0.3em] font-black">Velkommen tilbake til arkivene</p>
        </div>
        <div className="text-right hidden md:block border-l border-white/5 pl-8">
          <p className="text-3xl font-serif text-amber-500">{cosmic.sunDeg} {cosmic.sunSign}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Solen akkurat nå</p>
        </div>
      </header>

      {/* Daily Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Sun,
            label: 'Solen i dag',
            value: `${cosmic.sunDeg} ${cosmic.sunSign}`,
            desc: 'Din livskraft og ytre identitet',
            color: 'text-amber-400'
          },
          {
            icon: Moon,
            label: `Månen · ${cosmic.lunarPhase}`,
            value: cosmic.moonSign,
            desc: 'Følelsesmessig strøm akkurat nå',
            color: 'text-blue-400'
          },
          {
            icon: Activity,
            label: 'Kosmisk Vær',
            value: cosmic.retrogradeNote,
            desc: cosmic.retrogradeDesc,
            color: 'text-purple-400'
          }
        ].map((item, i) => (
          <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] space-y-4 hover:border-amber-500/20 transition-all group">
            <div className={`p-4 bg-white/5 rounded-2xl w-fit ${item.color}`}><item.icon size={28} /></div>
            <div>
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">{item.label}</p>
              <p className="text-xl font-serif text-white">{item.value}</p>
              <p className="text-xs text-slate-400 mt-2 font-light italic">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <button onClick={() => onNavigate('astrology')} className="p-10 bg-gradient-to-br from-indigo-900/40 to-black border border-white/5 rounded-[3.5rem] text-left group hover:scale-[1.01] transition-all relative overflow-hidden shadow-2xl h-full">
          <div className="absolute -right-16 -top-16 p-20 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors"></div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 text-amber-500">
              <Sun size={40} />
              <h3 className="text-3xl font-serif font-bold text-white">Astrologisk Analyse</h3>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">Dykk dypt ned i ditt fødselshoroskop, sjekk din relasjons-synergi eller se dine kommende transitter.</p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500 group-hover:gap-4 transition-all">
              Åpne Stjernekartet <ChevronRight size={14} />
            </div>
          </div>
        </button>

        <div className="grid grid-cols-1 gap-6">
          <button onClick={() => onNavigate('horoscope')} className="p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-[2.5rem] flex items-center gap-8 group hover:bg-indigo-500/20 transition-all">
            <div className="p-5 bg-indigo-500/20 rounded-3xl text-indigo-400 group-hover:scale-110 transition-transform"><Calendar size={32} /></div>
            <div className="text-left flex-1">
              <h4 className="text-xl font-serif text-white mb-1">Ditt Personlige Horoskop</h4>
              <p className="text-xs text-slate-500 font-light">Dag, uke, måned eller år — basert på ditt natale kart.</p>
            </div>
            <ChevronRight className="text-slate-700" />
          </button>

          <button onClick={() => onNavigate('tools')} className="p-8 bg-rose-500/5 border border-rose-900/20 rounded-[2.5rem] flex items-center gap-8 group hover:bg-rose-900/10 transition-all">
            <div className="p-5 bg-rose-900/20 rounded-3xl text-rose-400 group-hover:scale-110 transition-transform"><Zap size={32} /></div>
            <div className="text-left flex-1">
              <h4 className="text-xl font-serif text-white mb-1">Par-Horoskop & Verktøy</h4>
              <p className="text-xs text-slate-500 font-light">Synastri, relokasjon og ukentlig transit-prognose.</p>
            </div>
            <ChevronRight className="text-slate-700" />
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => onNavigate('chinese')} className="p-8 bg-red-500/5 border border-red-900/20 rounded-[2.5rem] flex flex-col items-center gap-4 group hover:bg-red-900/10 transition-all text-center">
              <div className="p-4 bg-red-900/20 rounded-2xl text-red-400 group-hover:scale-110 transition-transform"><Star size={24} /></div>
              <div>
                <h4 className="text-sm font-serif text-white mb-1">Kinesisk</h4>
                <p className="text-[10px] text-slate-500">Fem elementer</p>
              </div>
            </button>
            <button onClick={() => onNavigate('numerology')} className="p-8 bg-indigo-500/5 border border-indigo-900/20 rounded-[2.5rem] flex flex-col items-center gap-4 group hover:bg-indigo-900/10 transition-all text-center">
              <div className="p-4 bg-indigo-900/20 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform"><Fingerprint size={24} /></div>
              <div>
                <h4 className="text-sm font-serif text-white mb-1">Tallkode</h4>
                <p className="text-[10px] text-slate-500">Sjelens vibrasjon</p>
              </div>
            </button>
          </div>

          <button onClick={() => onNavigate('tarot')} className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] flex items-center gap-8 group hover:bg-white/10 transition-all">
            <div className="p-5 bg-purple-500/10 rounded-3xl text-purple-400 group-hover:scale-110 transition-transform"><Sparkles size={32} /></div>
            <div className="text-left flex-1">
              <h4 className="text-xl font-serif text-white mb-1">Tarot-Syntese</h4>
              <p className="text-xs text-slate-500 font-light">Spør orakelet og dechiffrer sjelens speil.</p>
            </div>
            <ChevronRight className="text-slate-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
