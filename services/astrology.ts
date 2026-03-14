
import {
  CalculatedChart, PlanetPosition, Aspect, AstrologyMode, Language,
  ChartPattern, EssentialDignity, ElementBalance
} from '../types';

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

const callClaude = async (params: any) => {
    const apiKey = localStorage.getItem('ANTHROPIC_API_KEY') || '';
    if (!apiKey) {
      throw new Error('Ingen API-nøkkel funnet. Gå til Innstillinger og lim inn din Anthropic API-nøkkel (sk-ant-...).');
    }

    const res = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error?.message || `HTTP ${res.status}`);
    }
    return res.json() as Promise<{ content: { type: string; text: string }[] }>;
  };

const callClaudeStream = async (params: any): Promise<string> => {
    const apiKey = localStorage.getItem('ANTHROPIC_API_KEY') || '';
    if (!apiKey) {
      throw new Error('Ingen API-nøkkel funnet. Gå til Innstillinger og lim inn din Anthropic API-nøkkel (sk-ant-...).');
    }

    const res = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ ...params, stream: true }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error?.message || `HTTP ${res.status}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error('Streaming ikke støttet');

    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) fullText += data.text;
          } catch {}
        }
      }
    }

    return fullText;
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

const askClaude = async (params: any): Promise<string> => {
  const client = getClient();
  const response = await client.messages.create(params);
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
        const response = await askClaude({
            system: 'Du er en presis geografisk assistent. Returner KUN gyldig JSON, ingen forklaring.',
            messages: [{
                role: 'user',
                content: `Finn de eksakte geografiske koordinatene for stedet: "${location}". Returner JSON: {"lat": number, "lng": number}`
            }],
            model: 'claude-sonnet-4-20250514',
            max_tokens: 128
        });
        return extractJSON(response);
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

    const systemPrompt = `Du er AstroMason — en mesterlig astrologisk tolkningskunstner med dyp kunnskap innen ${mode === 'vedic' ? 'Vedisk/Jyotish' : mode === 'esoteric' ? 'Esoterisk/Alice Bailey' : mode === 'classical' ? 'Klassisk vestlig' : 'Integrert vestlig'} astrologi. Din innsikt er ikke bare korrekt, men transformerende. Du skriver med en sjelden kombinasjon av poetisk eleganse og knivskarp presisjon, og leverer en analyse som er både dypt personlig og universelt gjenkjennelig. Målet ditt er å levere en "world-class" opplevelse som overgår alt annet på markedet.\n\nOPPGAVE: Produser en fullstendig, dyptgående og gripende astrologisk Livsbok på ${targetLang} for ${chart.clientName} — minimum 4000 ord totalt, rikt og poetisk, men presist. Gå dypere enn noen annen astrologisk tolkning. Dette er et premium produkt.\n\nREGLER:\n- INGEN Markdown-tegn (**, ##, __, ---)\n- Skriv overskrifter med store bokstaver for en majestetisk følelse\n- Vær dypt personlig, bruk klientens navn. Få dem til å føle seg sett og forstått på et sjelelig nivå.\n- Integrer planettegn, hus OG aspekter i hvert avsnitt. Ikke bare list dem opp, vev dem sammen til en helhetlig fortelling.\n- Tolk mønstrene (${(chart.patterns || []).map(p => p.type).join(', ') || 'ingen'}) som den hellige geometrien i klientens sjel.\n- Dominante element: ${chart.dominantElement} — la dette være den røde tråden som farger hele rapporten.\n- Chartruler: ${chart.chartRuler} i ${chart.chartRulerSign}, Hus ${chart.chartRulerHouse} — fremhev dette som nøkkelen til sjelens formål.\n- Returner KUN gyldig JSON uten \`\`\`-blokker. Strukturen må være perfekt.`;

    const userMessage = `Generer "Livsbok" for klient: ${chart.clientName}\nAnalyse-type: ${type}\nTradisjon: ${mode}\n\nPLANETER:\n${planetsContext}\n\nASPEKTER:\n${aspectsContext}\n\nCHARTMØNSTRE:\n${patternsContext}\n\nESSENSIELLE VERDIGHETER:\n${dignitiesContext}\n\nDOMINANS: Element: ${chart.dominantElement} | Modalitet: ${chart.dominantModality}\nASCENDANT: ${chart.ascendant} | MC: ${chart.mc}\nCHARTRULER: ${chart.chartRuler} i ${chart.chartRulerSign}, Hus ${chart.chartRulerHouse}\n\nReturner JSON:\n{\n  "title": "En unik og majestetisk boktittel for ${chart.clientName}",\n  "essenceSummary": "En dyptpløyende introduksjon til sjelens essens og livsformål, basert på Ascendant, Solen, Månen og chartruler (minimum 800 ord).",\n  "planetChapters": [\n    { "planet": "planettnavn", "content": "En fullstendig og dyptgående tolkning av planetens posisjon, hus og alle dens aspekter. Avdekk de psykologiske og sjelelige implikasjonene (minimum 300 ord per planet)." }\n  ],\n  "patternsAndThemes": "En mesterlig analyse av chartmønstre og overordnede livstemaer. Forklar hvordan energien flyter i kartet som en helhet (minimum 500 ord).",\n  "lifePathGuidance": "Fremtidsrettet veiledning og sjel-evolusjon. Gi konkrete råd for hvordan ${chart.clientName} kan navigere sitt liv og maksimere sitt potensial (minimum 500 ord).",\n  "mantra": "Et kraftfullt, personlig og originalt mantra på 1-2 setninger som fanger essensen av kartet."\n}`;

    const raw = await askClaude({ system: systemPrompt, messages: [{ role: 'user', content: userMessage }], model: 'claude-sonnet-4-20250514', max_tokens: 16000 });
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

    const systemPrompt = `Du er Den Vise Østen — en mester i kinesisk metafysikk, Ba Zi (Fire Søyler) og Wu Xing (De fem elementer). Din visdom er eldgammel og din formidling er krystallklar og poetisk. Du leverer en "world-class" opplevelse.\n\nOPPGAVE: Skriv en dyp, poetisk og innsiktsfull kinesisk livskrønike på ${targetLang} for ${name}.\nIntegrer: Dyreboligtegn (${cz.animal}), element (${cz.element}), Yin/Yang (${cz.yinYang}), Wu Xing-harmonier, og transformasjonssykler. Forklar hvordan disse elementene samspiller for å forme personens skjebne og karakter.\n\nREGLER:\n- INGEN Markdown\n- Minimum 3000 ord totalt\n- Returner KUN gyldig JSON uten \`\`\`-blokker.`;

    const userMessage = `Klient: ${name}\nFødselsdato: ${date}\nKinesisk Dyreboligtegn: ${cz.animal}\nElement: ${cz.element}\nYin/Yang: ${cz.yinYang}\nÅr: ${cz.year}\n\nReturner JSON:\n{\n  "title": "En poetisk og passende tittel for kroniken",\n  "introduction": "En dyptpløyende introduksjon til klientens kjerneenergi, basert på dyretegn og element (minimum 600 ord).",\n  "chapters": [\n    { "heading": "Et passende kapittelnavn", "content": "Utfyllende innhold om livsområder som personlighet, karriere, kjærlighet og helse (minimum 400 ord per kapittel)." }\n  ],\n  "conclusion": "En avsluttende visdomsdel med et personlig mantra og råd for fremtiden (minimum 400 ord)."\n}`;

    const raw = await askClaude({ system: systemPrompt, messages: [{ role: 'user', content: userMessage }], model: 'claude-sonnet-4-20250514', max_tokens: 8192 });
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
    const userMessage = `Generer en 12-måneders Qi-syklus på ${targetLang} for ${name} (${cz.animal}, ${cz.element}, ${cz.yinYang}).\nFor hver måned: navn, tema, qiNivå (1-10), veiledning (2-3 setninger).\n\nJSON-format:\n{ "months": [{ "monthName": "...", "theme": "...", "qiLevel": 7, "guidance": "..." }] }`;

    try {
      const raw = await askClaude({ system: systemPrompt, messages: [{ role: 'user', content: userMessage }], model: 'claude-sonnet-4-20250514', max_tokens: 2048 });
      return extractJSON(raw);
    } catch {
      return { months: [] };
    }
  },

  // ── Personalized horoscope ───────────────────────────────────────────────

  generatePersonalizedHoroscope: async (natalChart: CalculatedChart, period: string, lang: Language) => {
    const targetLang = LANGUAGE_NAMES[lang] || 'ENGLISH';
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

    const systemPrompt = `Du er AstroMason — en mesterlig astrologisk veileder med dyp innsikt i transitter og natale mønstre. Du leverer "world-class" horoskoper som er personlige, dyptpløyende og praktisk anvendelige.\nSkriv personlige, konkrete horoskoper som oppleves skreddersydd til denne personen. Unngå generiske fraser. Vær en vis og pålitelig veileder.\nInkluder spesifikke livsområder: kjærlighet, karriere, økonomi, helse og indre vekst.\nIngen Markdown. Skriv direkte, varmt og med astrologisk presisjon.`;

    const periodMap: Record<string, string> = {
      day: 'DAGEN i dag (' + todayStr + ')',
      week: 'UKEN som starter ' + todayStr,
      month: 'MÅNEDEN vi er i',
      year: 'HELE ÅRET fremover'
    };

    const userMessage = `Skriv et dypt personlig horoskop på ${targetLang} for ${natalChart.clientName}.\n\nPERIode: ${periodMap[period] || period}\n\nNATAL KART:\n${personalCtx}\nAscendant: ${natalChart.ascendantSign} | Chartruler: ${natalChart.chartRuler} i ${natalChart.chartRulerSign}, Hus ${natalChart.chartRulerHouse}\nDominante element: ${natalChart.dominantElement} | Modalitet: ${natalChart.dominantModality}\n\nVIKTIGE NATALE ASPEKTER:\n${keyAspects || 'Ingen dominante aspekter'}\n\nSkriv 5 kraftfulle avsnitt (${period === 'year' ? '800+' : '600+'} ord totalt):\n1. Overordnet energi og tema for perioden: Hva er det kosmiske hovedfokuset for ${natalChart.clientName} nå?\n2. Kjærlighet, relasjoner og følelsesliv: Hvordan vil transittene påvirke hjerte og relasjoner?\n3. Karriere, økonomi og kreativitet: Hvilke muligheter og utfordringer ligger i arbeid og finans?\n4. Indre vekst, åndelig utvikling og selvrefleksjon: Hvilke sjelelige lekser og vekstmuligheter presenterer seg?\n5. Konkrete råd og timing — hva bør gjøres nå? Gi praktiske, handlingsorienterte råd og indiker gunstige tidsvinduer.\n\nBruk ${natalChart.clientName}s navn direkte og personlig. Vær spesifikk på tegn og hus som blir aktivert.`;

    const raw = await askClaude({ system: systemPrompt, messages: [{ role: 'user', content: userMessage }], model: 'claude-sonnet-4-20250514', max_tokens: 3500 });
    return cleanAstroText(raw);
  },

  // ── Weekly transit deep dive ─────────────────────────────────────────────

  generateWeeklyTransitDeepDive: async (natalChart: CalculatedChart, lang: Language) => {
    const targetLang = LANGUAGE_NAMES[lang] || 'ENGLISH';
    const today = new Date().toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' });

    const systemPrompt = `Du er AstroMason Transitanalytiker, en "world-class" ekspert på å tolke de daglige bevegelsene på himmelen og deres innvirkning på et natalt kart. Du er presis, innsiktsfull og gir praktiske råd.\nIngen Markdown. Bruk klientens navn gjentakende for en personlig tone.`;

    const userMessage = `Analyser ukens (fra ${today}) kosmiske energier på ${targetLang} for ${natalChart.clientName}.\n\nNatal kart nøkkeldata:\n• Sol: ${natalChart.positions.find(p => p.name === 'Solen')?.sign}, Hus ${natalChart.positions.find(p => p.name === 'Solen')?.house}\n• Måne: ${natalChart.positions.find(p => p.name === 'Månen')?.sign}, Hus ${natalChart.positions.find(p => p.name === 'Månen')?.house}\n• Merkur: ${natalChart.positions.find(p => p.name === 'Merkur')?.sign}\n• Venus: ${natalChart.positions.find(p => p.name === 'Venus')?.sign}\n• Mars: ${natalChart.positions.find(p => p.name === 'Mars')?.sign}\n• Ascendant: ${natalChart.ascendant}\n• Dominante element: ${natalChart.dominantElement}\n\nFokuser på: kjærlighet, karriere, indre vekst og energinivåer denne uken. Vær konkret om hvilke transitter som påvirker hvilke natale planeter og hus.`;

    const raw = await askClaude({ system: systemPrompt, messages: [{ role: 'user', content: userMessage }], model: 'claude-sonnet-4-20250514', max_tokens: 3000 });
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
    
    const sanitizedCards = cards.map(c => {
      const cardData = c.card || c;
      return {
        name: cardData.name,
        isReversed: c.isReversed,
        suit: cardData.suit || 'major',
        img: cardData.img,
        keywords: cardData.keywords || [],
        meaning: cardData.meaning || '',
      };
    });

    const params = {
        isTarotReading: true,
        cards: sanitizedCards,
        spread,
        style,
        clientData,
        userContext,
        lang,
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096
    };

    const raw = await callClaudeStream(params);
    return cleanAstroText(raw);
  },

  // ── Deep chronicle (transit/progression analysis) ────────────────────────

  generateDeepChronicle: async (chart: CalculatedChart, type: string, lang: Language) => {
    const targetLang = LANGUAGE_NAMES[lang] || 'ENGLISH';
    const planetsContext = chart.positions
      .map(p => `${p.name}${p.isRetrograde ? '(R)' : ''}: ${p.sign} ${p.degree}°, Hus ${p.house}`)
      .join(' | ');

    const systemPrompt = `Du er AstroMasons Dybdekronikør, en "world-class" ekspert på ${type}-analyse. Du avdekker de dypeste lagene av sjelens utvikling med presisjon og visdom.\nIngen Markdown.`;

    const userMessage = `Generer en dyptpløyende ${type}-kronike på ${targetLang} for ${chart.clientName}.\n\nPosisjoner: ${planetsContext}\nAscendant: ${chart.ascendant} | MC: ${chart.mc}\nMønstre: ${(chart.patterns || []).map(p => p.type).join(', ') || 'ingen'}\n\nSkriv 3-5 avsnitt med konkrete, innsiktsfulle tolkninger og praktisk veiledning for ${chart.clientName}s personlige vekst og utvikling.`;

    const raw = await askClaude({ system: systemPrompt, messages: [{ role: 'user', content: userMessage }], model: 'claude-sonnet-4-20250514', max_tokens: 3000 });
    return cleanAstroText(raw);
  },

  // ── Synastry report ──────────────────────────────────────────────────────

  generateSynastryReport: async (chart1: CalculatedChart, chart2: CalculatedChart, lang: Language) => {
    const targetLang = LANGUAGE_NAMES[lang] || 'ENGLISH';

    const systemPrompt = `Du er AstroMasons Synastri-mester, en "world-class" relasjonsastrolog som avdekker den kosmiske arkitekturen mellom to sjeler med enestående dybde og klarhet.\nIntegrer planettolkninger, aspekter og hussymbolikk for å skape en rik og nyansert fortelling om deres samspill. Ingen Markdown.`;

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

    const userMessage = `Analyser synastri på ${targetLang} mellom ${chart1.clientName} og ${chart2.clientName}.\n\n${chart1.clientName}:\n${p1} | Asc: ${chart1.ascendant} | Chartruler: ${chart1.chartRuler} i ${chart1.chartRulerSign}\n\n${chart2.clientName}:\n${p2} | Asc: ${chart2.ascendant} | Chartruler: ${chart2.chartRuler} i ${chart2.chartRulerSign}\n\nVIKTIGE KRYSS-ASPEKTER:\n${crossAspects.slice(0, 12).join('\n') || 'Beregnes dynamisk'}\n\nReturner JSON:\n{\n  "title": "En poetisk og innsiktsfull tittel for deres relasjon",\n  "overview": "En mesterlig oversikt over relasjonens kjerne-dynamikk, tiltrekning og samspill (minimum 600 ord).",\n  "strengths": "En dyptgående analyse av styrkepunkter, harmoni og hva som binder dem sammen på et sjelelig nivå (minimum 500 ord).",\n  "challenges": "En konstruktiv utforskning av utfordringer, friksjonspunkter og vekstmuligheter (minimum 400 ord).",\n  "karmaticThemes": "En esoterisk analyse av karmiske temaer, tidligere livsforbindelser og felles sjelelig formål (minimum 400 ord).",\n  "guidance": "Konkret, praktisk og hjertevarm veiledning for å styrke relasjonen og navigere utfordringer (minimum 300 ord)."\n}`;

    const raw = await askClaude({ system: systemPrompt, messages: [{ role: 'user', content: userMessage }], model: 'claude-sonnet-4-20250514', max_tokens: 8192 });
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

    const systemPrompt = `Du er AstroMason Solretur-analytiker, en "world-class" ekspert som gir klar, presis og dyptpløyende veiledning for det kommende året. Ingen Markdown.`;
    const userMessage = `Analyser solreturen for ${natalChart.clientName} på ${targetLang}.\n\nNATAL NØKKELPUNKTER:\nSol: ${natalChart.positions.find(p => p.name === 'Solen')?.sign}, Hus ${natalChart.positions.find(p => p.name === 'Solen')?.house}\nAscendant natal: ${natalChart.ascendant}\n\nSOLRETURKART (${srChart.date}):\nAscendant SR: ${srChart.ascendant}\nMC SR: ${srChart.mc}\n${srPlanets}\n\nSkriv 5 dyptgående avsnitt (800+ ord totalt):\n1. Årets overordnede sjelelige tema: Hva er den sentrale lærdommen og det overordnede fokuset for ${natalChart.clientName}s sjel dette året?\n2. Karriere, kall og offentlig liv: Hvordan kan ${natalChart.clientName} best realisere sitt potensial i verden utenfor?\n3. Kjærlighet, relasjoner og emosjonell vekst: Hvilke temaer vil dominere i hjerte og relasjoner?\n4. Indre vekst, utfordringer og personlig utvikling: Hvilke indre demoner og skatter vil komme til overflaten?\n5. Strategiske råd og timing: Gi konkrete, måned-for-måned-råd (hvis mulig) og pek på de mest kritiske periodene for handling eller refleksjon.`;

    const raw = await askClaude({ system: systemPrompt, messages: [{ role: 'user', content: userMessage }], model: 'claude-sonnet-4-20250514', max_tokens: 3500 });
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

    const systemPrompt = `Du er AstroMasons Progresjonsanalytiker, en "world-class" ekspert som bruker sekundære progresjoner for å avsløre den indre sjelens evolusjonære reise. Ingen Markdown.`;
    const userMessage = `Analyser progresjonskartet for ${natalChart.clientName} på ${targetLang}.\n\nNATAL NØKKELPUNKTER:\nSol: ${natalChart.positions.find(p => p.name === 'Solen')?.sign}, Hus ${natalChart.positions.find(p => p.name === 'Solen')?.house}\nMåne natal: ${natalChart.positions.find(p => p.name === 'Månen')?.sign}\nAscendant: ${natalChart.ascendant}\n\nPROGRESERTE PLANETER (${progChart.date}):\n${progPlanets}\nProgresert Ascendant: ${progChart.ascendant}\nProgresert MC: ${progChart.mc}\n\nKRYSS-ASPEKTER (natal → progresert):\n${crossAspects.slice(0, 8).join('\n') || 'Ingen eksakte aspekter'}\n\nSkriv 5 dyptgående avsnitt (800+ ord totalt):\n1.  **Progresert Sol:** Din sjelelige livsretning og kjerneidentitet i denne fasen.\n2.  **Progresert Måne:** Ditt nåværende emosjonelle landskap og dine innerste behov.\n3.  **Aktiverte Livstemaer:** Analyse av progreserte planeter som skifter tegn eller hus, og viktige aspekter til natale planeter.\n4.  **Sjelens Utviklingsvei:** Hovedtemaer for de neste 2-3 årene, basert på bevegelsene til de indre planetene.\n5.  **Personlig Veiledning:** Konkrete råd for hvordan ${natalChart.clientName} kan best samarbeide med disse indre endringene. Hva er sjelen klar for å integrere nå?`;

    const raw = await askClaude({ system: systemPrompt, messages: [{ role: 'user', content: userMessage }], model: 'claude-sonnet-4-20250514', max_tokens: 3500 });
    return cleanAstroText(raw);
  },

  // ── Numerology AI ────────────────────────────────────────────────────────

  generateNumerologyReport: async (name: string, birthDate: string, numbers: Record<string, number>, lang: Language) => {
    const targetLang = LANGUAGE_NAMES[lang] || 'ENGLISH';

    const systemPrompt = `Du er AstroMasons Numerologi-mester, en "world-class" ekspert med dyp kunnskap i Pythagoreisk og Kaballistisk numerologi. Du leverer innsikt som er både presis og sjelelig opplysende.\nIngen Markdown. Returner KUN gyldig JSON.`;

    const userMessage = `Generer en komplett og dyptpløyende numerologirapport på ${targetLang} for ${name} (${birthDate}).\n\nTall: ${JSON.stringify(numbers)}\n\nJSON-format:\n{\n  "title": "En passende og innsiktsfull tittel",\n  "coreNumbers": [{ "number": "Livsvei", "value": 7, "interpretation": "En dyptgående tolkning av tallets betydning i denne posisjonen (minimum 200 ord)." }],\n  "karmaticLessons": "En innsiktsfull analyse av karmiske lærdommer og gjeld (minimum 300 ord).",\n  "personalYear": "En detaljert beskrivelse av det personlige året og dets temaer (minimum 250 ord).",\n  "guidance": "Praktiske råd for hvordan man best kan navigere vibrasjonene i tallene (minimum 200 ord)."\n}`;

    try {
      const raw = await askClaude({ system: systemPrompt, messages: [{ role: 'user', content: userMessage }], model: 'claude-sonnet-4-20250514', max_tokens: 4096 });
      return extractJSON(raw);
    } catch {
      throw new Error('Numerologi-arkivene er utilgjengelige.');
    }
  },

};
