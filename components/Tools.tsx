
import React, { useState, useEffect, useContext } from 'react';
import { AstrologyService } from '../services/astrology';
import { CalculatedChart } from '../types';
import { MapPin, Users, Activity, Sparkles, Loader2, Calendar, ArrowRight, Save, Download, Clock, Wallet } from './Icons';
import { LangContext } from '../App';

interface AdvancedToolsProps {
    onNavigateToSettings?: () => void;
}

export default function AdvancedTools({ onNavigateToSettings }: AdvancedToolsProps) {
  const [mode, setMode] = useState<'relocation' | 'relationship' | 'transit'>('relocation');
  const [chartA, setChartA] = useState<CalculatedChart | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState('');
  const { lang } = useContext(LangContext);
  const userEmail = localStorage.getItem('soul_email') || '';
  
  // Credits state
  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem('tarot_credits');
    return saved !== null ? parseInt(saved) : (userEmail === 'freddy.bremseth@gmail.com' ? 200000 : 0);
  });

  useEffect(() => {
    localStorage.setItem('tarot_credits', credits.toString());
  }, [credits]);

  const useCredit = () => {
    if (credits < 1) {
        if (confirm("Du trenger 1 kreditt for å utføre denne dype analysen. Vil du fylle på i innstillinger?")) {
            onNavigateToSettings?.();
        }
        return false;
    }
    setCredits(prev => prev - 1);
    return true;
  };

  // State for relocation input
  const [relocationCity, setRelocationCity] = useState('');

  // Load latest chart on mount to ensure we have a base to work from
  useEffect(() => {
    const savedName = localStorage.getItem('soul_name');
    if (savedName) {
      const birthData = {
          name: savedName,
          date: localStorage.getItem('soul_date') || '',
          time: localStorage.getItem('soul_time') || '',
          location: localStorage.getItem('soul_location') || '',
          houseSystem: localStorage.getItem('soul_houses') || 'Placidus'
      };
      if (birthData.name && birthData.date) {
          AstrologyService.calculateChart(birthData).then(setChartA);
      }
    }
  }, []);

  const handleRelocation = async (newLocation: string) => {
    if (!chartA) {
      alert("Vennligst fullfør din sjelsprofil i Sjelssenteret først.");
      return;
    }
    if (!newLocation.trim()) return;
    if (!useCredit()) return;

    setLoading(true);
    setReport('');
    try {
      const relocated = await AstrologyService.calculateChart({
        name: chartA.clientName, 
        date: chartA.date, 
        time: chartA.time, 
        location: newLocation, 
        houseSystem: 'Whole Sign'
      });
      const text = await AstrologyService.generateDeepChronicle(relocated, 'relocation', lang);
      setReport(text);
    } catch (error) {
      setReport("Kunne ikke utføre relokasjonsanalysen. Vennligst prøv igjen.");
    } finally { 
      setLoading(false); 
    }
  };

  const handleWeeklyTransit = async () => {
    if (!chartA) {
      alert("Vennligst fullfør din sjelsprofil først.");
      return;
    }
    if (!useCredit()) return;

    setLoading(true);
    setReport('');
    try {
      const text = await AstrologyService.generateWeeklyTransitDeepDive(chartA, lang);
      setReport(text);
    } catch (e) {
      setReport("De kosmiske arkivene er midlertidig utilgjengelige.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left space-y-2">
            <h2 className="text-4xl font-serif text-white">Magiske Verktøy</h2>
            <p className="text-slate-400 italic">Gå dypere inn i stjernenes mysterier.</p>
        </div>
        <div onClick={onNavigateToSettings} className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 cursor-pointer hover:border-amber-500/30 transition-all">
            <div className="text-right">
                <p className="text-[9px] uppercase font-black text-slate-500">Dine Kreditter</p>
                <p className="text-xl font-serif text-amber-500">{credits}</p>
            </div>
            <Wallet className="text-amber-500" size={20} />
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        {[
          { id: 'relocation', icon: MapPin, label: 'Relokasjon' },
          { id: 'relationship', icon: Users, label: 'Relasjon' },
          { id: 'transit', icon: Activity, label: '7-Dagers' }
        ].map(btn => (
          <button 
            key={btn.id}
            onClick={() => {
              setMode(btn.id as any);
              setReport('');
            }}
            className={`px-8 py-4 rounded-2xl flex items-center gap-3 border transition-all font-bold uppercase tracking-widest text-xs ${mode === btn.id ? 'bg-indigo-600 border-indigo-400 shadow-xl shadow-indigo-900/40 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
          >
            <btn.icon size={18} /> {btn.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 bg-[#0f0f25]/60 backdrop-blur-md p-10 rounded-[3rem] border border-white/5 space-y-8 shadow-2xl h-fit">
          <header className="space-y-2">
            <h3 className="text-2xl font-serif text-amber-100 flex items-center gap-3">
              <Sparkles className="text-amber-400" size={24} /> 
              {mode === 'relocation' ? 'Flytt ditt Kart' : mode === 'relationship' ? 'Partnerens Data' : 'Transit-søk'}
            </h3>
            <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">
              {chartA ? `Aktiv Klient: ${chartA.clientName}` : 'Ingen klient valgt'}
            </p>
          </header>
          
          {mode === 'relocation' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black ml-1">Ny Lokasjon (By, Land)</label>
                <input 
                  type="text" 
                  placeholder="f.eks. London, UK" 
                  value={relocationCity}
                  onChange={(e) => setRelocationCity(e.target.value)}
                  className="w-full bg-[#050511] p-5 rounded-2xl border border-white/10 text-white focus:border-indigo-500 outline-none transition-all placeholder:opacity-30" 
                  onKeyDown={e => e.key === 'Enter' && handleRelocation(relocationCity)} 
                />
              </div>
              <button 
                onClick={() => handleRelocation(relocationCity)}
                disabled={loading || !relocationCity.trim()}
                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-indigo-900/40 disabled:opacity-30"
              >
                Utfør Analyse (1 Kreditt)
              </button>
            </div>
          )}

          {mode === 'relationship' && (
            <div className="space-y-4">
              <div className="p-6 bg-indigo-900/10 border border-indigo-500/20 rounded-3xl text-center">
                 <p className="text-sm text-indigo-200 font-light">Kommer snart: Fullstendig synastri-analyse for 2 kreditter.</p>
              </div>
            </div>
          )}

          {mode === 'transit' && (
            <div className="space-y-6">
              <div className="p-6 bg-indigo-900/20 border border-indigo-500/30 rounded-[2rem] space-y-4">
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-amber-400" />
                    <p className="text-sm font-bold text-indigo-200 uppercase tracking-wider">7-Dagers Prognose</p>
                </div>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Få et detaljert dypdykk i ukens planetbevegelser og hvordan de samhandler med ditt unike kosmiske avtrykk.
                </p>
              </div>
              <button 
                onClick={handleWeeklyTransit}
                disabled={loading || !chartA}
                className="w-full py-5 bg-[#151535] border border-white/5 hover:border-amber-500/30 text-amber-200 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all disabled:opacity-30"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Activity size={16} />}
                Generer Prognose (1 Kreditt)
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-7 relative h-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-8 animate-pulse bg-white/2 rounded-[3rem] border border-white/5 border-dashed">
              <Loader2 className="animate-spin text-amber-500" size={64} />
              <p className="font-serif text-2xl text-amber-100 italic text-center px-10">AstroMason skriver din "Livsbok"...</p>
            </div>
          ) : report ? (
            <div className="bg-[#0a0a1a] p-10 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl h-full max-h-[700px] overflow-y-auto custom-scrollbar group relative">
              <article className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-amber-100 prose-p:text-slate-300 prose-p:font-light prose-p:leading-[1.8] whitespace-pre-wrap">
                {report}
              </article>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-white/5 rounded-[3rem] space-y-6">
              <Sparkles size={40} className="opacity-20" />
              <p className="font-serif italic text-xl">Velg et verktøy for å starte analysen</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
