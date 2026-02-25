
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { model = 'claude-sonnet-4-6', max_tokens = 4096, system, messages, apiKey } = req.body || {};

  const key = process.env.ANTHROPIC_API_KEY || apiKey;
  if (!key) {
    return res.status(401).json({ error: 'No Anthropic API key. Set ANTHROPIC_API_KEY in Vercel Environment Variables.' });
  }
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const body = { model, max_tokens, messages };
  if (system) body.system = system;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || `Anthropic error ${response.status}` });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: err.message || 'Proxy failed' });
  }
}
