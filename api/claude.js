
// Import prompt generation logic
const { generateCustomTarotPrompt } = require('../../services/tarot-ai-system.js');

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

    // Check if this is a tarot reading request
    if (rest.isTarotReading) {
        const { cards, spread, style, userContext, clientData } = rest;
        const cardsList = cards.map((c, i) =>
            `Posisjon ${i + 1} (${spread.positions?.[i] || 'Ukjent'}): ${c.card?.name || c.name || 'Ukjent'}${c.isReversed ? ' (Reversert)' : ''} (Keywords: ${(c.card?.keywords || []).join(', ')})`
        ).join('\n');

        finalSystem = generateCustomTarotPrompt(style, spread.name, userContext || 'Generell veiledning', clientData.clientName);
        finalMessages = [{
            role: 'user',
            content: `Analyser dette tarotlegget for ${clientData.clientName || 'klienten'}.\n\nKORT I LEGGET:\n${cardsList}`
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
