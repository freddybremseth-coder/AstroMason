import { CalculatedChart, PlanetPosition, Aspect, RulershipDetail, AnalysisReport } from '../types';
import { supabase } from '../lib/supabase';
import { AUTHORS, ASTRO_KNOWLEDGE_BASE, MAJOR_ARCANA, ELEMENTAL_RELATIONSHIPS } from '../constants';
import { 
    TarotSpread, 
    TarotCard, 
    preprocessSpreadForAI_V2, 
    analyzeSpreadPatterns, 
    analyzeCardInteractions, 
    identifyStoryArc,
    generateCustomTarotPrompt
} from './tarot-ai-system';

// Declaration for the external library loaded in index.html
declare const Astronomy: any;

const ZODIAC_SIGNS = [
  'Væren', 'Tyren', 'Tvillingene', 'Krepsen', 'Løven', 'Jomfruen',
  'Vekten', 'Skorpionen', 'Skytten', 'Steinbukken', 'Vannmannen', 'Fiskene'
];

const PLANET_NAMES: Record<string, string> = {
  'Sun': 'Solen', 'Moon': 'Månen', 'Mercury': 'Merkur', 'Venus': 'Venus',
  'Mars': 'Mars', 'Jupiter': 'Jupiter', 'Saturn': 'Saturn', 'Uranus': 'Uranus',
  'Neptune': 'Neptun', 'Pluto': 'Pluto', 'Mean Node': 'Nordnoden'
};

const getZodiacPosition = (longitude: number) => {
  if (typeof longitude !== 'number' || isNaN(longitude)) {
      return { sign: 'Væren', degree: 0, minute: 0, absoluteDegree: 0, signIndex: 0 };
  }
  
  let normalized = longitude % 360;
  if (normalized < 0) normalized += 360;
  const signIndex = Math.floor(normalized / 30);
  const degree = Math.floor(normalized % 30);
  const minute = Math.floor((normalized % 30 - degree) * 60);
  const signName = ZODIAC_SIGNS[signIndex] || 'Væren';
  
  return { sign: signName, degree, minute, absoluteDegree: normalized, signIndex };
};

const calculateAspects = (positions: PlanetPosition[]): Aspect[] => {
  const aspects: Aspect[] = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const p1 = positions[i];
      const p2 = positions[j];
      const signIndex1 = ZODIAC_SIGNS.indexOf(p1.sign);
      const signIndex2 = ZODIAC_SIGNS.indexOf(p2.sign);
      if (signIndex1 === -1 || signIndex2 === -1) continue;

      const abs1 = (signIndex1 * 30) + p1.degree;
      const abs2 = (signIndex2 * 30) + p2.degree;
      let diff = Math.abs(abs1 - abs2);
      if (diff > 180) diff = 360 - diff;

      let type = '';
      const orbLimit = 8; 
      if (diff <= 8) type = 'Konjunksjon';
      else if (Math.abs(diff - 60) <= orbLimit) type = 'Sekstil';
      else if (Math.abs(diff - 90) <= orbLimit) type = 'Kvadrat';
      else if (Math.abs(diff - 120) <= orbLimit) type = 'Trigon';
      else if (Math.abs(diff - 180) <= orbLimit) type = 'Opposisjon';

      if (type) {
        aspects.push({
          planet1: p1.name,
          planet2: p2.name,
          type,
          orb: `${Math.abs(diff - (type === 'Konjunksjon' ? 0 : type === 'Sekstil' ? 60 : type === 'Kvadrat' ? 90 : type === 'Trigon' ? 120 : 180)).toFixed(1)}°`
        });
      }
    }
  }
  return aspects;
};

// Pseudorandom generator based on string seed
const seededRandom = (seed: string) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return ((h >>> 0) / 4294967296);
}

const calculateChartLocal = (data: { name: string; date: string; time: string; location: string; houseSystem: string }): CalculatedChart => {
    const dateTimeStr = `${data.date}T${data.time}`;
    const dateObj = new Date(dateTimeStr);
    const seed = data.date + data.time;
    const positions: PlanetPosition[] = [];
    const bodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    let sunAbsDeg = 0;
    
    const epoch = new Date("2000-01-01T12:00:00Z").getTime();
    
    bodies.forEach(body => {
      let degree = seededRandom(seed + body) * 360;
      let isRetrograde = false;
      const zodiac = getZodiacPosition(degree);
      if (body === 'Sun') sunAbsDeg = degree;
      positions.push({
            name: PLANET_NAMES[body] || body,
            sign: zodiac.sign,
            degree: zodiac.degree,
            minute: zodiac.minute,
            house: 1, 
            isRetrograde
      });
    });

    const hoursSinceSunrise = (dateObj.getHours() - 6);
    const ascDeg = (sunAbsDeg + (hoursSinceSunrise * 15)) % 360;
    const mcDeg = (ascDeg - 90 + 360) % 360;
    const ascZodiac = getZodiacPosition(ascDeg);
    const mcZodiac = getZodiacPosition(mcDeg);

    positions.forEach(p => {
        const signDiff = (ZODIAC_SIGNS.indexOf(p.sign) - ZODIAC_SIGNS.indexOf(ascZodiac.sign) + 12) % 12;
        p.house = signDiff + 1;
    });

    const aspects = calculateAspects(positions);
    
    return {
      clientName: data.name || 'Klient',
      date: data.date,
      time: data.time,
      location: data.location,
      positions: positions,
      aspects: aspects,
      ascendant: `${ascZodiac.sign} (${ascZodiac.degree}°)`,
      mc: `${mcZodiac.sign} (${mcZodiac.degree}°)`,
      report: {
        elementalBalance: { fire: 0, earth: 0, air: 0, water: 0 }, 
        modalBalance: { cardinal: 0, fixed: 0, mutable: 0 }, 
        dignities: [],
        interpretations: [],
        rays: undefined,
        rulerships: []
      }
    };
};

export const AstrologyService = {
  
  calculateChart: async (data: { name: string; date: string; time: string; location: string; houseSystem: string }): Promise<CalculatedChart> => {
    return calculateChartLocal(data);
  },

  // --- ASTRO MASON AI REPORT GENERATOR (V2 - THE DEEP WRITER) ---
  
  generateAIReport: async (chartData: CalculatedChart, type: 'natal' | 'transit' | 'synastry' | 'esoteric' | 'karma', context?: { date: string, location: string, focusArea?: string, depth?: string }): Promise<any> => {
      
      const depth = context?.depth || 'medium';
      
      // Calculate data for the "System Prompt"
      const sunPos = chartData.positions.find(p => p.name === 'Solen');
      const moonPos = chartData.positions.find(p => p.name === 'Månen');
      const ascSign = chartData.ascendant.split(' ')[0];
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate thinking time

      // Structured data return for UI consumption
      const reportData = {
         type: 'astro',
         title: depth === 'long' ? "Livsboken: Din Store Reise" : depth === 'medium' ? "Årshoroskop 2024-2025" : "Kjerneanalyse",
         essence: `En kriger med et dikterhjerte. Du bærer en sjelden dualitet mellom det kompromissløse (${ascSign}) og det dypt sensitive (${moonPos?.sign}).`,
         dignities: [
            { type: 'flow', text: 'Luft & Vann dominerer: Du navigerer verden gjennom tanker og intuisjon.' },
            { type: 'conflict', text: 'Mangel på Ild: Du må bevisst skape din egen drivkraft.' }
         ],
         chapters: [] as any[], 
         timeline: [] as any[], 
         narrative: '',
         advice: "Bruk Jomfruens presisjon til å gi form til Fiskenes drømmer.",
         mantra: "Jeg er arkitekten av min egen ild."
      };

      if (depth === 'long') {
         // THE DEEP WRITER - 3000+ Words Simulation
         reportData.chapters = [
            {
               title: "Prolog: Sjelens Kontrakt",
               content: `Vi starter med det uforanderlige fundamentet i ditt liv. Din sjel valgte en Ascendant i ${ascSign}, ikke fordi det er den enkleste veien, men fordi du er her for å lære om dens unike styrke. Men Solen i ${sunPos?.sign} forteller en annen historie – om et dyptgripende behov for å skinne på en annen måte.\n\nHele livet ditt er en dans mellom disse to polene: Masken du viser verden (${ascSign}), og kjernen du beskytter (${sunPos?.sign}). Denne indre spenningen er ikke en feil i systemet; det er selve motoren i din utvikling. Uten Ascendantens energi ville du mistet evnen til å navigere i det ytre, men uten Solen ville du mistet kontakten med hvem du egentlig er. Sjelens kontrakt handler om å forene disse motsetningene til en helhet.`
            },
            {
               title: "Kapittel 1: Solens Reise & Identitet",
               content: `Solen din, plassert i ${sunPos?.sign}, indikerer at din identitet er uløselig knyttet til dette tegnets kvaliteter. Dette er hjertet i ditt horoskop, kilden til din vitalitet og bevissthet.\n\nMen med Mars, din handlingsplanet, plassert i et annet tegn, er det en underliggende strøm av kompleksitet som driver deg. Du nøyer deg ikke med det overfladiske; du søker en dypere mening i alt du gjør. Når Solen din aktiveres av transitter, føler du en dyp dragning mot å realisere ditt sanne potensial, ofte gjennom kreative eller ledelsesmessige roller. Utfordringen ligger i å ikke la andres forventninger skygge for ditt eget lys.`
            },
            {
               title: "Kapittel 2: Månens Dyp (Det Emosjonelle Landskapet)",
               content: `Månen i ${moonPos?.sign} avslører ditt innerste behov for trygghet og næring. Dette er din emosjonelle "bunker", stedet du trekker deg tilbake til når verden blir for overveldende.\n\nDenne plasseringen gir deg en intuitiv forståelse av omgivelsene, men kan også gjøre deg sårbar for svingninger i stemningen. Din mor-arketyp og din barndom preges av denne energien. Å forstå Månen din er nøkkelen til å mestre dine reaksjonsmønstre. I stedet for å reagere blindt på følelser, kan du lære å bruke dem som et kompass som viser deg hva som er i ubalanse i livet ditt.`
            },
            {
               title: "Kapittel 3: Skyggesiden (Pluto & Chiron)",
               content: "Ingen lys uten mørke. Din Chiron i 3. hus indikerer et sår knyttet til kommunikasjon og tidlig læring. Kanskje følte du deg ikke hørt som barn, eller kanskje ble dine ord misforstått. Men dette såret er din største gave: Du har en unik evne til å lytte til det usagte hos andre. Du hører ikke bare hva folk sier, men hva de *ikke* sier. Samtidig står Pluto i opposisjon til din Mars, noe som antyder perioder med intens maktkamp, enten med autoriteter eller med din egen indre kritiker. Nøkkelen her er å eie din egen skyggekraft. Når du tør å være 'ubehagelig' ærlig, mister skyggen sin makt over deg."
            },
            {
                title: "Kapittel 4: De Store Syklusene (Progresjoner)",
                content: "Livet beveger seg i bølger, og vi ser nå på dine 'Sekundære Progresjoner'. Din progressive Måne har nylig skiftet tegn. Dette markerer starten på en 2,5 års periode med ny emosjonell fargelegging. Det er ikke tiden for overfladiskhet, men for dybde. Du vil kanskje føle et behov for å trekke deg tilbake, for å utforske de mørkere krokene av psyken din, eller for å fordype deg i esoteriske emner. Dette er en 'vinter' i sjelen – men husk at det er under vinteren at røttene vokser seg sterkest."
            },
            {
                title: "Kapittel 5: Saturns Mesterlære & Fremtiden",
                content: "Saturn beveger seg nå gjennom et kritisk område i kartet ditt. Dette er en av de mest misforståtte transittene i astrologien. Mange frykter begrensning, men dette er egentlig en tid for å bygge varige strukturer. Gamle systemer som ikke lenger tjener deg, vil oppløses. Du kan føle at ting du pleide å stole på (karriere, status, ytre bekreftelse) mister sin betydning. Dette er Saturns måte å tvinge deg innover på. Oppgaven er å bygge en indre autoritet som ikke er avhengig av applaus. Når denne transitten er over, vil du stå stødigere enn noensinne."
            }
         ];
         reportData.timeline = [
             { year: '1990', title: 'Fødsel: Det Kosmiske Frøet', desc: `Solen i ${sunPos?.sign}, Måne i ${moonPos?.sign}. Et frø av potensial sås i jorden.`, major: true },
             { year: '2019', title: 'Saturn Return: Den Første Terskelen', desc: 'Saturn returnerer til fødselsposisjon. Livets første store eksamen. Strukturering av karriere og ansvar.', major: true },
             { year: '2024', title: 'Pluto inn i Vannmannen', desc: 'En total transformasjon av ditt sosiale nettverk og dine fremtidsvisjoner.', major: false },
             { year: '2026', title: 'Progressiv Fullmåne: Blomstring', desc: 'Et høydepunkt i livssyklusen. Det du startet for 14 år siden bærer nå frukt.', major: true },
             { year: '2032', title: 'Uranus Opposisjon: Midtlivs-oppvåkningen', desc: 'Den klassiske "40-årskrisen", men astrologisk sett en frigjøring.', major: true }
         ];
      } else {
           // Short/Medium Report
           reportData.narrative = `Det blåser en mild vind gjennom kartet ditt, ${chartData.clientName}. Med en sterk betoning av Luft (${sunPos?.sign}) og Vann (${moonPos?.sign}), er du en tenker og en føler. \n\nDu møter verden med ${ascSign}-energi. Folk ser deg som en leder, en som tar initiativ. Men bak denne masken skjuler det seg en sensitiv sjel som absorberer andres følelser som en svamp.\n\nSolen i ${sunPos?.sign} gir deg en naturlig diplomatisk evne, men du må passe deg for å ikke utslette dine egne behov for å holde freden. Månen i ${moonPos?.sign} indikerer at du trenger tid alene for å lade batteriene. Ikke undervurder dette behovet; det er ikke svakhet, det er nødvendig vedlikehold for din psyke.`;
      }

      return reportData;
  },

  // --- TAROT REPORT GENERATOR V2 (MASTER PROTOCOL) ---
  
  generateTarotReport: async (cards: any[], spread: any, styleId: string, themeId: string, client: CalculatedChart | null, contextStr: string): Promise<string> => {
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      return `## HISTORIEN OM DIN REISE

Dette er ikke bare tilfeldige kort - dette er en fortelling om overgang, ${client ? client.clientName : 'kjære vandrer'}.

### Akt 1 - Energien i Nået: ${cards[0].card.name}
Du står ved en terskel. ${cards[0].card.name} viser at du har samlet krefter, kanskje over lengre tid enn du selv er klar over. Det er en klar energi her – en vilje til å skape, til å bryte ut. Men det møter motstand i form av...

### Akt 2 - Utfordringen: ${cards[1].card.name}
Det er ikke omgivelsene som holder deg igjen, men din egen indre konflikt, speilet i ${cards[1].card.name}. Du venter på et tegn som allerede har kommet. Du analyserer følelsene dine i stedet for å føle dem. ${cards[1].card.isReversed ? 'Fordi kortet er reversert, tyder det på at denne blokkeringen er intern og selvpålagt.' : ''}

### Akt 3 - Veien Videre: ${cards[cards.length-1].card.name}
Kortene hvisker om ${cards[cards.length-1].card.name} i utfallet. Dette er løftet om klarhet og suksess. Men klarhet kommer ikke av å tenke mer – det kommer av å tørre å ta ett steg i blinde. Stol på at grunnen bærer deg.

### Konkrete Råd
1. **Stopp å analysere** (Utfordringen fra kort 2).
2. **Handle på impulsen** (Energien fra kort 1).
3. **Stol på prosessen** (Løftet fra kort 3).

Ikke tving frem svaret i dag. La det modnes. Det som vokser sakte, får dype røtter.`;
  }
};