# AstroMason - The Deep Archives
## Claude.ai Project Instructions

Du er utviklingsassistent for **AstroMason**, en profesjonell astrologisk webapp bygget med React + TypeScript + Vite, deployed på Vercel.

---

## Hva er AstroMason?

AstroMason er en fullverdig astrologisk plattform som kombinerer:
- Natal horoskop-beregning (Astronomy Engine)
- AI-drevet tolkning (Claude API)
- Tarot-lesninger (78-korts dekk med streaming)
- Kinesisk astrologi
- Numerologi
- Transit-kalender og progresjon
- Solar Return-analyse
- Flerspråklig støtte (8 språk)

**Live URL:** https://astro.chatgenius.pro

---

## Tech Stack

| Lag | Teknologi |
|-----|-----------|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS |
| Backend API | Vercel Serverless Functions (Node.js) |
| AI | @anthropic-ai/sdk (Claude Sonnet 4), Google Gemini |
| Database | Supabase (PostgreSQL + Auth) |
| Betaling | Stripe |
| Astronomi | Astronomy Engine 2.1.19 (CDN) |
| Deploy | Vercel (auto-deploy fra GitHub) |

---

## Prosjektstruktur

```
AstroMason/
├── api/                          # Vercel serverless functions
│   ├── claude.js                 # Claude API proxy (streaming + standard)
│   └── create-checkout-session.js # Stripe betalingshåndtering
│
├── components/                   # 22 React-komponenter
│   ├── App.tsx                   # Hoved-routing og state (tab-basert)
│   ├── Dashboard.tsx             # Forsiden: kosmisk oversikt, daglig kort
│   ├── Tarot.tsx                 # Tarot-modul: 4 spreads, 5 stiler
│   ├── ChartWheel.tsx            # SVG astrologihjul
│   ├── Sidebar.tsx               # Navigasjon, språkvalg
│   ├── Profile.tsx               # Fødselsdataskjema, rapportarkiv
│   ├── Settings.tsx              # API-nøkler, tema, abonnement
│   ├── Horoscope.tsx             # Dag/uke/måned/årshoroskop
│   ├── Numerology.tsx            # Livsvei, sjelskontrakt, karma
│   ├── ChineseAstrology.tsx      # Kinesisk horoskop
│   ├── AiAssistant.tsx           # Flytende AI-chat
│   ├── LandingPage.tsx           # Innlogging, prising
│   ├── TransitCalendar.tsx       # Månedlig transitkalender
│   ├── Progressions.tsx          # Sekundær progresjon
│   ├── SolarReturn.tsx           # Årlig solretur
│   ├── Tools.tsx                 # Synastri, kompositt, relokasjon
│   ├── Courses.tsx               # Læringsmoduler
│   ├── AdminCRM.tsx              # Admin brukerhåndtering
│   ├── Library.tsx               # Ressursbibliotek
│   ├── Methodology.tsx           # Pedagogisk innhold
│   ├── Icons.tsx                 # SVG-ikonbibliotek
│   └── Logo.tsx                  # Merkevarelogo
│
├── services/
│   ├── astrology.ts              # Kjernelogikk: beregninger + AI-kall
│   └── tarot-prompts.ts          # Tarot-tolkningsprompter
│
├── lib/
│   └── supabase.ts               # Auth, profil, rapporter (Supabase)
│
├── constants.ts                  # Oversettelser (8 språk), tarot-dekk (78 kort),
│                                 # zodiac-data, hus-systemer, kurs, ressurser
│
├── index.html                    # Entry point (CDN: Astronomy Engine, Tailwind)
├── index.tsx                     # React mount
├── index.css                     # Global CSS
├── vite.config.ts                # Vite config (port 3000)
├── tailwind.config.js            # Tema: gold, space, Playfair Display
├── vercel.json                   # maxDuration: 120s for claude.js
└── package.json                  # Dependencies
```

---

## Arkitektur

### Routing
Tab-basert state i `App.tsx` (ingen React Router). `activeTab` styrer hva som vises.

### State Management
- **React Context**: `LangContext` (språk), `ThemeContext` (lys/mørk)
- **localStorage**: Fødselsdata, API-nøkler, kreditter, abonnement
- **Supabase**: Persistent lagring med localStorage som fallback

### AI-integrasjon
Alle AI-kall går via `services/astrology.ts` → `callClaude()` → `/api/claude` serverless function → Anthropic SDK.

Tarot-tolkninger bruker **streaming** (SSE) via `callClaudeStream()` for å unngå 504 gateway timeout. System-prompten er ~250 linjer med detaljert tolkningsprotokoll.

### Kreditt-system
- 5 kreditter per AI-rapport (gratis for Master-abonnenter)
- Admin (freddy.bremseth@gmail.com) har ubegrenset

---

## Viktige filer og deres roller

| Fil | Størrelse | Rolle |
|-----|-----------|-------|
| `services/astrology.ts` | ~53KB | ALL astrologi-logikk, planetberegninger, AI-rapportgenerering |
| `constants.ts` | ~44KB | Oversettelser, tarot-dekk, zodiac, kurs, alt statisk innhold |
| `components/App.tsx` | ~28KB | Hoved-app, routing, auth, chart-beregning |
| `api/claude.js` | ~14KB | Serverless proxy med streaming + tarot-prompter |
| `components/Tarot.tsx` | Tarot-UI, kortvelging, spreads, tolkningsvisning |
| `components/Dashboard.tsx` | Forside med kosmisk snapshot |
| `components/ChartWheel.tsx` | SVG-basert interaktivt astrologihjul |

---

## Nøkkelkonsepter

### Tarot Spreads
- **Dagens Kort** (1 kort)
- **Tiden** (3 kort: fortid/nåtid/fremtid)
- **Relasjonen** (3 kort)
- **Keltisk Kors** (10 kort)

### Tolkningsstiler
- `general` - Helhetlig & Balansert
- `psychological` - Jungiansk Dybdepsykologi
- `predictive` - Prediktiv / Klassisk
- `esoteric` - Esoterisk / Sjelelig
- `classical` - Klassisk Tarot-Tradisjon

### Hus-systemer
Placidus (default), Whole Sign, Koch, Regiomontanus, Equal, Campanus, Porphyry

### Språk
`no` (norsk, primær), `en`, `es`, `de`, `fr`, `it`, `ru`, `pl`

---

## Kjente mønstre og gotchas

1. **Dashboard cacher daglig tarot-kort i localStorage** - Bruker nå `FULL_TAROT_DECK.find()` for å hente ferskt kort-objekt (unngår stale bilde-URLer)
2. **Tarot-tolkning bruker streaming** - `callClaudeStream()` med SSE for å unngå 504 timeout
3. **Astronomy Engine lastes fra CDN** - Tilgjengelig som `window.Astronomy`
4. **Auth fallback** - Appen fungerer uten Supabase (localStorage-only modus)
5. **Alle AI-kall** krever brukerens egen Anthropic API-nøkkel (lagres i Settings)
6. **Vercel maxDuration** er satt til 120s for `/api/claude`

---

## Utviklingsinstruksjoner

### Lokalt oppsett
```bash
cd AstroMason
npm install
npm run dev  # Starter på http://localhost:3000
```

### Deploy
Push til GitHub → Vercel auto-deployer.

### Når du endrer kode:
- **Frontend-komponenter**: Endre i `components/`, rebuild med Vite
- **API-logikk**: Endre `api/claude.js` (Vercel redeployer automatisk)
- **Beregninger/AI**: Endre `services/astrology.ts`
- **Statisk innhold**: Endre `constants.ts`
- **Styling**: Tailwind utility-klasser, tema i `tailwind.config.js`

### Konvensjoner
- Norsk som primærspråk i UI og kommentarer
- Alle oversettelser i `constants.ts` under `UI_TRANSLATIONS`
- AI-prompter er på norsk (Claude svarer på brukerens valgte språk)
- Tab-basert navigasjon (ingen React Router)
- localStorage som primær state + Supabase sync

---

## Nylige endringer (mars 2026)

1. **Fix: Dashboard tarot-kort bilde** - Stale cachet kort erstattet med oppslag fra `FULL_TAROT_DECK`
2. **Fix: Tarot-tolkning timeout** - Implementert SSE streaming i `api/claude.js` og `callClaudeStream()` i frontend
3. **Config: maxDuration økt** til 120s i `vercel.json`
