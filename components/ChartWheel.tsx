
import React, { useState } from 'react';
import { PlanetPosition, Aspect } from '../types';

interface ChartWheelProps {
  positions: PlanetPosition[];
  ascendantDegree: number;
  houses: number[]; 
  partnerPositions?: PlanetPosition[];
  aspects?: Aspect[];
  onPlanetClick?: (planet: PlanetPosition) => void;
}

const ZODIAC_SIGNS = [
  'Væren', 'Tyren', 'Tvillingene', 'Krepsen', 'Løven', 'Jomfruen',
  'Vekten', 'Skorpionen', 'Skytten', 'Steinbukken', 'Vannmannen', 'Fiskene'
];

const ELEMENT_COLORS: Record<string, string> = {
    'Væren': '#F87171', 'Løven': '#F87171', 'Skytten': '#F87171', 
    'Tyren': '#34D399', 'Jomfruen': '#34D399', 'Steinbukken': '#34D399',
    'Tvillingene': '#FBBF24', 'Vekten': '#FBBF24', 'Vannmannen': '#FBBF24',
    'Krepsen': '#60A5FA', 'Skorpionen': '#60A5FA', 'Fiskene': '#60A5FA',
};

const ASPECT_COLORS: Record<string, string> = {
  'Konjunksjon': '#fbbf24',
  'Opposisjon': '#ef4444',
  'Kvadrat': '#ef4444',
  'Trigon': '#3b82f6',
  'Sekstil': '#3b82f6'
};

const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const PLANET_SYMBOLS: Record<string, string> = {
  'Solen': '☉', 'Månen': '☽', 'Merkur': '☿', 'Venus': '♀', 'Mars': '♂',
  'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅', 'Neptun': '♆', 'Pluto': '♇'
};

const ChartWheel: React.FC<ChartWheelProps> = ({ positions, ascendantDegree, houses, aspects = [], onPlanetClick }) => {
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const radius = 190;
  const zodiacRadius = 172;
  const innerRadius = 135;
  const aspectRadius = 120;

  const getAbsoluteDegree = (pos: PlanetPosition) => {
    const signIndex = ZODIAC_SIGNS.indexOf(pos.sign);
    if (signIndex === -1) return 0;
    return (signIndex * 30) + pos.degree + (pos.minute / 60);
  };

  const getPlanetCoords = (pos: PlanetPosition, r: number) => {
    const deg = (getAbsoluteDegree(pos) - ascendantDegree + 180) % 360;
    const rad = deg * Math.PI / 180;
    return {
      x: 200 + r * Math.cos(rad),
      y: 200 + r * Math.sin(rad)
    };
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full animate-fade-in">
      <div className="relative w-full max-w-[480px] aspect-square">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10 w-32">
            <div className="w-10 h-[1px] bg-amber-500/20 mx-auto mb-1"></div>
            <h3 className="text-amber-500/70 font-serif font-bold text-[10px] tracking-widest">{hoverInfo?.title || "ASTROMASON"}</h3>
            <p className="text-gray-500 text-[8px] uppercase tracking-widest mt-0.5">{hoverInfo?.desc || "RESONANS"}</p>
            <div className="w-10 h-[1px] bg-amber-500/20 mx-auto mt-1"></div>
        </div>

        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl overflow-visible">
          <circle cx="200" cy="200" r="198" fill="#03030b" stroke="#1e293b" strokeWidth="0.5" />
          
          <g>
              {/* Aspektlinjer */}
              {aspects.map((aspect, idx) => {
                const p1 = positions.find(p => p.name === aspect.planet1);
                const p2 = positions.find(p => p.name === aspect.planet2);
                if (!p1 || !p2) return null;

                const c1 = getPlanetCoords(p1, aspectRadius);
                const c2 = getPlanetCoords(p2, aspectRadius);

                return (
                  <line 
                    key={`aspect-${idx}`}
                    x1={c1.x} y1={c1.y}
                    x2={c2.x} y2={c2.y}
                    stroke={ASPECT_COLORS[aspect.type] || '#334155'}
                    strokeWidth={aspect.orb < 1 ? "1.5" : "0.5"}
                    strokeOpacity={0.4}
                    strokeDasharray={aspect.type === 'Kvadrat' || aspect.type === 'Opposisjon' ? "" : "4 2"}
                  />
                );
              })}

              {/* Dyrekrets og Hus */}
              <g transform={`rotate(${180 - ascendantDegree}, 200, 200)`}>
                {ZODIAC_SIGNS.map((sign, i) => {
                    const start = i * 30;
                    const end = (i + 1) * 30;
                    const mid = start + 15;
                    const startRad = start * Math.PI / 180;
                    const endRad = end * Math.PI / 180;
                    const midRad = mid * Math.PI / 180;

                    return (
                        <g key={sign}>
                            <path 
                                d={`M 200 200 L ${200 + radius * Math.cos(startRad)} ${200 + radius * Math.sin(startRad)} A ${radius} ${radius} 0 0 1 ${200 + radius * Math.cos(endRad)} ${200 + radius * Math.sin(endRad)} Z`}
                                fill={ELEMENT_COLORS[sign]}
                                fillOpacity="0.03"
                                stroke="#1e293b"
                                strokeWidth="0.5"
                            />
                            <text
                                x={200 + zodiacRadius * Math.cos(midRad)}
                                y={200 + zodiacRadius * Math.sin(midRad)}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill={ELEMENT_COLORS[sign]}
                                fontSize="14"
                                fontWeight="bold"
                                opacity="0.5"
                                transform={`rotate(${-(180 - ascendantDegree)}, ${200 + zodiacRadius * Math.cos(midRad)}, ${200 + zodiacRadius * Math.sin(midRad)})`}
                            >
                                {ZODIAC_SYMBOLS[i]}
                            </text>
                        </g>
                    );
                })}

                {houses.map((h, i) => {
                    const startRad = (h) * Math.PI / 180;
                    const nextH = houses[(i + 1) % 12];
                    let diff = nextH - h;
                    if (diff < 0) diff += 360;
                    const midH = h + (diff / 2);
                    const midRad = midH * Math.PI / 180;
                    const isMainAxis = i === 0 || i === 3 || i === 6 || i === 9; 
                    
                    return (
                        <g key={i}>
                            <line 
                                x1="200" y1="200"
                                x2={200 + radius * Math.cos(startRad)}
                                y2={200 + radius * Math.sin(startRad)}
                                stroke={isMainAxis ? "#fbbf24" : "#334155"}
                                strokeWidth={isMainAxis ? "2" : "0.5"}
                                strokeDasharray={isMainAxis ? "" : "3 2"}
                                opacity={isMainAxis ? "0.9" : "0.3"}
                            />
                            <circle cx={200 + 115 * Math.cos(midRad)} cy={200 + 115 * Math.sin(midRad)} r="9" fill="#0f172a" stroke="#fbbf24" strokeWidth="0.5" />
                            <text x={200 + 115 * Math.cos(midRad)} y={200 + 115 * Math.sin(midRad)} fill="white" fontSize="10" fontWeight="black" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${-(180 - ascendantDegree)}, ${200 + 115 * Math.cos(midRad)}, ${200 + 115 * Math.sin(midRad)})`}>
                                {i + 1}
                            </text>
                        </g>
                    );
                })}
              </g>

              {/* Planeter */}
              {positions.filter(p => p.sign !== 'Ukjent').map((pos, i) => {
                  const coords = getPlanetCoords(pos, innerRadius);
                  return (
                      <g key={`inner-${pos.name}-${i}`} 
                         className="cursor-pointer group/planet"
                         onMouseEnter={() => setHoverInfo({ title: pos.name, desc: `${pos.sign} ${pos.degree}° i ${pos.house}. hus` })}
                         onMouseLeave={() => setHoverInfo(null)}
                         onClick={() => onPlanetClick?.(pos)}
                      >
                          <circle cx={coords.x} cy={coords.y} r="12" fill="#020617" stroke="#fbbf24" strokeWidth="2" className="group-hover/planet:fill-amber-500/20 group-hover/planet:stroke-white transition-all shadow-xl" />
                          <text x={coords.x} y={coords.y} textAnchor="middle" dominantBaseline="middle" fill="#fbbf24" fontSize="14" className="pointer-events-none font-bold group-hover/planet:fill-white">
                              {PLANET_SYMBOLS[pos.name] || '?'}
                          </text>
                      </g>
                  );
              })}
          </g>

          <line x1="20" y1="200" x2="380" y2="200" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="10 5" opacity="0.4" pointerEvents="none" />
        </svg>
      </div>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-lg mt-4">
          {aspects.slice(0, 6).map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-[9px] text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <span className="text-white font-bold">{PLANET_SYMBOLS[a.planet1]}</span>
                  <span style={{ color: ASPECT_COLORS[a.type] }}>{a.type}</span>
                  <span className="text-white font-bold">{PLANET_SYMBOLS[a.planet2]}</span>
                  <span className="text-[8px] opacity-60">({a.orb}°)</span>
              </div>
          ))}
      </div>
    </div>
  );
};

export default ChartWheel;
