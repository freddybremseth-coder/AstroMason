
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { priceId, email, amount } = req.body;

      // Opprett en Stripe Checkout Session
      // Merk: priceId må matche en ekte Price ID fra ditt Stripe Dashboard i produksjon
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId, 
            quantity: 1,
          },
        ],
        mode: 'payment',
        // Vi sender med mengden kreditter i suksess-URL-en slik at vi kan oppdatere balansen (forenklet)
        // I en full produksjons-app bør dette skje via en Stripe Webhook for 100% sikkerhet
        success_url: `${req.headers.origin}/settings?success=true&amount=${amount}`,
        cancel_url: `${req.headers.origin}/settings?canceled=true`,
        customer_email: email,
        metadata: {
          credit_amount: amount.toString(),
        },
      });

      res.status(200).json({ url: session.url });
    } catch (err) {
      console.error('Stripe Error:', err);
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
