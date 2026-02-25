
import React from 'react';

export type UserRole = 'client';
export type Language = 'no' | 'en' | 'es' | 'de' | 'fr' | 'it' | 'ru' | 'pl';
export type AstrologyMode = 'esoteric' | 'classical' | 'merged' | 'vedic';

export type ChartPatternType = 'Grand Trine' | 'T-Square' | 'Grand Cross' | 'Yod' | 'Stellium' | 'Kite' | 'Mystic Rectangle';

export interface ChartPattern {
  type: ChartPatternType;
  planets: string[];
  element?: string;
  description: string;
}

export interface SynastryAspect {
  planet1: string;
  planet2: string;
  person1Name: string;
  person2Name: string;
  type: string;
  orb: number;
  degree: number;
  isHarmonious: boolean;
  symbol?: string;
}

export interface EssentialDignity {
  planet: string;
  sign: string;
  status: 'Rulership' | 'Exaltation' | 'Detriment' | 'Fall' | 'Peregrine';
}

export interface ElementBalance {
  Ild: number;
  Jord: number;
  Luft: number;
  Vann: number;
}

export enum MethodologyType {
  WESTERN_CLASSICAL = 'Western Classical',
  HELLENISTIC = 'Hellenistic',
  VEDIC = 'Vedic',
  PSYCHOLOGICAL = 'Psychological',
  EVOLUTIONARY = 'Evolutionary',
  ESOTERIC = 'Esoteric',
  SPECIALIZED = 'Specialized'
}

export interface Author {
  id: string;
  name: string;
  era: string;
  specialty: string;
  description: string;
  keyWorks: string[];
  methodologies: MethodologyType[];
}

export interface Resource {
  id: string;
  title: string;
  author: string;
  type: string;
  description: string;
  isRecommended?: boolean;
  link?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'text' | 'video' | 'quiz';
  isCompleted: boolean;
  content?: string;
  questions?: QuizQuestion[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  isCertified: boolean;
  modules: Module[];
}

export interface PlanetPosition {
  name: string;
  symbol: string;
  sign: string;
  degree: number;
  minute: number;
  house: number;
  isRetrograde: boolean;
  /** Total degrees in 360 circle for calculation */
  totalDegrees: number;
  insight?: string;
  detailedInsight?: {
    signAnalysis: string;
    houseAnalysis: string;
    aspectsAnalysis: string;
    synthesis: string;
  };
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  degree: number;
  orb: number;
  meaning?: string;
}

export interface CalculatedChart {
  clientName: string;
  date: string;
  time: string;
  location: string;
  coords?: { lat: number; lng: number };
  positions: PlanetPosition[];
  aspects: Aspect[];
  ascendant: string;
  ascendantDegree: number;
  ascendantSign?: string;
  mc: string;
  mcDegree?: number;
  mcSign?: string;
  houseCusps: number[];
  quickSummary?: string;
  // Professional analysis fields
  patterns?: ChartPattern[];
  chartRuler?: string;
  chartRulerSign?: string;
  chartRulerHouse?: number;
  dominantElement?: string;
  dominantModality?: string;
  elementBalance?: ElementBalance;
  modalityBalance?: { Kardinal: number; Fast: number; Mutable: number };
  dignities?: EssentialDignity[];
  partOfFortune?: { sign: string; degree: number; house: number; totalDegrees: number };
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.FC<any>;
}
