
import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Save, Loader2, RotateCcw, X, FileText, Sparkles, Activity, PieChart, Bot, Infinity, UserCircle, Eye, Clock, Globe, ArrowRight, Target } from './Icons';
import { CalculatedChart, PlanetPosition, Aspect, RulershipDetail } from '../types';
import { AstrologyService } from '../services/astrology';
import ChartWheel from './ChartWheel';

const Tools: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<CalculatedChart | null>(null);
  const [savedCharts, setSavedCharts] = useState<CalculatedChart[]>([]);
  const [activeTab, setActiveTab] = useState<'table' | 'wheel' | 'report'>('table');
  const [selectedPlanet, setSelectedPlanet] = useState<{
    position: PlanetPosition;
    aspects: Aspect[];
    rulership?: RulershipDetail;
  } | null>(null);
  
  // AI Report State
  const [aiReport, setAiReport] = useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [activeReportType, setActiveReportType] = useState<string>('');
  
  // Prediction / Forecast / Deep Dive State
  const [predictionDate, setPredictionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [predictionLocation, setPredictionLocation] = useState<string>('');
  const [focusArea, setFocusArea] = useState<string>('general');
  
  const resultsRef = useRef<HTMLDivElement>(null);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    houseSystem: 'Whole Sign',
    zodiac: 'Tropical'
  });
  
  const [isTimeUnknown, setIsTimeUnknown] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('astroMasonCharts');
    if (saved) {
      try {
        setSavedCharts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load charts", e);
      }
    }
  }, []);

  useEffect(() => {
    if (chartData && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [chartData]);
  
  // Set default prediction location to birth location when chart loads
  useEffect(() => {
      if (chartData) {
          setPredictionLocation(chartData.location);
      }
  }, [chartData]);

  const handleSaveChart = () => {
    if (!chartData) return;
    const newSaved = [chartData, ...savedCharts].slice(0, 20);
    setSavedCharts(newSaved);
    localStorage.setItem('astroMasonCharts', JSON.stringify(newSaved));
    alert('Kartet er lagret lokalt.');
  };

  const handleLoadChart = (chart: CalculatedChart) => {
    setChartData(chart);
    setAiReport(''); // Clear old report
    setFormData({
      name: chart.clientName,
      date: chart.date,
      time: chart.time,
      location: chart.location,
      houseSystem: 'Whole Sign', 
      zodiac: 'Tropical'
    });
    setPredictionLocation(chart.location);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateHoroscope = async () => {
    // If time is unknown, we default to 12:00 but mark it logic-wise if needed
    const timeToUse = isTimeUnknown ? '12:00' : formData.time;

    if (!formData.date || !timeToUse || !formData.location) {
      alert("Vennligst fyll inn dato, tid og sted.");
      return;
    }

    setIsLoading(true);
    setChartData(null);
    setAiReport('');

    try {
      const result = await AstrologyService.calculateChart({
        name: formData.name,
        date: formData.date,
        time: timeToUse,
        location: formData.location,
        houseSystem: formData.houseSystem
      });
      
      // If time was unknown, append a note to the client name or handle internally
      if (isTimeUnknown) {
          result.clientName += " (Usikker tid)";
      }
      
      setChartData(result);
    } catch (error) {
      console.error("Failed to generate horoscope", error);
      alert("Det oppstod en feil under beregningen. Sjekk at backend kjører (port 8000).");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAIReport = async (type: 'natal' | 'esoteric' | 'transit' | 'karma') => {
      if (!chartData) return;
      setIsGeneratingReport(true);
      setAiReport(''); // Clear previous report to avoid confusion
      setActiveReportType(type);
      
      try {
          // Pass prediction context (future date / new location / focus area)
          const context = {
              date: predictionDate,
              location: predictionLocation || chartData.location,
              focusArea: focusArea
          };

          const report = await AstrologyService.generateAIReport(chartData, type, context);
          if (report) {
            setAiReport(report);
          } else {
            setAiReport("Beklager, ingen rapport ble generert. Prøv igjen.");
          }
      } catch (e) {
          console.error("Report generation error:", e);
          setAiReport('Feil: Kunne ikke koble til AI-tjenesten. Sjekk at backend kjører.');
      } finally {
          setIsGeneratingReport(false);
      }
  };

  const resetForm = () => {
    setChartData(null);
    setAiReport('');
    setActiveTab('table');
    setFormData({ ...formData, name: '', date: '', time: '', location: '' });
    setIsTimeUnknown(false);
  };

  const handlePlanetClick = (pos: PlanetPosition) => {
    if (!chartData) return;
    
    const relatedAspects = chartData.aspects.filter(
      a => a.planet1 === pos.name || a.planet2 === pos.name
    );
    
    const ruleDetail = chartData.report?.rulerships?.find(r => r.planet === pos.name);

    setSelectedPlanet({
      position: pos,
      aspects: relatedAspects,
      rulership: ruleDetail
    });
  };

  const getReportIcon = (type: string) => {
    switch(type) {
      case 'natal': return <UserCircle size={24} className="text-blue-500 dark:text-blue-400" />;
      case 'esoteric': return <Eye size={24} className="text-purple-500 dark:text-purple-400" />;
      case 'karma': return <Infinity size={24} className="text-indigo-500 dark:text-indigo-400" />;
      case 'transit': return <Activity size={24} className="text-green-500 dark:text-green-400" />;
      default: return <Sparkles size={24} className="text-gold-500 dark:text-gold-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto relative pb-20">
      
      {/* Planet Details Modal */}
      {selectedPlanet && (
        <div className="fixed inset-0 z-[80] bg-black/80 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-space-900 border border-gold-500/30 rounded-xl w-full max-w-lg p-0 shadow-2xl relative overflow-hidden">
            <div className="bg-gray-50 dark:bg-space-950 p-6 border-b border-gray-200 dark:border-space-800 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {selectedPlanet.position.name}
                  {selectedPlanet.position.isRetrograde && <span className="text-xs text-red-500 dark:text-red-400 border border-red-200 dark:border-red-900/50 px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/10">Rx</span>}
                </h3>
                <p className="text-gold-600 dark:text-gold-400 mt-1">
                  {selectedPlanet.position.sign} • {selectedPlanet.position.house}. Hus
                </p>
                <p className="text-gray-500 dark:text-space-400 text-sm font-mono mt-1">
                  {selectedPlanet.position.degree}° {selectedPlanet.position.minute}'
                </p>
              </div>
              <button onClick={() => setSelectedPlanet(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 hover:bg-gray-200 dark:hover:bg-space-800 rounded transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Activity size={14} /> Aspekter
                </h4>
                {selectedPlanet.aspects.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedPlanet.aspects.map((aspect, i) => (
                      <li key={i} className="bg-gray-50 dark:bg-space-800/50 p-3 rounded border border-gray-200 dark:border-space-800 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${aspect.type.includes('Kvadrat') || aspect.type.includes('Opposisjon') ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                          <span className="text-gray-700 dark:text-gray-200">{aspect.type}</span>
                          <span className="text-gray-400 dark:text-gray-500">med</span>
                          <span className="text-gray-900 dark:text-gray-200 font-medium">{aspect.planet1 === selectedPlanet.position.name ? aspect.planet2 : aspect.planet1}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-space-400 font-mono">{aspect.orb}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic text-sm">Ingen store aspekter funnet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">Profesjonelle Verktøy</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Presisjonsberegning for vestlig, vedisk og esoterisk astrologi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-space-900 border border-gray-200 dark:border-space-800 rounded-xl p-6 md:p-8 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-space-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-gold-500" size={24} />
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-200">Ny Beregning</h3>
              </div>
              {chartData && (
                <button onClick={resetForm} className="text-sm text-gray-500 hover:text-gold-500 dark:text-gray-400 dark:hover:text-gold-400 flex items-center gap-1">
                  <RotateCcw size={14} /> Nullstill
                </button>
              )}
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-500 dark:text-gray-400 font-medium">Navn / Referanse</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text" 
                    className="w-full bg-gray-50 dark:bg-space-950 border border-gray-300 dark:border-space-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-200 focus:border-gold-500 focus:outline-none transition-colors" 
                    placeholder="Klientnavn" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500 dark:text-gray-400 font-medium">Fødselsdato</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                    <input 
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      type="date" 
                      className="w-full bg-gray-50 dark:bg-space-950 border border-gray-300 dark:border-space-700 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 dark:text-gray-200 focus:border-gold-500 focus:outline-none transition-colors" 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                   <div className="flex justify-between items-center mb-1">
                       <label className="text-sm text-gray-500 dark:text-gray-400 font-medium">Tidspunkt</label>
                       <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
                           <input 
                            type="checkbox" 
                            checked={isTimeUnknown} 
                            onChange={(e) => setIsTimeUnknown(e.target.checked)}
                            className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                           />
                           Vet ikke
                       </label>
                   </div>
                   <div className="relative">
                        <Clock className={`absolute left-3 top-1/2 -translate-y-1/2 ${isTimeUnknown ? 'text-gray-300 dark:text-space-700' : 'text-gray-400 dark:text-gray-500'}`} size={18} />
                        <input 
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            type="time" 
                            disabled={isTimeUnknown}
                            className={`w-full bg-gray-50 dark:bg-space-950 border border-gray-300 dark:border-space-700 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 dark:text-gray-200 focus:border-gold-500 focus:outline-none transition-colors ${isTimeUnknown ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-space-900' : ''}`} 
                        />
                   </div>
                   {isTimeUnknown && <p className="text-[10px] text-amber-500">*Bruker 12:00. Ascendant vil være usikker.</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-gray-500 dark:text-gray-400 font-medium">Sted</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                    <input 
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      type="text" 
                      className="w-full bg-gray-50 dark:bg-space-950 border border-gray-300 dark:border-space-700 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 dark:text-gray-200 focus:border-gold-500 focus:outline-none transition-colors" 
                      placeholder="Oslo, Norge" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Innstillinger</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500 dark:text-gray-400">Hussystem</label>
                    <select 
                        name="houseSystem"
                        value={formData.houseSystem}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 dark:bg-space-950 border border-gray-300 dark:border-space-700 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-200 focus:border-gold-500 outline-none transition-colors"
                    >
                        <option value="Whole Sign">Whole Sign</option>
                        <option value="Placidus">Placidus</option>
                        <option value="Koch">Koch</option>
                        <option value="Regiomontanus">Regiomontanus</option>
                        <option value="Equal">Equal House</option>
                        <option value="Porphyry">Porphyry</option>
                        <option value="Campanus">Campanus</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-500 dark:text-gray-400">Zodiac</label>
                    <select 
                        name="zodiac"
                        value={formData.zodiac}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 dark:bg-space-950 border border-gray-300 dark:border-space-700 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-200 focus:border-gold-500 outline-none transition-colors"
                    >
                        <option value="Tropical">Tropical</option>
                        <option value="Sidereal">Sidereal</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button" 
                  onClick={generateHoroscope}
                  disabled={isLoading}
                  className="flex-1 bg-gold-600 hover:bg-gold-700 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-gold-500/20 dark:shadow-gold-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Beregner...
                    </>
                  ) : (
                    'Generer Horoskop'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results Section */}
          {chartData && (
            <div ref={resultsRef} className="bg-white dark:bg-space-900 border border-gray-200 dark:border-space-800 rounded-xl p-6 animate-fade-in shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-gold-600 dark:text-gold-400">{chartData.clientName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{chartData.date} kl {chartData.time} • {chartData.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase">Ascendant</p>
                  <p className="font-serif text-lg text-gray-900 dark:text-gray-200">{chartData.ascendant}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 border-b border-gray-200 dark:border-space-700 mb-6 overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('table')}
                    className={`pb-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'table' ? 'text-gold-600 dark:text-gold-400 border-b-2 border-gold-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                >
                    Tabell
                </button>
                <button 
                    onClick={() => setActiveTab('wheel')}
                    className={`pb-2 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'wheel' ? 'text-gold-600 dark:text-gold-400 border-b-2 border-gold-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                >
                    <PieChart size={14} /> Visuelt Kart
                </button>
                <button 
                    onClick={() => setActiveTab('report')}
                    className={`pb-2 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'report' ? 'text-gold-600 dark:text-gold-400 border-b-2 border-gold-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                >
                    <FileText size={14} /> AI Rapport
                </button>
              </div>

              {/* Tab Content: Table */}
              {activeTab === 'table' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-space-950 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs border-b border-gray-200 dark:border-space-800">
                        <tr>
                          <th className="p-3 font-medium">Planet</th>
                          <th className="p-3 font-medium">Tegn</th>
                          <th className="p-3 font-medium text-right">Posisjon</th>
                          <th className="p-3 font-medium text-center">Hus</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-space-800">
                        {chartData.positions.map((pos, idx) => (
                          <tr 
                            key={idx}
                            onClick={() => handlePlanetClick(pos)}
                            className="hover:bg-gray-50 dark:hover:bg-space-800/50 transition-colors cursor-pointer group"
                          >
                            <td className="p-3 font-medium text-gray-900 dark:text-gray-200 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-gold-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                              {pos.name}
                              {pos.isRetrograde && <span className="text-[10px] text-red-500 dark:text-red-400 font-bold border border-red-200 dark:border-red-900/50 px-1 rounded bg-red-100 dark:bg-red-900/20">R</span>}
                            </td>
                            <td className="p-3 text-gray-700 dark:text-gray-300">{pos.sign}</td>
                            <td className="p-3 text-right font-mono text-gold-600 dark:text-gold-500">{pos.degree}° {pos.minute}'</td>
                            <td className="p-3 text-center text-gray-500 dark:text-gray-400">{pos.house}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              )}

              {/* Tab Content: Wheel */}
              {activeTab === 'wheel' && (
                  <div className="py-8 flex flex-col items-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center italic">
                          Hold over planetene for å se detaljer.
                      </p>
                      <ChartWheel 
                        positions={chartData.positions} 
                        aspects={chartData.aspects}
                        ascendantDegree={parseInt(chartData.ascendant.match(/\d+/)?.[0] || '0')} 
                        houses={[]} 
                      />
                  </div>
              )}

              {/* Tab Content: Report */}
              {activeTab === 'report' && (
                  <div className="space-y-8 animate-fade-in">
                      
                      {/* Prediction / Analysis Configuration */}
                      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 p-5 rounded-lg">
                          <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wide mb-4 flex items-center gap-2">
                             <Clock size={16} /> Konfigurer Analyse
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div>
                                <label className="block text-xs text-blue-600 dark:text-blue-400 mb-1">Dato for Analyse</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                                    <input 
                                        type="date" 
                                        value={predictionDate}
                                        onChange={(e) => setPredictionDate(e.target.value)}
                                        className="w-full bg-white dark:bg-space-950 border border-blue-200 dark:border-blue-800 rounded px-3 py-2 pl-9 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-400"
                                    />
                                </div>
                             </div>
                             <div>
                                <label className="block text-xs text-blue-600 dark:text-blue-400 mb-1">Sted (Relokasjon)</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                                    <input 
                                        type="text" 
                                        value={predictionLocation}
                                        onChange={(e) => setPredictionLocation(e.target.value)}
                                        placeholder="Samme som fødsel"
                                        className="w-full bg-white dark:bg-space-950 border border-blue-200 dark:border-blue-800 rounded px-3 py-2 pl-9 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-400"
                                    />
                                </div>
                             </div>
                             <div>
                                <label className="block text-xs text-blue-600 dark:text-blue-400 mb-1">Fokusområde</label>
                                <div className="relative">
                                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                                    <select 
                                        value={focusArea}
                                        onChange={(e) => setFocusArea(e.target.value)}
                                        className="w-full bg-white dark:bg-space-950 border border-blue-200 dark:border-blue-800 rounded px-3 py-2 pl-9 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-400"
                                    >
                                        <option value="general">Generelt</option>
                                        <option value="love">Kjærlighet & Relasjoner</option>
                                        <option value="career">Karriere & Økonomi</option>
                                        <option value="health">Helse & Velvære</option>
                                        <option value="growth">Personlig Vekst</option>
                                    </select>
                                </div>
                             </div>
                          </div>
                          <p className="text-[10px] text-blue-500/80 dark:text-blue-400/60 mt-2 italic">
                             *Velg fokusområde for å få en skreddersydd dybdeanalyse fremfor en generell tolkning.
                          </p>
                      </div>

                      {/* AI Generator Section */}
                      <div className="bg-gray-50 dark:bg-space-950 p-6 rounded-lg border border-gold-500/20">
                          <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                             <Sparkles className="text-gold-500" size={20} />
                             Astro Mason AI Analyse
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Velg rapporttype for å generere en unik tolkning basert på dine data.</p>
                          
                          <div className="flex flex-wrap gap-4">
                              <button 
                                onClick={() => handleGenerateAIReport('natal')}
                                disabled={isGeneratingReport}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50 border ${
                                  activeReportType === 'natal' ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-200' : 'bg-white dark:bg-space-800 border-gray-300 dark:border-space-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-space-700'
                                }`}
                              >
                                 <UserCircle size={16} className={activeReportType === 'natal' ? 'text-blue-600 dark:text-blue-300' : 'text-blue-500 dark:text-blue-400'} /> Natal Rapport
                              </button>
                              
                              <button 
                                onClick={() => handleGenerateAIReport('esoteric')}
                                disabled={isGeneratingReport}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50 border ${
                                  activeReportType === 'esoteric' ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500 text-purple-700 dark:text-purple-200' : 'bg-white dark:bg-space-800 border-gray-300 dark:border-space-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-space-700'
                                }`}
                              >
                                 <Eye size={16} className={activeReportType === 'esoteric' ? 'text-purple-600 dark:text-purple-300' : 'text-purple-500 dark:text-purple-400'} /> Esoterisk Rapport
                              </button>

                              <button 
                                onClick={() => handleGenerateAIReport('karma')}
                                disabled={isGeneratingReport}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50 border ${
                                  activeReportType === 'karma' ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-200' : 'bg-white dark:bg-space-800 border-gray-300 dark:border-space-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-space-700'
                                }`}
                              >
                                 <Infinity size={16} className={activeReportType === 'karma' ? 'text-indigo-600 dark:text-indigo-300' : 'text-indigo-500 dark:text-indigo-400'} /> Karmisk Rapport
                              </button>

                              <button 
                                onClick={() => handleGenerateAIReport('transit')}
                                disabled={isGeneratingReport}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50 border ${
                                  activeReportType === 'transit' ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-200' : 'bg-white dark:bg-space-800 border-gray-300 dark:border-space-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-space-700'
                                }`}
                              >
                                 <Activity size={16} className={activeReportType === 'transit' ? 'text-green-600 dark:text-green-300' : 'text-green-500 dark:text-green-400'} /> Transitter & Fremtid
                              </button>
                          </div>

                          {isGeneratingReport && (
                              <div className="mt-8 p-8 bg-white dark:bg-space-900/50 rounded-lg border border-gray-200 dark:border-space-800 flex flex-col items-center justify-center min-h-[200px] animate-pulse">
                                  <Loader2 className="animate-spin text-gold-500 mb-4" size={40} />
                                  <h4 className="text-lg font-serif text-gold-600 dark:text-gold-400 font-bold capitalize">
                                      Genererer {activeReportType} Rapport
                                  </h4>
                                  <p className="text-gray-500 text-sm mt-2">
                                      Astro Mason konsulterer stjernene... (Fokus: {focusArea === 'general' ? 'Generelt' : focusArea === 'love' ? 'Kjærlighet' : focusArea === 'career' ? 'Karriere' : 'Helse'})
                                  </p>
                              </div>
                          )}

                          {!isGeneratingReport && aiReport && (
                              <div className="mt-8 bg-white dark:bg-space-900 p-6 rounded-lg border border-gold-500/20 shadow-lg animate-fade-in relative overflow-hidden">
                                  {/* Professional Overlay Styling */}
                                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 via-amber-500 to-gold-400"></div>
                                  
                                  <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-space-800 pb-4">
                                      <div className="flex items-center gap-3">
                                          <div className="p-2 bg-gold-50 dark:bg-space-800 rounded-lg text-gold-600 dark:text-gold-400">
                                              {getReportIcon(activeReportType)}
                                          </div>
                                          <div>
                                              <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white capitalize">
                                                  {activeReportType} Analyse
                                              </h3>
                                              {(activeReportType === 'transit' || activeReportType === 'karma') && (
                                                  <p className="text-xs text-gray-500">
                                                      Tidshorisont: {predictionDate} {predictionLocation && `• Sted: ${predictionLocation}`}
                                                  </p>
                                              )}
                                          </div>
                                      </div>
                                      <span className="text-[10px] bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 px-3 py-1 rounded-full border border-gold-200 dark:border-gold-800 flex items-center gap-1 uppercase tracking-wider font-bold">
                                         <Bot size={12} /> AI Insight
                                      </span>
                                  </div>
                                  
                                  <div className="prose prose-stone dark:prose-invert max-w-none">
                                      {/* Markdown rendering simulation */}
                                      {aiReport.split('\n').map((line, i) => {
                                          if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-serif font-bold text-gold-600 dark:text-gold-400 mt-6 mb-4 pb-2 border-b border-gray-200 dark:border-space-700">{line.replace('# ', '')}</h1>;
                                          if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">{line.replace('## ', '')}</h2>;
                                          if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-2">{line.replace('### ', '')}</h3>;
                                          if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-gold-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4 bg-gray-50 dark:bg-space-800/30 p-3 rounded-r">{line.replace('> ', '')}</blockquote>;
                                          if (line.startsWith('* ')) return <li key={i} className="ml-4 mb-1 text-gray-700 dark:text-gray-300">{line.replace('* ', '')}</li>;
                                          
                                          // Bold text handling
                                          const parts = line.split('**');
                                          if (parts.length > 1) {
                                              return <p key={i} className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                                                  {parts.map((part, index) => index % 2 === 1 ? <strong key={index} className="text-gray-900 dark:text-white font-semibold">{part}</strong> : part)}
                                              </p>
                                          }
                                          
                                          return <p key={i} className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed font-light">{line}</p>
                                      })}
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-space-800 flex justify-end gap-3">
                <button 
                  onClick={handleSaveChart}
                  className="text-sm bg-gray-100 dark:bg-space-800 hover:bg-gray-200 dark:hover:bg-space-700 text-green-600 dark:text-green-400 border border-gray-300 dark:border-space-700 px-4 py-2 rounded transition-colors flex items-center gap-2"
                >
                  <Save size={16} /> Lagre Kart
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-space-900 dark:to-space-950 border border-gray-200 dark:border-space-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-serif text-gray-900 dark:text-gray-200 mb-4">Lagrede Kart</h3>
            <div className="space-y-3">
               {savedCharts.length > 0 ? (
                 savedCharts.map((chart, i) => (
                   <div 
                     key={i} 
                     onClick={() => handleLoadChart(chart)}
                     className="flex justify-between items-center p-3 bg-white dark:bg-space-800/30 rounded border border-gray-200 dark:border-space-800 hover:border-gold-500/30 transition-colors cursor-pointer group shadow-sm hover:shadow-md"
                   >
                     <div>
                       <p className="text-sm text-gray-800 dark:text-gray-200 font-medium group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">{chart.clientName}</p>
                       <p className="text-xs text-gray-500">{chart.date}</p>
                     </div>
                     <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-space-400 bg-gray-100 dark:bg-space-900 px-1.5 py-0.5 rounded border border-gray-300 dark:border-space-700">ÅPNE</span>
                   </div>
                 ))
               ) : (
                 <p className="text-sm text-gray-500 italic text-center py-4">Ingen lagrede kart funnet.</p>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
