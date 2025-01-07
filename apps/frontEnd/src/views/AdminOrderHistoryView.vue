<script setup lang="ts">
import AdvancedTable from '@/components/AdvancedTable.vue'
import api from '@/services/api'
import { onMounted, ref } from 'vue'

const orders = ref([])

const headers = [
  { key: 'createdAt', label: 'Date', searchable: true },
  { key: 'user.email', label: 'Utilisateur', searchable: true },
  { key: 'totalAmount', label: 'Montant total', searchable: true },
  { key: 'status', label: 'Statut', searchable: true },
  { key: 'shippingAddress.city', label: 'Ville de livraison', searchable: true },
]

const actions = [
  {
    label: 'Modifier le statut',
    method: updateOrderStatus
  }
]

const statusOptions = ['Pending', 'Shipped', 'Delivered', 'Cancelled']
const selectedOrder = ref(null)
const showStatusModal = ref(false)

async function fetchOrders() {
  try {
    const response = await api.get('/orders')
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

function updateOrderStatus(order) {
  selectedOrder.value = order
  showStatusModal.value = true
}

async function saveOrderStatus(newStatus) {
  try {
    await api.put(`/orders/${selectedOrder.value._id}`, {
      status: newStatus
    })
    showStatusModal.value = false
    selectedOrder.value = null
    await fetchOrders()
  }
  catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="admin-orders">
    <h1>Gestion des commandes</h1>
    <AdvancedTable
      :headers="headers"
      :data="orders"
      :actions="actions"
    />

    <div v-if="showStatusModal" class="status-modal">
      <div class="modal-content">
        <h2>Modifier le statut de la commande</h2>
        <select v-model="selectedOrder.status">
          <option v-for="status in statusOptions" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
        <div class="modal-actions">
          <button @click="saveOrderStatus(selectedOrder.status)">
            Sauvegarder
          </button>
          <button @click="showStatusModal = false">
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-orders {
  padding: 2rem;
}

.status-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
}

.modal-actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}
</style>