
import Anthropic from '@anthropic-ai/sdk';

// Helper function to generate a tarot prompt if needed
function generateCustomTarotPrompt(style, spreadType, question, querentSituation) {
    // This is a placeholder for the actual prompt generation logic
    // which should ideally live on the client-side.
    // For now, we'll keep a simplified version here.
    return `You are a professional tarot reader.
    Style: ${style}
    Spread: ${spreadType}
    Question: ${question}
    Situation: ${querentSituation}
    Interpret the cards provided.`;
}


export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send({ error: { message: 'Only POST method is allowed' } });
    }

    const authHeader = req.headers.authorization;
    const apiKey = authHeader ? authHeader.split(' ')[1] : null;

    if (!apiKey) {
        return res.status(401).send({ error: { message: 'Authentication error: Missing API key. Please check your settings.' } });
    }

    try {
        const client = new Anthropic({ apiKey });
        const { isTarotReading, ...restOfBody } = req.body;

        let requestBody;

        // If it's a tarot reading, we construct a specific message format
        if (isTarotReading) {
            const { cards, spread, style, clientData, userContext } = restOfBody;
            
            const tarotSystemPrompt = generateCustomTarotPrompt(style, spread.name, userContext, `Client: ${clientData.clientName}`);
            
            const cardDetails = cards.map(c => {
                const cardName = c.card?.name || c.name || 'Unknown';
                return `${cardName}${c.isReversed ? ' (Reversed)' : ''}`;
            }).join(', ');

            const userMessage = `
            ### DECK
            ${cardDetails}

            ### POSITIONS
            ${spread.positions.join(', ')}

            ### INTERPRETATION
            Please perform a deep interpretation based on the protocol.
            `;

            requestBody = {
                model: restOfBody.model || 'claude-3-sonnet-20240229',
                max_tokens: restOfBody.max_tokens || 4096,
                system: tarotSystemPrompt,
                messages: [{
                    role: 'user',
                    content: userMessage
                }]
            };

        } else {
            // For all other non-tarot AI calls, we pass the request body directly
            requestBody = {
                messages: restOfBody.messages,
                model: restOfBody.model || 'claude-3-sonnet-20240229',
                max_tokens: restOfBody.max_tokens || 1024,
                system: restOfBody.system,
            };
        }
        
        const msg = await client.messages.create(requestBody);

        const responseText = msg.content[0].text;
        res.status(200).json({ content: [{ type: 'text', text: responseText }] });

    } catch (error) {
        console.error('Error communicating with Anthropic API:', error);
        
        // Specifically check for authentication errors from the API provider
        if (error && error.status === 401) {
            return res.status(401).json({
                error: {
                    message: 'Authentication failed. The provided API key is likely invalid or expired.',
                    details: error.message
                }
            });
        }

        res.status(500).json({
            error: {
                message: 'An internal error occurred while communicating with the AI service.',
                details: error.message
            }
        });
    }
};
