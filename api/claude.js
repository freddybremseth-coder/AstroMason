
// tarot-ai-system.js logic embedded directly
const ENHANCED_TAROT_SYNTHESIS_PROMPT = `
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

const READING_STYLES = {
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

function generateCustomTarotPrompt(style, spreadType, question, querentsituation) {
  const styleKey = READING_STYLES[style] ? style : 'general';
  const styleConfig = READING_STYLES[styleKey];
  
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


async function readBody(req) {
    return new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => { data += chunk.toString(); });
      req.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve({}); }
      });
      req.on('error', reject);
    });
  }
  
  export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    if (req.method === 'OPTIONS') return res.status(200).end();
  
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
    const body = (req.body && typeof req.body === 'object') ? req.body : await readBody(req);
  
    const { model = 'claude-sonnet-4-6', max_tokens = 4096, system, messages, ...rest } = body;
  
    const authHeader = req.headers.authorization;
    const key = authHeader ? authHeader.split(' ')[1] : process.env.ANTHROPIC_API_KEY;
  
    if (!key) {
      return res.status(401).json({ error: 'Ingen API-nøkkel. Sett ANTHROPIC_API_KEY i Vercel Environment Variables, eller lim inn nøkkelen i Innstillinger.' });
    }

    let finalSystem = system;
    let finalMessages = messages;

    if (rest.isTarotReading) {
        const { cards, spread, style, userContext, clientData } = rest;

        if (!cards || !spread || !clientData) {
            return res.status(400).json({ error: 'Mangler 'cards', 'spread' eller 'clientData' for tarot-tolkning.' });
        }

        const cardsList = cards.map((c, i) =>
            `Posisjon ${i + 1} (${spread.positions?.[i] || 'Ukjent'}): ${c.card?.name || c.name || 'Ukjent'}${c.isReversed ? ' (Reversert)' : ''} (Keywords: ${(c.card?.keywords || []).join(', ')})`
        ).join('\n');
        
        const spreadName = spread?.name || 'Ukjent legg';
        const clientName = clientData?.clientName || 'klienten';
        const question = userContext || 'Generell veiledning';

        finalSystem = generateCustomTarotPrompt(style, spreadName, question, clientName);
        finalMessages = [{
            role: 'user',
            content: `Analyser dette tarotlegget for ${clientName}.\n\nKORT I LEGGET:\n${cardsList}`
        }];
    }

    if (!Array.isArray(finalMessages) || finalMessages.length === 0) {
        return res.status(400).json({ error: 'messages-array mangler eller er tomt' });
    }
  
    const requestBody = { model, max_tokens, messages: finalMessages };
    if (finalSystem) requestBody.system = finalSystem;
  
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Anthropic error:', data);
        return res.status(response.status).json({ error: data.error?.message || `Anthropic HTTP ${response.status}` });
      }
  
      res.status(200).json(data);
    } catch (err) {
      console.error('Proxy fetch error:', err);
      res.status(500).json({ error: err.message || 'Proxy feil' });
    }
  }
