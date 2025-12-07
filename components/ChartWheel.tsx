import React from 'react';
import { PlanetPosition, Aspect } from '../types';

interface ChartWheelProps {
  positions: PlanetPosition[];
  ascendantDegree: number; 
  houses: number[]; 
  aspects?: Aspect[];
}

const ChartWheel: React.FC<ChartWheelProps> = () => {
  return (
    <div className="w-64 h-64 rounded-full border-4 border-gold-500 flex items-center justify-center bg-space-950 text-gold-500">
      <p className="text-center text-xs px-4">Visuelt kart er forenklet i denne versjonen.</p>
    </div>
  );
};
export default ChartWheel;