import type { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { Router } from 'express'
import Stripe from 'stripe'
import Payment from '../models/payment.model'

const router = Router()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-12-18.acacia',
})

router.post('/create-payment-intent', async (req: Request, res: Response) => {
  const { amount, currency, userId } = req.body

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { userId }, // Optional metadata
    })

    const newPayment = new Payment({
      paymentIntentId: paymentIntent.id,
      amount,
      currency,
      status: paymentIntent.status,
      userId,
    })

    await newPayment.save()

    res.json({ clientSecret: paymentIntent.client_secret })
  }
  catch (error) {
    console.error('Error creating payment intent:', error)
    res.status(500).json({ error: (error as Error).message })
  }
})

const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string

router.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature']

    let event

    try {
      event = Stripe.webhooks.constructEvent(req.body, sig!, stripeWebhookSecret)
    }
    catch (err) {
      console.error('Webhook signature verification failed.', err)
      res.status(400).send(`Webhook Error: ${(err as Error).message}`)
      return
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        Payment.findOneAndUpdate(
          { paymentIntentId: paymentIntent.id },
          { status: paymentIntent.status },
          (err: any) => {
            if (err) {
              console.error('Database update error:', err)
            }
            else {
              console.log('Payment succeeded:', paymentIntent.id)
            }
          },
        )
        break
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        Payment.findOneAndUpdate(
          { paymentIntentId: paymentIntent.id },
          { status: paymentIntent.status },
          (err: any) => {
            if (err) {
              console.error('Database update error:', err)
            }
            else {
              console.log('Payment failed:', paymentIntent.id)
            }
          },
        )
        break
      }
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.json({ received: true })
  },
)

export default router
