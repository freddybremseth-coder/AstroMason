
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
  const subscription = localStorage.getItem('soul_subscription');
  
  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem('tarot_credits');
    if (saved !== null) return parseInt(saved);
    return userEmail === 'freddy.bremseth@gmail.com' ? 200000 : 0;
  });

  useEffect(() => {
    localStorage.setItem('tarot_credits', credits.toString());
  }, [credits]);

  const useCredit = (amount: number = 1) => {
    if (subscription === 'Master') return true;
    if (credits < amount) {
        if (confirm(`Dette verktøyet krever ${amount} kreditt. Vil du fylle på i innstillinger?`)) {
            onNavigateToSettings?.();
        }
        return false;
    }
    setCredits(prev => prev - amount);
    return true;
  };

  const [relocationCity, setRelocationCity] = useState('');

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
    if (!chartA) return alert("Oppdater profilen din først.");
    if (!newLocation.trim()) return;
    if (!useCredit(1)) return;

    setLoading(true);
    setReport('');
    try {
      const relocated = await AstrologyService.calculateChart({
        name: chartA.clientName, date: chartA.date, time: chartA.time, location: newLocation, houseSystem: 'Whole Sign'
      });
      const text = await AstrologyService.generateDeepChronicle(relocated, 'relocation', lang);
      setReport(text);
    } catch (error) {
      setReport("Kunne ikke utføre analysen.");
    } finally { setLoading(false); }
  };

  const handleWeeklyTransit = async () => {
    if (!chartA) return alert("Oppdater profilen din først.");
    if (!useCredit(1)) return;

    setLoading(true);
    setReport('');
    try {
      const text = await AstrologyService.generateWeeklyTransitDeepDive(chartA, lang);
      setReport(text);
    } catch (e) {
      setReport("Feil ved henting av data.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left space-y-2">
            <h2 className="text-4xl font-serif text-white">Magiske Verktøy</h2>
            <p className="text-slate-400 italic">Utforsk dypere lag av din sjel.</p>
        </div>
        <div onClick={onNavigateToSettings} className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 cursor-pointer hover:border-amber-500/30 transition-all">
            <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Status</p>
                <p className="text-xl font-serif text-amber-500">{subscription === 'Master' ? 'Master' : `${credits.toLocaleString()} Kreditter`}</p>
            </div>
            <Wallet className="text-amber-500" size={20} />
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        {[
          { id: 'relocation', icon: MapPin, label: 'Relokasjon' },
          { id: 'transit', icon: Activity, label: '7-Dagers' }
        ].map(btn => (
          <button key={btn.id} onClick={() => { setMode(btn.id as any); setReport(''); }}
            className={`px-8 py-4 rounded-2xl flex items-center gap-3 border transition-all font-bold uppercase tracking-widest text-xs ${mode === btn.id ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}>
            <btn.icon size={18} /> {btn.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 bg-[#0f0f25]/60 backdrop-blur-md p-10 rounded-[3rem] border border-white/5 space-y-8 shadow-2xl h-fit">
          {mode === 'relocation' ? (
            <div className="space-y-6">
              <label className="text-[10px] uppercase tracking-widest text-slate-400 font-black ml-1">Ny Lokasjon</label>
              <input type="text" placeholder="By, Land" value={relocationCity} onChange={e => setRelocationCity(e.target.value)}
                className="w-full bg-[#050511] p-5 rounded-2xl border border-white/10 text-white outline-none" />
              <button onClick={() => handleRelocation(relocationCity)} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl">
                Analyser Flytting
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-slate-300 text-sm font-light">Se hva de neste 7 dagene bringer for din unike vibrasjon.</p>
              <button onClick={handleWeeklyTransit} className="w-full py-5 bg-[#151535] border border-white/5 text-amber-200 rounded-2xl font-black uppercase text-[10px]">
                Generer Prognose
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
              <Loader2 className="animate-spin text-amber-500" size={64} />
              <p className="font-serif italic text-xl">AstroMason dechiffrerer...</p>
            </div>
          ) : report ? (
            <div className="bg-[#0a0a1a] p-10 rounded-[3.5rem] border border-white/5 shadow-2xl overflow-y-auto max-h-[600px] custom-scrollbar">
              <article className="prose prose-invert max-w-none whitespace-pre-wrap font-light leading-relaxed text-slate-300">
                {report}
              </article>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center text-slate-600 border-2 border-dashed border-white/5 rounded-[3rem]">
              <Sparkles size={40} className="opacity-10" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
