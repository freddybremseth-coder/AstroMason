
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

export const cleanAstroText = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/\*\*/g, "")
    .replace(/##/g, "")
    .replace(/###/g, "")
    .replace(/\*/g, "•")
    .replace(/_/g, "")
    .trim();
};

export const AstrologyService = {
  geocode: async (location: string): Promise<{ lat: number; lng: number }> => {
    if (!location) return { lat: 59.91, lng: 10.75 };
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

  calculateChart: async (data: { name: string; date: string; time: string; location: string; houseSystem: string }, mode: AstrologyMode = 'merged', existingCoords?: { lat: number; lng: number }): Promise<CalculatedChart> => {
    const astro = window.Astronomy;
    const isVedic = mode === 'vedic';
    const [year, month, day] = data.date.split('-').map(Number);
    const [hour, min] = (data.time || '12:00').split(':').map(Number);
    const time = astro.MakeTime(new Date(Date.UTC(year, month - 1, day, hour, min)));
    
    const coords = existingCoords || await AstrologyService.geocode(data.location);

    const bodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    const positions: PlanetPosition[] = bodies.map(b => {
      const vector = astro.GeoVector(astro.Body[b], time, true);
      const ecl = astro.Ecliptic(vector);
      const d = getZodiacDetails(ecl.elon, isVedic);
      const name = PLANET_MAP[b];
      return { 
        name, 
        symbol: PLANET_SYMBOLS[name], 
        sign: d.sign, 
        degree: d.degree, 
        minute: d.minute, 
        house: 1, 
        isRetrograde: false, // Simplification
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

    positions.forEach(p => {
        p.house = Math.floor(((p.totalDegrees - asc.totalDegrees + 360) % 360) / 30) + 1;
    });

    const aspects = calculateAspects(positions);

    return {
      clientName: data.name, date: data.date, time: data.time, location: data.location,
      coords, positions, aspects, ascendant: `${asc.sign} ${asc.degree}°`, ascendantDegree: asc.totalDegrees,
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
    const planetsContext = chart.positions.map(p => `- ${p.name}: ${p.sign}, Hus ${p.house}`).join('\n');
    const aspectsContext = chart.aspects.map(a => `- ${a.planet1} ${a.type} ${a.planet2}`).join('\n');
    let context = `DATA FOR ANALYSE:\nPOSISJONER:\n${planetsContext}\n\nASPEKTER:\n${aspectsContext}`;
    
    const languageNames: Record<Language, string> = { no: 'NORWEGIAN', en: 'ENGLISH', es: 'SPANISH', de: 'GERMAN', fr: 'FRENCH', it: 'ITALIAN', ru: 'RUSSIAN', pl: 'POLISH' };
    const targetLang = languageNames[lang] || 'ENGLISH';

    const systemInstruction = `ROLLE: AstroMason - The Deep Chronicler. 
    MÅL: Produser en 4000+ ord dyp astrologisk "Livsbok" på ${targetLang}.
    REGEL: IKKE bruk Markdown-tegn som ** eller ##. Bruk store bokstaver for overskrifter.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Generer komplett Livsbok for ${type} ved bruk av ${mode} tradisjon. Klient: ${chart.clientName}.\n\n${context}`,
        config: { 
          systemInstruction, 
          responseMimeType: "application/json",
          maxOutputTokens: 15000,
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  title: { type: Type.STRING },
                  essenceSummary: { type: Type.STRING },
                  planetChapters: {
                      type: Type.ARRAY,
                      items: {
                          type: Type.OBJECT,
                          properties: { planet: { type: Type.STRING }, content: { type: Type.STRING } },
                          required: ["planet", "content"]
                      }
                  },
                  mantra: { type: Type.STRING }
              },
              required: ["title", "essenceSummary", "planetChapters", "mantra"]
          }
        }
      });
      const data = JSON.parse(response.text || '{}');
      data.title = cleanAstroText(data.title);
      data.essenceSummary = cleanAstroText(data.essenceSummary);
      data.planetChapters = data.planetChapters.map((c: any) => ({
          planet: cleanAstroText(c.planet),
          content: cleanAstroText(c.content)
      }));
      data.mantra = cleanAstroText(data.mantra);
      return data;
    } catch (e) {
      throw new Error("AstroMason arkivene er for øyeblikket utilgjengelige.");
    }
  },

  generateChineseReport: async (name: string, date: string, lang: Language) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const cz = AstrologyService.calculateChineseZodiac(date);
    const languageNames: Record<Language, string> = { no: 'NORWEGIAN', en: 'ENGLISH', es: 'SPANISH', de: 'GERMAN', fr: 'FRENCH', it: 'ITALIAN', ru: 'RUSSIAN', pl: 'POLISH' };
    const targetLang = languageNames[lang] || 'ENGLISH';
    const systemInstruction = `Den Østlige Vise. Skriv en dyp kinesisk horoskopanalyse på ${targetLang}. REGEL: IKKE bruk Markdown. KLIENT: ${name}. DYRETEGN: ${cz.animal}. ELEMENT: ${cz.element}.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: `Generer en dyp "Østlig Kronike" for ${name}.`,
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
                      properties: { heading: { type: Type.STRING }, content: { type: Type.STRING } },
                      required: ["heading", "content"]
                    }
                  },
                  conclusion: { type: Type.STRING }
                },
                required: ["title", "introduction", "chapters", "conclusion"]
              }
            }
        });
        const data = JSON.parse(response.text || '{}');
        data.title = cleanAstroText(data.title);
        data.introduction = cleanAstroText(data.introduction);
        data.chapters = data.chapters.map((c: any) => ({
            heading: cleanAstroText(c.heading), // Fixed variable name error
            content: cleanAstroText(c.content)
        }));
        data.conclusion = cleanAstroText(data.conclusion);
        return data;
    } catch (e) {
        throw new Error("De østlige arkivene er forseglet.");
    }
  },

  generateChineseYearlyCycle: async (name: string, date: string, lang: Language) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const cz = AstrologyService.calculateChineseZodiac(date);
    const languageNames: Record<Language, string> = { no: 'NORWEGIAN', en: 'ENGLISH', es: 'SPANISH', de: 'GERMAN', fr: 'FRENCH', it: 'ITALIAN', ru: 'RUSSIAN', pl: 'POLISH' };
    const targetLang = languageNames[lang] || 'ENGLISH';

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generer en 12-måneders sjelelig syklus for ${name} (Født: ${date}, Tegn: ${cz.animal}, Element: ${cz.element}) på ${targetLang}. For hver måned: Tema, Qi-nivå (1-10) og visdom.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              months: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    monthName: { type: Type.STRING },
                    theme: { type: Type.STRING },
                    qiLevel: { type: Type.NUMBER },
                    guidance: { type: Type.STRING }
                  },
                  required: ["monthName", "theme", "qiLevel", "guidance"]
                }
              }
            },
            required: ["months"]
          }
        }
      });
      return JSON.parse(response.text || '{"months": []}');
    } catch (e) {
      return { months: [] };
    }
  },

  generatePersonalizedHoroscope: async (natalChart: CalculatedChart, period: string, lang: Language) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const languageNames: Record<Language, string> = { no: 'NORWEGIAN', en: 'ENGLISH', es: 'SPANISH', de: 'GERMAN', fr: 'FRENCH', it: 'ITALIAN', ru: 'RUSSIAN', pl: 'POLISH' };
    const targetLang = languageNames[lang] || 'ENGLISH';

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Skriv et personlig horoskop for ${natalChart.clientName} for perioden ${period} på ${targetLang}.`,
        config: { systemInstruction: `Du er AstroMason. Ingen Markdown (**).` }
      });
      return cleanAstroText(response.text);
    } catch (e) {
      throw new Error("Kosmisk forbindelse feilet.");
    }
  },

  generateWeeklyTransitDeepDive: async (natalChart: CalculatedChart, lang: Language) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const languageNames: Record<Language, string> = { no: 'NORWEGIAN', en: 'ENGLISH', es: 'SPANISH', de: 'GERMAN', fr: 'FRENCH', it: 'ITALIAN', ru: 'RUSSIAN', pl: 'POLISH' };
    const targetLang = languageNames[lang] || 'ENGLISH';

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Analyser ukens transitter for ${natalChart.clientName} på ${targetLang}.`,
        config: { systemInstruction: "AstroMason Deep Dive. Ingen Markdown." }
      });
      return cleanAstroText(response.text);
    } catch (e) {
      throw new Error("Feil ved henting av data.");
    }
  },

  generateTarotReport: async (cards: any[], spread: any, style: string, mode: string, clientData: any, userContext: string, lang: Language) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = generateCustomTarotPrompt(style, spread.name, userContext || "Generell veiledning");
    const targetLang = lang === 'no' ? 'Norsk' : 'English';

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Analyser dette tarot-legget for ${clientData.clientName}.`,
        config: { systemInstruction: `AstroMason Tarotmester. Språk: ${targetLang}. Ingen Markdown.` }
      });
      return cleanAstroText(response.text);
    } catch (e) {
      throw new Error("Orakelforbindelsen feilet.");
    }
  },

  generateDeepChronicle: async (chart: CalculatedChart, type: string, lang: Language) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const targetLang = lang === 'no' ? 'Norsk' : 'English';
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Generer en dyp kronike for ${type} på ${targetLang}.`,
        config: { systemInstruction: "AstroMason Chronicler. Ingen Markdown." }
      });
      return cleanAstroText(response.text);
    } catch (e) {
      throw new Error("Kronikør-feil.");
    }
  }
};
