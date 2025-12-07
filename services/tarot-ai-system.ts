
// ============================================================================
// PROFESSIONAL TAROT AI INTERPRETATION SYSTEM V2
// ============================================================================

export interface TarotCard {
    id: string | number;
    name: string;
    arcana: 'major' | 'minor';
    suit?: 'Wands' | 'Cups' | 'Swords' | 'Pentacles';
    number?: number;
    element?: 'Ild' | 'Vann' | 'Luft' | 'Jord'; // Using Norwegian/System match
    astrology?: string;
    numerology?: number;
    keywords: string[];
    reversed?: boolean;
    desc?: string;
    img?: string;
  }
  
  export interface ReadingPosition {
    position: number;
    positionName: string;
    card: TarotCard;
    context: string;
  }
  
  export interface TarotSpread {
    name: string;
    positions: ReadingPosition[];
    question: string;
    querentsituation?: string;
  }
  
  // ============================================================================
  // 1. ELEMENTAL DIGNITIES (Card Combinations)
  // ============================================================================
  
  export const ELEMENTAL_RELATIONSHIPS: Record<string, { type: string, strength: number, meaning: string }> = {
    'Ild-Ild': { type: 'neutral', strength: 1, meaning: 'Forsterker energi, kan bli overveldende.' },
    'Ild-Vann': { type: 'hostile', strength: -2, meaning: 'Konflikt - Ild demper Vann, Vann slukker Ild (Damp/Uro).' },
    'Ild-Luft': { type: 'friendly', strength: 2, meaning: 'Støttende - Luft gir næring til Ild (Eksplosiv vekst).' },
    'Ild-Jord': { type: 'neutral', strength: 0, meaning: 'Nøytral - Kan samarbeide hvis balansert (Energi møter masse).' },
    
    'Vann-Vann': { type: 'neutral', strength: 1, meaning: 'Forsterker følelser, dypere intuisjon.' },
    'Vann-Luft': { type: 'hostile', strength: -2, meaning: 'Konflikt - Luft pisker opp Vann (Bølger/Storm).' },
    'Vann-Jord': { type: 'friendly', strength: 2, meaning: 'Støttende - Vann nærer Jord (Fruktbarhet).' },
    'Vann-Ild': { type: 'hostile', strength: -2, meaning: 'Konflikt - Samme som Ild-Vann.' },
    
    'Luft-Luft': { type: 'neutral', strength: 1, meaning: 'Forsterker tanker og intellekt, kan bli abstrakt.' },
    'Luft-Jord': { type: 'hostile', strength: -2, meaning: 'Konflikt - Abstrakt vs Konkret (Støvstorm).' },
    'Luft-Ild': { type: 'friendly', strength: 2, meaning: 'Støttende - Samme som Ild-Luft.' },
    'Luft-Vann': { type: 'hostile', strength: -2, meaning: 'Konflikt - Samme som Vann-Luft.' },
    
    'Jord-Jord': { type: 'neutral', strength: 1, meaning: 'Forsterker stabilitet, kan bli stillstand.' },
    'Jord-Ild': { type: 'neutral', strength: 0, meaning: 'Nøytral - Samme som Ild-Jord.' },
    'Jord-Vann': { type: 'friendly', strength: 2, meaning: 'Støttende - Samme som Vann-Jord.' },
    'Jord-Luft': { type: 'hostile', strength: -2, meaning: 'Konflikt - Samme som Luft-Jord.' }
  };
  
  export function calculateElementalDignity(card1: TarotCard, card2: TarotCard): {
    relationship: string;
    strength: number;
    interpretation: string;
  } {
    if (!card1.element || !card2.element) {
      return { relationship: 'neutral', strength: 0, interpretation: 'Vurderes individuelt basert på arketype.' };
    }
    
    const key = `${card1.element}-${card2.element}`;
    const dignity = ELEMENTAL_RELATIONSHIPS[key] || { type: 'neutral', strength: 0, meaning: 'Ingen spesiell relasjon.' };
    
    return {
      relationship: dignity.type,
      strength: dignity.strength,
      interpretation: dignity.meaning
    };
  }
  
  // ============================================================================
  // 2. SPREAD PATTERN ANALYSIS
  // ============================================================================
  
  export interface SpreadPattern {
    pattern: string;
    cards: TarotCard[];
    significance: string;
    interpretation: string;
  }
  
  export function analyzeSpreadPatterns(spread: TarotSpread): SpreadPattern[] {
    const patterns: SpreadPattern[] = [];
    const cards = spread.positions.map(p => p.card);
    
    // 1. ELEMENT DOMINANCE & VOIDS
    const elementCount = { Ild: 0, Vann: 0, Luft: 0, Jord: 0 };
    let majorCount = 0;
  
    cards.forEach(card => {
      if (card.arcana === 'major') majorCount++;
      if (card.element) elementCount[card.element as keyof typeof elementCount]++;
    });
    
    // Dominance
    const dominantElement = Object.entries(elementCount).reduce((a, b) => a[1] > b[1] ? a : b);
    if (dominantElement[1] >= Math.max(2, cards.length / 2)) {
      const meanings = {
        Ild: 'Fokus på handling, vilje, kreativitet og inspirasjon.',
        Vann: 'Fokus på følelser, relasjoner, intuisjon og drømmer.',
        Luft: 'Fokus på tanker, kommunikasjon, konflikt og sannhet.',
        Jord: 'Fokus på materialitet, arbeid, helse og ressurser.'
      };
      patterns.push({
        pattern: 'Elementær Dominans',
        cards: cards.filter(c => c.element === dominantElement[0]),
        significance: `${dominantElement[1]} kort av elementet ${dominantElement[0]}`,
        interpretation: meanings[dominantElement[0] as keyof typeof meanings] || 'Dominant energi'
      });
    }
  
    // Voids (Missing Elements) - Critical for V2
    const voids = Object.entries(elementCount).filter(([_, count]) => count === 0);
    voids.forEach(([element, _]) => {
        const advice = {
            Ild: 'Mangel på Ild: Du kan mangle initiativ eller gnist. Du må bevisst skape energi.',
            Vann: 'Mangel på Vann: Du kan intellektualisere følelser. Koble deg på hjertet.',
            Luft: 'Mangel på Luft: Du kan mangle objektivitet. Ta et steg tilbake og analyser.',
            Jord: 'Mangel på Jord: Du kan være urealistisk. Sørg for å jorde planene dine.'
        };
        patterns.push({
            pattern: 'Manglende Element (Void)',
            cards: [],
            significance: `Ingen kort av elementet ${element}`,
            interpretation: advice[element as keyof typeof advice]
        });
    });
    
    // 2. MAJOR ARCANA DOMINANCE
    if (majorCount >= Math.max(2, cards.length / 2)) {
      patterns.push({
        pattern: 'Skjebnetung (Major Arcana)',
        cards: cards.filter(c => c.arcana === 'major'),
        significance: `${majorCount} kort fra Store Arkana`,
        interpretation: 'Dette er en livsendrende periode. Kreftene som er i spill er karmiske og utenfor din umiddelbare kontroll.'
      });
    }
    
    // 3. REVERSED CARD PATTERN
    const reversedCards = cards.filter(c => c.reversed);
    if (reversedCards.length >= Math.max(2, cards.length / 2)) {
      patterns.push({
        pattern: 'Blokkering / Indre Arbeid',
        cards: reversedCards,
        significance: `${reversedCards.length} reverserte kort`,
        interpretation: 'Mye av energien er internalisert eller blokkert. Ting går tregere enn forventet, eller krever at du ser innover før du handler utover.'
      });
    }
    
    return patterns;
  }
  
  // ============================================================================
  // 3. CARD INTERACTION ANALYSIS
  // ============================================================================
  
  export interface CardInteraction {
    card1: TarotCard;
    card2: TarotCard;
    relationshipType: 'supporting' | 'conflicting' | 'neutral' | 'transforming';
    dynamicDescription: string;
  }
  
  export function analyzeCardInteractions(positions: ReadingPosition[]): CardInteraction[] {
    const interactions: CardInteraction[] = [];
    
    // Analyze adjacent cards
    for (let i = 0; i < positions.length - 1; i++) {
      const pos1 = positions[i];
      const pos2 = positions[i + 1];
      const card1 = pos1.card;
      const card2 = pos2.card;
      
      // Elemental relationship
      const elementalDignity = calculateElementalDignity(card1, card2);
      
      let relationshipType: 'supporting' | 'conflicting' | 'neutral' | 'transforming';
      
      if (elementalDignity.strength > 0) relationshipType = 'supporting';
      else if (elementalDignity.strength < 0) relationshipType = 'conflicting';
      else relationshipType = 'neutral';
      
      // Special cases: transformation pairs
      if ((card1.name === 'Døden' || card2.name === 'Døden') ||
          (card1.name === 'Tårnet' || card2.name === 'Tårnet')) {
        relationshipType = 'transforming';
      }
      
      // Generate context-aware description
      const desc = generateDynamicDescription(pos1, pos2, relationshipType, elementalDignity);
      
      interactions.push({
        card1,
        card2,
        relationshipType,
        dynamicDescription: desc
      });
    }
    
    return interactions;
  }
  
  function generateDynamicDescription(
    pos1: ReadingPosition,
    pos2: ReadingPosition,
    type: string,
    elemental: any
  ): string {
    const c1 = pos1.card;
    const c2 = pos2.card;
  
    const descriptions: Record<string, string> = {
      supporting: `**Flyt:** Bevegelsen fra "${pos1.positionName}" (${c1.name}) til "${pos2.positionName}" (${c2.name}) er harmonisk. ${elemental.interpretation} FARE: Kan bli for komfortabelt. LØFTE: Naturlig vekst.`,
      conflicting: `**Friksjon:** Overgangen fra "${pos1.positionName}" (${c1.name}) til "${pos2.positionName}" (${c2.name}) møter motstand. ${elemental.interpretation} FARE: Du stopper opp. LØFTE: Friksjon skaper varme og nødvendig endring.`,
      neutral: `**Side om side:** "${pos1.positionName}" og "${pos2.positionName}" opererer uavhengig. ${c1.name} og ${c2.name} må håndteres som separate oppgaver.`,
      transforming: `**Radikalt Skifte:** Møtet mellom ${c1.name} og ${c2.name} signaliserer en total omveltning i narrativet. Alt endres her.`
    };
    
    return descriptions[type] || 'Relasjon analyseres...';
  }
  
  // ============================================================================
  // 4. STORYTELLING STRUCTURE
  // ============================================================================
  
  export interface StoryArc {
    beginning: ReadingPosition[];
    middle: ReadingPosition[];
    end: ReadingPosition[];
    climax?: ReadingPosition;
    narrativeFlow: string;
  }
  
  export function identifyStoryArc(spread: TarotSpread): StoryArc {
    const positions = spread.positions;
    const length = positions.length;
    
    // Default segments
    const beginning = positions.slice(0, Math.ceil(length/3));
    const middle = positions.slice(Math.ceil(length/3), Math.ceil(2*length/3));
    const end = positions.slice(Math.ceil(2*length/3));
  
    // Find climax (Major Arcana or 10s or 5s)
    const climax = positions.find(p => ['Tårnet', 'Døden', 'Djevelen', 'Solen', 'Verden', 'Dommen'].includes(p.card.name)) 
                || positions[Math.floor(length/2)];
  
    // Check Numerological Progression
    const nStart = beginning[0]?.card.number || 0;
    const nEnd = end[end.length-1]?.card.number || 0;
    let progressionText = "";
    
    if (nEnd > nStart) progressionText = "Tallene stiger (Eskalering) - situasjonen bygger seg opp mot et nytt nivå.";
    else if (nEnd < nStart) progressionText = "Tallene synker (De-eskalering) - en reise innover eller tilbake til røttene.";
    else progressionText = "Tallene svinger - situasjonen er dynamisk og uforutsigbar.";
    
    const narrativeFlow = `
  ### Fortellingsbuen
  1. **Starten:** Reisen begynner i "${beginning[0]?.positionName}" med ${beginning[0]?.card.name}.
  2. **Kjernen:** Historien tilspisser seg rundt "${middle[0]?.positionName}". ${climax ? `Vendepunktet er **${climax.card.name}**.` : ''}
  3. **Utfallet:** Det hele lander i "${end[end.length-1]?.positionName}" med ${end[end.length-1]?.card.name}.
  
  ${progressionText}
    `.trim();
    
    return { beginning, middle, end, climax, narrativeFlow };
  }
  
  // ============================================================================
  // 5. PREPROCESSOR FOR AI (V2)
  // ============================================================================
  
  export function preprocessSpreadForAI_V2(spread: TarotSpread): string {
    const patterns = analyzeSpreadPatterns(spread);
    const interactions = analyzeCardInteractions(spread.positions);
    const story = identifyStoryArc(spread);
    
    // Helper to get number meanings
    const getNumeralMeaning = (num: number) => {
        const m = ['Null', 'Start/Potensial', 'Balanse/Valg', 'Vekst/Kreativitet', 'Struktur/Stabilitet', 'Konflikt/Endring', 'Harmoni/Healing', 'Refleksjon/Strategi', 'Handling/Kraft', 'Fullføring/Visdom', 'Ny Syklus/Overflod'];
        return m[num] || 'Ukjent';
    };
  
    return `
  # TAROT READING DATA - PROFESJONELL ANALYSE
  
  ## SPREAD OVERVIEW
  - **Name:** ${spread.name}
  - **Question:** "${spread.question}"
  ${spread.querentsituation ? `- **Querent's Situation:** ${spread.querentsituation}` : ''}
  - **Major Arcana:** ${spread.positions.filter(p => p.card.arcana === 'major').length}
  
  ## DETECTED PATTERNS (NEVN DISSE FØRST!)
  ${patterns.length > 0 ? patterns.map(p => `- **${p.pattern}**: ${p.significance} - ${p.interpretation}`).join('\n') : '- Ingen sterke mønstre funnet'}
  
  ## STORY STRUCTURE (FORTELLINGSBUEN)
  ${story.narrativeFlow}
  
  ## CARDS IN SPREAD (MED KONTEKST)
  ${spread.positions.map((pos, i) => `
  ---
  ### Posisjon ${i + 1}: ${pos.positionName}
  **Kort:** ${pos.card.name}${pos.card.reversed ? ' (REVERSED)' : ''}
  **Arcana:** ${pos.card.arcana}
  ${pos.card.suit ? `**Suit:** ${pos.card.suit} (${pos.card.element})` : ''}
  ${pos.card.number ? `**Number:** ${pos.card.number} (${getNumeralMeaning(pos.card.number || 0)})` : ''}
  **Keywords:** ${pos.card.keywords.join(', ')}
  **Context:** ${pos.context}
  `).join('\n')}
  
  ## CARD INTERACTIONS (ANALYSER DISSE NØYE!)
  ${interactions.map((int, i) => `
  ### ${int.card1.name} → ${int.card2.name}
  ${int.dynamicDescription}
  `).join('\n')}
  `;
  }
  
  // ============================================================================
  // 6. PROMPT GENERATION (Merged from tarot-prompts.ts)
  // ============================================================================
  
  export const ENHANCED_TAROT_SYNTHESIS_PROMPT = `
  # PROFESJONELL TAROT-TOLKNING - MASTER PROTOCOL
  
  Du er en ekspert tarot-leser med 20+ års erfaring. Du kombinerer dyp psykologisk innsikt, 
  poetisk språk og konkret veiledning. Du tolker ALDRI fra kokebøker.
  
  ---
  
  ## FASE 1: HELHETSBILDE (30% av tolkningen)
  
  ### 1.1 Identifiser Mønstre
  - Suit dominance (3+ av samme suit)
  - Numerical repetitions
  - Court card clusters
  - Major Arcana concentration (skjebnetung periode hvis 3+)
  - Reversal rate
  
  ### 1.2 Elementær Energi
  **Beregn elementfordeling og TOLKE hva det betyr:**
  
  ❌ DÅRLIG: "3 Vann-kort. Fokus på følelser."
  
  ✅ GODT: "Med 3 Vann-kort dominerer følelseslivet denne situasjonen. Du navigerer 
  ikke med logikk (Luft) eller vilje (Ild), men med FØLELSEN av hva som er riktig. 
  Dette kan være en gave - din intuisjon vet mer enn hodet ditt. MEN det kan også 
  bli overveldende; du drukner i følelser uten fast grunn under føttene (mangel på Jord)."
  
  ### 1.3 Identifiser Mangler (KRITISK!)
  Manglende elementer er LIKE viktige som tilstedeværende:
  
  - **Ingen Ild**: Mangel på initiativ, vilje, lidenskap. Må bevisst tilføres.
  - **Ingen Jord**: Mangel på grounding, praktisk sans. Risiko for å være i hodet/hjertet uten manifestasjon.
  - **Ingen Luft**: Mangel på objektivitet, kommunikasjon. Kan ikke se situasjonen klart.
  - **Ingen Vann**: Mangel på emosjonell tilkobling. Risiko for tørrhet, kynisme.
  
  ### 1.4 Story Arc (Fortellingsstruktur)
  Identifiser:
  - **Begynnelse** (ofte pos 1-2): Hvor starter historien?
  - **Klimaks** (ofte midten): Vendepunktet - høyeste intensitet
  - **Resolusjon** (ofte siste kort): Hvor leder dette?
  
  **Numerologisk flyt:**
  - Stigende tall (3→7→9) = ESKALERING, vekst
  - Fallende tall (9→5→2) = DE-ESKALERING, tilbaketrekning
  - Kaotiske tall = Uforutsigbar, kompleks situasjon
  
  ---
  
  ## FASE 2: KORT-FOR-KORT ANALYSE (50% av tolkningen)
  
  For HVERT kort, ALLTID inkluder disse 5 lagene:
  
  ### Layer 1: Traditional Meaning
  Grunnbetydning basert på RWS/Thoth tradisjon.
  
  ### Layer 2: Numerological Significance
  Hva sier TALLET? (1=Start, 5=Konflikt, 9=Fullføring, 10=Ny syklus etc.)
  
  ### Layer 3: Elemental Energy & Dignity
  **Vurder elementrelasjon til NABO-kort:**
  
  Friendly (+2):
  - Fire + Air: Luft nærer ild (inspirasjon + intellekt)
  - Water + Earth: Vann nærer jord (følelser + manifestasjon)
  
  Hostile (-2):
  - Fire + Water: De slukker hverandre (vilje vs følelse)
  - Air + Earth: Abstrakt vs konkret (tanke vs realitet)
  
  Neutral (0):
  - Fire + Earth: Kan samarbeide, men krever arbeid
  - Water + Air: Spenning, men kan balanseres
  
  **KRITISK:** Beskriv KONKRET hva denne dynamikken betyr:
  
  ❌ DÅRLIG: "Vognen og Djevelen er støttende (Vann-Jord)."
  
  ✅ GODT: "Vognen (Vann-energi: følelsesmessig momentum) møter Djevelen (Jord-energi: 
  materiell binding). Elementene er støttende - dine følelser GIR NÆRING til materialismen. 
  Dette er en ADVARSEL: Din følelsesmessige trang til sikkerhet (Vognen søker trygghet) 
  risikerer å bli til besettelse (Djevelen). Vann nærer jord, ja - men hvis vannet er 
  FRYKT snarere enn kjærlighet, vokser giftige planter."
  
  ### Layer 4: Position Context
  **Samme kort betyr ULIKE ting i ulike posisjoner:**
  - I "Fortid": Transformasjon du allerede har gjennomgått
  - I "Utfordring": Du MOTARBEIDER energien
  - I "Råd": Du MÅ bruke denne energien
  
  ### Layer 5: Image Analysis (for RWS/illustrerte dekk)
  **Studer BILDENE - ikke bare betydninger:**
  - Hva GJØR figuren?
  - Hvor SER de?
  - Hva HOLDER de?
  - Hva er i BAKGRUNNEN?
  
  ---
  
  ## FASE 3: CARD INTERACTIONS (15% av tolkningen)
  
  ### 3.1 Nabo-dynamikk
  Analyser HVER overgang mellom kort:
  
  **Template:**
  [Kort 1] → [Kort 2]:
  Elementær relasjon: [Friendly/Hostile/Neutral]
  Psykologisk dynamikk: [Hva skjer når disse energiene møtes?]
  FARE: [Hva kan gå galt?]
  LØFTE: [Hva kan gå riktig?]
  
  ### 3.2 Transformative Pairings
  Vær ekstra oppmerksom på kraftige kombinasjoner (Death+Tower, Devil+Lovers, etc.).
  
  ---
  
  ## FASE 4: KONKRET VEILEDNING (5% av tolkningen)
  
  ### 5.1 Handlingsplan
  Gi KONKRETE steg basert på kortene:
  
  **Umiddelbare handlinger** (basert på nåsituasjon/utfordring)
  **Indre arbeid** (basert på skjulte kort/underbevisste)
  **Langsiktig visjon** (basert på råd/utfall)
  
  ### 5.2 Avsluttende visdom
  End med EN kraftig, poetisk innsikt som oppsummerer alt og gir håp.
  
  ---
  
  ## ABSOLUTTE FORBUD
  
  ### ALDRI gjør dette:
  1. ❌ Bruk template-fraser: "Dette er en oppfordring til å bruke X aktivt..."
  2. ❌ Si "dette kortet betyr alltid..." (kontekst er ALT)
  3. ❌ Gi fatalistiske prediksjoner: "Du VIL mislykkes"
  4. ❌ List kort uten å veve dem sammen til historie
  5. ❌ Nevn elemental dignities uten å forklare HVA det betyr praktisk
  6. ❌ Gi generiske råd: "Følg hjertet ditt"
  
  ### ALLTID gjør dette:
  1. ✅ Vev alle kort til EN sammenhengende fortelling
  2. ✅ Kombiner minimum 4 lag per kort (traditional + numerology + element + position + image)
  3. ✅ Beskriv card interactions KONKRET (ikke bare "støttende")
  4. ✅ Gi handlingsbare råd
  5. ✅ End med håp og empowerment
  `;
  
  export const READING_STYLES = {
    'psychological': {
      name: 'Jungiansk Dybdepsykologi',
      focus: 'Dybdepsykologi, arketyper, skyggearbeid',
      extraPrompt: `
  JUNGIANSK FOKUS:
  - Identifiser arketyper (særlig i Major Arcana)
  - Diskuter skygge-aspekter (særlig med "mørke" kort)
  - Se opposites som må integreres (ikke bekjempes)
  - Vurder om Court cards er projeksjoner
  - Fokuser på individuasjonsprosessen (bli hel)
  - Bruk Jungs språk: kollektivt ubevisst, Anima/Animus, Self
  
  Tonalitet: Terapeutisk, dyptgående, transformativ
      `
    },
    
    'general': {
      name: 'Helhetlig & Balansert',
      focus: 'Billedanalyse, følelser, symbolikk, balanse',
      extraPrompt: `
  INTUITIV & BALANSERT FOKUS:
  - Studer hvert BILDE nøye (hva skjer visuelt?)
  - Hvilke FØLELSER vekkes av fargene, symbolene?
  - Hva er den OVERORDNEDE stemningen i spreaden?
  - Tillat deg å "lese" energien mellom kortene
  - Bruk poetisk, billedlig språk
  
  Tonalitet: Poetisk, flytende, intuitiv, klar
      `
    },
    
    'predictive': {
      name: 'Prediktiv / Klassisk',
      focus: 'Konkrete råd, handlingsplan, manifesting, fremtid',
      extraPrompt: `
  KLASSISK PREDIKTIV FOKUS:
  - Hva kan querent GJØRE akkurat nå?
  - Hvordan manifesteres denne energien i dagliglivet?
  - Gi timeline hvis mulig (Aces = dager/uker, 10s = måneder)
  - Fokuser på Pentacles og Wands for manifestasjon
  - Mindre psykologi, mer "hva skjer og hva gjør jeg?"
  - Inkluder hvordan arbeide MED planetary timing hvis relevant
  
  Tonalitet: Direkte, handlingsorientert, motiverende
      `
    },
    
    'esoteric': {
      name: 'Esoterisk / Sjelelig',
      focus: 'Sjelsoppgave, karma, åndelig vekst',
      extraPrompt: `
  ESOTERISK & KARMISK FOKUS:
  - Hva er sjelsens leksjon her?
  - Karmiske mønstre (særlig med Wheel, Justice, Saturn-kort)
  - Åndelige guider/meldinger (særlig Major Arcana)
  - Hvordan tjener dette querents høyeste vel?
  - Chakra-koblinger hvis relevant
  - Astrologiske koblinger til Major Arcana
  
  Tonalitet: Elevated, visdomssøkende, transcendent
      `
    }
  };
  
  export function generateCustomTarotPrompt(
    style: string,
    spreadType: string,
    question: string,
    querentsituation?: string
  ): string {
    // Safe access to style config
    const styleKey = (READING_STYLES as any)[style] ? style : 'general';
    const styleConfig = (READING_STYLES as any)[styleKey];
    
    return `
  ${ENHANCED_TAROT_SYNTHESIS_PROMPT}
  
  ---
  
  ## TILPASSET STIL: ${styleConfig.name.toUpperCase()}
  ${styleConfig.extraPrompt}
  
  ---
  
  ## SPREAD-SPESIFIKK INFO
  Spread type: ${spreadType}
  Spørsmål: "${question}"
  ${querentsituation ? `Querent's situasjon: ${querentsituation}` : ''}
  
  Tilpass tolkningen til denne spesifikke konteksten. Hver posisjon skal tolkes 
  i lys av spørsmålet og querentsituasjonen.
  
  ---
  
  Nå, gi en PROFESJONELL tolkning som følger ALL guidance ovenfor.
  `;
  }
  