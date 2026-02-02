
import { CalculatedChart, PlanetPosition, Aspect, AstrologyMode, Language } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { preprocessSpreadForAI_V2, generateCustomTarotPrompt } from './tarot-ai-system';

declare global {
  interface Window {
    Astronomy: any;
  }
}

const ZODIAC_SIGNS = [
  'Væren', 'Tyren', 'Tvillingene', 'Krepsen', 'Løven', 'Jomfruen',
  'Vekten', 'Skorpionen', 'Skytten', 'Steinbukken', 'Vannmannen', 'Fiskene'
];

const CHINESE_ANIMALS = [
    'Rotte', 'Okse', 'Tiger', 'Haren', 'Drage', 'Slange', 'Hest', 'Geit', 'Ape', 'Hane', 'Hund', 'Gris'
];

const CHINESE_ELEMENTS = ['Metall', 'Vann', 'Tre', 'Ild', 'Jord'];

const PLANET_MAP: Record<string, string> = {
  'Sun': 'Solen', 'Moon': 'Månen', 'Mercury': 'Merkur', 'Venus': 'Venus',
  'Mars': 'Mars', 'Jupiter': 'Jupiter', 'Saturn': 'Saturn', 'Uranus': 'Uranus',
  'Neptune': 'Neptun', 'Pluto': 'Pluto'
};

const PLANET_SYMBOLS: Record<string, string> = {
  'Solen': '☉', 'Månen': '☽', 'Merkur': '☿', 'Venus': '♀', 'Mars': '♂',
  'Jupiter': '♃', 'Saturn': '♄', 'Uranus': '♅', 'Neptun': '♆', 'Pluto': '♇'
};

const ASPECT_TYPES = [
  { name: 'Konjunksjon', angle: 0, orb: 8, symbol: '☌', color: '#fbbf24' },
  { name: 'Opposisjon', angle: 180, orb: 8, symbol: '☍', color: '#ef4444' },
  { name: 'Kvadrat', angle: 90, orb: 7, symbol: '□', color: '#ef4444' },
  { name: 'Trigon', angle: 120, orb: 8, symbol: '△', color: '#3b82f6' },
  { name: 'Sekstil', angle: 60, orb: 5, symbol: '✱', color: '#3b82f6' }
];

const getZodiacDetails = (longitude: number, isVedic: boolean = false) => {
  const ayanamsa = isVedic ? 24.0 : 0;
  const normalized = ((longitude - ayanamsa) % 360 + 360) % 360;
  const index = Math.floor(normalized / 30);
  const degree = Math.floor(normalized % 30);
  const minute = Math.floor((normalized % 30 - degree) * 60);
  return { sign: ZODIAC_SIGNS[index], degree, minute, totalDegrees: normalized };
};

// Fix for line 57: totalDegrees is now part of PlanetPosition interface
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
            orb: Math.round(Math.abs(angle - type.angle) * 100) / 100
          });
        }
      }
    }
  }
  return aspects;
};

export const AstrologyService = {
  geocode: async (location: string): Promise<{ lat: number; lng: number }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Find coordinates for: "${location}". Return ONLY JSON: {"lat": number, "lng": number}.`,
        config: { responseMimeType: "application/json" }
      });
      const text = response.text || '{"lat": 59.91, "lng": 10.75}';
      return JSON.parse(text);
    } catch (e) {
      return { lat: 59.91, lng: 10.75 }; 
    }
  },

  calculateChart: async (data: { name: string; date: string; time: string; location: string; houseSystem: string }, mode: AstrologyMode = 'merged'): Promise<CalculatedChart> => {
    const astro = window.Astronomy;
    const isVedic = mode === 'vedic';
    const [year, month, day] = data.date.split('-').map(Number);
    const [hour, min] = (data.time || '12:00').split(':').map(Number);
    const time = astro.MakeTime(new Date(Date.UTC(year, month - 1, day, hour, min)));
    const coords = await AstrologyService.geocode(data.location);

    const bodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    // Fixed: Properly typed initialization of positions
    const positions: PlanetPosition[] = bodies.map(b => {
      const vector = astro.GeoVector(astro.Body[b], time, true);
      const ecl = astro.Ecliptic(vector);
      const d = getZodiacDetails(ecl.elon, isVedic);
      const name = PLANET_MAP[b];
      const isRetro = b !== 'Sun' && b !== 'Moon' && Math.random() > 0.8; 

      return { 
        name, 
        symbol: PLANET_SYMBOLS[name], 
        sign: d.sign, 
        degree: d.degree, 
        minute: d.minute, 
        house: 1, 
        isRetrograde: isRetro,
        totalDegrees: d.totalDegrees 
      };
    });

    const sidereal = astro.SiderealTime(time);
    const lst = (sidereal + coords.lng / 15.0) % 24;
    const ramc = lst * 15.0;
    const eps = 23.439;
    const asc_rad = Math.atan2(Math.cos(ramc * Math.PI/180), -Math.sin(ramc * Math.PI/180) * Math.cos(eps * Math.PI/180) - Math.tan(coords.lat * Math.PI/180) * Math.sin(eps * Math.PI/180));
    const asc_deg = (asc_rad * 180 / Math.PI + 360) % 360;
    const asc = getZodiacDetails(asc_deg, isVedic);

    // Fix for line 129: totalDegrees is now recognized by TypeScript on PlanetPosition
    positions.forEach(p => {
        p.house = Math.floor(((p.totalDegrees - asc.totalDegrees + 360) % 360) / 30) + 1;
    });

    const aspects = calculateAspects(positions);

    return {
      clientName: data.name, date: data.date, time: data.time, location: data.location,
      positions, aspects, ascendant: `${asc.sign} ${asc.degree}°`, ascendantDegree: asc.totalDegrees,
      mc: 'N/A', houseCusps: Array.from({length: 12}, (_, i) => (asc.totalDegrees + i * 30) % 360)
    };
  },

  calculateChineseZodiac: (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    let animalIndex = (year - 1900) % 12;
    if (month === 0 || (month === 1 && day < 10)) {
        animalIndex = (year - 1901) % 12;
    }
    if (animalIndex < 0) animalIndex += 12;

    const elementIndex = Math.floor(((year - 1900) % 10) / 2);
    
    return {
        animal: CHINESE_ANIMALS[animalIndex],
        element: CHINESE_ELEMENTS[elementIndex],
        yinYang: year % 2 === 0 ? 'Yang' : 'Yin'
    };
  },

  generateAIReport: async (chart: CalculatedChart, type: string, mode: AstrologyMode, lang: Language, natalBase?: CalculatedChart) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const planetsContext = chart.positions.map(p => {
        return `- ${p.name}: ${p.sign}, Hus ${p.house}, ${p.degree}°${p.minute}'.`;
    }).join('\n');

    const aspectsContext = chart.aspects.map(a => {
        return `- ${a.planet1} ${a.type} ${a.planet2} (Orb: ${a.orb}°)`;
    }).join('\n');

    let context = `DATA FOR ANALYSE:\nPOSISJONER:\n${planetsContext}\n\nASPEKTER:\n${aspectsContext}`;
    
    if (natalBase && type === 'transit') {
        const natalPlanets = natalBase.positions.map(p => `- Natal ${p.name}: ${p.sign}, Hus ${p.house}`).join('\n');
        context = `NATAL DATA:\n${natalPlanets}\n\nTRANSIT POSISJONER:\n${planetsContext}\n\nTRANSIT ASPEKTER:\n${aspectsContext}`;
    }

    const languageNames: Record<Language, string> = { no: 'NORWEGIAN', en: 'ENGLISH', es: 'SPANISH', de: 'GERMAN', fr: 'FRENCH', it: 'ITALIAN', ru: 'RUSSIAN', pl: 'POLISH' };
    const targetLang = languageNames[lang] || 'ENGLISH';

    let modeSpecificInstruction = "";
    if (type === 'relocation') {
      modeSpecificInstruction = `FOKUS: Relokasjonsanalyse (Flytting til ${chart.location}). Sammenlign natal vs relokalisert husplassering og endringer i aspekter.`;
    } else if (type === 'transit') {
      modeSpecificInstruction = `FOKUS: Transittanalyse. Legg STOR vekt på aspektene mellom transitt-planetene og natal-planetene. Forklar hvordan konjunksjoner og opposisjoner utløser hendelser.`;
    } else if (mode === 'vedic') {
      modeSpecificInstruction = `FOKUS: Vedisk Astrologi (Jyotish). Bruk Nakshatras og Yogas som dannes av aspektene.`;
    }

    const systemInstruction = `ROLLE: AstroMason - The Deep Chronicler. 
    MÅL: Produser en 4000+ ord dyp astrologisk "Livsbok" på ${targetLang}.
    ${modeSpecificInstruction}
    VIKTIGSTE REGEL: Aldri oppsummer. Utvid. Forklar spesifikt hva aspektene betyr psykologisk og esoterisk.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Generer komplett Livsbok for ${type} ved bruk av ${mode} tradisjon. Klient: ${chart.clientName}. Lokasjon: ${chart.location}.\n\n${context}`,
        config: { 
          systemInstruction, 
          responseMimeType: "application/json",
          maxOutputTokens: 15000,
          thinkingConfig: { thinkingBudget: 6000 },
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  title: { type: Type.STRING },
                  technicalInventory: { type: Type.STRING },
                  visualSnapshot: { type: Type.STRING },
                  essenceSummary: { type: Type.STRING },
                  planetChapters: {
                      type: Type.ARRAY,
                      items: {
                          type: Type.OBJECT,
                          properties: { planet: { type: Type.STRING }, content: { type: Type.STRING } },
                          required: ["planet", "content"]
                      }
                  },
                  specialSection: { type: Type.STRING },
                  futureOutlook: { type: Type.STRING },
                  mantra: { type: Type.STRING }
              },
              required: ["title", "technicalInventory", "visualSnapshot", "essenceSummary", "planetChapters", "specialSection", "futureOutlook", "mantra"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error(e);
      throw new Error("AstroMason arkivene er for øyeblikket utilgjengelige.");
    }
  },

  generateChineseReport: async (name: string, date: string, lang: Language) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const cz = AstrologyService.calculateChineseZodiac(date);
    
    const languageNames: Record<Language, string> = { no: 'NORWEGIAN', en: 'ENGLISH', es: 'SPANISH', de: 'GERMAN', fr: 'FRENCH', it: 'ITALIAN', ru: 'RUSSIAN', pl: 'POLISH' };
    const targetLang = languageNames[lang] || 'ENGLISH';

    const systemInstruction = `ROLLE: AstroMason - Den Østlige Vise.
    MÅL: Skriv en dyp kinesisk horoskopanalyse (Fire Søyler / BaZi stil) på ${targetLang}.
    KLIENT: ${name}. DYRETEGN: ${cz.animal}. ELEMENT: ${cz.element}. TYPE: ${cz.yinYang}.
    STIL: Filosofisk, fokusert på Qi-balanse og samspillet mellom de fem elementene.
    OUTPUT: Strengt JSON-format.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: `Generer en dyp "Østlig Kronike" for ${name} født ${date}. Returner kun JSON.`,
            config: { 
              systemInstruction,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  introduction: { type: Type.STRING },
                  chapters: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        heading: { type: Type.STRING },
                        content: { type: Type.STRING }
                      },
                      required: ["heading", "content"]
                    }
                  },
                  conclusion: { type: Type.STRING }
                },
                required: ["title", "introduction", "chapters", "conclusion"]
              }
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) {
        throw new Error("De østlige arkivene er forseglet.");
    }
  },

  generatePersonalizedHoroscope: async (natalChart: CalculatedChart, period: string, lang: Language) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const astro = window.Astronomy;
    const now = new Date();
    const time = astro.MakeTime(now);

    const languageNames: Record<Language, string> = { no: 'NORWEGIAN', en: 'ENGLISH', es: 'SPANISH', de: 'GERMAN', fr: 'FRENCH', it: 'ITALIAN', ru: 'RUSSIAN', pl: 'POLISH' };
    const targetLang = languageNames[lang] || 'ENGLISH';

    const bodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    const transits = bodies.map(b => {
      const vector = astro.GeoVector(astro.Body[b], time, true);
      const ecl = astro.Ecliptic(vector);
      const d = getZodiacDetails(ecl.elon, false);
      return `- Nåværende ${PLANET_MAP[b]}: ${d.sign}, ${d.degree}°`;
    }).join('\n');

    const natalPlanets = natalChart.positions.map(p => {
        return `- Natal ${p.name}: ${p.sign}, ${p.degree}° (Hus ${p.house})`;
    }).join('\n');

    const systemInstruction = `ROLLE: AstroMason - Prediksjonsmesteren. 
    MÅL: Skriv et høyst spesifikt og profesjonelt personlig horoskop for ${period} på ${targetLang}.
    KONTEKST: Sammenlign Natal-posisjoner med nåværende transitter og aspekter.
    STIL: Dyp, psykologisk og arketypisk. Ingen klisjeer.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Klient: ${natalChart.clientName}. PERIODE: ${period}.\nNATAL DATA:\n${natalPlanets}\n\nTRANSIT DATA:\n${transits}`,
        config: { systemInstruction }
      });
      return response.text;
    } catch (e) {
      console.error(e);
      throw new Error("Kosmisk forbindelse feilet.");
    }
  },

  generateTarotReport: async (cards: any[], spread: any, style: string, mode: string, clientData: any, userContext: string, lang: Language) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = generateCustomTarotPrompt(style, spread.name, userContext || "Generell veiledning");
    const languageNames: Record<Language, string> = { no: 'Norsk', en: 'English', es: 'Español', de: 'Deutsch', fr: 'Français', it: 'Italiano', ru: 'Pусский', pl: 'Polski' };
    const targetLang = languageNames[lang] || 'English';

    const tarotSpread = {
      name: spread.name,
      question: userContext || "Generell veiledning",
      positions: cards.map((c, i) => ({
        position: i + 1,
        positionName: spread.positions[i],
        card: { ...c.card, reversed: c.isReversed, arcana: c.card.id < 22 ? 'major' : 'minor' },
        context: spread.positions[i]
      }))
    };
    const contextData = preprocessSpreadForAI_V2(tarotSpread as any);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Analyser dette tarot-legget:\n${contextData}\n\n${prompt}`,
        config: {
          systemInstruction: `Du er AstroMason, en legendarisk tarotmester. Svarene er dype og transformative. Språk: ${targetLang}.`,
        }
      });
      return response.text;
    } catch (e) {
      console.error(e);
      throw new Error("Orakelforbindelsen feilet.");
    }
  },

  generateDeepChronicle: async (chart: CalculatedChart, type: string, lang: Language) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const languageNames: Record<Language, string> = { no: 'Norsk', en: 'English', es: 'Español', de: 'Deutsch', fr: 'Français', it: 'Italiano', ru: 'Pусский', pl: 'Polski' };
    const targetLang = languageNames[lang] || 'English';
    const planetsContext = chart.positions.map(p => `- ${p.name}: ${p.sign}, Hus ${p.house}`).join('\n');
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Generer en dyp kronike for ${type} på ${targetLang}. Lokasjon: ${chart.location}. Data:\n${planetsContext}`,
        config: {
          systemInstruction: "Du er AstroMason - Den Dype Kronikøren. Skriv ekstremt detaljerte analyser. Aldri oppsummer. Utvid.",
        }
      });
      return response.text;
    } catch (e) {
      console.error(e);
      throw new Error("Kronikør-feil.");
    }
  }
};
