
import { Author, MethodologyType, Resource, Course } from './types';

export const UI_TRANSLATIONS: Record<string, any> = {
  no: {
    navDashboard: 'Dashboard',
    navProfile: 'Sjelssenter',
    navAstrology: 'Astrologi',
    navNumerology: 'Numerologi',
    navTarot: 'Tarot',
    navHoroscope: 'Horoskop',
    navChineseAstrology: 'Kinesisk',
    navSettings: 'Innstillinger',
    navLogout: 'Logg ut',
    welcomeBack: 'Velkommen tilbake til arkivene',
    soulOverview: 'Sjelens Oversikt',
    dailyEnergy: 'Dagens Energi',
    emotionalWave: 'Følelsesmessig Bølge',
    cosmicWeather: 'Kosmisk Vær',
    startJourney: 'Start Min Kronike',
    natalTitle: 'Ditt Opprinnelige Kart',
    relocationTitle: 'Flytting',
    transitTitle: 'Transitter',
    vedicTitle: 'Vedic',
    esotericTitle: 'Esoterisk',
    classicalTitle: 'Klassisk',
    modernTitle: 'Moderne',
    writeBook: 'Skriv Min Livsbok',
    archiveReport: 'Arkiver Rapport',
    printReport: 'Skriv ut Rapport',
    languageName: 'Norsk',
    periodDay: 'I dag',
    periodWeek: 'Denne uken',
    periodMonth: 'Denne måneden',
    periodYear: 'Hele året',
    horoscopeTitle: 'Ditt Personlige Horoskop',
    horoscopeSubtitle: 'Basert på sjelens transitter',
    chineseTitle: 'Kinesisk Horoskop',
    chineseSubtitle: 'De fire søyler og elementenes balanse',
    traditionLabel: 'Tradisjon',
    analysisLabel: 'Analyse',
    saveProfileBtn: 'Oppdater Sjelsprofil',
    saveSuccess: 'Data er trygt arkivert i din sjelsprofil',
    nameLabel: 'Navn for Vibrasjon',
    birthDateLabel: 'Fødselsdato',
    birthTimeLabel: 'Klokkeslett',
    birthLocationLabel: 'Fødested',
    houseSystemLabel: 'Foretrukket Hussystem',
    apiKeysTitle: 'Personlige Arkivnøkler',
    apiKeysDesc: 'Disse nøklene brukes for å åpne de dype AI-analysene.',
    appearanceTitle: 'App-utseende',
    lightMode: 'Lys',
    darkMode: 'Mørk',
    archiveTitle: 'Mine Lagrede Innsikter',
    noArchiveDesc: 'Ditt arkiv venter på sin første historie...',
    readInsight: 'Les Innsikt',
    backToArchive: 'Tilbake til Arkivet',
    technicalInventory: 'Teknisk Inventar',
    transformationCycles: 'Transformasjon & Sykluser',
    powerMantraLabel: 'Ditt Makt-Mantra',
    landing: {
      heroTitle: 'Din Sjels',
      heroSubtitle: 'Kronike',
      heroDesc: 'Gå forbi overfladiske horoskop. Astro Mason dechiffrerer din sjel gjennom esoterisk astrologi, dyp tarot og hellig numerologi.',
      startBtn: 'Start Reisen',
      createArchive: 'Opprett ditt Arkiv',
      login: 'Logg inn',
      investmentTitle: 'Sjelelig Investering',
      investmentDesc: 'Velg din vei til selvinnsikt',
      singleTitle: 'Enkeltreise',
      singlePrice: '€14',
      singleUnit: '/ rapport',
      singleDesc: 'Perfekt for et dypdykk i din nåværende situasjon eller et spesifikt spørsmål.',
      singleFeatures: ['Komplett "Livsbok" (4000+ ord)', 'Dyp personlig analyse', 'Evig tilgang til rapport'],
      masterTitle: 'Mester-medlemskap',
      masterPrice: '€49',
      masterUnit: '/ år',
      masterDesc: 'Full og ubegrenset tilgang til alle arkiver, tarot-legg og numerologiske koder.',
      masterFeatures: ['Ubegrenset Astro-rapporter', 'Full tilgang til Tarot-modul', 'Alle numerologiske koder', 'Personlig innsiktshub'],
      bestValue: 'Beste Verdi',
      selectPlan: 'Velg denne',
      selectMaster: 'Velg Mester-veien',
      authTitleLogin: 'Velkommen Tilbake',
      authTitleReg: 'Opprett Sjelsprofil',
      authDesc: 'Gå inn i de dype arkivene',
      emailLabel: 'E-postadresse',
      passLabel: 'Passord',
      loginBtn: 'Logg inn',
      regBtn: 'Registrer Bruker',
      noAccount: 'Har du ikke konto?',
      hasAccount: 'Har du allerede konto?',
      clickHere: 'Klikk her'
    }
  }
};

export const ASTRO_KNOWLEDGE_BASE: Record<string, string> = {
    'Væren': 'Keiseren (Struktur, lederskap, initiativ)',
    'Tyren': 'Hierofanten (Tradisjon, verdier, stabilitet)',
    'Tvillingene': 'De Elskende (Valg, dualitet, kommunikasjon)',
    'Krepsen': 'Vognen (Beskyttelse, vilje, emosjonell kontroll)',
    'Løven': 'Styrke (Indre kraft, mot, lidenskap)',
    'Jomfruen': 'Eneboeren (Analyse, introspeksjon, detaljer)',
    'Vekten': 'Rettferdighet (Balanse, karma, sannhet)',
    'Skorpionen': 'Døden (Transformasjon, slippe taket, fornyelse)',
    'Skytten': 'Måtehold (Syntese, visjon, høyere mening)',
    'Steinbukken': 'Djevelen (Materialisme, ambisjon, grenser)',
    'Vannmannen': 'Stjernen (Håp, humanitær visjon, fremtid)',
    'Fiskene': 'Månen (Illusjon, drømmer, underbevissthet)',
    'Ild': 'Inspirasjon, handling, vilje (Wands)',
    'Jord': 'Manifestasjon, krop, ressurser (Pentacles)',
    'Luft': 'Tanke, kommunikasjon, konflikt (Swords)',
    'Vann': 'Følelser, relasjoner, intuisjon (Cups)'
};

export const ELEMENTAL_RELATIONSHIPS: Record<string, Record<string, string>> = {
  'Ild': { 'Ild': 'Nøytral', 'Luft': 'Vennlig (Nærer)', 'Jord': 'Nøytral', 'Vann': 'Fiendtlig (Slukker)' },
  'Luft': { 'Ild': 'Vennlig (Nærer)', 'Luft': 'Nøytral', 'Jord': 'Fiendtlig (Konflikt)', 'Vann': 'Nøytral' },
  'Jord': { 'Ild': 'Nøytral', 'Luft': 'Fiendtlig (Konflikt)', 'Jord': 'Nøytral', 'Vann': 'Vennlig (Nærer)' },
  'Vann': { 'Ild': 'Fiendtlig (Slukker)', 'Luft': 'Nøytral', 'Jord': 'Vennlig (Nærer)', 'Vann': 'Nøytral' }
};

export const MAJOR_ARCANA = [
    { id: 0, number: 0, name: 'Narren', desc: 'Ny begynnelse, uskyld, spontanitet, fri ånd.', keywords: ['Frihet', 'Risiko', 'Start'], element: 'Luft', planet: 'Uranus', img: 'https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg' },
    { id: 1, number: 1, name: 'Magikeren', desc: 'Manifestasjon, ressurssterkhet, kraft, inspirert handling.', keywords: ['Kraft', 'Handling', 'Evne'], element: 'Luft', planet: 'Merkur', img: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg' },
    { id: 2, number: 2, name: 'Yppersteprestinnen', desc: 'Intuisjon, hellig kunnskap, det guddommelige feminine.', keywords: ['Intuisjon', 'Mysterium', 'Stillhet'], element: 'Vann', planet: 'Månen', img: 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg' },
    { id: 3, number: 3, name: 'Keiserinnen', desc: 'Fruktbarhet, femininitet, skjønnhet, natur, overflod.', keywords: ['Fruktbarhet', 'Natur', 'Omsorg'], element: 'Jord', planet: 'Venus', img: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg' },
    { id: 4, number: 4, name: 'Keiseren', desc: 'Autoritet, etablering, struktur, en farsfigur.', keywords: ['Struktur', 'Autoritet', 'Stabilitet'], element: 'Ild', planet: 'Mars', img: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg' },
    { id: 5, number: 5, name: 'Hierofanten', desc: 'Spirituell visdom, religion, gruppeidentitet, tradisjon.', keywords: ['Tradisjon', 'Læring', 'Tro'], element: 'Jord', planet: 'Tyren', img: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg' },
    { id: 6, number: 6, name: 'De Elskende', desc: 'Kjærlighet, harmoni, relasjoner, verdivalg.', keywords: ['Valg', 'Kjærlighet', 'Harmoni'], element: 'Luft', planet: 'Tvillingene', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/TheLovers.jpg' },
    { id: 7, number: 7, name: 'Vognen', desc: 'Kontroll, viljestyrke, seier, pågangsmot.', keywords: ['Vilje', 'Seier', 'Reise'], element: 'Vann', planet: 'Krepsen', img: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg' },
    { id: 8, number: 8, name: 'Styrke', desc: 'Styrke, mot, overtalelse, innflytelse, medfølelse.', keywords: ['Mot', 'Tålmodighet', 'Kontroll'], element: 'Ild', planet: 'Løven', img: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg' },
    { id: 9, number: 9, name: 'Eneboeren', desc: 'Sjelesøking, introspeksjon, å være alene, indre veiledning.', keywords: ['Ensomhet', 'Søken', 'Visdom'], element: 'Jord', planet: 'Jomfruen', img: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg' },
    { id: 10, number: 10, name: 'Lykkehjulet', desc: 'Lykke, karma, livssykluser, skjebne, et vendepunkt.', keywords: ['Skjebne', 'Endring', 'Syklus'], element: 'Ild', planet: 'Jupiter', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg' },
    { id: 11, number: 11, name: 'Rettferdighet', desc: 'Rettferdighet, sannhet, årsak og virkning, lov.', keywords: ['Sannhet', 'Balanse', 'Lov'], element: 'Luft', planet: 'Vekten', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg' },
    { id: 12, number: 12, name: 'Den Hengte Mann', desc: 'Pause, overgivelse, gi slipp, nye perspektiver.', keywords: ['Offer', 'Pause', 'Perspektiv'], element: 'Vann', planet: 'Neptun', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg' },
    { id: 13, number: 13, name: 'Døden', desc: 'Slutt, overgang, eliminering, forandring.', keywords: ['Slutt', 'Transformasjon', 'Ny start'], element: 'Vann', planet: 'Skorpionen', img: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg' },
    { id: 14, number: 14, name: 'Måtehold', desc: 'Balanse, moderasjon, tålmodighet, formål.', keywords: ['Balanse', 'Alkymi', 'Måtehold'], element: 'Ild', planet: 'Skytten', img: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg' },
    { id: 15, number: 15, name: 'Djevelen', desc: 'Skyggesider, avhengighet, begrensning, seksualitet.', keywords: ['Avhengighet', 'Materialisme', 'Lyst'], element: 'Jord', planet: 'Steinbukken', img: 'https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg' },
    { id: 16, number: 16, name: 'Tårnet', desc: 'Plutselig forandring, omveltning, kaos, åpenbaring.', keywords: ['Kaos', 'Ødeleggelse', 'Åpenbaring'], element: 'Ild', planet: 'Mars', img: 'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg' },
    { id: 17, number: 17, name: 'Stjernen', desc: 'Håp, tro, hensikt, fornyelse, spiritualitet.', keywords: ['Håp', 'Inspirasjon', 'Ro'], element: 'Luft', planet: 'Vannmannen', img: 'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg' },
    { id: 18, number: 18, name: 'Månen', desc: 'Illusjon, frykt, angst, underbevissthet, intuisjon.', keywords: ['Illusjon', 'Drømmer', 'Underbevissthet'], element: 'Vann', planet: 'Fiskene', img: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg' },
    { id: 19, number: 19, name: 'Solen', desc: 'Positivitet, moro, varme, suksess, vitalitet.', keywords: ['Glede', 'Suksess', 'Vitalitet'], element: 'Ild', planet: 'Solen', img: 'https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg' },
    { id: 20, number: 20, name: 'Dommen', desc: 'Dom, gjenfødelse, indre kall, tilgivelse.', keywords: ['Dom', 'Kall', 'Oppvåkning'], element: 'Ild', planet: 'Pluto', img: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg' },
    { id: 21, number: 21, name: 'Verden', desc: 'Fullføring, integrasjon, oppnåelse, reise.', keywords: ['Fullføring', 'Helhet', 'Reise'], element: 'Jord', planet: 'Saturn', img: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg' }
];

export const METHODOLOGY_DESCRIPTIONS: Record<MethodologyType, string> = {
  [MethodologyType.WESTERN_CLASSICAL]: 'Basert på Ptolemaios og middelalderens tradisjoner. Fokuserer på skjebne, styrkeforhold mellom planeter og konkrete spådommer.',
  [MethodologyType.HELLENISTIC]: 'Den opprinnelige horoskop-astrologien (1. årh. f.Kr - 7. årh. e.Kr). Bruker "whole sign" hus og tids-herrer.',
  [MethodologyType.VEDIC]: 'Jyotish ("Lyset Vitenskap"). Bruker det sideriske dyrekretsen og nakshatras for presis timing og karma-analyse.',
  [MethodologyType.PSYCHOLOGICAL]: 'Integrerer Jungiansk dybdepsykologi. Fokuserer på arketyper, det ubevisste og horoskopet som et kart over psyken.',
  [MethodologyType.EVOLUTIONARY]: 'Fokuserer på sjelens reise over flere liv, karma og måne-nodene. "Hvorfor" skjer ting for sjelens vekst.',
  [MethodologyType.ESOTERIC]: 'Fokuserer på sjelens formål og utvikling gjennom de syv stråler og esoteriske herskere.',
  [MethodologyType.SPECIALIZED]: 'Avanserte teknikker som Horar (spørsmålsastrologi), Eleksjon (timing) og Mundanastrologi.'
};

// Added missing constants for Library and Courses components
export const AUTHORS: Author[] = [
  {
    id: '1',
    name: 'Claudius Ptolemy',
    era: 'Ancient',
    specialty: 'Hellenistic Astrology',
    description: 'En av de mest innflytelsesrike astronomene og astrologene i historien. Hans verk Tetrabiblos la grunnlaget for vestlig astrologi.',
    keyWorks: ['Tetrabiblos', 'Almagest'],
    methodologies: [MethodologyType.WESTERN_CLASSICAL, MethodologyType.HELLENISTIC]
  },
  {
    id: '2',
    name: 'Liz Greene',
    era: 'Modern',
    specialty: 'Psychological Astrology',
    description: 'En ledende skikkelse innen moderne psykologisk astrologi, kjent for å integrere Jungiansk psykologi i tolkningen.',
    keyWorks: ['Saturn: A New Look at an Old Devil', 'The Astrology of Fate'],
    methodologies: [MethodologyType.PSYCHOLOGICAL]
  },
  {
    id: '3',
    name: 'Alice Bailey',
    era: '20th Century',
    specialty: 'Esoteric Astrology',
    description: 'Forfatteren bak de esoteriske læresetningene om de syv stråler og sjelens utvikling gjennom dyrekretsen.',
    keyWorks: ['Esoteric Astrology'],
    methodologies: [MethodologyType.ESOTERIC]
  }
];

export const RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Christian Astrology',
    author: 'William Lilly',
    type: 'Book',
    description: 'Det første store astrologiske verket skrevet på engelsk, essensielt for klassisk horar-astrologi.',
    isRecommended: true,
    link: 'https://example.com/lilly'
  },
  {
    id: '2',
    title: 'The Inner Sky',
    author: 'Steven Forrest',
    type: 'Book',
    description: 'En moderne klassiker innen evolusjonær astrologi.',
    isRecommended: true,
    link: 'https://example.com/forrest'
  }
];

export const COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Grunnkurs i Klassisk Astrologi',
    description: 'Lær de fundamentale prinsippene i vestlig klassisk astrologi, fra planeter til hussystemer.',
    level: 'Nybegynner',
    duration: '10 uker',
    instructor: 'AstroMason',
    thumbnail: 'https://images.unsplash.com/photo-1532960401447-7dd05bef20b0?auto=format&fit=crop&q=80&w=800',
    progress: 0,
    isCertified: true,
    modules: [
      {
        id: 'm1',
        title: 'Introduksjon',
        lessons: [
          { id: 'l1', title: 'Hva er Astrologi?', duration: '15m', type: 'video', isCompleted: false, content: 'Astrologi er studiet av himmellegemenes bevegelser...' }
        ]
      }
    ]
  },
  {
    id: 'c2',
    title: 'Esoterisk Astrologi & De Syv Stråler',
    description: 'Utforsk sjelens formål gjennom de esoteriske herskerne og stråle-energiene.',
    level: 'Avansert',
    duration: '8 uker',
    instructor: 'AstroMason',
    thumbnail: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800',
    progress: 0,
    isCertified: true,
    modules: []
  },
  {
    id: 'c3',
    title: 'Psykologisk Astrologi i Praksis',
    description: 'Bruk horoskopet som et verktøy for selvutvikling og forståelse av menneskets psyke.',
    level: 'Middels',
    duration: '12 uker',
    instructor: 'AstroMason',
    thumbnail: 'https://images.unsplash.com/photo-1515825838458-f2a94b20105a?auto=format&fit=crop&q=80&w=800',
    progress: 0,
    isCertified: true,
    modules: []
  }
];
