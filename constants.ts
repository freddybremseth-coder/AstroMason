

import { Author, MethodologyType, Resource, Course } from './types';

export const UI_TRANSLATIONS: Record<string, any> = {
  no: {
    navDashboard: 'Dashboard',
    navCourses: 'Kurs',
    navLibrary: 'Bibliotek',
    navMethodology: 'Metodikk',
    navAstrology: 'Astrologi',
    navTarot: 'Tarot',
    navSettings: 'Innstillinger'
  },
  en: {
    navDashboard: 'Dashboard',
    navCourses: 'Courses',
    navLibrary: 'Library',
    navMethodology: 'Methodology',
    navAstrology: 'Astrology',
    navTarot: 'Tarot',
    navSettings: 'Settings'
  },
  es: {
    navDashboard: 'Tablero',
    navCourses: 'Cursos',
    navLibrary: 'Biblioteca',
    navMethodology: 'Metodología',
    navAstrology: 'Astrología',
    navTarot: 'Tarot',
    navSettings: 'Ajustes'
  }
};

// --- ASTRO KNOWLEDGE BASE ---
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
    'Jord': 'Manifestasjon, kropp, ressurser (Pentacles)',
    'Luft': 'Tanke, kommunikasjon, konflikt (Swords)',
    'Vann': 'Følelser, relasjoner, intuisjon (Cups)'
};

// --- TAROT DATA & LOGIC ---

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

export const AUTHORS: Author[] = [
  // --- Klassiske Esoterikere (Grunnpilarer) ---
  {
    id: 'c1', name: 'Antoine Court de Gébelin', era: 'Classical', specialty: 'Opprinnelse & Esoterikk',
    description: 'Fransk esoteriker (1700-tall) som først koblet tarot til egyptisk visdom i "Le Monde Primitif". Starten på okkult tarot.',
    keyWorks: ['Le Monde Primitif'], methodologies: [MethodologyType.ESOTERIC]
  },
  {
    id: 'c2', name: 'Jean-Baptiste Alliette (Etteilla)', era: 'Classical', specialty: 'Spådomssystematikk',
    description: 'Den første som systematiserte tarot som et rent spådomsverktøy og ga ut manualer for kortlesing.',
    keyWorks: ['Manière de se récréer avec le jeu de cartes'], methodologies: [MethodologyType.WESTERN_CLASSICAL]
  },
  {
    id: 'c3', name: 'Eliphas Lévi', era: 'Classical', specialty: 'Magisk Kabbala',
    description: 'Integrerte tarot i vestlig magisk tradisjon (Seremoniell Magi). Koblet hebraiske bokstaver til Major Arcana.',
    keyWorks: ['Dogme et Rituel de la Haute Magie'], methodologies: [MethodologyType.ESOTERIC]
  },
  {
    id: 'c4', name: 'S.L. MacGregor Mathers', era: 'Classical', specialty: 'Golden Dawn',
    description: 'En av grunnleggerne av Hermetic Order of the Golden Dawn. Utviklet mange av korrespondansene vi bruker i dag.',
    keyWorks: ['The Tarot', 'Book T'], methodologies: [MethodologyType.ESOTERIC]
  },
  {
    id: 'c5', name: 'Arthur Edward Waite', era: 'Classical', specialty: 'Rider-Waite-Smith',
    description: 'Skaperen av verdens mest brukte tarotstokk. Fokuserte på kristen mystikk og tilgjengelig symbolikk.',
    keyWorks: ['The Pictorial Key to the Tarot'], methodologies: [MethodologyType.WESTERN_CLASSICAL, MethodologyType.ESOTERIC]
  },
  {
    id: 'c6', name: 'Aleister Crowley', era: 'Classical', specialty: 'Thelema & Thoth',
    description: 'Okkultist som skapte Thoth Tarot. Dyp integrasjon av astrologi, kabbala og hellig geometri.',
    keyWorks: ['The Book of Thoth'], methodologies: [MethodologyType.ESOTERIC]
  },

  // --- Moderne Eksperter (Standardverk) ---
  {
    id: 'm1', name: 'Rachel Pollack', era: 'Modern', specialty: 'Psykologisk & Spirituell',
    description: '"Tarot-guruen". Hennes "78 Degrees of Wisdom" regnes som tarotens bibel for moderne lesere.',
    keyWorks: ['Seventy-Eight Degrees of Wisdom', 'Tarot Wisdom'], methodologies: [MethodologyType.PSYCHOLOGICAL, MethodologyType.ESOTERIC]
  },
  {
    id: 'm2', name: 'Mary K. Greer', era: 'Modern', specialty: 'Selvutvikling & Metodikk',
    description: 'Pioner innen tarot for selvutvikling. Utviklet metoder for "Tarot Profile" og fødselskort.',
    keyWorks: ['Tarot for Your Self', '21 Ways to Read a Tarot Card'], methodologies: [MethodologyType.PSYCHOLOGICAL]
  },
  {
    id: 'm3', name: 'Joan Bunning', era: 'Modern', specialty: 'Strukturert Læring',
    description: 'Kjent for svært pedagogiske og strukturerte kurs i tarot. Standardverk for nybegynnere.',
    keyWorks: ['Learning the Tarot'], methodologies: [MethodologyType.WESTERN_CLASSICAL]
  },
  {
    id: 'm4', name: 'Paul Fenton-Smith', era: 'Modern', specialty: 'Praktisk & Intuitiv',
    description: 'Australsk ekspert som kombinerer intuisjon med solid struktur. Fokus på historiefortelling i legget.',
    keyWorks: ['The Tarot Revealed', 'Advanced Tarot'], methodologies: [MethodologyType.PSYCHOLOGICAL]
  },
  {
    id: 'm5', name: 'Benebell Wen', era: 'Modern', specialty: 'Holistisk & Analytisk',
    description: 'Forfatter av "Holistic Tarot", et massivt oppslagsverk. Tilnærmer seg tarot analytisk og akademisk.',
    keyWorks: ['Holistic Tarot'], methodologies: [MethodologyType.SPECIALIZED]
  },
  {
    id: 'm6', name: 'Theresa Reed (The Tarot Lady)', era: 'Modern', specialty: 'Moderne Praksis',
    description: 'Gjør tarot tilgjengelig og "no-nonsense". Fokus på business og hverdagsråd.',
    keyWorks: ['The Tarot Coloring Book', 'Twist Your Fate'], methodologies: [MethodologyType.WESTERN_CLASSICAL]
  },
  
  // --- Praktisk & Pedagogisk ---
  { id: 'p1', name: 'Paul Quinn', era: 'Modern', specialty: 'Livsveiledning', description: 'Fokus på tarot som verktøy for å navigere livets utfordringer.', keyWorks: ['Tarot for Life'], methodologies: [MethodologyType.PSYCHOLOGICAL] },
  { id: 'p2', name: 'Sasha Graham', era: 'Modern', specialty: 'Skyggearbeid', description: 'Kombinerer tarot med mørkere psykologiske temaer og skyggearbeid.', keyWorks: ['Tarot Diva', '365 Tarot Spreads'], methodologies: [MethodologyType.PSYCHOLOGICAL] },
  { id: 'p3', name: 'Barbara Moore', era: 'Modern', specialty: 'Spreads & Teknikk', description: 'Har skrevet utallige guidebøker og utviklet mange unike legg.', keyWorks: ['Tarot Spreads'], methodologies: [MethodologyType.WESTERN_CLASSICAL] },

  // --- Historikere & Forskere ---
  { id: 'h1', name: 'Robert Place', era: 'Modern', specialty: 'Historie & Alkymi', description: 'Ekspert på tarotens historie og dens kobling til neoplatonisme og alkymi.', keyWorks: ['The Tarot: History, Symbolism, and Divination'], methodologies: [MethodologyType.HELLENISTIC] },
  { id: 'h2', name: 'Caitlín Matthews', era: 'Modern', specialty: 'Pre-Rider-Waite', description: 'Forsker på eldre europeiske systemer (Marseille, Lenormand).', keyWorks: ['Untold Tarot'], methodologies: [MethodologyType.ESOTERIC] },
  { id: 'h3', name: 'Michael Dummett', era: 'Modern', specialty: 'Akademisk Historie', description: 'Filosof og historiker som "debunket" mange myter. Fokus på fakta.', keyWorks: ['The Game of Tarot'], methodologies: [MethodologyType.SPECIALIZED] },
];

export const RESOURCES: Resource[] = [
  {
    id: 'r1',
    title: 'Seventy-Eight Degrees of Wisdom',
    author: 'Rachel Pollack',
    type: 'Book',
    description: 'Ofte kalt "Tarotens Bibel". Et must for dyp psykologisk og spirituell forståelse.',
    isRecommended: true,
    link: '#'
  },
  {
    id: 'r2',
    title: 'Holistic Tarot',
    author: 'Benebell Wen',
    type: 'Book',
    description: 'En integrerende tilnærming for nybegynnere og eksperter. Svært omfattende.',
    isRecommended: true,
    link: '#'
  },
  {
    id: 'r3',
    title: 'The Book of Thoth',
    author: 'Aleister Crowley',
    type: 'Book',
    description: 'Avansert esoterisk tekst som kobler tarot til kabbala og astrologi. Krevende men givende.',
    isRecommended: true,
    link: '#'
  }
];

export const METHODOLOGY_DESCRIPTIONS: Record<MethodologyType, string> = {
  [MethodologyType.WESTERN_CLASSICAL]: 'Basert på Ptolemy og middelalderske tradisjoner. Fokuserer på skjebne, styrkeforhold mellom planeter, og konkrete prediksjoner i det materielle livet.',
  [MethodologyType.HELLENISTIC]: 'Den opprinnelige horoskopastrologien (1. årh. f.Kr. - 7. årh. e.Kr.). Bruker hele tegn hus, tidsherrer (Time Lords) og sekt for å kartlegge skjebne.',
  [MethodologyType.VEDIC]: 'Jyotish ("Lysvitenskap"). Bruker den sideriske dyrekretsen, nakshatras (måneboliger) og dasha-systemer for nøyaktig tidsbestemmelse og karma-analyse.',
  [MethodologyType.PSYCHOLOGICAL]: 'Integrerer Jungiansk dybdepsykologi. Fokuserer på arketyper, det ubevisste, og horoskopet som et kart over psyken og indre dynamikk.',
  [MethodologyType.EVOLUTIONARY]: 'Fokuserer på sjelens reise over livstider, karma, og månens noder. Spørsmålet er "hvorfor" ting skjer for sjelens vekst.',
  [MethodologyType.ESOTERIC]: 'Fokuserer på sjelens formål og utvikling. Bruker "De syv stråler" og esoteriske herskere for å forstå individets rolle i det kollektive og sjelens intensjon bak inkarnasjonen.',
  [MethodologyType.SPECIALIZED]: 'Avanserte teknikker som Horary (spørsmålsastrologi), Electional (valg av tidspunkt) og Mundan (verdensastrologi).'
};

export const COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Klassisk Vestlig Astrologi',
    description: 'En grundig fordypning i astrologiens tekniske fundament. Lær å beregne styrke, forstå essensielle verdigheter og tolke husene slik de gamle mesterne gjorde.',
    level: 'Nybegynner',
    duration: '10 uker',
    instructor: 'Robert Hand (Metode)',
    thumbnail: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&q=80&w=1000',
    progress: 0,
    isCertified: true,
    modules: [
      {
        id: 'm1_c1',
        title: 'Modul 1: Fundamentet',
        lessons: [
          {
            id: 'l1_m1_c1',
            title: 'Essensielle Verdigheter',
            duration: '45 min',
            type: 'text',
            isCompleted: false,
            content: `
# Essensielle Verdigheter (Essential Dignities)

I klassisk astrologi er ikke alle planetplasseringer like sterke. For å bedømme en planets evne til å handle, må vi se på dens **verdighet**.

## De 5 Nivåene av Verdighet (Ptolemy)

1. **Rulership (Domisil) - +5 poeng**
   Når en planet er i sitt eget tegn (f.eks. Mars i Væren), er den "hjemme". Den har full kontroll over ressurser og handler i tråd med sin natur.

2. **Exaltation (Eksaltasjon) - +4 poeng**
   En planet i eksaltasjon behandles som en æret gjest. Den er løftet opp og presterer ofte over evne. (F.eks. Solen i Væren).

3. **Triplicity (Triplisitet) - +3 poeng**
   Basert på elementene (Ild, Jord, Luft, Vann) og sekten (Dag/Natt). En støttende faktor, som å være blant venner.

4. **Term (Grenser) - +2 poeng**
   Ulike deler av et tegn styres av ulike planeter. Dette dikterer "reglene" eller grensene planeten må operere innenfor.

5. **Face (Ansikt/Dekan) - +1 poeng**
   Den svakeste verdigheten. Som en person som akkurat har lov til å oppholde seg i rommet, men uten makt.

## Peregrine (Fremmed)
En planet uten noen av de ovennevnte verdighetene kalles "peregrine". Den mangler retning og moralsk kompass, og "vandrer" uten mål.
            `
          },
          {
            id: 'q1_m1_c1',
            title: 'Quiz: Verdigheter',
            duration: '15 min',
            type: 'quiz',
            isCompleted: false,
            questions: [
              { id: 'q1', question: 'Hvilken verdighet gir +5 poeng?', options: [{id: 'a', text: 'Eksaltasjon', isCorrect: false}, {id: 'b', text: 'Domisil (Rulership)', isCorrect: true}, {id: 'c', text: 'Triplisitet', isCorrect: false}] },
              { id: 'q2', question: 'Hva kalles en planet uten verdigheter?', options: [{id: 'a', text: 'Peregrine', isCorrect: true}, {id: 'b', text: 'Retrograd', isCorrect: false}, {id: 'c', text: 'Combust', isCorrect: false}] }
            ]
          }
        ]
      },
      {
        id: 'm2_c1',
        title: 'Modul 2: Hus og Sekt',
        lessons: [
          { id: 'l1_m2_c1', title: 'Dag og Nattkart (Sekt)', duration: '50 min', type: 'text', isCompleted: false, content: 'Forskjellen på planeter i et dagkart (Solen over horisonten) vs nattkart. Hvordan Jupiter er den store goderen i dagkart, mens Venus tar den rollen i nattkart.' },
        ]
      }
    ]
  },
  {
    id: 'c2',
    title: 'Esoterisk Astrologi & Sjelens Vei',
    description: 'Basert på Alice Bailey og Djwhal Khul. Dette kurset lærer deg å tolke horoskopet fra sjelens perspektiv, bruke de esoteriske herskerne og forstå de syv stråler.',
    level: 'Videregående',
    duration: '12 uker',
    instructor: 'Astro Mason Esoterics',
    thumbnail: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=1000',
    progress: 0,
    isCertified: true,
    modules: [
      {
        id: 'm1_c2',
        title: 'Modul 1: De Syv Stråler (The Seven Rays)',
        lessons: [
          {
            id: 'l1_m1_c2',
            title: 'Introduksjon til Strålene',
            duration: '60 min',
            type: 'text',
            isCompleted: false,
            content: `
# De Syv Stråler

I esoterisk astrologi er alt energi. De syv strålene er de primære kvalitetene av bevissthet som former alt liv.

### Stråle 1: Vilje og Makt
**Herskerplaneter:** Solen, Pluto, Vulkan.
**Fokus:** Hensikt, ødeleggelse av gamle former, lederskap.
**Utfordring:** Å bruke makt for fellesskapet, ikke egoet.

### Stråle 2: Kjærlighet og Visdom
**Herskerplaneter:** Jupiter, Solen (hjertet).
**Fokus:** Samhold, helbredelse, undervisning. Universets grunnleggende energi.
**Utfordring:** Å ikke bli overveldet av andres følelser, men å elske med klokskap.

### Stråle 3: Aktiv Intelligens
**Herskerplaneter:** Saturn, Jorden.
**Fokus:** Abstrakt tenkning, planlegging, filosofi.
**Utfordring:** Å unngå å bli fanget i mentale konstruksjoner ("Weaving the web").
            `
          },
          {
            id: 'q1_m1_c2',
            title: 'Quiz: Strålekunnskap',
            duration: '15 min',
            type: 'quiz',
            isCompleted: false,
            questions: [
              { id: 'q1', question: 'Hvilken stråle handler om Kjærlighet og Visdom?', options: [{id: 'a', text: 'Stråle 1', isCorrect: false}, {id: 'b', text: 'Stråle 2', isCorrect: true}, {id: 'c', text: 'Stråle 7', isCorrect: false}] },
              { id: 'q2', question: 'Hvilken planet er sterkt knyttet til Stråle 1?', options: [{id: 'a', text: 'Venus', isCorrect: false}, {id: 'b', text: 'Pluto', isCorrect: true}, {id: 'c', text: 'Månen', isCorrect: false}] }
            ]
          }
        ]
      },
      {
        id: 'm2_c2',
        title: 'Modul 2: Esoteriske Herskere',
        lessons: [
          {
            id: 'l1_m2_c2',
            title: 'Skiftet fra Personlighet til Sjel',
            duration: '50 min',
            type: 'text',
            isCompleted: false,
            content: `
# Ortodokse vs. Esoteriske Herskere

Når et menneske begynner å våkne til sin sjelelige hensikt, endres energiflyten i horoskopet. Vi slutter å reagere instinktivt på de klassiske (ortodokse) herskerne, og begynner å vibrere til de esoteriske herskerne.

**Væren:**
*   *Ortodoks:* Mars (Krig, konflikt, ego-hevdelse)
*   *Esoterisk:* Merkur (Sinnet som redskap for sjelen, budbringeren)

**Tvillingene:**
*   *Ortodoks:* Merkur (Konstant bevegelse, informasjonsinnhenting)
*   *Esoterisk:* Venus (Harmonisering av motsetninger, kjærlighet bak tanken)

**Skorpionen:**
*   *Ortodoks:* Mars/Pluto (Konflikt, død, begjær)
*   *Esoterisk:* Mars (Her blir Mars krigeren som kjemper *for* sjelen, ikke mot andre).

**Fiskene:**
*   *Ortodoks:* Jupiter/Neptun (Grenseløshet, tåke, flukt)
*   *Esoterisk:* Pluto (Døden av det gamle egoet for å muliggjøre universell oppstandelse).
            `
          },
          {
            id: 'q1_m2_c2',
            title: 'Quiz: Esoteriske Herskere',
            duration: '10 min',
            type: 'quiz',
            isCompleted: false,
            questions: [
              { id: 'q1', question: 'Hva er den esoteriske herskeren for Tvillingene?', options: [{id: 'a', text: 'Merkur', isCorrect: false}, {id: 'b', text: 'Venus', isCorrect: true}, {id: 'c', text: 'Jupiter', isCorrect: false}] },
              { id: 'q2', question: 'Hvilken planet styrer Fiskene esoterisk?', options: [{id: 'a', text: 'Neptun', isCorrect: false}, {id: 'b', text: 'Pluto', isCorrect: true}] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'c3',
    title: 'Psykologisk & Evolusjonær Astrologi',
    description: 'Kombinasjonen av Jungiansk psykologi og evolusjonær astrologi gir dyp innsikt i menneskesinnet og karmiske mønstre.',
    level: 'Videregående',
    duration: '8 uker',
    instructor: 'Inspirert av Liz Greene',
    thumbnail: 'https://images.unsplash.com/photo-1505506874110-6a7a69069a08?auto=format&fit=crop&q=80&w=1000',
    progress: 0,
    isCertified: true,
    modules: [
      {
        id: 'm1_c3',
        title: 'Modul 1: Arketyper i Psyken',
        lessons: [
          { id: 'l1_m1_c3', title: 'Jung og Astrologi', duration: '45 min', type: 'text', isCompleted: false, content: 'Introduksjon til Carl Jungs begreper: Det ubevisste, Skyggen, Anima/Animus og Selvet, og hvordan disse sees i horoskopet.' },
          { id: 'l2_m1_c3', title: 'Saturn som Skyggen', duration: '45 min', type: 'text', isCompleted: false, content: 'Hvordan Saturn representerer våre dypeste frykter og forsvarsmekanismer, men også porten til reell modenhet.' }
        ]
      },
      {
        id: 'm2_c3',
        title: 'Modul 2: Måneknutene og Karma',
        lessons: [
          { id: 'l1_m2_c3', title: 'Sørnodens felle', duration: '50 min', type: 'text', isCompleted: false, content: 'Sørnoden viser hva vi har med oss av talenter, men også hvor vi sitter fast i gamle mønstre.' },
          { id: 'l2_m2_c3', title: 'Nordnoden: Sjelens retning', duration: '50 min', type: 'text', isCompleted: false, content: 'Nordnoden viser det ukjente territoriet vi må bevege oss inn i for å vokse.' }
        ]
      }
    ]
  }
];