
import Anthropic from '@anthropic-ai/sdk';
import { generateCustomTarotPrompt } from '../services/tarot-prompts.js';

const client = new Anthropic();

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send({ error: { message: 'Only POST allowed' } });
    }

    const { cards, spread, style, clientData, userContext, lang } = req.body;

    try {
        // Generer den dynamiske, tilpassede prompten
        const tarotSystemPrompt = generateCustomTarotPrompt(style, spread.name, userContext, `Klient: ${clientData.clientName}`);
        
        const cardDetails = cards.map(c => {
            const cardName = c.card?.name || c.name || 'Ukjent'; // Robust tilgang til navn
            return `${cardName}${c.isReversed ? ' (Reversert)' : ''}`;
        }).join(', ');

        const userMessage = `
        ### KORTSTOKK
        ${cardDetails}

        ### POSISJONER
        ${spread.positions.join(', ')}

        ### TOLKNING
        Utfør en dyptgående tolkning basert på protokollen.
        `;

        const msg = await client.messages.create({
            model: 'claude-3-opus-20240229',
            max_tokens: 4096,
            system: tarotSystemPrompt, // Bruk den genererte systemprompten
            messages: [{
                role: 'user',
                content: userMessage
            }]
        });

        const responseText = msg.content[0].text;
        res.status(200).json({ content: [{ type: 'text', text: responseText }] });

    } catch (error) {
        console.error('Error calling Anthropic API:', error);
        res.status(500).json({
            error: {
                message: 'En feil oppstod under kommunikasjon med AI-tjenesten.',
                details: error.message
            }
        });
    }
};
