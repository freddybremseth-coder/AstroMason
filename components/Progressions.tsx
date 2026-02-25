
import React, { useState, useContext } from 'react';
import { Star, Loader2, Sparkles, X, Clock as ClockIcon, RefreshCw } from './Icons';
import { CalculatedChart } from '../types';
import { AstrologyService, cleanAstroText } from '../services/astrology';
import { LangContext } from '../App';

interface ProgressionsProps {
  natalChart: CalculatedChart;
}

const PLANET_SYMBOLS: Record<string, string> = {
  'Solen': '☉', 'Månen': '☽', 'Merkur': '☿', 'Venus': '♀', 'Mars': '♂',
  'Jupiter': '♃', 'Saturn': '♄', 'Ascendant': '↑', 'Chiron': '⚷', 'Lilith': '⚸'
};

const Progressions: React.FC<ProgressionsProps> = ({ natalChart }) => {
  const { lang } = useContext(LangContext);
  const today = new Date().toISOString().split('T')[0];
  const [targetDate, setTargetDate] = useState(today);
  const [progChart, setProgChart] = useState<CalculatedChart | null>(null);
  const [report, setReport] = useState('');
  const [loadingChart, setLoadingChart] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState('');

  const natalData = {
    name: natalChart.clientName,
    date: natalChart.date,
    time: natalChart.time,
    location: natalChart.location,
    houseSystem: localStorage.getItem('soul_houses') || 'Placidus',
  };

  const birthDate = new Date(natalChart.date);
  const yearsElapsed = ((new Date(targetDate).getTime() - birthDate.getTime()) / (365.25 * 24 * 3600 * 1000)).toFixed(1);

  const handleCalculate = async () => {
    setLoadingChart(true);
    setError('');
    setProgChart(null);
    setReport('');
    try {
      const chart = await AstrologyService.calculateProgressions(natalData, targetDate, 'merged');
      setProgChart(chart);
    } catch (e: any) {
      setError('Kunne ikke beregne progresjonskart. ' + (e?.message || ''));
    } finally {
      setLoadingChart(false);
    }
  };

  const handleReport = async () => {
    if (!progChart) return;
    setLoadingReport(true);
    setError('');
    try {
      const text = await AstrologyService.generateProgressionReport(natalChart, progChart, lang);
      setReport(cleanAstroText(text));
    } catch (e: any) {
      setError('Kunne ikke generere rapport. ' + (e?.message || ''));
    } finally {
      setLoadingReport(false);
    }
  };

  const keyPlanets = progChart?.positions.filter(p =>
    ['Solen', 'Månen', 'Merkur', 'Venus', 'Mars', 'Chiron', 'Lilith'].includes(p.name)
  ) || [];

  // Find cross-aspects between natal and progressed
  const crossAspects: { natal: string; prog: string; type: string }[] = [];
  if (progChart) {
    for (const np of natalChart.positions.slice(0, 7)) {
      for (const pp of progChart.positions.slice(0, 7)) {
        const diff = Math.abs(np.totalDegrees - pp.totalDegrees);
        const angle = diff > 180 ? 360 - diff : diff;
        if (Math.abs(angle) <= 2) crossAspects.push({ natal: np.name, prog: pp.name, type: 'Konjunksjon ☌' });
        else if (Math.abs(angle - 180) <= 2) crossAspects.push({ natal: np.name, prog: pp.name, type: 'Opposisjon ☍' });
        else if (Math.abs(angle - 90) <= 2) crossAspects.push({ natal: np.name, prog: pp.name, type: 'Kvadrat □' });
        else if (Math.abs(angle - 120) <= 2) crossAspects.push({ natal: np.name, prog: pp.name, type: 'Trigon △' });
      }
    }
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <header className="space-y-2">
        <h3 className="text-4xl font-serif text-white">Sekundære Progresjoner</h3>
        <p className="text-slate-500 text-xs uppercase tracking-widest font-black">
          1 dag etter fødsel = 1 leveår · Sjelsutvikling over tid
        </p>
      </header>

      {/* Date selector */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-4 flex-1">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
              Progresjonsdato — for {natalChart.clientName}
            </p>
            <input
              type="date"
              value={targetDate}
              min={natalChart.date}
              max={new Date(new Date().getFullYear() + 20, 11, 31).toISOString().split('T')[0]}
              onChange={e => { setTargetDate(e.target.value); setProgChart(null); setReport(''); }}
              className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-amber-500 outline-none text-sm w-full md:w-auto"
            />
          </div>
          {targetDate && (
            <p className="text-slate-500 text-xs">
              Analyserer <span className="text-amber-400">{yearsElapsed} leveår</span> — planeter progresert {yearsElapsed} dager etter fødsel
            </p>
          )}
        </div>

        <button
          onClick={handleCalculate}
          disabled={loadingChart || !targetDate}
          className="px-10 py-5 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-2xl font-black uppercase text-xs text-white shadow-xl hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
        >
          {loadingChart ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          Beregn Progresjonskart
        </button>
      </div>

      {error && (
        <div className="bg-red-900/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {/* Chart result */}
      {progChart && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#0d0d20] border border-white/5 rounded-[2rem] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif text-2xl text-amber-100">Progresjonskart</h4>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
                  For dato {targetDate} · {yearsElapsed} leveår
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Prog. Ascendant</p>
                <p className="text-lg font-serif text-amber-400">{progChart.ascendant}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Prog. MC</p>
                <p className="text-sm font-serif text-indigo-400">{progChart.mc}</p>
              </div>
            </div>

            {/* Progressed planets */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Progreserte planeter</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {keyPlanets.map((p, i) => {
                  const natal = natalChart.positions.find(n => n.name === p.name);
                  return (
                    <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-indigo-500/20 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg text-indigo-400">{PLANET_SYMBOLS[p.name] || '★'}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{p.name}</span>
                      </div>
                      <p className="text-sm text-white font-light">{p.sign}</p>
                      <p className="text-xs text-slate-500">{p.degree}° · Hus {p.house}</p>
                      {natal && natal.sign !== p.sign && (
                        <p className="text-[9px] text-amber-400 mt-1">
                          Flyttet fra {natal.sign}
                        </p>
                      )}
                      {p.isRetrograde && <span className="text-[9px] text-red-400 font-bold block">RETROGRAD</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cross-aspects */}
            {crossAspects.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Natal → Progresjon Aspekter</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {crossAspects.slice(0, 6).map((a, i) => (
                    <div key={i} className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/10 rounded-xl p-3">
                      <Star size={12} className="text-amber-500 flex-shrink-0" />
                      <p className="text-xs text-slate-300">
                        Natal <span className="text-amber-400">{a.natal}</span> {a.type} Prog. <span className="text-indigo-400">{a.prog}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Generate report */}
          {!report && (
            <div className="text-center">
              <button
                onClick={handleReport}
                disabled={loadingReport}
                className="px-12 py-5 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl font-black uppercase text-xs text-indigo-300 hover:bg-indigo-600/30 transition-all flex items-center gap-3 mx-auto"
              >
                {loadingReport ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                Generer AI-progresjonsanalyse
              </button>
            </div>
          )}

          {loadingReport && (
            <div className="flex items-center gap-4 text-slate-500 justify-center py-8">
              <Loader2 size={24} className="animate-spin text-indigo-400" />
              <p className="font-serif italic text-lg">AstroMason dechiffrerer sjelsprogresjonen...</p>
            </div>
          )}

          {report && (
            <div className="bg-[#0a0a1a] border border-white/5 rounded-[2rem] p-8 md:p-12 space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-3xl text-white">Progresjonsanalyse</h4>
                <button
                  onClick={() => setReport('')}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-500 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
              <article className="text-slate-300 leading-relaxed font-light whitespace-pre-wrap text-base">
                <span className="first-letter:text-5xl first-letter:font-serif first-letter:text-indigo-400 first-letter:mr-2 first-letter:float-left">
                  {report}
                </span>
              </article>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Progressions;
