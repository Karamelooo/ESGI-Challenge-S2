import type { Request, Response } from 'express'
import Order from '../models/order.model'
import Product from '../models/product.model'
import User from '../models/user.model'

// Exporter la BDD
export async function exportBdd(req: Request, res: Response): Promise<void> {
  try {
    const orders = await Order.find()
    const products = await Product.find()
    const users = await User.find()

    const databaseExport = {
      orders,
      products,
      users,
    }

    res.setHeader('Content-Disposition', 'attachment; filename=database.json')
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(JSON.stringify(databaseExport, null, 2))
  }
  catch (error) {
    console.error('Error exporting database:', error)
    res.status(500).json({ message: 'An error occurred while exporting the database.' })
  }
}
