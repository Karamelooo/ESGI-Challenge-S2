<script>
import { showToast } from '@/utils/toast'
import Chart from 'chart.js/auto'
import { onMounted, ref } from 'vue'

const baseUrl = import.meta.env.VITE_BACK_APP_URL
export default {
  data() {
    return {
      revenueChart: null,
      categoryChart: null,
      basketChart: null,
      customersChart: null,
      selectedTimeframe: 'month',
    }
  },
  mounted() {
    this.initCharts()

    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    async downloadDatabase() {
      try {
        const response = await fetch(`${baseUrl}/exportbdd/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
        if (!response.ok) {
          throw new Error('Erreur lors du téléchargement de la base de données')
        }
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'database.json')
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
      catch (error) {
        console.error(error)
        showToast('Une erreur est survenue lors du téléchargement.')
      }
    },
    initCharts() {
      this.$nextTick(() => {
        this.initRevenueChart()
        this.initCategoryChart()
        this.initBasketChart()
        this.initCustomersChart()
      })
    },
    initRevenueChart() {
      const ctx = document.getElementById('revenueChart')
      if (!ctx)
        return

      this.revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [{
            label: 'Chiffre d\'affaires (€)',
            data: [12000, 19000, 15000, 25000, 22000, 30000],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          }],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Évolution du chiffre d\'affaires',
            },
          },
        },
      })
    },
    initCategoryChart() {
      const ctx = document.getElementById('categoryChart')
      if (!ctx)
        return
      this.categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Cartes Pokémon', 'Cartes Memes'],
          datasets: [{
            data: [30, 25],
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
            ],
          }],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Répartition des ventes par catégorie',
            },
          },
        },
      })
    },
    initBasketChart() {
      const ctx = document.getElementById('basketChart')
      if (!ctx)
        return
      this.basketChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [{
            label: 'Valeur moyenne du panier (€)',
            data: [85, 72, 78, 95, 82, 89],
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
          }],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Valeur moyenne des paniers',
            },
          },
        },
      })
    },
    initCustomersChart() {
      const ctx = document.getElementById('customersChart')
      if (!ctx)
        return
      this.customersChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [{
            label: 'Nouveaux clients',
            data: [45, 38, 52, 48, 65, 58],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          }],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Nouveaux clients par mois',
            },
          },
        },
      })
    },
  },
}
</script>

<template>
  <div>
    <h2>Administration</h2>
    <nav>
      <ul>
        <li>
          <router-link to="/admin/dashboard">
            Dashboard
          </router-link>
        </li>
        <li>
          <router-link to="/admin/products">
            Produits
          </router-link>
        </li>
        <li>
          <div>
            <button @click="downloadDatabase">
              Télécharger la base de données
            </button>
          </div>
        </li>
        <li>
          <router-link to="/admin/orders">
            Commandes
          </router-link>
        </li>
        <li>
          <router-link to="/admin/users">
            Utilisateurs
          </router-link>
        </li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>
