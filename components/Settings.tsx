
import React, { useState, useContext } from 'react';
import { User, Settings as SettingsIcon, Bell, Shield, Save, Download, ExternalLink, Key, Moon, Sun, Monitor } from './Icons';
import { ThemeContext } from '../App';

interface SettingsProps {
  currentPlan: 'professional' | 'client';
  onPlanChange: (planId: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentPlan, onPlanChange }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKeys, setApiKeys] = useState({
      supabase: localStorage.getItem('supabase_key') || '',
      openai: localStorage.getItem('openai_key') || '',
      gemini: localStorage.getItem('gemini_api_key') || ''
  });

  const handleSaveKeys = () => {
      localStorage.setItem('supabase_key', apiKeys.supabase);
      localStorage.setItem('openai_key', apiKeys.openai);
      localStorage.setItem('gemini_api_key', apiKeys.gemini);
      setShowApiModal(false);
      alert('Nøkler lagret i nettleseren.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12 relative">
      
      {/* API Modal */}
      {showApiModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-space-900 border border-gray-200 dark:border-space-700 p-6 rounded-xl w-full max-w-md shadow-2xl">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Konfigurer API-nøkler</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Disse lagres kun lokalt i din nettleser. Du trenger en Gemini-nøkkel for AI-analysene.
                  </p>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs text-gray-500 uppercase mb-1 font-bold">Google Gemini API Key (Anbefalt)</label>
                          <input 
                            type="password" 
                            value={apiKeys.gemini}
                            onChange={(e) => setApiKeys({...apiKeys, gemini: e.target.value})}
                            placeholder="AIzaSy..."
                            className="w-full bg-gray-50 dark:bg-space-950 border border-gold-500/50 dark:border-gold-500/50 rounded p-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 outline-none"
                          />
                          <p className="text-[10px] text-gray-400 mt-1">Hent gratis nøkkel på aistudio.google.com</p>
                      </div>
                      <div className="opacity-50">
                          <label className="block text-xs text-gray-500 uppercase mb-1">OpenAI API Key (Valgfritt)</label>
                          <input 
                            type="password" 
                            value={apiKeys.openai}
                            onChange={(e) => setApiKeys({...apiKeys, openai: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-space-950 border border-gray-300 dark:border-space-700 rounded p-2 text-gray-900 dark:text-white"
                          />
                      </div>
                      <div className="opacity-50">
                          <label className="block text-xs text-gray-500 uppercase mb-1">Supabase Anon Key (Database)</label>
                          <input 
                            type="password" 
                            value={apiKeys.supabase}
                            onChange={(e) => setApiKeys({...apiKeys, supabase: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-space-950 border border-gray-300 dark:border-space-700 rounded p-2 text-gray-900 dark:text-white"
                          />
                      </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                      <button onClick={() => setShowApiModal(false)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm">Avbryt</button>
                      <button onClick={handleSaveKeys} className="bg-gold-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-gold-700 transition-colors">Lagre & Aktiver</button>
                  </div>
              </div>
          </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">Innstillinger</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Administrer din profil og applikasjonspreferanser.</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-space-900 border border-gray-200 dark:border-space-800 rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center text-white dark:text-space-950 text-4xl font-serif font-bold shadow-xl shadow-black/10 dark:shadow-black/30 border-4 border-white dark:border-space-800">
            AA
          </div>
          <div className="absolute bottom-0 right-0 bg-white dark:bg-space-800 rounded-full p-1 border border-gray-200 dark:border-space-700">
             <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left space-y-1">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Astrid Astrolog</h3>
          <p className="text-gold-600 dark:text-gold-500 font-medium">
             {currentPlan === 'professional' ? 'Profesjonell Lisens' : 'Standard Klient'} • Utløper Des 2025
          </p>
          <p className="text-gray-500 text-sm">astrid.astrolog@example.com</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="space-y-8">
            {/* Theme / Appearance */}
            <div className="bg-white dark:bg-space-900 border border-gray-200 dark:border-space-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-200 dark:border-space-800 bg-gray-50 dark:bg-space-950/50 flex items-center gap-3">
                    <Monitor className="text-blue-500 dark:text-blue-400" size={20} />
                    <h3 className="font-bold text-gray-900 dark:text-gray-200">Utseende</h3>
                </div>
                <div className="p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Velg ditt foretrukne utseende for applikasjonen.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setTheme('light')}
                            className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                theme === 'light' 
                                ? 'bg-blue-50 border-blue-500 text-blue-700' 
                                : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:border-gray-300'
                            }`}
                        >
                            <Sun size={32} className={theme === 'light' ? 'text-blue-500' : 'text-gray-400'} />
                            <span className="font-medium">Lys Modus</span>
                        </button>
                        <button 
                            onClick={() => setTheme('dark')}
                            className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                theme === 'dark' 
                                ? 'bg-space-800 border-gold-500 text-gold-400' 
                                : 'bg-gray-50 dark:bg-space-950 border-gray-200 dark:border-space-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-space-800 dark:hover:border-space-600'
                            }`}
                        >
                            <Moon size={32} className={theme === 'dark' ? 'text-gold-500' : 'text-gray-400'} />
                            <span className="font-medium">Mørk Modus</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Astrological Preferences */}
            <div className="bg-white dark:bg-space-900 border border-gray-200 dark:border-space-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-200 dark:border-space-800 bg-gray-50 dark:bg-space-950/50 flex items-center gap-3">
                    <SettingsIcon className="text-gold-500" size={20} />
                    <h3 className="font-bold text-gray-900 dark:text-gray-200">Astrologiske Preferanser</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Standard Hussystem</label>
                        <select className="w-full bg-gray-50 dark:bg-space-950 border border-gray-300 dark:border-space-800 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-200 focus:outline-none focus:border-gold-500 transition-colors">
                            <option value="wholesign">Whole Sign (Anbefalt)</option>
                            <option value="placidus">Placidus</option>
                            <option value="koch">Koch</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {/* Application Settings */}
        <div className="space-y-8">
           {/* Security / Account */}
           <div className="bg-white dark:bg-space-900 border border-gray-200 dark:border-space-800 rounded-xl overflow-hidden shadow-sm">
             <div className="p-4 border-b border-gray-200 dark:border-space-800 bg-gray-50 dark:bg-space-950/50 flex items-center gap-3">
               <Shield className="text-green-500 dark:text-green-400" size={20} />
               <h3 className="font-bold text-gray-900 dark:text-gray-200">Sikkerhet & Data</h3>
             </div>
             <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">For å aktivere AI-funksjonene (Tarot & Astrologi), må du legge inn en API-nøkkel.</p>
                <button 
                    onClick={() => setShowApiModal(true)}
                    className="w-full text-left flex items-center justify-between p-3 border border-transparent bg-gray-50 dark:bg-space-800 hover:bg-gray-100 dark:hover:bg-space-700 rounded transition-colors group"
                >
                   <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">Administrer API-nøkler</span>
                   <Key className="text-gold-500" size={16} />
                </button>
             </div>
           </div>

           {/* Notifications */}
           <div className="bg-white dark:bg-space-900 border border-gray-200 dark:border-space-800 rounded-xl overflow-hidden shadow-sm">
             <div className="p-4 border-b border-gray-200 dark:border-space-800 bg-gray-50 dark:bg-space-950/50 flex items-center gap-3">
               <Bell className="text-purple-500 dark:text-purple-400" size={20} />
               <h3 className="font-bold text-gray-900 dark:text-gray-200">Varsler</h3>
             </div>
             <div className="p-6 space-y-4">
               <div className="flex items-center justify-between">
                 <span className="text-sm text-gray-600 dark:text-gray-300">Daglige transitter</span>
                 <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                 </div>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-sm text-gray-600 dark:text-gray-300">Nye kursmoduler</span>
                 <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
