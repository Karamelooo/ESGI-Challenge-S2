import { loadStripe, type Stripe } from '@stripe/stripe-js';

const stripePromise: Promise<Stripe | null> = loadStripe('your-publishable-key'); // key à ajouter

//petite modif

export default stripePromise;
