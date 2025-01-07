import type { Request, Response } from 'express'
import Order from '../models/order.model'
import Product from '../models/product.model'

// Obtenir toutes les commandes
export async function getOrders(req: Request, res: Response): Promise<void> {
  try {
    const orders = await Order.find({})
    res.json(orders)
  }
  catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error })
  }
}

// Obtenir une commande par Id
export async function getOrderById(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const order = await Order.findById(id)
    res.json(order)
  }
  catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la commande', error })
  }
}

// Créer une commande
export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const { user, products, totalAmount, status, shippingAddress, postalCode } = req.body

    if (products === undefined || totalAmount === undefined || shippingAddress === undefined || postalCode === undefined) {
      res.status(422).json({ message: 'Les champs : products, totalAmount, shippingAddress et postalCode sont requis' })
      return
    }

    const newOrder = new Order({ user, products, totalAmount, status, shippingAddress, postalCode })
    await newOrder.save()
    res.status(201).json(newOrder)
  }
  catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de la commande', error })
  }
}

// Mettre à jour une commande
export async function updateOrder(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true })
    if (!updatedOrder) {
      res.status(404).json({ message: 'Commande non trouvé' })
      return
    }
    res.json(updatedOrder)
  }
  catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de la commande', error })
  }
}

// Supprimer une commande
export async function deleteOrder(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const deletedOrder = await Order.findByIdAndDelete(id)
    if (!deletedOrder) {
      res.status(404).json({ message: 'Commande non trouvé' })
      return
    }
    res.status(204).send()
  }
  catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression de la commande', error })
  }
}