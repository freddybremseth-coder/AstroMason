
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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Debug: sjekk om env var er satt
  if (req.method === 'GET') {
    return res.status(200).json({
      hasKey: !!process.env.ANTHROPIC_API_KEY,
      keyLength: process.env.ANTHROPIC_API_KEY?.length || 0,
      nodeEnv: process.env.NODE_ENV || 'ukjent',
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Parse body — Vercel ESM runtime may not auto-parse JSON
  const body = (req.body && typeof req.body === 'object') ? req.body : await readBody(req);

  const {
    model = 'claude-sonnet-4-6',
    max_tokens = 4096,
    system,
    messages,
    apiKey,
  } = body;

  const key = process.env.ANTHROPIC_API_KEY || apiKey;

  if (!key) {
    return res.status(401).json({ error: 'Ingen API-nøkkel. Sett ANTHROPIC_API_KEY i Vercel Environment Variables, eller lim inn nøkkelen i Innstillinger.' });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages-array mangler eller er tomt' });
  }

  const requestBody = { model, max_tokens, messages };
  if (system) requestBody.system = system;

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
