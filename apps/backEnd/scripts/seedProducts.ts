import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../src/models/product.model';

dotenv.config();


const mongoURI = process.env.DB_URL || 'mongodb://localhost:27017/db/test';

mongoose
  .connect(mongoURI)
  .then(() => console.log('Connected to MongoDB for seeding...'))
  .catch((err) => console.error('MongoDB connection error:', err));


const products = [
    {
      name: 'Pikachu VMAX',
      description: 'A rare Pikachu VMAX card with a strong Thunderbolt attack.',
      price: 25.99,
      stock: 10,
      images: ['https://example.com/images/pikachu-vmax.jpg'],
      category: '64b7d07de6c9f1001e4d7b9b',
    },
    {
      name: 'Charizard EX',
      description: 'A legendary Charizard EX card with Flame Burst ability.',
      price: 49.99,
      stock: 5,
      images: ['https://example.com/images/charizard-ex.jpg'],
      category: '64b7d07de6c9f1001e4d7b9b',
    },
  ];
  

const seedProducts = async () => {
  try {
    await Product.insertMany(products);
    console.log('Pokémon cards seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding Pokémon cards:', error);
    mongoose.connection.close();
  }
};

seedProducts();
