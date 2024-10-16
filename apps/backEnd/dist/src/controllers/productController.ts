import { Request, Response } from 'express';
import Product, { IProduct } from '../models/product.model';

// Création d'un produit
export const createProduct = async (req: Request, res: Response): Promise<Response> => {
	try {
		const { name, description, price, quantity } = req.body;
		const newProduct = new Product({ name, description, price, quantity });
		await newProduct.save();
		return res.status(201).json(newProduct);
	} catch (error) {
		return res.status(500).json({ error: 'Erreur lors de la création du produit.' });
	}
};

// Lecture d'un produit par ID
export const getProduct = async (req: Request, res: Response): Promise<Response> => {
	try {
		const product = await Product.findById(req.params.id);
		return product ? res.json(product) : res.status(404).json({ error: 'Produit non trouvé.' });
	} catch (error) {
		return res.status(500).json({ error: 'Erreur lors de la récupération du produit.' });
	}
};

// Mise à jour d'un produit
export const updateProduct = async (req: Request, res: Response): Promise<Response> => {
	try {
		const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
		return product ? res.json(product) : res.status(404).json({ error: 'Produit non trouvé.' });
	} catch (error) {
		return res.status(500).json({ error: 'Erreur lors de la mise à jour du produit.' });
	}
};

// Suppression d'un produit
export const deleteProduct = async (req: Request, res: Response): Promise<Response> => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);
		return product ? res.status(204).send() : res.status(404).json({ error: 'Produit non trouvé.' });
	} catch (error) {
		return res.status(500).json({ error: 'Erreur lors de la suppression du produit.' });
	}
};
