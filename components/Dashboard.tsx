
import React, { useEffect, useState, useMemo } from 'react';
import { Sun, Moon, Activity, Star, Sparkles, Fingerprint, ChevronRight, Calendar, Zap } from './Icons';
import { FULL_TAROT_DECK } from '../constants';

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

interface ActiveTransit {
  transitPlanet: string;
  aspect: string;
  natalPlanet: string;
  orb: number;
  color: string;
}

const reduceNum = (n: number): number => {
  if ([11, 22, 33].includes(n)) return n;
  while (n > 9 && ![11, 22, 33].includes(n)) n = String(n).split('').reduce((a, b) => a + +b, 0);
  return n;
};

const getDailyCard = () => {
  const dateStr = new Date().toDateString();
  const cached = localStorage.getItem('daily_tarot_card');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed.date === dateStr) return parsed.card;
    } catch {}
  }
  // Seed from date string hash for stable daily card
  const hash = dateStr.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const card = FULL_TAROT_DECK[hash % FULL_TAROT_DECK.length];
  localStorage.setItem('daily_tarot_card', JSON.stringify({ date: dateStr, card }));
  return card;
};

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const today = new Date().toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' });

  const [activeTransits, setActiveTransits] = useState<ActiveTransit[]>([]);

  const dailyCard = useMemo(() => getDailyCard(), []);

  const personalYear = useMemo(() => {
    const bDate = localStorage.getItem('soul_date');
    if (!bDate) return null;
    const [, month, day] = bDate.split('-').map(Number);
    const year = new Date().getFullYear();
    return reduceNum(reduceNum(month) + reduceNum(day) + reduceNum(String(year).split('').reduce((a, b) => a + +b, 0)));
  }, []);

  const personalMonth = useMemo(() => {
    if (!personalYear) return null;
    return reduceNum(personalYear + (new Date().getMonth() + 1));
  }, [personalYear]);

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
    // Transit indicator: compare current sky to natal positions
    const attemptTransits = (tries = 0) => {
      const astro = (window as any).Astronomy;
      const chartSummary = localStorage.getItem('soul_chart_summary');
      if (!astro || !chartSummary) {
        if (tries < 10) setTimeout(() => attemptTransits(tries + 1), 700);
        return;
      }
      try {
        const now = new Date();
        const time = astro.MakeTime(now);
        const ZODIAC_NO = ['Væren','Tyren','Tvillingene','Krepsen','Løven','Jomfruen','Vekten','Skorpionen','Skytten','Steinbukken','Vannmannen','Fiskene'];
        const signToDeg = (sign: string, deg: number) => ZODIAC_NO.indexOf(sign) * 30 + deg;

        // Parse natal positions from summary: "Solen: Tvillingene 15°, ..."
        const natalPositions: {name: string; deg: number}[] = [];
        chartSummary.split(', ').forEach(part => {
          const m = part.match(/^(.+?):\s*(.+?)\s+(\d+)°/);
          if (m) {
            const [, name, sign, deg] = m;
            const signIdx = ZODIAC_NO.indexOf(sign.trim());
            if (signIdx >= 0) natalPositions.push({ name: name.trim(), deg: signIdx * 30 + parseInt(deg) });
          }
        });

        // Current transit planets
        const transitBodies: [string, string][] = [
          ['Sun','Solen☉'], ['Moon','Månen☽'], ['Mercury','Merkur☿'],
          ['Venus','Venus♀'], ['Mars','Mars♂'], ['Jupiter','Jupiter♃'], ['Saturn','Saturn♄']
        ];
        const aspects = [
          { angle: 0, name: '☌', color: 'text-amber-400' },
          { angle: 60, name: '✱', color: 'text-blue-400' },
          { angle: 90, name: '□', color: 'text-red-400' },
          { angle: 120, name: '△', color: 'text-green-400' },
          { angle: 180, name: '☍', color: 'text-red-500' },
        ];

        const found: ActiveTransit[] = [];
        for (const [eng, nor] of transitBodies) {
          const lon = astro.Ecliptic(astro.GeoVector(astro.Body[eng], time, true)).elon;
          for (const natal of natalPositions) {
            for (const asp of aspects) {
              const diff = Math.abs(((lon - natal.deg - asp.angle + 540) % 360) - 180);
              const orb = Math.min(diff, 180 - diff);
              if (orb < 3) {
                found.push({ transitPlanet: nor, aspect: asp.name, natalPlanet: natal.name, orb: Math.round(orb * 10) / 10, color: asp.color });
              }
            }
          }
        }
        found.sort((a, b) => a.orb - b.orb);
        setActiveTransits(found.slice(0, 5));
      } catch (_) {}
    };
    attemptTransits();

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

      {/* Daily Cosmic Briefing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Tarot Card */}
        <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border border-indigo-500/20 p-8 rounded-[2.5rem] flex items-center gap-8 group hover:border-indigo-500/40 transition-all cursor-pointer" onClick={() => onNavigate('tarot')}>
          <div className="relative w-20 h-28 shrink-0 rounded-xl overflow-hidden border border-amber-500/20 shadow-xl">
            <img src={dailyCard.img} alt={dailyCard.name} referrerPolicy="no-referrer" crossOrigin="anonymous" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/70">Dagens Tarot-Kort</p>
            <p className="text-xl font-serif text-white">{dailyCard.name}</p>
            {'suit' in dailyCard && dailyCard.suit && (
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{(dailyCard as any).suit}</p>
            )}
            <p className="text-xs text-slate-400 italic">{'keywords' in dailyCard ? (dailyCard.keywords as string[]).join(' · ') : ''}</p>
          </div>
        </div>

        {/* Personal Year/Month */}
        {personalYear && (
          <div className="bg-gradient-to-br from-amber-900/20 to-black border border-amber-500/10 p-8 rounded-[2.5rem] space-y-4 hover:border-amber-500/30 transition-all group" onClick={() => onNavigate('numerology')} style={{ cursor: 'pointer' }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/70">Numerologiske Sykler</p>
            <div className="flex items-end gap-6">
              <div className="text-center">
                <p className="text-5xl font-serif text-white group-hover:scale-105 transition-transform inline-block">{personalYear}</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black mt-1">Personlig År</p>
              </div>
              <div className="h-12 w-px bg-white/10"></div>
              <div className="text-center">
                <p className="text-3xl font-serif text-amber-400">{personalMonth}</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black mt-1">Personlig Måned</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 italic font-light">Numerologisk energi akkurat nå — klikk for dypanalyse</p>
          </div>
        )}
      </div>

      {/* Live Transit Indicator */}
      {activeTransits.length > 0 && (
        <div className="bg-[#0f0f25]/60 border border-white/5 p-8 rounded-[2.5rem] space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Aktive Transitter Akkurat Nå</p>
            <button onClick={() => onNavigate('astrology')} className="text-[9px] text-slate-600 hover:text-amber-500 font-black uppercase tracking-widest transition-colors">Se kart →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {activeTransits.map((t, i) => (
              <div key={i} className="bg-black/30 border border-white/5 rounded-2xl p-4 text-center space-y-1 hover:border-indigo-500/20 transition-all">
                <p className="text-sm font-bold text-white">{t.transitPlanet}</p>
                <p className={`text-2xl font-serif ${t.color}`}>{t.aspect}</p>
                <p className="text-xs text-slate-400">{t.natalPlanet}</p>
                <p className="text-[9px] text-slate-600 font-black">{t.orb}° orb</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
