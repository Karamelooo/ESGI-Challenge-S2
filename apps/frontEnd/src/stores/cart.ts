import axios from 'axios';
import { defineStore } from 'pinia';
import { useUserStore } from './user';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as Array<{ id: string; name: string; price: number; quantity: number }>,
    total: 0,
  }),

  actions: {
    async fetchCart() {
      const userStore = useUserStore();
      if (!userStore.userId) throw new Error('Utilisateur non authentifié');
      try {
        const response = await axios.get(`/api/cart/${userStore.userId}`);
        this.items = response.data.cart.items.map((item: any) => ({
          id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          quantity: item.quantity,
        }));
        this.total = response.data.total;
      } catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
      }
    },

    async addToCart(product: { id: string; name: string; price: number }) {
      const userStore = useUserStore();
      if (!userStore.userId) throw new Error('Utilisateur non authentifié');
      try {
        await axios.post('/api/cart/add', {
          userId: userStore.userId,
          productId: product.id,
          quantity: 1,
        });
        await this.fetchCart(); // Refresh cart
      } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
      }
    },

    async removeFromCart(productId: string) {
      const userStore = useUserStore();
      if (!userStore.userId) throw new Error('Utilisateur non authentifié');
      try {
        await axios.post('/api/cart/remove', { userId: userStore.userId, productId });
        await this.fetchCart(); // Refresh cart
      } catch (error) {
        console.error('Erreur lors de la suppression du produit du panier:', error);
      }
    },

    async clearCart() {
      const userStore = useUserStore();
      if (!userStore.userId) throw new Error('Utilisateur non authentifié');
      try {
        await axios.post('/api/cart/clear', { userId: userStore.userId });
        this.items = [];
        this.total = 0;
      } catch (error) {
        console.error('Erreur lors de la vidange du panier:', error);
      }
    },
  },

  getters: {
    cartCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },
  },
});
