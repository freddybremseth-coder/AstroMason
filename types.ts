import React from 'react';

export type UserRole = 'professional' | 'client';
export type Language = 'no' | 'en' | 'es';

export enum MethodologyType {
  WESTERN_CLASSICAL = 'Vestlig Klassisk',
  HELLENISTIC = 'Hellenistisk',
  VEDIC = 'Vedisk (Jyotish)',
  PSYCHOLOGICAL = 'Psykologisk',
  EVOLUTIONARY = 'Evolusjonær & Karmisk',
  ESOTERIC = 'Esoterisk',
  SPECIALIZED = 'Spesialiserte Teknikker'
}

export interface Author {
  id: string;
  name: string;
  era: 'Modern' | 'Classical' | 'Renaissance' | 'Ancient' | '20th Century';
  specialty: string;
  description: string;
  keyWorks: string[];
  methodologies: MethodologyType[];
}

export interface Resource {
  id: string;
  title: string;
  author: string;
  type: 'Book' | 'Translation' | 'Academic Paper' | 'Manuscript' | 'Website';
  description: string;
  link?: string;
  isRecommended: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.FC<any>;
  roles: UserRole[];
}

export interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  minute: number;
  house: number;
  isRetrograde: boolean;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  orb: string;
}

export interface Interpretation {
  planet: string;
  placement: string;
  classical: string;
  esoteric: string;
}

export interface RulershipDetail {
  planet: string;
  housesRuled: number[];
  strength: number;
  positives: string[];
  negatives: string[];
}

export interface AnalysisReport {
  elementalBalance: { fire: number; earth: number; air: number; water: number };
  modalBalance: { cardinal: number; fixed: number; mutable: number };
  dignities: { planet: string; dignity: string; score: number }[];
  interpretations: Interpretation[];
  rulerships?: RulershipDetail[];
}

export interface CalculatedChart {
  clientName: string;
  date: string;
  time: string;
  location: string;
  positions: PlanetPosition[];
  aspects: Aspect[];
  ascendant: string;
  mc: string;
  report?: AnalysisReport;
  partnerChart?: CalculatedChart; // Added for Synastry
}

// Course Types
export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'text' | 'quiz';
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
  level: 'Nybegynner' | 'Videregående' | 'Ekspert';
  duration: string;
  instructor: string;
  thumbnail: string;
  modules: Module[];
  progress: number;
  isCertified: boolean;
}

// Tarot Types
export interface TarotCard {
  name: string;
  desc: string;
  keywords: string[];
  element: string;
  planet: string;
  img: string;
}

export interface TarotDeck {
  id: string;
  name: string;
  style: string;
}

export interface TarotSpread {
  id: string;
  name: string;
  count: number;
  positions: string[];
}

export interface TarotTheme {
  id: string;
  name: string;
  icon: React.FC<any>;
}

export interface ReadingStyle {
  id: string;
  name: string;
  icon: React.FC<any>;
  desc: string;
}

// Numerology Types
export interface NumerologyProfile {
  lifePath: { number: number; master: boolean };
  destiny: { number: number; master: boolean };
  soulUrge: { number: number; master: boolean };
  personality: { number: number; master: boolean };
  chaldean: { single: number; compound: number };
  pinnacles: number[];
  challenges: number[];
  personalYear: number;
}