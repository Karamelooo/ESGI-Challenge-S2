import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import Order from '../models/order.model'
import Product from '../models/product.model'
import User from '../models/user.model'
import { async } from './logout.controller'

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

// export user info
export async function exportUser(req: Request, res: Response): Promise<void> {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.status(401).json({ message: 'Token manquant' })
      return
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' })
    }

    res.setHeader('Content-Disposition', `attachment; filename=user.json`)
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(JSON.stringify(user, null, 2))
  }
  catch (error) {
    console.error('Erreur lors de l\'exportation de l\'utilisateur :', error)
    res.status(500).json({ message: 'Une erreur est survenue lors de l\'exportation des données utilisateur.' })
  }
}
