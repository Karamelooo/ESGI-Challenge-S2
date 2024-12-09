import express from 'express';
import stripe from '../utils/stripe'; // Import the Stripe instance

const router = express.Router();

// Route to create a payment intent
router.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency, // e.g., 'usd'
      payment_method_types: ['card'], // Accept card payments
    });

    // Send the client secret back to the frontend
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Error creating payment intent:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
