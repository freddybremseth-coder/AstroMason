
import {
  CalculatedChart, PlanetPosition, Aspect, AstrologyMode, Language,
  ChartPattern, EssentialDignity, ElementBalance
} from '../types';
import { generateCustomTarotPrompt } from './tarot-ai-system';

declare global {
  interface Window { Astronomy: any; }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ZODIAC_SIGNS = [
  'Væren', 'Tyren', 'Tvillingene', 'Krepsen', 'Løven', 'Jomfruen',
  'Vekten', 'Skorpionen', 'Skytten', 'Steinbukken', 'Vannmannen', 'Fiskene'
];

const ZODIAC_SIGNS_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const CHINESE_ANIMALS = [
  'Rotte', 'Okse', 'Tiger', 'Haren', 'Drage', 'Slange',
  'Hest', 'Geit', 'Ape', 'Hane', 'Hund', 'Gris'
];

const CHINESE_ELEMENTS = ['Metall', 'Vann', 'Tre', 'Ild', 'Jord'];

const PLANET_MAP: Record<string, string> = {
  'Sun': 'Solen', 'Moon': 'Månen', 'Mercury': 'Merkur', 'Venus': 'Venus',
  'Mars': 'Mars', 'Jupiter': 'Jupiter', 'Saturn': 'Saturn',
  'Uranus': 'Uranus', 'Neptune': 'Neptun', 'Pluto': 'Pluto'
};

const PLANET_SYMBOLS: Record<string, string> = {
  'Solen': '☉', 'Månen': '☽', 'Merkur': '☿', 'Venus': '♀', 'Mars': '♂',
  'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅', 'Neptun': '♆', 'Pluto': '♇',
  'Chiron': '⚷', 'Lilith': '⚸'
};

// ─── Chiron & Black Moon Lilith (simplified ephemeris) ────────────────────

const J2000 = 2451545.0; // Julian date for J2000.0

const getJulianDate = (d: Date): number =>
  d.getTime() / 86400000 + 2440587.5;

/** Chiron: period ~50.7 yrs, J2000.0 position ~246.24° */
const calcChiron = (dateUTC: Date, isVedic = false): PlanetPosition => {
  const daysSinceJ2000 = getJulianDate(dateUTC) - J2000;
  const lon = ((246.24 + daysSinceJ2000 * 0.01944) % 360 + 360) % 360;
  const d = getZodiacDetails(lon, isVedic);
  return {
    name: 'Chiron', symbol: '⚷',
    sign: d.sign, degree: d.degree, minute: d.minute,
    house: 1, isRetrograde: false, totalDegrees: d.totalDegrees
  };
};

/** Black Moon Lilith (Mean): daily motion ~0.11140°, J2000.0 ~263.35° */
const calcLilith = (dateUTC: Date, isVedic = false): PlanetPosition => {
  const daysSinceJ2000 = getJulianDate(dateUTC) - J2000;
  const lon = ((263.35 + daysSinceJ2000 * 0.11140) % 360 + 360) % 360;
  const d = getZodiacDetails(lon, isVedic);
  return {
    name: 'Lilith', symbol: '⚸',
    sign: d.sign, degree: d.degree, minute: d.minute,
    house: 1, isRetrograde: false, totalDegrees: d.totalDegrees
  };
};

const ASPECT_TYPES = [
  { name: 'Konjunksjon', angle: 0,   orb: 8, symbol: '☌', color: '#fbbf24', harmonious: null },
  { name: 'Opposisjon',  angle: 180,  orb: 8, symbol: '☍', color: '#ef4444', harmonious: false },
  { name: 'Kvadrat',     angle: 90,   orb: 7, symbol: '□', color: '#ef4444', harmonious: false },
  { name: 'Trigon',      angle: 120,  orb: 8, symbol: '△', color: '#3b82f6', harmonious: true },
  { name: 'Sekstil',     angle: 60,   orb: 5, symbol: '✱', color: '#3b82f6', harmonious: true },
  { name: 'Kvinkil',     angle: 150,  orb: 3, symbol: '⊻', color: '#8b5cf6', harmonious: null },
  { name: 'Halvkvadrat', angle: 45,   orb: 2, symbol: '∠', color: '#f97316', harmonious: false },
];

const ELEMENT_MAP: Record<string, keyof ElementBalance> = {
  'Væren': 'Ild', 'Løven': 'Ild', 'Skytten': 'Ild',
  'Tyren': 'Jord', 'Jomfruen': 'Jord', 'Steinbukken': 'Jord',
  'Tvillingene': 'Luft', 'Vekten': 'Luft', 'Vannmannen': 'Luft',
  'Krepsen': 'Vann', 'Skorpionen': 'Vann', 'Fiskene': 'Vann',
};

const MODALITY_MAP: Record<string, string> = {
  'Væren': 'Kardinal', 'Krepsen': 'Kardinal', 'Vekten': 'Kardinal', 'Steinbukken': 'Kardinal',
  'Tyren': 'Fast', 'Løven': 'Fast', 'Skorpionen': 'Fast', 'Vannmannen': 'Fast',
  'Tvillingene': 'Mutable', 'Jomfruen': 'Mutable', 'Skytten': 'Mutable', 'Fiskene': 'Mutable',
};

// Traditional rulerships
const RULERSHIPS: Record<string, string[]> = {
  'Solen':    ['Løven'],
  'Månen':    ['Krepsen'],
  'Merkur':   ['Tvillingene', 'Jomfruen'],
  'Venus':    ['Tyren', 'Vekten'],
  'Mars':     ['Væren', 'Skorpionen'],
  'Jupiter':  ['Skytten', 'Fiskene'],
  'Saturn':   ['Steinbukken', 'Vannmannen'],
  'Uranus':   ['Vannmannen'],
  'Neptun':   ['Fiskene'],
  'Pluto':    ['Skorpionen'],
};

const EXALTATIONS: Record<string, string> = {
  'Solen': 'Væren', 'Månen': 'Tyren', 'Merkur': 'Jomfruen',
  'Venus': 'Fiskene', 'Mars': 'Steinbukken', 'Jupiter': 'Krepsen',
  'Saturn': 'Vekten',
};

const DETRIMENTS: Record<string, string[]> = {
  'Solen': ['Vannmannen'], 'Månen': ['Steinbukken'], 'Merkur': ['Skytten', 'Fiskene'],
  'Venus': ['Væren', 'Skorpionen'], 'Mars': ['Tyren', 'Vekten'],
  'Jupiter': ['Tvillingene', 'Jomfruen'], 'Saturn': ['Krepsen', 'Løven'],
};

const FALLS: Record<string, string> = {
  'Solen': 'Vekten', 'Månen': 'Skorpionen', 'Merkur': 'Fiskene',
  'Venus': 'Jomfruen', 'Mars': 'Krepsen', 'Jupiter': 'Steinbukken',
  'Saturn': 'Væren',
};

const LANGUAGE_NAMES: Record<Language, string> = {
  no: 'NORSK', en: 'ENGLISH', es: 'SPANISH', de: 'GERMAN',
  fr: 'FRENCH', it: 'ITALIAN', ru: 'RUSSIAN', pl: 'POLISH'
};

// ─── Client (proxy) ──────────────────────────────────────────────────────────

interface ClaudeParams {
  model?: string;
  max_tokens?: number;
  system?: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
}

const callClaude = async (params: ClaudeParams) => {
  const apiKey = localStorage.getItem('ANTHROPIC_API_KEY') || '';
  if (!apiKey) {
    throw new Error('Ingen API-nøkkel funnet. Gå til Innstillinger og lim inn din Anthropic API-nøkkel (sk-ant-...).');
  }
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error?.message || `HTTP ${res.status}`);
  }
  return res.json() as Promise<{ content: { type: string; text: string }[] }>;
};


const getClient = () => ({
  messages: { create: callClaude },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const extractJSON = (text: string): any => {
  // Try direct parse first
  try { return JSON.parse(text); } catch {}
  // Try to find JSON block
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) { try { return JSON.parse(match[1]); } catch {} }
  // Try to find first { or [
  const start = text.search(/[\[{]/);
  const end = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'));
  if (start !== -1 && end !== -1) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch {}
  }
  throw new Error('Kunne ikke tolke AI-svar som JSON');
};

const askClaude = async (
  systemPrompt: string,
  userMessage: string,
  model: 'claude-opus-4-6' | 'claude-sonnet-4-6' = 'claude-opus-4-6',
  maxTokens = 8192
): Promise<string> => {
  const client = getClient();
  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });
  const block = response.content[0];
  return block.type === 'text' ? block.text : '';
};

export const cleanAstroText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\*\*/g, '')
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*/g, '•')
    .replace(/_([^_]+)_/g, '$1')
    .trim();
};

// ─── Zodiac / Aspect calculations ────────────────────────────────────────────

const getZodiacDetails = (longitude: number, isVedic = false) => {
  const ayanamsa = isVedic ? 24.0 : 0;
  const normalized = ((longitude - ayanamsa) % 360 + 360) % 360;
  const index = Math.floor(normalized / 30);
  const degree = Math.floor(normalized % 30);
  const minute = Math.floor((normalized % 30 - degree) * 60);
  return { sign: ZODIAC_SIGNS[index], signEN: ZODIAC_SIGNS_EN[index], degree, minute, totalDegrees: normalized };
};

const calculateAspects = (positions: PlanetPosition[]): Aspect[] => {
  const aspects: Aspect[] = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const p1 = positions[i];
      const p2 = positions[j];
      const diff = Math.abs(p1.totalDegrees - p2.totalDegrees);
      const angle = diff > 180 ? 360 - diff : diff;
      for (const type of ASPECT_TYPES) {
        if (Math.abs(angle - type.angle) <= type.orb) {
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            type: type.name,
            degree: Math.round(angle * 100) / 100,
            orb: Math.round(Math.abs(angle - type.angle) * 100) / 100,
          });
          break; // Only strongest aspect per pair
        }
      }
    }
  }
  return aspects;
};

const calculateElementBalance = (positions: PlanetPosition[]): ElementBalance => {
  const balance: ElementBalance = { Ild: 0, Jord: 0, Luft: 0, Vann: 0 };
  // Weight luminaries and angles more
  const weights: Record<string, number> = {
    'Solen': 3, 'Månen': 3, 'Merkur': 2, 'Venus': 2, 'Mars': 2,
    'Jupiter': 1, 'Saturn': 1, 'Uranus': 1, 'Neptun': 1, 'Pluto': 1
  };
  positions.forEach(p => {
    const element = ELEMENT_MAP[p.sign];
    if (element) balance[element] += (weights[p.name] || 1);
  });
  return balance;
};

const calculateDignities = (positions: PlanetPosition[]): EssentialDignity[] => {
  return positions.map(p => {
    let status: EssentialDignity['status'] = 'Peregrine';
    if (RULERSHIPS[p.name]?.includes(p.sign)) status = 'Rulership';
    else if (EXALTATIONS[p.name] === p.sign) status = 'Exaltation';
    else if (DETRIMENTS[p.name]?.includes(p.sign)) status = 'Detriment';
    else if (FALLS[p.name] === p.sign) status = 'Fall';
    return { planet: p.name, sign: p.sign, status };
  });
};

const detectChartPatterns = (positions: PlanetPosition[], aspects: Aspect[]): ChartPattern[] => {
  const patterns: ChartPattern[] = [];

  // Grand Trine: 3 planets in mutual trines
  const trines = aspects.filter(a => a.type === 'Trigon');
  const trineMap: Record<string, string[]> = {};
  trines.forEach(a => {
    if (!trineMap[a.planet1]) trineMap[a.planet1] = [];
    if (!trineMap[a.planet2]) trineMap[a.planet2] = [];
    trineMap[a.planet1].push(a.planet2);
    trineMap[a.planet2].push(a.planet1);
  });
  const planets = Object.keys(trineMap);
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      for (let k = j + 1; k < planets.length; k++) {
        const [a, b, c] = [planets[i], planets[j], planets[k]];
        if (trineMap[a].includes(b) && trineMap[b].includes(c) && trineMap[a].includes(c)) {
          const signs = [a, b, c].map(n => positions.find(p => p.name === n)?.sign || '');
          const elements = [...new Set(signs.map(s => ELEMENT_MAP[s]))];
          patterns.push({
            type: 'Grand Trine',
            planets: [a, b, c],
            element: elements[0],
            description: `Et Stort Trigon i ${elements[0] || 'blandede'} tegn — flytende talenter og naturlig harmoni.`
          });
        }
      }
    }
  }

  // T-Square: two oppositions meeting at a square apex
  const opps = aspects.filter(a => a.type === 'Opposisjon');
  const squares = aspects.filter(a => a.type === 'Kvadrat');
  opps.forEach(opp => {
    squares.forEach(sq => {
      const allInOpp = [opp.planet1, opp.planet2];
      const allInSq = [sq.planet1, sq.planet2];
      const apex = allInSq.find(p => !allInOpp.includes(p));
      const base = allInSq.find(p => allInOpp.includes(p));
      if (apex && base) {
        const hasOtherSquare = squares.some(s =>
          (s.planet1 === apex && allInOpp.includes(s.planet2)) ||
          (s.planet2 === apex && allInOpp.includes(s.planet1))
        );
        if (hasOtherSquare && !patterns.find(p => p.type === 'T-Square' && p.planets.includes(apex))) {
          patterns.push({
            type: 'T-Square',
            planets: [opp.planet1, opp.planet2, apex],
            description: `T-Kvadrat med apex i ${positions.find(p => p.name === apex)?.sign || apex} — sterk drivkraft og indre spenning som søker utløp.`
          });
        }
      }
    });
  });

  // Stellium: 3+ planets in same sign or within 10 degrees
  const signGroups: Record<string, string[]> = {};
  positions.forEach(p => {
    if (!signGroups[p.sign]) signGroups[p.sign] = [];
    signGroups[p.sign].push(p.name);
  });
  Object.entries(signGroups).forEach(([sign, ps]) => {
    if (ps.length >= 3) {
      patterns.push({
        type: 'Stellium',
        planets: ps,
        description: `Stellium i ${sign} — en massiv konsentrasjon av energi og fokus i dette tegnets temaer.`
      });
    }
  });

  return patterns;
};

const getChartRuler = (ascendantSign: string): string => {
  for (const [planet, signs] of Object.entries(RULERSHIPS)) {
    if (signs.includes(ascendantSign)) return planet;
  }
  return 'Solen';
};

// ─── Part of Fortune ─────────────────────────────────────────────────────────

const calculatePartOfFortune = (
  sun: PlanetPosition, moon: PlanetPosition, ascDegree: number, isNightChart: boolean
) => {
  // Day chart: Asc + Moon - Sun; Night chart: Asc + Sun - Moon
  const pofDegree = isNightChart
    ? ((ascDegree + sun.totalDegrees - moon.totalDegrees) % 360 + 360) % 360
    : ((ascDegree + moon.totalDegrees - sun.totalDegrees) % 360 + 360) % 360;
  const details = getZodiacDetails(pofDegree);
  return { sign: details.sign, degree: details.degree, house: 1, totalDegrees: pofDegree };
};

// ─── AstrologyService ─────────────────────────────────────────────────────────

export const AstrologyService = {

  // ── Geocode ──────────────────────────────────────────────────────────────

  geocode: async (location: string): Promise<{ lat: number; lng: number }> => {
    if (!location) return { lat: 59.91, lng: 10.75 };
    try {
      const text = await askClaude(
        'Du er en presis geografisk assistent. Returner KUN gyldig JSON, ingen forklaring.',
        `Finn de eksakte geografiske koordinatene for stedet: "${location}". Returner JSON: {"lat": number, "lng": number}`,
        'claude-sonnet-4-6',
        128
      );
      return extractJSON(text);
    } catch {
      return { lat: 59.91, lng: 10.75 };
    }
  },

  // ── Calculate natal chart ────────────────────────────────────────────────

  calculateChart: async (
    data: { name: string; date: string; time: string; location: string; houseSystem: string },
    mode: AstrologyMode = 'merged',
    existingCoords?: { lat: number; lng: number }
  ): Promise<CalculatedChart> => {
    const astro = window.Astronomy;
    const isVedic = mode === 'vedic';
    const [year, month, day] = data.date.split('-').map(Number);
    const [hour, min] = (data.time || '12:00').split(':').map(Number);
    const dateUTC = new Date(Date.UTC(year, month - 1, day, hour, min));
    const time = astro.MakeTime(dateUTC);

    const coords = existingCoords || await AstrologyService.geocode(data.location);

    // Calculate planet positions
    const bodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    const positions: PlanetPosition[] = bodies.map(b => {
      const vector = astro.GeoVector(astro.Body[b], time, true);
      const ecl = astro.Ecliptic(vector);
      const d = getZodiacDetails(ecl.elon, isVedic);
      const name = PLANET_MAP[b];

      // Retrograde: check if longitude decreasing vs 24h ago
      const timeMinus1 = astro.MakeTime(new Date(dateUTC.getTime() - 86400000));
      const vecPrev = astro.GeoVector(astro.Body[b], timeMinus1, true);
      const eclPrev = astro.Ecliptic(vecPrev);
      const isRetrograde = ecl.elon < eclPrev.elon && Math.abs(ecl.elon - eclPrev.elon) < 5;

      return {
        name, symbol: PLANET_SYMBOLS[name],
        sign: d.sign, degree: d.degree, minute: d.minute,
        house: 1, isRetrograde, totalDegrees: d.totalDegrees
      };
    });

    // Add Chiron and Black Moon Lilith
    positions.push(calcChiron(dateUTC, isVedic));
    positions.push(calcLilith(dateUTC, isVedic));

    // Ascendant calculation (Placidus-like)
    const sidereal = astro.SiderealTime(time);
    const lst = (sidereal + coords.lng / 15.0) % 24;
    const ramc = lst * 15.0;
    const eps = 23.4393;
    const latRad = coords.lat * Math.PI / 180;
    const ramcRad = ramc * Math.PI / 180;
    const epsRad = eps * Math.PI / 180;
    const asc_rad = Math.atan2(
      Math.cos(ramcRad),
      -Math.sin(ramcRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad)
    );
    const asc_deg = ((asc_rad * 180 / Math.PI) + 360) % 360;
    const asc = getZodiacDetails(asc_deg, isVedic);

    // MC calculation
    const mc_rad = Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(epsRad));
    const mc_deg = ((mc_rad * 180 / Math.PI) + 360) % 360;
    const mc = getZodiacDetails(mc_deg, isVedic);

    // ── House cusps & assignment ──────────────────────────────────────────
    let houseCuspsRaw: number[];

    if (data.houseSystem === 'Whole Sign') {
      // Whole Sign: each house = complete sign, House 1 = ASC sign
      const ascSignIndex = Math.floor(asc.totalDegrees / 30);
      houseCuspsRaw = Array.from({ length: 12 }, (_, i) => ((ascSignIndex + i) % 12) * 30);
      positions.forEach(p => {
        const pSignIndex = Math.floor(p.totalDegrees / 30);
        p.house = ((pSignIndex - ascSignIndex + 12) % 12) + 1;
      });
    } else if (data.houseSystem === 'Placidus') {
      // Placidus: MC/ASC anchored, intermediate cusps via trisection of semi-arc
      const mc11 = (mc_deg + (asc_deg - mc_deg + 360) % 360 / 3) % 360;
      const mc12 = (mc_deg + 2 * ((asc_deg - mc_deg + 360) % 360 / 3)) % 360;
      const h2   = (asc_deg + ((mc_deg + 180 - asc_deg + 360) % 360) / 3) % 360;
      const h3   = (asc_deg + 2 * ((mc_deg + 180 - asc_deg + 360) % 360 / 3)) % 360;
      houseCuspsRaw = [
        asc_deg,       h2,            h3,
        (mc_deg + 180) % 360, (mc11 + 180) % 360, (mc12 + 180) % 360,
        (asc_deg + 180) % 360, (h2 + 180) % 360, (h3 + 180) % 360,
        mc_deg,        mc11,          mc12,
      ];
      positions.forEach(p => {
        let house = 1;
        for (let i = 0; i < 12; i++) {
          const cusp = houseCuspsRaw[i];
          const nextCusp = houseCuspsRaw[(i + 1) % 12];
          let inHouse: boolean;
          if (cusp <= nextCusp) {
            inHouse = p.totalDegrees >= cusp && p.totalDegrees < nextCusp;
          } else {
            inHouse = p.totalDegrees >= cusp || p.totalDegrees < nextCusp;
          }
          if (inHouse) { house = i + 1; break; }
        }
        p.house = house;
      });
    } else {
      // Equal House (default)
      houseCuspsRaw = Array.from({ length: 12 }, (_, i) => (asc.totalDegrees + i * 30) % 360);
      positions.forEach(p => {
        p.house = Math.floor(((p.totalDegrees - asc.totalDegrees + 360) % 360) / 30) + 1;
      });
    }

    const aspects = calculateAspects(positions);
    const elementBalance = calculateElementBalance(positions);
    const dignities = calculateDignities(positions);
    const patterns = detectChartPatterns(positions, aspects);
    const chartRulerName = getChartRuler(asc.sign);
    const chartRulerPlanet = positions.find(p => p.name === chartRulerName);

    // Dominant element
    const elementEntries = Object.entries(elementBalance) as [keyof ElementBalance, number][];
    const dominantElement = elementEntries.sort((a, b) => b[1] - a[1])[0][0];

    // Modality balance
    const modalityBalance = { Kardinal: 0, Fast: 0, Mutable: 0 };
    positions.forEach(p => {
      const mod = MODALITY_MAP[p.sign] as keyof typeof modalityBalance;
      if (mod) modalityBalance[mod]++;
    });
    const dominantModality = Object.entries(modalityBalance).sort((a, b) => b[1] - a[1])[0][0];

    // Part of Fortune: night chart if Sun is below horizon (house 1-6)
    const sun = positions.find(p => p.name === 'Solen')!;
    const moon = positions.find(p => p.name === 'Månen')!;
    const isNightChart = sun.house >= 1 && sun.house <= 6;
    const partOfFortune = calculatePartOfFortune(sun, moon, asc.totalDegrees, isNightChart);
    partOfFortune.house = Math.floor(((partOfFortune.totalDegrees - asc.totalDegrees + 360) % 360) / 30) + 1;

    return {
      clientName: data.name,
      date: data.date,
      time: data.time,
      location: data.location,
      coords,
      positions,
      aspects,
      ascendant: `${asc.sign} ${asc.degree}°`,
      ascendantDegree: asc.totalDegrees,
      ascendantSign: asc.sign,
      mc: `${mc.sign} ${mc.degree}°`,
      mcDegree: mc.totalDegrees,
      mcSign: mc.sign,
      houseCusps: houseCuspsRaw,
      patterns,
      chartRuler: chartRulerName,
      chartRulerSign: chartRulerPlanet?.sign,
      chartRulerHouse: chartRulerPlanet?.house,
      dominantElement,
      dominantModality,
      elementBalance,
      modalityBalance,
      dignities,
      partOfFortune,
    };
  },

  // ── Chinese zodiac ───────────────────────────────────────────────────────

  calculateChineseZodiac: (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    let animalIndex = (year - 1900) % 12;
    // Adjust for Chinese New Year (approximate: before ~Feb 10 = previous year's animal)
    if (month === 0 || (month === 1 && day < 10)) {
      animalIndex = (year - 1901) % 12;
    }
    if (animalIndex < 0) animalIndex += 12;
    const elementIndex = Math.floor(((year - 1900) % 10) / 2);
    return {
      animal: CHINESE_ANIMALS[animalIndex],
      element: CHINESE_ELEMENTS[elementIndex],
      yinYang: year % 2 === 0 ? 'Yang' : 'Yin',
      year,
    };
  },

  // ── Deep AI Life Book (main report) ─────────────────────────────────────

  generateAIReport: async (
    chart: CalculatedChart,
    type: string,
    mode: AstrologyMode,
    lang: Language,
    _natalBase?: CalculatedChart
  ) => {
    const targetLang = LANGUAGE_NAMES[lang] || 'ENGLISH';
    const planetsContext = chart.positions
      .map(p => `• ${p.name}${p.isRetrograde ? ' (R)' : ''}: ${p.sign} ${p.degree}°${p.minute}', Hus ${p.house}`)
      .join('\n');
    const aspectsContext = chart.aspects
      .map(a => `• ${a.planet1} ${a.type} ${a.planet2} (orb: ${a.orb}°)`)
      .join('\n');
    const patternsContext = (chart.patterns || [])
      .map(p => `• ${p.type}: ${p.planets.join(', ')} — ${p.description}`)
      .join('\n') || 'Ingen dominante mønster';
    const dignitiesContext = (chart.dignities || [])
      .filter(d => d.status !== 'Peregrine')
      .map(d => `• ${d.planet} i ${d.sign}: ${d.status}`)
      .join('\n') || 'Ingen dominante verdigheter';

    const systemPrompt = `Du er AstroMason — en mesterlig astrologisk tolkningskunstner med dyp kunnskap innen ${mode === 'vedic' ? 'Vedisk/Jyotish' : mode === 'esoteric' ? 'Esoterisk/Alice Bailey' : mode === 'classical' ? 'Klassisk vestlig' : 'Integrert vestlig'} astrologi.

OPPGAVE: Produser en fullstendig, dyptgående astrologisk Livsbok på ${targetLang} for ${chart.clientName} — minimum 3000 ord totalt, rikt og poetisk men presist.

REGLER:
- INGEN Markdown-tegn (**, ##, __, ---)
- Skriv overskrifter med store bokstaver
- Vær dypt personlig, bruk klientens navn
- Integrer planettegn, hus OG aspekter i hvert avsnitt
- Tolk mønstrene (${(chart.patterns || []).map(p => p.type).join(', ') || 'ingen'}) som sjeles-arkitektur
- Dominante element: ${chart.dominantElement} — vev dette gjennom hele rapporten
- Chartruler: ${chart.chartRuler} i ${chart.chartRulerSign}, Hus ${chart.chartRulerHouse}
- Returner KUN gyldig JSON uten \`\`\`-blokker`;

    const userMessage = `Generer "Livsbok" for klient: ${chart.clientName}
Analyse-type: ${type}
Tradisjon: ${mode}

PLANETER:
${planetsContext}

ASPEKTER:
${aspectsContext}

CHARTMØNSTRE:
${patternsContext}

ESSENSIELLE VERDIGHETER:
${dignitiesContext}

DOMINANS: Element: ${chart.dominantElement} | Modalitet: ${chart.dominantModality}
ASCENDANT: ${chart.ascendant} | MC: ${chart.mc}
CHARTRULER: ${chart.chartRuler} i ${chart.chartRulerSign}, Hus ${chart.chartRulerHouse}

Returner JSON:
{
  "title": "Personlig boktittel for ${chart.clientName}",
  "essenceSummary": "Introduksjon og sjelens essens (600+ ord)",
  "planetChapters": [
    { "planet": "planettnavn", "content": "Dyp tolkning (200+ ord per planet)" }
  ],
  "patternsAndThemes": "Analyse av chartmønstre og livstemata (400+ ord)",
  "lifePathGuidance": "Fremtidsrettet veiledning og sjel-evolusjon (400+ ord)",
  "mantra": "Et kraftfullt personlig mantra på 1-2 setninger"
}`;

    const raw = await askClaude(systemPrompt, userMessage, 'claude-opus-4-6', 16000);
    const data = extractJSON(raw);

    return {
      title: cleanAstroText(data.title || ''),
      essenceSummary: cleanAstroText(data.essenceSummary || ''),
      planetChapters: (data.planetChapters || []).map((c: any) => ({
        planet: cleanAstroText(c.planet || ''),
        content: cleanAstroText(c.content || ''),
      })),
      patternsAndThemes: cleanAstroText(data.patternsAndThemes || ''),
      lifePathGuidance: cleanAstroText(data.lifePathGuidance || ''),
      mantra: cleanAstroText(data.mantra || ''),
    };
  },

  // ── Chinese astrology report ─────────────────────────────────────────────

  generateChineseReport: async (name: string, date: string, lang: Language) => {
    const targetLang = LANGUAGE_NAMES[lang] || 'ENGLISH';
    const cz = AstrologyService.calculateChineseZodiac(date);

    const systemPrompt = `Du er Den Vise Østen — en mester i kinesisk metafysikk, Ba Zi (Fire Søyler) og Wu Xing (De fem elementer).

OPPGAVE: Skriv en dyp, poetisk kinesisk livskrønike på ${targetLang} for ${name}.
Integrer: Dyreboligtegn (${cz.animal}), element (${cz.element}), Yin/Yang (${cz.yinYang}), Wu Xing-harmonier og transformasjonssykler.

REGLER:
- INGEN Markdown
- Minimum 2000 ord totalt
- Returner KUN gyldig JSON uten \`\`\`-blokker`;

    const userMessage = `Klient: ${name}
Fødselsdato: ${date}
Kinesisk Dyreboligtegn: ${cz.animal}
Element: ${cz.element}
Yin/Yang: ${cz.yinYang}
År: ${cz.year}

Returner JSON:
{
  "title": "Tittel på kroniken",
  "introduction": "Introduksjon og essens (400+ ord)",
  "chapters": [
    { "heading": "kapittelnavn", "content": "Innhold (300+ ord)" }
  ],
  "conclusion": "Avsluttende visdom og mantra (200+ ord)"
}`;

    const raw = await askClaude(systemPrompt, userMessage, 'claude-opus-4-6', 8192);
    const data = extractJSON(raw);

    return {
      title: cleanAstroText(data.title || ''),
      introduction: cleanAstroText(data.introduction || ''),
      chapters: (data.chapters || []).map((c: any) => ({
        heading: cleanAstroText(c.heading || ''),
        content: cleanAstroText(c.content || ''),
      })),
      conclusion: cleanAstroText(data.conclusion || ''),
    };
  },

  // ── Chinese yearly cycle ─────────────────────────────────────────────────

  generateChineseYearlyCycle: async (name: string, date: string, lang: Language) => {
    const targetLang = LANGUAGE_NAMES[lang] || 'ENGLISH';
    const cz = AstrologyService.calculateChineseZodiac(date);

    const systemPrompt = `Du er en kinesisk astrologimester. Svar KUN med gyldig JSON, ingen forklaring.`;
    const userMessage = `Generer en 12-måneders Qi-syklus på ${targetLang} for ${name} (${cz.animal}, ${cz.element}, ${cz.yinYang}).
For hver måned: navn, tema, qiNivå (1-10), veiledning (2-3 setninger).

JSON-format:
{ "months": [{ "monthName": "...", "theme": "...", "qiLevel": 7, "guidance": "..." }] }`;

    try {
      const raw = await askClaude(systemPrompt, userMessage, 'claude-sonnet-4-6', 2048);
      return extractJSON(raw);
    } catch {
      return { months: [] };
    }
  },

  // ── Personalized horoscope ───────────────────────────────────────────────

  generatePersonalizedHoroscope: async (natalChart: CalculatedChart, period: string, lang: Language) => {
    const targetLang = LANGUAGE_NAMES[lang] || 'ENGLISH';
    const sunSign = natalChart.positions.find(p => p.name === 'Solen')?.sign || '';
    const moonSign = natalChart.positions.find(p => p.name === 'Månen')?.sign || '';
    const ascSign = natalChart.ascendantSign || natalChart.ascendant.split(' ')[0];
    const todayStr = new Date().toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' });

    const keyAspects = natalChart.aspects
      .filter(a => ['Konjunksjon', 'Opposisjon', 'Trigon', 'Kvadrat'].includes(a.type))
      .slice(0, 8)
      .map(a => `${a.planet1} ${a.type} ${a.planet2} (orb ${a.orb}°)`)
      .join(', ');

    const personalPlanets = ['Solen', 'Månen', 'Merkur', 'Venus', 'Mars'];
    const personalCtx = natalChart.positions
      .filter(p => personalPlanets.includes(p.name))
      .map(p => `${p.name}${p.isRetrograde ? '(R)' : ''}: ${p.sign} ${p.degree}°, Hus ${p.house}`)
      .join(' | ');

    const systemPrompt = `Du er AstroMason — en mesterlig astrologisk veileder med dyp innsikt i transitter og natale mønstre.
Skriv personlige, konkrete horoskoper som oppleves skreddersydd til denne personen.
Inkluder spesifikke livsområder: kjærlighet, karriere, økonomi, helse og indre vekst.
Ingen Markdown. Skriv direkte, varmt og med astrologisk presisjon.`;

    const periodMap: Record<string, string> = {
      day: 'DAGEN i dag (' + todayStr + ')',
      week: 'UKEN som starter ' + todayStr,
      month: 'MÅNEDEN vi er i',
      year: 'HELE ÅRET fremover'
    };

    const userMessage = `Skriv et dypt personlig horoskop på ${targetLang} for ${natalChart.clientName}.

PERIODE: ${periodMap[period] || period}

NATAL KART:
${personalCtx}
Ascendant: ${ascSign} | Chartruler: ${natalChart.chartRuler} i ${natalChart.chartRulerSign}, Hus ${natalChart.chartRulerHouse}
Dominante element: ${natalChart.dominantElement} | Modalitet: ${natalChart.dominantModality}

VIKTIGE NATALE ASPEKTER:
${keyAspects || 'Ingen dominante aspekter'}

Skriv 5 kraftfulle avsnitt (${period === 'year' ? '600+' : '400+'} ord totalt):
1. Overordnet energi og tema for perioden
2. Kjærlighet, relasjoner og følelsesliv
3. Karriere, økonomi og kreativitet
4. Indre vekst, åndelig utvikling og selvrefleksjon
5. Konkrete råd og timing — hva bør gjøres nå?

Bruk ${natalChart.clientName}s navn direkte. Vær spesifikk på tegn og hus.`;

    const raw = await askClaude(systemPrompt, userMessage, 'claude-sonnet-4-6', 3500);
    return cleanAstroText(raw);
  },

  // ── Weekly transit deep dive ─────────────────────────────────────────────

  generateWeeklyTransitDeepDive: async (natalChart: CalculatedChart, lang: Language) => {
    const targetLang = LANGUAGE_NAMES[lang] || 'ENGLISH';
    const today = new Date().toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' });

    const systemPrompt = `Du er AstroMason Transitanalytiker. Analyser ukentlige kosmiske strømmer og deres effekt på klientens natale kart.
Ingen Markdown. Bruk klientens navn gjentakende.`;

    const userMessage = `Analyser ukens (fra ${today}) kosmiske energier på ${targetLang} for ${natalChart.clientName}.

Natal kart nøkkeldata:
• Sol: ${natalChart.positions.find(p => p.name === 'Solen')?.sign}, Hus ${natalChart.positions.find(p => p.name === 'Solen')?.house}
• Måne: ${natalChart.positions.find(p => p.name === 'Månen')?.sign}, Hus ${natalChart.positions.find(p => p.name === 'Månen')?.house}
• Merkur: ${natalChart.positions.find(p => p.name === 'Merkur')?.sign}
• Venus: ${natalChart.positions.find(p => p.name === 'Venus')?.sign}
• Mars: ${natalChart.positions.find(p => p.name === 'Mars')?.sign}
• Ascendant: ${natalChart.ascendant}
• Dominante element: ${natalChart.dominantElement}

Fokuser på: kjærlighet, karriere, indre vekst og energinivåer denne uken.`;

    const raw = await askClaude(systemPrompt, userMessage, 'claude-sonnet-4-6', 3000);
    return cleanAstroText(raw);
  },

  // ── Tarot report ─────────────────────────────────────────────────────────

  generateTarotReport: async (
    cards: any[],
    spread: any,
    style: string,
    _mode: string,
    clientData: any,
    userContext: string,
    lang: Language
  ) => {
    const targetLang = LANGUAGE_NAMES[lang] || 'ENGLISH';
    const cardsList = cards.map((c, i) =>
      `Posisjon ${i + 1} (${spread.positions?.[i] || 'Ukjent'}): ${c.card?.name || c.name || 'Ukjent'}${c.isReversed ? ' (Reversert)' : ''}`
    ).join('\n');

    const systemPrompt = `Du er AstroMasons Tarotmester — en dyp leser med innsikt i symbolikk, sjelsarkitektur og livsnavigasjon.
Integrer astrologi og tarot-symbolikk. Skriv poetisk men konkret. Ingen Markdown.`;

    const userMessage = `Analyser dette tarotlegget på ${targetLang} for ${clientData.clientName || 'klienten'}.

Spørsmål/kontekst: ${userContext || 'Generell veiledning'}
Stil: ${style}
Leggtype: ${spread.name}

KORT I LEGGET:
${cardsList}

Skriv en sammenhengende, dyp tolkning (500-800 ord). Start med en overordnet essens, deretter kart kort individuelt i kontekst, og avslutt med syntese og råd.`;

    const raw = await askClaude(systemPrompt, userMessage, 'claude-opus-4-6', 4096);
    return cleanAstroText(raw);
  },

  // ── Deep chronicle (transit/progression analysis) ────────────────────────

  generateDeepChronicle: async (chart: CalculatedChart, type: string, lang: Language) => {
    const targetLang = LANGUAGE_NAMES[lang] || 'ENGLISH';
    const planetsContext = chart.positions
      .map(p => `${p.name}${p.isRetrograde ? '(R)' : ''}: ${p.sign} ${p.degree}°, Hus ${p.house}`)
      .join(' | ');

    const systemPrompt = `Du er AstroMasons Dybdekronikør. Skriv dyptgående ${type}-analyse. Ingen Markdown.`;

    const userMessage = `Generer en dyp ${type}-kronike på ${targetLang} for ${chart.clientName}.

Posisjoner: ${planetsContext}
Ascendant: ${chart.ascendant} | MC: ${chart.mc}
Mønstre: ${(chart.patterns || []).map(p => p.type).join(', ') || 'ingen'}

Skriv 3-5 avsnitt med konkrete tolkninger og veiledning.`;

    const raw = await askClaude(systemPrompt, userMessage, 'claude-sonnet-4-6', 3000);
    return cleanAstroText(raw);
  },

  // ── Synastry report ──────────────────────────────────────────────────────

  generateSynastryReport: async (chart1: CalculatedChart, chart2: CalculatedChart, lang: Language) => {
    const targetLang = LANGUAGE_NAMES[lang] || 'ENGLISH';

    const systemPrompt = `Du er AstroMasons Synastri-mester. Analyser forholdets kosmiske arkitektur mellom to sjeler.
Integrer planettolkninger, aspekter og hussymbolikk. Ingen Markdown.`;

    const p1 = chart1.positions.map(p => `${p.name}: ${p.sign}, Hus ${p.house}`).join(' | ');
    const p2 = chart2.positions.map(p => `${p.name}: ${p.sign}, Hus ${p.house}`).join(' | ');

    // Cross-aspects: check key inter-chart aspects
    const crossAspects: string[] = [];
    const keyBodies = ['Solen', 'Månen', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
    for (const p1planet of chart1.positions.filter(p => keyBodies.includes(p.name))) {
      for (const p2planet of chart2.positions.filter(p => keyBodies.includes(p.name))) {
        const diff = Math.abs(p1planet.totalDegrees - p2planet.totalDegrees);
        const angle = diff > 180 ? 360 - diff : diff;
        for (const { name, angle: aAngle, orb } of [
          { name: 'konjunksjon', angle: 0, orb: 8 },
          { name: 'trigon', angle: 120, orb: 8 },
          { name: 'opposisjon', angle: 180, orb: 8 },
          { name: 'kvadrat', angle: 90, orb: 7 },
        ]) {
          if (Math.abs(angle - aAngle) <= orb) {
            crossAspects.push(`${chart1.clientName} ${p1planet.name} ${name} ${chart2.clientName} ${p2planet.name}`);
            break;
          }
        }
      }
    }

    const userMessage = `Analyser synastri på ${targetLang} mellom ${chart1.clientName} og ${chart2.clientName}.

${chart1.clientName}:
${p1} | Asc: ${chart1.ascendant} | Chartruler: ${chart1.chartRuler} i ${chart1.chartRulerSign}

${chart2.clientName}:
${p2} | Asc: ${chart2.ascendant} | Chartruler: ${chart2.chartRuler} i ${chart2.chartRulerSign}

VIKTIGE KRYSS-ASPEKTER:
${crossAspects.slice(0, 12).join('\n') || 'Beregnes dynamisk'}

Returner JSON:
{
  "title": "Poetisk tittel for deres relasjon",
  "overview": "Overordnet relasjonskjemi — kjernedynamikk, tiltrekning og samspill (500+ ord)",
  "strengths": "Styrkepunkter, harmoni og hva som binder dem (400+ ord)",
  "challenges": "Utfordringer, friksjonspunkter og vekstmuligheter (300+ ord)",
  "karmaticThemes": "Karmiske temaer, tidligere liv og sjeldne mønstre (300+ ord)",
  "guidance": "Konkret praktisk veiledning for å styrke relasjonen (200+ ord)"
}`;

    const raw = await askClaude(systemPrompt, userMessage, 'claude-opus-4-6', 8192);
    const data = extractJSON(raw);

    return {
      title: cleanAstroText(data.title || ''),
      overview: cleanAstroText(data.overview || ''),
      strengths: cleanAstroText(data.strengths || ''),
      challenges: cleanAstroText(data.challenges || ''),
      karmaticThemes: cleanAstroText(data.karmaticThemes || ''),
      guidance: cleanAstroText(data.guidance || ''),
    };
  },

  // ── Solar Return ─────────────────────────────────────────────────────────

  calculateSolarReturn: async (
    natalChart: CalculatedChart,
    targetYear: number,
    mode: AstrologyMode = 'merged'
  ): Promise<CalculatedChart> => {
    const astro = window.Astronomy;
    const natalSun = natalChart.positions.find(p => p.name === 'Solen');
    if (!natalSun) throw new Error('Natal solposisjon mangler');

    const natalSunLon = natalSun.totalDegrees;
    const birthLocation = natalChart.location;
    const coords = natalChart.coords || await AstrologyService.geocode(birthLocation);
    const isVedic = mode === 'vedic';

    // Binary search for the exact moment when sun returns to natal longitude
    let lo = new Date(targetYear, 0, 1);
    let hi = new Date(targetYear, 11, 31);

    for (let iter = 0; iter < 50; iter++) {
      const mid = new Date((lo.getTime() + hi.getTime()) / 2);
      const time = astro.MakeTime(mid);
      const vec = astro.GeoVector(astro.Body.Sun, time, true);
      const ecl = astro.Ecliptic(vec);
      const sunLon = getZodiacDetails(ecl.elon, isVedic).totalDegrees;

      let diff = sunLon - natalSunLon;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      if (Math.abs(diff) < 0.001) break;
      if (diff > 0) hi = mid;
      else lo = mid;
    }

    const srDate = new Date((lo.getTime() + hi.getTime()) / 2);
    const srDateStr = srDate.toISOString().split('T')[0];
    const srTimeStr = `${String(srDate.getUTCHours()).padStart(2, '0')}:${String(srDate.getUTCMinutes()).padStart(2, '0')}`;

    return AstrologyService.calculateChart(
      {
        name: `Solretur ${targetYear} — ${natalChart.clientName}`,
        date: srDateStr,
        time: srTimeStr,
        location: birthLocation,
        houseSystem: natalChart.houseCusps.length > 0 ? 'Placidus' : 'Equal',
      },
      mode,
      coords
    );
  },

  generateSolarReturnReport: async (
    natalChart: CalculatedChart,
    srChart: CalculatedChart,
    lang: Language
  ) => {
    const targetLang = LANGUAGE_NAMES[lang] || 'ENGLISH';
    const srPlanets = srChart.positions
      .map(p => `${p.name}${p.isRetrograde ? '(R)' : ''}: ${p.sign} ${p.degree}°, Hus ${p.house}`)
      .join(' | ');

    const systemPrompt = `Du er AstroMason Solretur-analytiker. Analyser et solreturkart for å gi konkret veiledning for det kommende året. Ingen Markdown.`;
    const userMessage = `Analyser solreturen for ${natalChart.clientName} på ${targetLang}.

NATAL NØKKELPUNKTER:
Sol: ${natalChart.positions.find(p => p.name === 'Solen')?.sign}, Hus ${natalChart.positions.find(p => p.name === 'Solen')?.house}
Ascendant natal: ${natalChart.ascendant}

SOLRETURKART (${srChart.date}):
Ascendant SR: ${srChart.ascendant}
MC SR: ${srChart.mc}
${srPlanets}

Skriv 5 avsnitt (600+ ord totalt):
1. Årets overordnede energi og tema
2. Karriere og økonomi
3. Kjærlighet og relasjoner
4. Indre vekst og utfordringer
5. Beste måneder og timing for handling`;

    const raw = await askClaude(systemPrompt, userMessage, 'claude-sonnet-4-6', 3500);
    return cleanAstroText(raw);
  },

  // ── Secondary Progressions ───────────────────────────────────────────────

  calculateProgressions: async (
    natalData: { name: string; date: string; time: string; location: string; houseSystem: string },
    targetDate: string,
    mode: AstrologyMode = 'merged'
  ): Promise<CalculatedChart> => {
    const birthDate = new Date(natalData.date + 'T' + (natalData.time || '12:00') + ':00Z');
    const target = new Date(targetDate);

    // 1 day after birth = 1 year of life
    const yearsElapsed = (target.getTime() - birthDate.getTime()) / (365.25 * 24 * 3600 * 1000);
    const progressedDate = new Date(birthDate.getTime() + yearsElapsed * 24 * 3600 * 1000);

    const progDateStr = progressedDate.toISOString().split('T')[0];
    const progTimeStr = `${String(progressedDate.getUTCHours()).padStart(2, '0')}:${String(progressedDate.getUTCMinutes()).padStart(2, '0')}`;

    const coords = natalData.location ? await AstrologyService.geocode(natalData.location) : undefined;

    return AstrologyService.calculateChart(
      {
        name: `Progresjon ${targetDate} — ${natalData.name}`,
        date: progDateStr,
        time: progTimeStr,
        location: natalData.location,
        houseSystem: natalData.houseSystem,
      },
      mode,
      coords
    );
  },

  generateProgressionReport: async (
    natalChart: CalculatedChart,
    progChart: CalculatedChart,
    lang: Language
  ) => {
    const targetLang = LANGUAGE_NAMES[lang] || 'ENGLISH';
    const progPlanets = progChart.positions
      .filter(p => ['Solen', 'Månen', 'Merkur', 'Venus', 'Mars', 'Chiron', 'Lilith'].includes(p.name))
      .map(p => `${p.name}${p.isRetrograde ? '(R)' : ''}: ${p.sign} ${p.degree}°, Hus ${p.house}`)
      .join('\n');

    // Cross-aspects between natal and progressed
    const crossAspects: string[] = [];
    for (const np of natalChart.positions.slice(0, 7)) {
      for (const pp of progChart.positions.slice(0, 7)) {
        const diff = Math.abs(np.totalDegrees - pp.totalDegrees);
        const angle = diff > 180 ? 360 - diff : diff;
        if (Math.abs(angle) <= 2) crossAspects.push(`Natal ${np.name} konj. Prog. ${pp.name} (${np.sign})`);
        else if (Math.abs(angle - 180) <= 2) crossAspects.push(`Natal ${np.name} opp. Prog. ${pp.name}`);
        else if (Math.abs(angle - 90) <= 2) crossAspects.push(`Natal ${np.name} kv. Prog. ${pp.name}`);
        else if (Math.abs(angle - 120) <= 2) crossAspects.push(`Natal ${np.name} tr. Prog. ${pp.name}`);
      }
    }

    const systemPrompt = `Du er AstroMasons Progresjonsanalytiker. Bruk sekundære progresjoner for å avsløre sjels-utvikling og livstemata. Ingen Markdown.`;
    const userMessage = `Analyser progresjonskart for ${natalChart.clientName} på ${targetLang}.

NATAL NØKKELPUNKTER:
Sol: ${natalChart.positions.find(p => p.name === 'Solen')?.sign}, Hus ${natalChart.positions.find(p => p.name === 'Solen')?.house}
Måne natal: ${natalChart.positions.find(p => p.name === 'Månen')?.sign}
Ascendant: ${natalChart.ascendant}

PROGRESERTE PLANETER (${progChart.date}):
${progPlanets}
Progresert Ascendant: ${progChart.ascendant}
Progresert MC: ${progChart.mc}

KRYSS-ASPEKTER (natal → progresert):
${crossAspects.slice(0, 8).join('\n') || 'Ingen eksakte aspekter'}

Skriv 5 avsnitt (600+ ord totalt):
1. Progresert sol og livsretning nå
2. Progresert måne og emosjonelt klima
3. Aktiverte livstemata og karmiske mønstre
4. Progresjonshovedtemaer neste 2-3 år
5. Råd: hva er sjelen klar for å ta tak i nå?`;

    const raw = await askClaude(systemPrompt, userMessage, 'claude-sonnet-4-6', 3500);
    return cleanAstroText(raw);
  },

  // ── Numerology AI ────────────────────────────────────────────────────────

  generateNumerologyReport: async (name: string, birthDate: string, numbers: Record<string, number>, lang: Language) => {
    const targetLang = LANGUAGE_NAMES[lang] || 'ENGLISH';

    const systemPrompt = `Du er AstroMasons Numerologi-mester med dyp kunnskap i Pythagoreisk og Kaballistisk numerologi.
Ingen Markdown. Returner KUN gyldig JSON.`;

    const userMessage = `Generer komplett numerologirapport på ${targetLang} for ${name} (${birthDate}).

Tall: ${JSON.stringify(numbers)}

JSON-format:
{
  "title": "...",
  "coreNumbers": [{ "number": "Livssti", "value": 7, "interpretation": "..." }],
  "karmaticLessons": "...",
  "personalYear": "...",
  "guidance": "..."
}`;

    try {
      const raw = await askClaude(systemPrompt, userMessage, 'claude-sonnet-4-6', 4096);
      return extractJSON(raw);
    } catch {
      throw new Error('Numerologi-arkivene er utilgjengelige.');
    }
  },

};
