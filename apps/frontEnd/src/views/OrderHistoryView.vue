<script setup lang="ts">
import AdvancedTable from '@/components/AdvancedTable.vue'
import api from '@/services/api'
import { onMounted, ref } from 'vue'

const orders = ref([])

const headers = [
  { key: 'createdAt', label: 'Date', searchable: true },
  { key: 'totalAmount', label: 'Montant total', searchable: true },
  { key: 'status', label: 'Statut', searchable: true },
  { key: 'shippingAddress.city', label: 'Ville de livraison', searchable: true },
]

async function fetchOrders() {
  try {
    const response = await api.get('/orders/user')
    orders.value = response.data.map(order => ({
      ...order,
      createdAt: new Date(order.createdAt).toLocaleDateString('fr-FR'),
      totalAmount: `${order.totalAmount}€`,
    }))
  }
  catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error)
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="orders-history">
    <h1>Historique des commandes</h1>
    <AdvancedTable
      :headers="headers"
      :data="orders"
    />
  </div>
</template>

<style scoped>
.orders-history {
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
}
</style> 