
import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Moon, Sun, Star, Loader2, ChevronLeft, ChevronRight, Zap } from './Icons';
import { CalculatedChart } from '../types';
import { AstrologyService, cleanAstroText } from '../services/astrology';
import { LangContext } from '../App';

interface TransitCalendarProps {
  natalChart: CalculatedChart;
}

interface DayInfo {
  date: Date;
  moonPhase: string;
  moonPhaseEmoji: string;
  moonSign: string;
  isToday: boolean;
  isCurrentMonth: boolean;
  highlights: string[];
  energy: 'low' | 'medium' | 'high' | 'peak';
}

const getMoonPhase = (date: Date): { phase: string; emoji: string; illumination: number } => {
  // Known new moon: Jan 1 2000 18:14 UTC (JD 2451545.38)
  const J2000_NM = 2451545.38;
  const SYNODIC_MONTH = 29.53058867;
  const JD = date.getTime() / 86400000 + 2440587.5;
  const daysSince = JD - J2000_NM;
  const phase = ((daysSince % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const illumination = (1 - Math.cos((phase / SYNODIC_MONTH) * 2 * Math.PI)) / 2;

  let name: string, emoji: string;
  if (phase < 1.85)       { name = 'Nymåne';          emoji = '🌑'; }
  else if (phase < 7.38)  { name = 'Voksende sigd';   emoji = '🌒'; }
  else if (phase < 9.22)  { name = 'Første kvarter';  emoji = '🌓'; }
  else if (phase < 14.77) { name = 'Voksende gibbous';emoji = '🌔'; }
  else if (phase < 16.61) { name = 'Fullmåne';        emoji = '🌕'; }
  else if (phase < 22.15) { name = 'Avtakende gibbous';emoji = '🌖'; }
  else if (phase < 23.99) { name = 'Tredje kvarter';  emoji = '🌗'; }
  else if (phase < 29.53) { name = 'Avtakende sigd';  emoji = '🌘'; }
  else                    { name = 'Nymåne';           emoji = '🌑'; }

  return { phase: name, emoji, illumination };
};

const getMoonSign = (date: Date): string => {
  const ZODIAC = [
    'Væren','Tyren','Tvillingene','Krepsen','Løven','Jomfruen',
    'Vekten','Skorpionen','Skytten','Steinbukken','Vannmannen','Fiskene'
  ];
  const JD = date.getTime() / 86400000 + 2440587.5;
  // Moon moves ~13.176°/day; at J2000 moon was at ~218.3°
  const moonLon = ((218.3 + 13.176 * (JD - 2451545.0)) % 360 + 360) % 360;
  return ZODIAC[Math.floor(moonLon / 30)];
};

const MERCURY_RETROGRADES_2025_2026 = [
  { start: new Date('2025-03-15'), end: new Date('2025-04-07') },
  { start: new Date('2025-07-18'), end: new Date('2025-08-11') },
  { start: new Date('2025-11-09'), end: new Date('2025-11-29') },
  { start: new Date('2026-03-15'), end: new Date('2026-04-07') },
];

const VENUS_RETROGRADES = [
  { start: new Date('2025-03-01'), end: new Date('2025-04-12') },
];

const isMercuryRetrograde = (date: Date): boolean =>
  MERCURY_RETROGRADES_2025_2026.some(r => date >= r.start && date <= r.end);

const isVenusRetrograde = (date: Date): boolean =>
  VENUS_RETROGRADES.some(r => date >= r.start && date <= r.end);

const getEnergyLevel = (date: Date, natalChart: CalculatedChart): 'low' | 'medium' | 'high' | 'peak' => {
  const moonPhaseRaw = (() => {
    const J2000_NM = 2451545.38;
    const SYNODIC_MONTH = 29.53058867;
    const JD = date.getTime() / 86400000 + 2440587.5;
    return ((JD - J2000_NM) % SYNODIC_MONTH + SYNODIC_MONTH) % SYNODIC_MONTH;
  })();

  // Full moon and new moon = peak energy
  if (moonPhaseRaw < 1.5 || Math.abs(moonPhaseRaw - 14.77) < 1.5) return 'peak';

  // Mercury retrograde = lower energy for communication
  if (isMercuryRetrograde(date)) return 'low';

  // First/third quarter = medium
  if (Math.abs(moonPhaseRaw - 7.38) < 2 || Math.abs(moonPhaseRaw - 22.15) < 2) return 'medium';

  return 'high';
};

const getHighlights = (date: Date, natalChart: CalculatedChart): string[] => {
  const highlights: string[] = [];
  const { phase } = getMoonPhase(date);
  const moonSign = getMoonSign(date);

  if (phase === 'Nymåne') highlights.push(`Nymåne i ${moonSign} — sett intensjoner`);
  if (phase === 'Fullmåne') highlights.push(`Fullmåne i ${moonSign} — utgivelse og avsløring`);
  if (phase === 'Første kvarter') highlights.push('Første kvarter — tid for handling');
  if (phase === 'Tredje kvarter') highlights.push('Tredje kvarter — refleksjon');

  if (isMercuryRetrograde(date)) highlights.push('☿ Merkur retrograd — dobbeltsjekk kommunikasjon');
  if (isVenusRetrograde(date)) highlights.push('♀ Venus retrograd — revurder relasjoner');

  // Check if moon is in a sign that aspects natal sun
  const natalSun = natalChart.positions.find(p => p.name === 'Solen');
  if (natalSun) {
    const moonSignIndex = ['Væren','Tyren','Tvillingene','Krepsen','Løven','Jomfruen',
      'Vekten','Skorpionen','Skytten','Steinbukken','Vannmannen','Fiskene'].indexOf(moonSign);
    const sunSignIndex = ['Væren','Tyren','Tvillingene','Krepsen','Løven','Jomfruen',
      'Vekten','Skorpionen','Skytten','Steinbukken','Vannmannen','Fiskene'].indexOf(natalSun.sign);
    const diff = Math.abs(moonSignIndex - sunSignIndex);
    if (diff === 0) highlights.push(`Månen i ditt natal sol-tegn — høy personlig energi`);
    if (diff === 4 || diff === 8) highlights.push(`Månen trigoner din natal sol — flyt og muligheter`);
    if (diff === 6) highlights.push(`Måneopposisjon til din natal sol — emosjonelt intenst`);
  }

  return highlights.slice(0, 2);
};

const ENERGY_COLORS = {
  low:    'bg-slate-800/40 border-slate-700/20',
  medium: 'bg-indigo-900/10 border-indigo-500/10',
  high:   'bg-amber-900/10 border-amber-500/10',
  peak:   'bg-amber-500/10 border-amber-500/30',
};

const ENERGY_DOTS = {
  low:    'bg-slate-600',
  medium: 'bg-indigo-400',
  high:   'bg-amber-400',
  peak:   'bg-amber-400',
};

const TransitCalendar: React.FC<TransitCalendarProps> = ({ natalChart }) => {
  const { lang } = useContext(LangContext);
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null);
  const [monthInsight, setMonthInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  const MONTH_NAMES = [
    'Januar','Februar','Mars','April','Mai','Juni',
    'Juli','August','September','Oktober','November','Desember'
  ];
  const DAY_NAMES = ['Man','Tir','Ons','Tor','Fre','Lør','Søn'];

  const buildCalendar = (): DayInfo[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Start on Monday
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const days: DayInfo[] = [];

    // Previous month fill
    for (let i = startOffset - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      const { phase, emoji } = getMoonPhase(date);
      days.push({
        date,
        moonPhase: phase,
        moonPhaseEmoji: emoji,
        moonSign: getMoonSign(date),
        isToday: false,
        isCurrentMonth: false,
        highlights: [],
        energy: 'low',
      });
    }

    // Current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const { phase, emoji } = getMoonPhase(date);
      const energy = getEnergyLevel(date, natalChart);
      const highlights = getHighlights(date, natalChart);
      const isToday = date.toDateString() === today.toDateString();
      days.push({
        date, moonPhase: phase, moonPhaseEmoji: emoji,
        moonSign: getMoonSign(date), isToday, isCurrentMonth: true,
        highlights, energy,
      });
    }

    // Next month fill to complete grid
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(year, month + 1, d);
      const { phase, emoji } = getMoonPhase(date);
      days.push({
        date, moonPhase: phase, moonPhaseEmoji: emoji,
        moonSign: getMoonSign(date), isToday: false, isCurrentMonth: false,
        highlights: [], energy: 'low',
      });
    }

    return days;
  };

  const loadMonthInsight = async () => {
    setLoadingInsight(true);
    try {
      const insight = await AstrologyService.generatePersonalizedHoroscope(
        natalChart,
        'month',
        lang
      );
      setMonthInsight(insight);
    } catch {
      setMonthInsight('Kosmisk innsikt er midlertidig utilgjengelig.');
    } finally {
      setLoadingInsight(false);
    }
  };

  useEffect(() => {
    setSelectedDay(null);
    setMonthInsight('');
  }, [currentMonth]);

  const calendar = buildCalendar();

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="text-4xl font-serif text-white">Kosmisk Kalender</h3>
          <p className="text-slate-500 text-xs uppercase tracking-widest font-black mt-1">
            Månefaser · Transitter · Personlig energi
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
            className="p-3 bg-white/5 border border-white/10 rounded-xl hover:border-amber-500/30 transition-all text-slate-400 hover:text-white"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-lg font-serif text-white min-w-[180px] text-center">
            {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
            className="p-3 bg-white/5 border border-white/10 rounded-xl hover:border-amber-500/30 transition-all text-slate-400 hover:text-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </header>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest">
        <span className="flex items-center gap-2 text-slate-500"><span className="w-3 h-3 rounded-full bg-amber-400"></span>Topp energi</span>
        <span className="flex items-center gap-2 text-slate-500"><span className="w-3 h-3 rounded-full bg-indigo-400"></span>Medium energi</span>
        <span className="flex items-center gap-2 text-slate-500"><span className="w-3 h-3 rounded-full bg-slate-600"></span>Lav energi</span>
        <span className="flex items-center gap-2 text-slate-500">🌑🌕 Månefase</span>
        {isMercuryRetrograde(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 15)) &&
          <span className="flex items-center gap-2 text-red-400">☿ Merkur retrograd denne måneden</span>
        }
      </div>

      {/* Calendar grid */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 overflow-hidden">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_NAMES.map(d => (
            <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-600 py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendar.map((day, i) => (
            <button
              key={i}
              onClick={() => day.isCurrentMonth && setSelectedDay(day)}
              className={`aspect-square rounded-xl p-1.5 flex flex-col items-center justify-center relative transition-all ${
                day.isCurrentMonth
                  ? `${ENERGY_COLORS[day.energy]} hover:border-amber-500/40 cursor-pointer`
                  : 'opacity-20 cursor-default'
              } ${day.isToday ? 'ring-2 ring-amber-500 ring-offset-1 ring-offset-[#0a0a16]' : ''}
              ${selectedDay?.date.toDateString() === day.date.toDateString() && day.isCurrentMonth ? 'border-amber-500/60' : ''}`}
            >
              <span className={`text-xs font-bold ${day.isToday ? 'text-amber-400' : day.isCurrentMonth ? 'text-slate-300' : 'text-slate-700'}`}>
                {day.date.getDate()}
              </span>
              {day.isCurrentMonth && (
                <>
                  <span className="text-[10px] leading-none">{day.moonPhaseEmoji}</span>
                  {day.highlights.length > 0 && (
                    <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${ENERGY_DOTS[day.energy]}`} />
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selected day detail */}
      {selectedDay && (
        <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-[2rem] p-8 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-2xl text-white">
              {selectedDay.date.toLocaleDateString('no-NO', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h4>
            <span className="text-3xl">{selectedDay.moonPhaseEmoji}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Månefase</p>
              <p className="text-sm text-white">{selectedDay.moonPhase}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Månetegn</p>
              <p className="text-sm text-white">{selectedDay.moonSign}</p>
            </div>
          </div>
          {selectedDay.highlights.length > 0 ? (
            <div className="space-y-2">
              {selectedDay.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                  <Star size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-300">{h}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm italic">Ingen spesielle kosmiske hendelser denne dagen.</p>
          )}
          {isMercuryRetrograde(selectedDay.date) && (
            <div className="flex items-center gap-3 bg-red-900/10 border border-red-500/20 rounded-xl p-3">
              <span className="text-lg">☿</span>
              <p className="text-sm text-red-400">Merkur er retrograd — unngå store kontrakter, backup data</p>
            </div>
          )}
        </div>
      )}

      {/* Month AI insight */}
      <div className="bg-[#0d0d20] border border-white/5 rounded-[2rem] p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-2xl text-amber-100">Kosmisk Månedsinnsikt</h4>
          {!monthInsight && (
            <button
              onClick={loadMonthInsight}
              disabled={loadingInsight}
              className="px-6 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all flex items-center gap-2"
            >
              {loadingInsight ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
              Generer innsikt
            </button>
          )}
        </div>
        {loadingInsight && (
          <div className="flex items-center gap-4 text-slate-500">
            <Loader2 size={20} className="animate-spin text-amber-500" />
            <p className="text-sm italic">AstroMason leser måneds-energiene...</p>
          </div>
        )}
        {monthInsight && (
          <p className="text-slate-300 leading-relaxed font-light whitespace-pre-wrap">{monthInsight}</p>
        )}
        {!monthInsight && !loadingInsight && (
          <p className="text-slate-600 text-sm italic">Klikk for å generere din personlige kosmiske månedsinnsikt.</p>
        )}
      </div>
    </div>
  );
};

export default TransitCalendar;
