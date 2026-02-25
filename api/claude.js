
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { model = 'claude-sonnet-4-6', max_tokens = 4096, system, messages, apiKey } = req.body || {};

  const key = process.env.ANTHROPIC_API_KEY || apiKey;
  if (!key) return res.status(401).json({ error: 'No Anthropic API key provided. Set ANTHROPIC_API_KEY in Vercel environment variables, or enter your key in app Settings.' });

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  try {
    const client = new Anthropic({ apiKey: key });
    const params = { model, max_tokens, messages };
    if (system) params.system = system;

    const response = await client.messages.create(params);
    res.status(200).json(response);
  } catch (err) {
    console.error('Anthropic proxy error:', err);
    res.status(500).json({ error: err.message || 'Anthropic API call failed' });
  }
}
