
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
  