import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import uvicorn

try:
    from astrology import calculate_swisseph_chart, generate_ai_interpretation, chat_with_astrologer, calculate_composite_chart, calculate_synastry_chart
    from tarot import tarot_deck
    from knowledge_base import kb
except ImportError:
    from backend.astrology import calculate_swisseph_chart, generate_ai_interpretation, chat_with_astrologer, calculate_composite_chart, calculate_synastry_chart
    from backend.tarot import tarot_deck
    from backend.knowledge_base import kb

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChartData(BaseModel):
    date: str
    time: str
    lat: float
    lon: float
    house_system: str = "W"
    name: Optional[str] = "Klient"
    is_time_unknown: bool = False # NYTT FELT

class SynastryRequest(BaseModel):
    personA: ChartData
    personB: ChartData

class ReportRequest(BaseModel):
    chart_data: dict
    report_type: str

class ChatRequest(BaseModel):
    message: str
    chart_data: Dict[str, Any]

class TarotRequest(BaseModel):
    question: str
    deck: str = "Rider-Waite"
    spread: str = "one-card"
    theme: str = "general"
    chart_data: Optional[Dict[str, Any]] = None

# --- Spread Definitions (samme som før) ---
SPREAD_DEFINITIONS = {
    "one-card": ["Dagens Råd / Fokus"],
    "three-card": {
        "general": ["Fortid", "Nåtid", "Fremtid"],
        "love": ["Deg", "Den Andre", "Dynamikken"],
        "career": ["Utfordring", "Løsning", "Resultat"],
        "growth": ["Hva må gå", "Hva må komme", "Hvordan vokse"]
    },
    "five-card": {
        "general": ["Nåværende Situasjon", "Hva blokkerer", "Hva hjelper", "Kortsiktig utfall", "Langsiktig utfall"],
        "love": ["Dine følelser", "Partnerens følelser", "Hva binder dere", "Hva skiller dere", "Fremtidsutsikt"],
        "career": ["Nåværende jobb", "Dine ambisjoner", "Skjulte muligheter", "Utfordringer", "Karrierevei"]
    },
    "celtic-cross": [
        "Nåværende Situasjon", "Det som krysser (Utfordring)", "Grunnlaget (Underbevisst)", 
        "Fortiden", "Kronen (Bevisst mål)", "Nær fremtid", 
        "Deg selv (Holdning)", "Omgivelsene", "Håp og Frykt", "Utfallet"
    ]
}

@app.get("/")
def read_root():
    return {"status": "Astro Mason Backend OK"}

@app.post("/api/calculate-chart")
def calculate_chart(req: ChartData):
    try:
        data = req.dict()
        return calculate_swisseph_chart(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/calculate-synastry")
def synastry(req: SynastryRequest):
    try:
        return calculate_synastry_chart(req.personA.dict(), req.personB.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/calculate-composite")
def composite(req: SynastryRequest):
    try:
        return calculate_composite_chart(req.personA.dict(), req.personB.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-report")
async def generate_report(req: ReportRequest):
    try:
        content = await generate_ai_interpretation(req.chart_data, req.report_type)
        return {"content": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(req: ChatRequest):
    try:
        reply = await chat_with_astrologer(req.message, req.chart_data)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tarot/draw")
async def draw_tarot(req: TarotRequest):
    try:
        # 1. Spread Logic
        num_cards = 1
        position_names = []
        if req.spread == "one-card":
            num_cards = 1
            position_names = SPREAD_DEFINITIONS["one-card"]
        elif req.spread == "celtic-cross":
            num_cards = 10
            position_names = SPREAD_DEFINITIONS["celtic-cross"]
        else:
            defs = SPREAD_DEFINITIONS.get(req.spread)
            if defs:
                position_names = defs.get(req.theme, defs["general"])
                num_cards = len(position_names)
            else:
                num_cards = 3 if req.spread == "three-card" else 5
                position_names = [f"Posisjon {i+1}" for i in range(num_cards)]

        # 2. Draw Cards
        cards = tarot_deck.draw_spread(req.deck, num_cards)
        for i, card in enumerate(cards):
            card['positionName'] = position_names[i] if i < len(position_names) else f"Kort {i+1}"

        # 3. AI
        import os
        from google import genai
        api_key = os.getenv("API_KEY")
        
        interpretation = "API-nøkkel mangler."
        if api_key:
            client = genai.Client(api_key=api_key)
            cards_text = "\n".join([f"- {c['positionName']}: {c['name']} ({c['type']})" for c in cards])
            astro_context = ""
            if req.chart_data:
                 astro_context = f"Brukerens Astrologi: Asc {req.chart_data.get('ascendant', '?')}, {str(req.chart_data.get('positions', [])[:3])}..."

            prompt = f"""
            Du er en Tarot-mester. Tolk følgende legg med kortstokken {req.deck}.
            Tema: {req.theme.capitalize()}. Spread: {req.spread}.
            Spørsmål: "{req.question}"
            
            Kortene:
            {cards_text}
            
            {astro_context}
            
            Gi en dyp, profesjonell tolkning på norsk.
            """
            
            try:
                response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
                interpretation = response.text
            except Exception as e:
                interpretation = f"Kunne ikke tolke: {str(e)}"

        return {"cards": cards, "interpretation": interpretation}

    except Exception as e:
        print(f"Tarot Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
