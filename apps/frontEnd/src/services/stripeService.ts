import { loadStripe, type Stripe } from '@stripe/stripe-js';

const stripePromise: Promise<Stripe | null> = loadStripe('your-publishable-key'); // Replace with your Stripe publishable key

export default stripePromise;