import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import type { Application, Request, Response } from 'express';
import express from 'express';
import mongoose from 'mongoose';
import Payment from './models/payment.model';

import Stripe from 'stripe';
import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes';
import productRoutes from './routes/product.routes';


// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-11-20.acacia',
});

// MongoDB connection
const mongoString = 'mongodb://esgi:esgi@database:27017';

mongoose
  .connect(mongoString)
  .then(() => {
    console.log('Database Connected');
  })
  .catch((error: Error) => {
    console.error(error);
  });

const app: Application = express();

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost',
    credentials: true,
  })
);

// Test route
app.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Le serveur fonctionne correctement' });
});

// Stripe Payment Intent Endpoint
app.post('/create-payment-intent', async (req: Request, res: Response) => {
  const { amount, currency, userId } = req.body;

  try {
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { userId }, // Optional metadata
    });

    // Save the payment to the database
    const newPayment = new Payment({
      paymentIntentId: paymentIntent.id,
      amount,
      currency,
      status: paymentIntent.status,
      userId, // Optional: associate with a user
    });

    await newPayment.save();

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

app.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
  
      event = stripe.webhooks.constructEvent(req.body, sig!, stripeWebhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed.', err);
      res.status(400).send(`Webhook Error: ${(err as Error).message}`);
      return;
    }


    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        Payment.findOneAndUpdate(
          { paymentIntentId: paymentIntent.id },
          { status: paymentIntent.status },
          (err: any) => {
            if (err) {
              console.error('Database update error:', err);
            } else {
              console.log('Payment succeeded:', paymentIntent.id);
            }
          }
        );
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        Payment.findOneAndUpdate(
          { paymentIntentId: paymentIntent.id },
          { status: paymentIntent.status },
          (err: any) => {
            if (err) {
              console.error('Database update error:', err);
            } else {
              console.log('Payment failed:', paymentIntent.id);
            }
          }
        );
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);
// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

app.use('/api/cart', cartRoutes);
console.log(authRoutes);

app.listen(8080, () => {
  console.log('Server started and listening on port 8080');
});
