import React, { useState } from 'react';
import { Fingerprint, RotateCcw } from './icons';

const Numerology: React.FC = () => {
  const [birthDate, setBirthDate] = useState("");
  const [lifePathNum, setLifePathNum] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateLifePath = () => {
    if (!birthDate) return;
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
        // Real calculation logic
        const digits = birthDate.replace(/-/g, '').split('').map(Number);
        let sum = digits.reduce((a, b) => a + b, 0);
        
        while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
            sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
        }
        
        setLifePathNum(sum);
        setIsCalculating(false);
    }, 1000);
  };

  const getNumberMeaning = (num: number) => {
      const meanings: Record<number, string> = {
          1: "Lederen. Du er her for å stå på egne ben, være original og ta initiativ.",
          2: "Diplomaten. Du er her for å skape harmoni, samarbeid og forståelse.",
          3: "Kunstneren. Du er her for å uttrykke deg kreativt og spre glede.",
          4: "Byggeren. Du er her for å skape stabilitet, orden og varige strukturer.",
          5: "Eventyreren. Du er her for å oppleve frihet, forandring og mangfold.",
          6: "Beskytteren. Du er her for å ta ansvar, vise omsorg og skape skjønnhet.",
          7: "Sannhetssøkeren. Du er her for å analysere, finne åndelig visdom og forstå dypet.",
          8: "Visjonæren. Du er her for å mestre den materielle verden og utøve autoritet.",
          9: "Humanisten. Du er her for å tjene verden med visdom og medfølelse.",
          11: "Mesterlæreren (Mestertall). Høy intuitiv innsikt og inspirasjon.",
          22: "Mesterbyggeren (Mestertall). Evnen til å gjøre store drømmer til virkelighet.",
          33: "Mesterlæreren (Mestertall). Høyeste grad av åndelig tjeneste."
      };
      return meanings[num] || "Et tall fylt med potensial.";
  };

  return (
    <div className="max-w-md mx-auto animate-fade-in text-center p-6 min-h-[500px] flex flex-col justify-center">
        <header className="mb-10 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-indigo-900/20 border border-indigo-500/30 flex items-center justify-center">
                <Fingerprint size={40} className="text-indigo-300" />
            </div>
            <div>
                <h2 className="text-3xl font-serif text-indigo-100">Numerologi</h2>
                <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-[0.2em]">Tallenes hemmelige språk</p>
            </div>
        </header>

        <div className="bg-[#0f0f25]/80 backdrop-blur-md rounded-2xl p-8 border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-900/20 rounded-full blur-[80px]"></div>

            {!lifePathNum ? (
                <>
                    <div className="space-y-4 relative z-10">
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-indigo-300/70">Din Fødselsdato</label>
                        <input 
                            type="date" 
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full bg-[#050511] border border-slate-800 rounded-lg p-4 text-center text-white focus:border-amber-500/50 focus:outline-none transition-all" 
                        />
                    </div>
                    <button 
                        onClick={calculateLifePath}
                        disabled={!birthDate || isCalculating}
                        className="w-full py-4 bg-gradient-to-r from-indigo-900 to-slate-900 border border-indigo-500/30 hover:border-indigo-400 text-white rounded-lg uppercase tracking-[0.2em] text-xs font-bold transition-all relative z-10"
                    >
                        {isCalculating ? 'Kalkulerer...' : 'Kalkuler Livsvei'}
                    </button>
                </>
            ) : (
                <div className="space-y-8 animate-slide-up relative z-10">
                    <div className="w-32 h-32 mx-auto rounded-full border-2 border-amber-500/30 flex items-center justify-center bg-amber-900/10 relative">
                        <div className="absolute inset-0 border border-amber-500/10 rounded-full animate-ping opacity-20"></div>
                        <div className="absolute inset-0 bg-stardust opacity-50 rounded-full"></div>
                        <span className="text-6xl font-serif text-amber-100 drop-shadow-lg">{lifePathNum}</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-serif text-indigo-100 mb-2">Livsvei {lifePathNum}</h3>
                        <p className="text-sm text-slate-300 leading-relaxed font-light">
                            {getNumberMeaning(lifePathNum)}
                        </p>
                    </div>
                    <button 
                        onClick={() => setLifePathNum(null)} 
                        className="text-xs text-indigo-400 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors"
                    >
                        <RotateCcw size={12} />
                        Beregn på nytt
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default Numerology;