
import React, { useState, useEffect, useContext } from 'react';
import { AstrologyService } from '../services/astrology';
import { CalculatedChart } from '../types';
import { MapPin, Activity, Sparkles, Loader2, Download, Wallet, Heart, X, Printer } from './Icons';
import { LangContext } from '../App';

interface AdvancedToolsProps {
    onNavigateToSettings?: () => void;
}

export default function AdvancedTools({ onNavigateToSettings }: AdvancedToolsProps) {
  const [mode, setMode] = useState<'relocation' | 'synastry' | 'transit'>('synastry');
  const [chartA, setChartA] = useState<CalculatedChart | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const { lang } = useContext(LangContext);
  const userEmail = localStorage.getItem('soul_email') || '';
  const subscription = localStorage.getItem('soul_subscription');

  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem('tarot_credits');
    if (saved !== null) return parseInt(saved);
    return userEmail === 'freddy.bremseth@gmail.com' ? 200000 : 0;
  });

  const [partnerName, setPartnerName] = useState('');
  const [partnerDate, setPartnerDate] = useState('');
  const [partnerTime, setPartnerTime] = useState('12:00');
  const [partnerLocation, setPartnerLocation] = useState('');
  const [relocationCity, setRelocationCity] = useState('');

  useEffect(() => {
    const update = () => {
      const creds = parseInt(localStorage.getItem('tarot_credits') || '0');
      setCredits(creds);
    };
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, []);

  useEffect(() => { setReport(null); }, [lang]);

  useEffect(() => {
    const savedName = localStorage.getItem('soul_name');
    if (savedName) {
      const birthData = {
        name: savedName,
        date: localStorage.getItem('soul_date') || '',
        time: localStorage.getItem('soul_time') || '12:00',
        location: localStorage.getItem('soul_location') || '',
        houseSystem: localStorage.getItem('soul_houses') || 'Placidus'
      };
      if (birthData.name && birthData.date) {
        AstrologyService.calculateChart(birthData).then(setChartA).catch(() => {});
      }
    }
  }, []);

  const useCredit = (amount: number = 1) => {
    if (subscription === 'Master') return true;
    if (credits < amount) {
      if (confirm(`Dette verktøyet krever ${amount} kreditter. Vil du fylle på i innstillinger?`)) {
        onNavigateToSettings?.();
      }
      return false;
    }
    const newCreds = credits - amount;
    setCredits(newCreds);
    localStorage.setItem('tarot_credits', newCreds.toString());
    window.dispatchEvent(new Event('storage'));
    return true;
  };

  const handleSynastry = async () => {
    if (!chartA) return alert("Oppdater din sjelsprofil først (Navn og fødselsdato kreves).");
    if (!partnerName || !partnerDate || !partnerLocation) return alert("Fyll ut partnerens navn, fødselsdato og fødested.");
    if (!useCredit(3)) return;

    setLoading(true);
    setReport(null);
    try {
      const partnerChart = await AstrologyService.calculateChart({
        name: partnerName, date: partnerDate, time: partnerTime,
        location: partnerLocation, houseSystem: 'Placidus'
      });
      const result = await AstrologyService.generateSynastryReport(chartA, partnerChart, lang);
      setReport({ type: 'synastry', data: result });
    } catch {
      alert("Kunne ikke analysere par-horoskopet. Prøv igjen.");
    } finally { setLoading(false); }
  };

  const handleRelocation = async () => {
    if (!chartA) return alert("Oppdater profilen din først.");
    if (!relocationCity.trim()) return;
    if (!useCredit(1)) return;

    setLoading(true);
    setReport(null);
    try {
      const relocated = await AstrologyService.calculateChart({
        name: chartA.clientName, date: chartA.date, time: chartA.time,
        location: relocationCity, houseSystem: 'Whole Sign'
      });
      const text = await AstrologyService.generateDeepChronicle(relocated, 'relocation', lang);
      setReport({ type: 'text', data: text, title: `Relokasjonsanalyse: ${relocationCity}` });
    } catch { alert("Kunne ikke utføre analysen."); }
    finally { setLoading(false); }
  };

  const handleWeeklyTransit = async () => {
    if (!chartA) return alert("Oppdater profilen din først.");
    if (!useCredit(1)) return;

    setLoading(true);
    setReport(null);
    try {
      const text = await AstrologyService.generateWeeklyTransitDeepDive(chartA, lang);
      setReport({ type: 'text', data: text, title: '7-Dagers Kosmisk Prognose' });
    } catch { alert("Feil ved henting av data."); }
    finally { setLoading(false); }
  };

  const tools = [
    { id: 'synastry',    icon: Heart,    label: 'Par-Horoskop',    cost: '3 kreditter' },
    { id: 'relocation',  icon: MapPin,   label: 'Relokasjon',      cost: '1 kreditt' },
    { id: 'transit',     icon: Activity, label: '7-Dagers Prognose', cost: '1 kreditt' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12 animate-fade-in pb-32">
      <header className="text-center md:text-left space-y-2">
        <h2 className="text-5xl font-serif font-bold text-white">Magiske Verktøy</h2>
        <p className="text-slate-400 text-sm italic">Avansert kosmisk analyse for ditt unike kart.</p>
      </header>

      <div className="flex flex-wrap gap-3 justify-center no-print">
        {tools.map(t => (
          <button key={t.id} onClick={() => { setMode(t.id as any); setReport(null); }}
            className={`px-8 py-4 rounded-2xl flex items-center gap-3 border transition-all font-bold uppercase tracking-widest text-[10px] ${mode === t.id ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}>
            <t.icon size={16} /> {t.label}
            <span className="text-[8px] opacity-60 ml-1">· {t.cost}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Input panel */}
        <div className="lg:col-span-5 bg-[#0f0f25]/60 backdrop-blur-md p-10 rounded-[3rem] border border-white/5 space-y-8 shadow-2xl h-fit no-print">

          {mode === 'synastry' && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-4">
                  <Heart size={20} className="text-rose-400" />
                  <h3 className="font-serif text-xl text-white">Par-Horoskop</h3>
                </div>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  Analyser den kosmiske kjemien mellom deg og en annen sjel. Avdekker styrker, utfordringer og karmiske bånd.
                </p>
              </div>

              <div className="bg-indigo-900/20 border border-indigo-500/20 p-6 rounded-2xl space-y-1">
                <p className="text-[9px] uppercase font-black text-indigo-400 tracking-widest">Din sjelsprofil</p>
                <p className="text-white font-serif">{chartA?.clientName || localStorage.getItem('soul_name') || '—'}</p>
                <p className="text-xs text-slate-500">
                  {chartA?.date || localStorage.getItem('soul_date') || 'Ikke satt'}
                  {(chartA?.location || localStorage.getItem('soul_location')) ? ` · ${chartA?.location || localStorage.getItem('soul_location')}` : ''}
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] uppercase font-black text-rose-400 tracking-widest">Partnerens data</p>
                <input type="text" placeholder="Partnerens navn" value={partnerName} onChange={e => setPartnerName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-rose-500 transition-all placeholder:text-slate-600" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-500 font-black tracking-widest ml-1">Fødselsdato</label>
                    <input type="date" value={partnerDate} onChange={e => setPartnerDate(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-rose-500 transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase text-slate-500 font-black tracking-widest ml-1">Klokkeslett</label>
                    <input type="time" value={partnerTime} onChange={e => setPartnerTime(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-rose-500 transition-all" />
                  </div>
                </div>
                <input type="text" placeholder="Fødested (by, land)" value={partnerLocation} onChange={e => setPartnerLocation(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-rose-500 transition-all placeholder:text-slate-600" />
              </div>

              <button onClick={handleSynastry} disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-rose-600 to-pink-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-40">
                <Heart size={18} /> Analyser Relasjonskjemi
              </button>
              <p className="text-[9px] text-slate-500 text-center font-bold">KOSTNAD: 3 KREDITTER</p>
            </div>
          )}

          {mode === 'relocation' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <MapPin size={20} className="text-indigo-400" />
                <h3 className="font-serif text-xl text-white">Relokasjonskart</h3>
              </div>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                Se hvordan ditt kart endres om du bor et annet sted. Hvilke energier aktiveres på et nytt sted?
              </p>
              <input type="text" placeholder="By, Land (f.eks. Barcelona, Spania)" value={relocationCity} onChange={e => setRelocationCity(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600" />
              <button onClick={handleRelocation} disabled={loading}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl hover:bg-indigo-500 transition-all disabled:opacity-40">
                Analyser Flytte-Energi
              </button>
              <p className="text-[9px] text-slate-500 text-center font-bold">KOSTNAD: 1 KREDITT</p>
            </div>
          )}

          {mode === 'transit' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Activity size={20} className="text-purple-400" />
                <h3 className="font-serif text-xl text-white">Ukentlig Prognose</h3>
              </div>
              <p className="text-slate-300 text-sm font-light leading-relaxed">
                Se hva de neste 7 dagene bringer for din unike vibrasjon. En dypere titt på ukens viktigste transitter og deres effekt på ditt natale kart.
              </p>
              <button onClick={handleWeeklyTransit} disabled={loading}
                className="w-full py-5 bg-indigo-900/40 border border-indigo-500/20 text-amber-200 rounded-2xl font-black uppercase text-[10px] hover:bg-indigo-900 transition-all disabled:opacity-40">
                Generer Ukens Prognose
              </button>
              <p className="text-[9px] text-slate-500 text-center font-bold">KOSTNAD: 1 KREDITT</p>
            </div>
          )}
        </div>

        {/* Report panel */}
        <div className="lg:col-span-7">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8">
              <Loader2 className="animate-spin text-amber-500" size={72} />
              <p className="font-serif italic text-2xl text-amber-100 animate-pulse">
                {mode === 'synastry' ? 'Analyserer sjelenes kjemi...' : mode === 'relocation' ? 'Dechiffrerer steders energi...' : 'Konsulterer ukens transitter...'}
              </p>
            </div>
          ) : report?.type === 'synastry' ? (
            <div className="bg-[#0a0a1a] p-10 md:p-16 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-12 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/5 pb-8 no-print">
                <div>
                  <h3 className="font-serif text-3xl text-white mb-1">{report.data.title}</h3>
                  <p className="text-[10px] uppercase text-rose-400 font-black tracking-widest">Synastri · Par-horoskop</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => window.print()} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-slate-400 flex items-center gap-2 px-6 text-[10px] font-black uppercase tracking-widest">
                    <Printer size={16} /> PDF
                  </button>
                  <button onClick={() => setReport(null)} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-slate-500"><X size={20} /></button>
                </div>
              </div>
              {[
                { key: 'overview',        label: 'Relasjonens Kjerne',          color: 'text-rose-300' },
                { key: 'strengths',       label: 'Styrker & Harmoni',           color: 'text-green-300' },
                { key: 'challenges',      label: 'Vekstpunkter & Utfordringer', color: 'text-amber-300' },
                { key: 'karmaticThemes',  label: 'Karmiske Temaer',             color: 'text-purple-300' },
                { key: 'guidance',        label: 'Praktisk Veiledning',         color: 'text-blue-300' },
              ].filter(s => report.data[s.key]).map(section => (
                <div key={section.key} className="space-y-4 pb-10 border-b border-white/5 last:border-0">
                  <h4 className={`font-serif text-2xl uppercase tracking-widest ${section.color}`}>{section.label}</h4>
                  <p className="text-slate-300 leading-[2.2] font-light text-lg whitespace-pre-wrap">{report.data[section.key]}</p>
                </div>
              ))}
            </div>
          ) : report?.type === 'text' ? (
            <div className="bg-[#0a0a1a] p-10 md:p-16 rounded-[3.5rem] border border-white/5 shadow-2xl overflow-y-auto max-h-[800px] custom-scrollbar animate-fade-in">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6 no-print">
                <h3 className="font-serif text-2xl text-amber-100 uppercase tracking-widest">{report.title}</h3>
                <div className="flex gap-3">
                  <button onClick={() => window.print()} className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-slate-400"><Download size={20} /></button>
                  <button onClick={() => setReport(null)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-slate-500"><X size={20} /></button>
                </div>
              </div>
              <article className="prose prose-invert prose-xl max-w-none whitespace-pre-wrap font-light leading-[2.2] text-slate-300">
                {report.data}
              </article>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-white/5 rounded-[3rem] opacity-30 space-y-6">
              <Sparkles size={56} />
              <div className="text-center space-y-1">
                <p className="text-sm uppercase tracking-widest font-black">
                  {mode === 'synastry' ? 'Skriv inn partnerens data' : mode === 'relocation' ? 'Skriv inn ny by' : 'Klikk for å generere'}
                </p>
                <p className="text-xs">og start analysen</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
