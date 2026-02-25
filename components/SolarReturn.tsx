
import React, { useState, useContext } from 'react';
import { Sun, Calendar, Loader2, Star, ChevronLeft, ChevronRight, Sparkles, X } from './Icons';
import { CalculatedChart } from '../types';
import { AstrologyService, cleanAstroText } from '../services/astrology';
import { LangContext } from '../App';

interface SolarReturnProps {
  natalChart: CalculatedChart;
}

const PLANET_SYMBOLS: Record<string, string> = {
  'Solen': '☉', 'Månen': '☽', 'Merkur': '☿', 'Venus': '♀', 'Mars': '♂',
  'Jupiter': '♃', 'Saturn': '♄', 'Chiron': '⚷', 'Lilith': '⚸'
};

const SolarReturn: React.FC<SolarReturnProps> = ({ natalChart }) => {
  const { lang } = useContext(LangContext);
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [srChart, setSrChart] = useState<CalculatedChart | null>(null);
  const [report, setReport] = useState('');
  const [loadingChart, setLoadingChart] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    setLoadingChart(true);
    setError('');
    setSrChart(null);
    setReport('');
    try {
      const chart = await AstrologyService.calculateSolarReturn(natalChart, year, 'merged');
      setSrChart(chart);
    } catch (e: any) {
      setError('Kunne ikke beregne solretur. ' + (e?.message || ''));
    } finally {
      setLoadingChart(false);
    }
  };

  const handleReport = async () => {
    if (!srChart) return;
    setLoadingReport(true);
    setError('');
    try {
      const text = await AstrologyService.generateSolarReturnReport(natalChart, srChart, lang);
      setReport(cleanAstroText(text));
    } catch (e: any) {
      setError('Kunne ikke generere rapport. ' + (e?.message || ''));
    } finally {
      setLoadingReport(false);
    }
  };

  const keyPlanets = srChart?.positions.filter(p =>
    ['Solen', 'Månen', 'Merkur', 'Venus', 'Mars', 'Jupiter', 'Saturn'].includes(p.name)
  ) || [];

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <header className="space-y-2">
        <h3 className="text-4xl font-serif text-white">Solretur</h3>
        <p className="text-slate-500 text-xs uppercase tracking-widest font-black">
          Årshoroskop basert på solens retur til fødselspunktet
        </p>
      </header>

      {/* Year selector */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Velg år</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setYear(y => y - 1); setSrChart(null); setReport(''); }}
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:border-amber-500/30 transition-all text-slate-400"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-5xl font-serif text-white font-bold min-w-[120px] text-center">{year}</span>
            <button
              onClick={() => { setYear(y => y + 1); setSrChart(null); setReport(''); }}
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:border-amber-500/30 transition-all text-slate-400"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <p className="text-slate-600 text-xs">
            Solretur skjer når solen returnerer til {natalChart.positions.find(p => p.name === 'Solen')?.degree}° {natalChart.positions.find(p => p.name === 'Solen')?.sign}
          </p>
        </div>

        <button
          onClick={handleCalculate}
          disabled={loadingChart}
          className="px-10 py-5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl font-black uppercase text-xs text-black shadow-xl hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
        >
          {loadingChart ? <Loader2 size={18} className="animate-spin" /> : <Sun size={18} />}
          Beregn Solretur {year}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {/* Chart result */}
      {srChart && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#0d0d20] border border-white/5 rounded-[2rem] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif text-2xl text-amber-100">Solreturkart {year}</h4>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
                  {srChart.date} · {srChart.time} UTC
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">SR Ascendant</p>
                <p className="text-lg font-serif text-amber-400">{srChart.ascendant}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">SR MC</p>
                <p className="text-sm font-serif text-indigo-400">{srChart.mc}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {keyPlanets.map((p, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-amber-500/20 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg text-amber-500">{PLANET_SYMBOLS[p.name] || '★'}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{p.name}</span>
                  </div>
                  <p className="text-sm text-white font-light">{p.sign}</p>
                  <p className="text-xs text-slate-500">{p.degree}° · Hus {p.house}</p>
                  {p.isRetrograde && <span className="text-[9px] text-red-400 font-bold">RETROGRAD</span>}
                </div>
              ))}
            </div>
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
                Generer AI-analyse for {year}
              </button>
            </div>
          )}

          {loadingReport && (
            <div className="flex items-center gap-4 text-slate-500 justify-center py-8">
              <Loader2 size={24} className="animate-spin text-amber-500" />
              <p className="font-serif italic text-lg">AstroMason leser ditt solreturkart...</p>
            </div>
          )}

          {report && (
            <div className="bg-[#0a0a1a] border border-white/5 rounded-[2rem] p-8 md:p-12 space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-3xl text-white">Din {year}-analyse</h4>
                <button
                  onClick={() => setReport('')}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-500 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
              <article className="text-slate-300 leading-relaxed font-light whitespace-pre-wrap text-base">
                <span className="first-letter:text-5xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left">
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

export default SolarReturn;
