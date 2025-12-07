from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv() # Load API key from .env file

def generate_ai_report(chart_data, report_type='natal'):
    api_key = os.getenv("API_KEY")
    if not api_key:
        return {"error": "API Key not configured"}

    client = genai.Client(api_key=api_key)
    
    # Create a prompt based on the calculated chart data
    prompt = f"""
    Du er en ekspert astrolog. Lag en kort, profesjonell {report_type}-rapport basert på følgende data:
    
    Ascendant: {chart_data.get('ascendant', 'Ukjent')}
    Solen: {next((p['sign'] for p in chart_data['positions'] if p['name'] == 'Sun'), 'Ukjent')}
    Månen: {next((p['sign'] for p in chart_data['positions'] if p['name'] == 'Moon'), 'Ukjent')}
    
    Fokuser på {report_type}-aspekter. Bruk et empatisk og innsiktsfullt språk.
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return {"content": response.text}
    except Exception as e:
        return {"error": str(e)}