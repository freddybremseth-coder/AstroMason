import React, { useState, useEffect, useContext } from 'react';
import { UserCircle, User, Key, History, Save, Download, FileText, BookOpen, Trash2, Shield, Lock, ExternalLink, Moon, Sun, Monitor, Printer, X, Loader2, CheckCircle, Info, MapPin, Calendar, Clock as ClockIcon, ChevronRight } from './Icons';
import { ThemeContext, LangContext } from '../App';
import { UI_TRANSLATIONS } from '../constants';

interface SoulData {
  name: string;
  date: string;
  time: string;
  location: string;
  houseSystem: string;
}

interface SavedReport {
  id: string;
  title: string;
  date: string;
  type: string;
  content: string; 
}

interface ProfileProps {
  onUpdate?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onUpdate }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { lang } = useContext(LangContext);
  const t = UI_TRANSLATIONS[lang];

  const [soulData, setSoulData] = useState<SoulData>({
    name: localStorage.getItem('soul_name') || '',
    date: localStorage.getItem('soul_date') || '',
    time: localStorage.getItem('soul_time') || '',
    location: localStorage.getItem('soul_location') || '',
    houseSystem: localStorage.getItem('soul_houses') || 'Placidus'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('astromason_reports');
    if (saved) {
      try { setSavedReports(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveSoulData = () => {
    if (!soulData.name || !soulData.date || !soulData.location) {
      alert("Navn, fødselsdato og fødested er påkrevd for å åpne arkivene.");
      return;
    }
    setIsSaving(true);
    localStorage.setItem('soul_name', soulData.name);
    localStorage.setItem('soul_date', soulData.date);
    localStorage.setItem('soul_time', soulData.time);
    localStorage.setItem('soul_location', soulData.location);
    localStorage.setItem('soul_houses', soulData.houseSystem);
    
    setTimeout(() => {
        setIsSaving(false);
        setShowSuccess(true);
        if (onUpdate) onUpdate(); 
        setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const openReport = (saved: SavedReport) => {
    try {
        const parsed = JSON.parse(saved.content);
        setSelectedReport({ ...parsed, meta: saved });
    } catch (e) {
        setSelectedReport({
            report: { title: saved.title, essenceSummary: saved.content, planetChapters: [] },
            meta: saved
        });
    }
  };

  const deleteReport = (id: string) => {
    if(confirm("Er du sikker på at du vil slette denne innsikten?")) {
        const updated = savedReports.filter(r => r.id !== id);
        setSavedReports(updated);
        localStorage.setItem('astromason_reports', JSON.stringify(updated));
    }
  };

  if (selectedReport) return (
    <div className="max-w-4xl mx-auto py-12 animate-fade-in space-y-12 pb-32">
        <div className="bg-[#0a0a1a] p-12 md:p-20 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <button onClick={() => setSelectedReport(null)} className="absolute top-8 left-8 p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all text-slate-400 no-print">
                <X size={20} />
            </button>
            <div className="absolute top-8 right-8 flex gap-3 no-print">
                <button onClick={() => window.print()} className="p-3 bg-amber-500/10 rounded-full hover:bg-amber-500/20 transition-all text-amber-500 flex items-center gap-2 px-6">
                    <Printer size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">PDF / Utskrift</span>
                </button>
            </div>
            <header className="text-center space-y-4 mb-16">
                <h1 className="text-5xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-amber-500 leading-tight">
                    {selectedReport.report?.title || selectedReport.meta.title}
                </h1>
                <p className="text-sm uppercase tracking-widest text-slate-500 font-black">
                    {new Date(selectedReport.meta.date).toLocaleDateString()} • {selectedReport.meta.type}
                </p>
            </header>
            <article className="prose prose-invert prose-xl max-w-none text-slate-300 leading-[2.2] font-light whitespace-pre-wrap">
                <div className="first-letter:text-6xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-3 first-letter:float-left mb-12">
                    {selectedReport.report?.essenceSummary}
                </div>
            </article>
        </div>
        <button onClick={() => setSelectedReport(null)} className="mx-auto block px-12 py-5 bg-white/5 border border-white/10 rounded-2xl no-print hover:bg-white/10 transition-all font-black uppercase tracking-widest text-xs">
            Tilbake til Arkivet
        </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 animate-fade-in space-y-12">
      <header className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-serif font-bold shadow-2xl relative">
          {soulData.name.charAt(0) || "S"}
        </div>
        <div className="space-y-2">
          <h2 className="text-5xl font-serif font-bold text-white">Sjelssenteret</h2>
          <p className="text-slate-500 text-xs uppercase tracking-[0.5em] font-black">Ditt kosmiske fundament</p>
        </div>
      </header>

      {showSuccess && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up z-[600]">
            <CheckCircle size={20} /> Profilen din er oppdatert og arkivert
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6 space-y-8">
          <section className="bg-[#0f0f25]/80 backdrop-blur-xl border border-white/5 p-10 rounded-[3.5rem] shadow-2xl space-y-10">
            <div className="space-y-2 border-l-4 border-amber-500 pl-6">
              <h3 className="font-serif text-2xl text-amber-100">Opprett din Sjelsprofil</h3>
              <p className="text-sm text-slate-400 font-light italic">Vi trenger nøyaktige data for å dechiffrere ditt kosmiske avtrykk.</p>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
                   <User size={14} /> Sjelens Navn
                </h4>
                <input type="text" value={soulData.name} onChange={e => setSoulData({...soulData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-amber-500 outline-none transition-all" placeholder="Ditt fødselsnavn..." />
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
                   <Calendar size={14} /> Fødselstid
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <input type="date" value={soulData.date} onChange={e => setSoulData({...soulData, date: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-amber-500 outline-none" />
                    <input type="time" value={soulData.time} onChange={e => setSoulData({...soulData, time: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-amber-500 outline-none" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
                   <MapPin size={14} /> Fødested
                </h4>
                <input type="text" value={soulData.location} onChange={e => setSoulData({...soulData, location: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-amber-500 outline-none transition-all" placeholder="f.eks. Oslo, Norge" />
              </div>

              <button onClick={saveSoulData} disabled={isSaving} className="w-full py-6 bg-amber-500 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] text-black hover:bg-amber-400 transition-all shadow-2xl flex items-center justify-center gap-3">
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Aktiver Mine Arkiver
              </button>
            </div>
          </section>
        </div>

        <div className="lg:col-span-6 space-y-8">
          <section className="bg-white/[0.02] border border-white/5 p-10 rounded-[4rem] shadow-2xl min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4 text-amber-100">
                <History size={32} className="text-amber-500" />
                <h3 className="font-serif text-3xl">Lagrede Innsikter</h3>
              </div>
            </div>

            {savedReports.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center opacity-10 space-y-6 text-center">
                <BookOpen size={100} />
                <p className="font-serif italic text-2xl">Ditt arkiv er tomt</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {savedReports.map((report) => (
                  <div key={report.id} className="bg-[#0a0a1a]/80 border border-white/5 p-6 rounded-[2.5rem] group hover:border-amber-500/30 transition-all flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-serif text-white group-hover:text-amber-100 transition-colors">{report.title}</h4>
                      <p className="text-[9px] text-slate-500 uppercase font-black">{new Date(report.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openReport(report)} className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">Åpne</button>
                      <button onClick={() => deleteReport(report.id)} className="p-4 bg-red-900/10 hover:bg-red-900/20 border border-red-900/20 rounded-2xl text-red-500 transition-all"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;