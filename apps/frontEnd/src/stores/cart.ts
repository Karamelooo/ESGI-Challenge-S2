import axios from 'axios';
import { defineStore } from 'pinia';
import { useUserStore } from './user';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { showToast } from '@/utils/toast';

const baseUrl = import.meta.env.VITE_BACK_APP_URL;

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as Array<{ id: string; name: string; price: number; quantity: number }>,
    total: 0,
  }),

  actions: {
    async fetchCart() {
      const userStore = authMiddleware();
      if (!userStore) throw new Error('Utilisateur non authentifié');
      try {
        const response = await axios.get(`${baseUrl}/cart/`);
        this.items = response.data.cart.items.map((item: any) => ({
          id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          quantity: item.quantity,
        }));
        this.total = response.data.total;
      } catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
        showToast('Erreur lors de la récupération du panier');
      }
    },

    async addToCart(product: { id: string; name: string; price: number }) {
      const userStore = authMiddleware();
      if (!userStore) throw new Error('Utilisateur non authentifié');
      try {
        const response = await axios.post(`${baseUrl}/cart/add`, {
          productId: product.id,
          quantity: 1,
        });
        await this.fetchCart();
        showToast(response.data.message);
      } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        showToast('Produit non disponible');
      }
    },

    async removeFromCart(productId: string) {
      const userStore = authMiddleware();
      if (!userStore) throw new Error('Utilisateur non authentifié');
      try {
        const response = await axios.post(`${baseUrl}/cart/remove`, { productId });
        await this.fetchCart();
        showToast(response.data.message);
      } catch (error) {
        console.error('Erreur lors de la suppression du produit du panier:', error);
        showToast('Erreur lors de la suppression du produit du panier');
      }
    },

    async clearCart() {
      const userStore = authMiddleware();
      if (!userStore) throw new Error('Utilisateur non authentifié');
      try {
        const response = await axios.post(`${baseUrl}/cart/clear`);
        this.items = [];
        this.total = 0;
        showToast(response.data.message);
      } catch (error) {
        console.error('Erreur lors de la vidange du panier:', error);
        showToast('Erreur lors de la vidange du panier');
      }
    },
  },

  getters: {
    cartCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },
  },
});