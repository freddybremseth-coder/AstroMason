class KnowledgeBase:
    def __init__(self):
        """
        En database med kuratert ekspertkunnskap for Astro Mason.
        Inneholder:
        1. Klassisk Astrologi (Ptolemy, Lilly, Hand)
        2. Psykologisk & Evolusjonær Astrologi (Greene, Forrest, Arroyo)
        3. Esoterisk & Karmisk Astrologi (Alice Bailey, Jan Spiller)
        4. Tarot (Waite, Crowley, moderne tolkninger)
        """
        self.qa_database = [
            # --- ASTROLOGI: PLANETER & PERSONLIGHET ---
            {
                "tags": ["solen", "personlighet", "livsformål", "klassisk"],
                "expert": "Astro Mason Core",
                "q": "Hva symboliserer Solen i et horoskop?",
                "a": "Solen representerer kjernen i personligheten, egoet, viljen og livskraften. I klassisk astrologi er det helten i din egen reise. Esoterisk sett symboliserer Solen sjelens kvalitet og utstråling som må foredles."
            },
            {
                "tags": ["månen", "følelser", "underbevissthet", "behov"],
                "expert": "Stephen Arroyo",
                "q": "Hva betyr Månen i astrologi?",
                "a": "Månen styrer følelseslivet, instinktive reaksjoner, vaner og det underbevisste. Den viser hva du trenger for å føle deg trygg og hvordan du gir omsorg."
            },
            {
                "tags": ["merkur", "kommunikasjon", "tanke", "læring"],
                "expert": "Klassisk Astrologi",
                "q": "Hva er Merkurs rolle?",
                "a": "Merkur styrer kommunikasjon, tenkning, logikk, handel og korte reiser. Dens plassering viser hvordan du lærer og formidler informasjon."
            },
            {
                "tags": ["venus", "kjærlighet", "verdier", "penger"],
                "expert": "Liz Greene",
                "q": "Hva symboliserer Venus?",
                "a": "Venus representerer kjærlighet, skjønnhet, harmoni, verdier og evnen til å tiltrekke seg ressurser. Psykologisk viser den hva vi verdsetter og hvordan vi relaterer oss til andre."
            },
            {
                "tags": ["mars", "handling", "energi", "konflikt"],
                "expert": "Astro Mason Core",
                "q": "Hva betyr Mars i et horoskop?",
                "a": "Mars er planeten for handling, begjær, aggresjon og energi. Den viser hvordan du hevder deg selv, din kampvilje og din seksuelle energi."
            },
            {
                "tags": ["jupiter", "vekst", "lykke", "filosofi"],
                "expert": "Robert Hand",
                "q": "Hva er Jupiters funksjon?",
                "a": "Jupiter står for ekspansjon, vekst, optimisme, tro og høyere lærdom. Den viser hvor i livet du søker mening og hvor du har størst potensial for flaks."
            },
            {
                "tags": ["saturn", "struktur", "karma", "ansvar"],
                "expert": "Liz Greene",
                "q": "Hvordan tolkes Saturn?",
                "a": "Saturn er 'Den Store Læreren'. Den bringer struktur, disiplin, begrensninger og ansvar. Psykologisk representerer den våre forsvarsmekanismer og hvor vi må jobbe hardest for å oppnå mestring."
            },
            {
                "tags": ["uranus", "frihet", "revolusjon", "endring"],
                "expert": "Moderne Astrologi",
                "q": "Hva betyr Uranus?",
                "a": "Uranus er planeten for plutselige endringer, opprør, frihet, originalitet og intuisjon. Den bryter ned gamle strukturer for å skape noe nytt."
            },
            {
                "tags": ["neptun", "drømmer", "illusjon", "spiritualitet"],
                "expert": "Steven Forrest",
                "q": "Hva symboliserer Neptun?",
                "a": "Neptun styrer drømmer, illusjoner, spiritualitet, empati og det grenseløse. Den løser opp egoet, men kan også føre til forvirring eller virkelighetsflukt."
            },
            {
                "tags": ["pluto", "transformasjon", "makt", "død"],
                "expert": "Jeff Green",
                "q": "Hva er Plutos rolle?",
                "a": "Pluto representerer transformasjon, død og gjenfødelse, makt og sjelens dypeste begjær. Den krever at vi eliminerer alt som ikke lenger tjener vår evolusjon."
            },

            # --- KARMISK & ESOTERISK ASTROLOGI ---
            {
                "tags": ["måneknuter", "nordnode", "sørnode", "karma", "jan spiller"],
                "expert": "Jan Spiller",
                "q": "Hva betyr måneknutene (North Node/South Node)?",
                "a": "Sørnoden representerer dine talenter og vaner fra tidligere liv – din komfortsone. Nordnoden viser din sjelsoppgave i dette livet, retningen du må strekke deg mot for å vokse."
            },
            {
                "tags": ["saturn", "karma", "ansvar", "tidligere liv"],
                "expert": "Steven Forrest",
                "q": "Er Saturn dårlig karma?",
                "a": "Saturn er ikke 'dårlig', men representerer karmisk tyngde og ansvar vi har valgt å ta på oss. Den viser hvor vi må modnes og utvikle integritet."
            },
            {
                "tags": ["esoterisk", "sjel", "personlighet", "alice bailey"],
                "expert": "Alice Bailey",
                "q": "Hva er forskjellen på sjel og personlighet i esoterisk astrologi?",
                "a": "Personligheten (Ego) styres av de tradisjonelle planetene (f.eks. Mars for Væren). Sjelen styres av esoteriske herskere (f.eks. Merkur for Væren). Målet er at personligheten skal bli et redskap for sjelen."
            },
            {
                "tags": ["chiron", "healer", "sår", "healing"],
                "expert": "Melanie Reinhart",
                "q": "Hva betyr Chiron?",
                "a": "Chiron er 'Den Sårede Healer'. Den viser hvor vi har dype sår (fysisk eller psykisk) som kanskje aldri forsvinner helt, men som gir oss visdommen til å helbrede andre."
            },

            # --- HUS & OMRÅDER ---
            {
                "tags": ["1. hus", "ascendant", "selv"],
                "expert": "Klassisk Astrologi",
                "q": "Hva betyr det 1. huset?",
                "a": "Huset for selvet, fysisk kropp, utseende og hvordan du møter verden (masken). Ascendanten er startpunktet her."
            },
            {
                "tags": ["7. hus", "relasjoner", "ekteskap", "partnerskap"],
                "expert": "Jan Spiller",
                "q": "Hva betyr planeter i 7. hus?",
                "a": "Det indikerer fokus på partnere, ekteskap og åpne fiender. Læringskurven her handler om samarbeid, balanse og å se seg selv gjennom andre."
            },
            {
                "tags": ["10. hus", "karriere", "mc", "status"],
                "expert": "Moderne Astrologi",
                "q": "Hva styrer det 10. huset?",
                "a": "Karriere, offentlig omdømme, autoriteter, livsmål og arven vi etterlater oss. MC (Medium Coeli) er startpunktet."
            },
            {
                "tags": ["12. hus", "karma", "underbevissthet", "skjult"],
                "expert": "Dane Rudhyar",
                "q": "Hva betyr det 12. huset?",
                "a": "Huset for det underbevisste, karma, isolasjon, drømmer og åndelighet. Planeter her kan være 'skjulte' for eieren, men sterke kilder til inspirasjon."
            },

            # --- TAROT: MAJOR ARCANA (UTVALG) ---
            {
                "tags": ["tarot", "the fool", "narren", "0"],
                "expert": "Tarot Master",
                "q": "Hva betyr The Fool (Narren) i Tarot?",
                "a": "Narren (0) er kortet for nye begynnelser, uskyld, spontanitet og et sprang i tro. Det oppfordrer deg til å stole på universet og starte på nytt med et åpent hjerte."
            },
            {
                "tags": ["tarot", "the magician", "magikeren", "1"],
                "expert": "Tarot Master",
                "q": "Hva betyr The Magician (Magikeren)?",
                "a": "Magikeren (I) handler om manifestasjon, viljestyrke og ressurser. Du har alle verktøyene du trenger for å skape din egen virkelighet. 'Som over, så under'."
            },
            {
                "tags": ["tarot", "high priestess", "yppersteprestinnen", "2"],
                "expert": "Tarot Master",
                "q": "Hva betyr The High Priestess?",
                "a": "Yppersteprestinnen (II) symboliserer intuisjon, mysterier og det underbevisste. Svaret finnes inni deg, ikke i den ytre verden. Lytt til drømmer og magefølelse."
            },
            {
                "tags": ["tarot", "the empress", "keiserinnen", "3"],
                "expert": "Tarot Master",
                "q": "Hva betyr The Empress?",
                "a": "Keiserinnen (III) står for fruktbarhet, kreativitet, overflod og sanselighet. Det er en tid for å nyte naturen, skape noe vakkert og gi omsorg."
            },
            {
                "tags": ["tarot", "the lovers", "de elskende", "6"],
                "expert": "Tarot Master",
                "q": "Hva betyr The Lovers?",
                "a": "De Elskende (VI) handler om valg, kjærlighet, harmoni og partnerskap. Det kan indikere et viktig veivalg basert på dine dypeste verdier."
            },
            {
                "tags": ["tarot", "death", "døden", "13"],
                "expert": "Tarot Master",
                "q": "Hva betyr Death-kortet?",
                "a": "Døden (XIII) betyr sjelden fysisk død, men heller en dyp transformasjon, slutten på en syklus og begynnelsen på en ny. Gi slipp på det gamle for å gi plass til vekst."
            },
            {
                "tags": ["tarot", "the tower", "tårnet", "16"],
                "expert": "Tarot Master",
                "q": "Hva betyr The Tower?",
                "a": "Tårnet (XVI) representerer plutselig, sjokkerende endring som river ned falske strukturer. Det kan være kaotisk, men er nødvendig for å bygge noe sant på en solid grunnmur."
            },
            {
                "tags": ["tarot", "the star", "stjernen", "17"],
                "expert": "Tarot Master",
                "q": "Hva betyr The Star?",
                "a": "Stjernen (XVII) er kortet for håp, inspirasjon, fornyelse og spirituell veiledning. Etter stormen (Tårnet) kommer roen og troen på fremtiden."
            },

            # --- TAROT: MINOR ARCANA (SUITS) ---
            {
                "tags": ["tarot", "wands", "staver", "ild"],
                "expert": "Tarot Master",
                "q": "Hva betyr Staver (Wands) i Tarot?",
                "a": "Staver representerer elementet Ild: Energi, lidenskap, inspirasjon, handling, karriere og kreativitet."
            },
            {
                "tags": ["tarot", "cups", "beger", "vann"],
                "expert": "Tarot Master",
                "q": "Hva betyr Beger (Cups) i Tarot?",
                "a": "Beger representerer elementet Vann: Følelser, relasjoner, intuisjon, kjærlighet og det underbevisste."
            },
            {
                "tags": ["tarot", "swords", "sverd", "luft"],
                "expert": "Tarot Master",
                "q": "Hva betyr Sverd (Swords) i Tarot?",
                "a": "Sverd representerer elementet Luft: Tanker, intellekt, kommunikasjon, sannhet, men også konflikt og bekymring."
            },
            {
                "tags": ["tarot", "pentacles", "mynter", "jord"],
                "expert": "Tarot Master",
                "q": "Hva betyr Mynter (Pentacles) i Tarot?",
                "a": "Mynter representerer elementet Jord: Materiell verden, penger, arbeid, helse, hjem og praktiske resultater."
            },
            
            # --- TAROT + ASTROLOGI KOBLINGER ---
            {
                "tags": ["tarot", "astrologi", "kobling"],
                "expert": "Golden Dawn Tradition",
                "q": "Hvordan kobles Tarot og Astrologi?",
                "a": "Hvert kort i Store Arkana korresponderer med en planet eller et tegn (f.eks. Keiseren = Væren, Keiserinnen = Venus). Små Arkana korresponderer med dekaner (10-graders inndelinger) av dyrekretsen."
            },
            {
                "tags": ["tarot", "ace", "ess", "elementer"],
                "expert": "Tarot Master",
                "q": "Hva betyr Essene i Tarot?",
                "a": "Essene representerer den reneste formen av elementet sitt (Ild, Vann, Luft, Jord). De er frøet til potensiale, en gave eller en ny mulighet som må gripes."
            },
            
            # --- DIVERSE Q&A FRA PDF (UTVALG) ---
            {
                "tags": ["retrograd", "merkur", "kommunikasjon"],
                "expert": "Astro Mason Core",
                "q": "Hva betyr Merkur Retrograd?",
                "a": "En tid for å revurdere, reflektere og korrigere kommunikasjon og tankeprosesser. Unngå å signere viktige kontrakter eller starte helt nye prosjekter hvis mulig, fokuser heller på 're'-ord (revidere, reparere)."
            },
            {
                "tags": ["stellium", "konjunksjon", "energi"],
                "expert": "Astro Mason Core",
                "q": "Hva er et stellium?",
                "a": "En konsentrasjon av tre eller flere planeter i samme tegn eller hus. Dette skaper et intenst fokus av energi på det livsområdet, ofte en 'superkraft' men også en utfordring å balansere."
            },
             {
                "tags": ["synastri", "relasjoner", "kompositt"],
                "expert": "Liz Greene",
                "q": "Hva er forskjellen på Synastri og Kompositt?",
                "a": "Synastri sammenligner to fødselshoroskop for å se hvordan A påvirker B (kjemi). Kompositt-kartet er et matematisk midtpunkt som viser 'forholdets sjel' eller relasjonen som en tredje enhet."
            }
        ]

    def search(self, query, context_tags=[]):
        """
        Søker i kunnskapsbasen basert på nøkkelord og tags.
        Returnerer de mest relevante Q&A-parene.
        """
        query = query.lower()
        results = []
        
        for entry in self.qa_database:
            score = 0
            
            # Vekting av tags (hvis vi vet konteksten, f.eks. 'tarot' eller 'karma')
            for tag in entry['tags']:
                if tag in query or tag in context_tags:
                    score += 3  # Høyere vekt på tags
            
            # Sjekk tekstinnhold
            if entry['q'].lower() in query:
                score += 2
            if entry['a'].lower() in query:
                score += 1
                
            # Hvis query er veldig kort (f.eks. "solen"), sjekk om "solen" er i tags
            tokens = query.split()
            for token in tokens:
                if token in entry['tags']:
                    score += 1

            if score > 0:
                # Legg til litt tilfeldighet for variasjon hvis score er lik,
                # men prioriter høy score.
                results.append({"entry": entry, "score": score})
                
        # Sorter etter score (høyest først) og returner topp 4
        sorted_results = sorted(results, key=lambda x: x['score'], reverse=True)
        return [r['entry'] for r in sorted_results[:4]]

# Eksporter instansen
kb = KnowledgeBase()
