<script>
import { showToast } from '@/utils/toast'
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
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
      if (!ctx) return
      
      this.revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [{
            label: 'Chiffre d\'affaires (€)',
            data: [12000, 19000, 15000, 25000, 22000, 30000],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Évolution du chiffre d\'affaires'
            }
          }
        }
      })
    },

    initCategoryChart() {
      const ctx = document.getElementById('categoryChart')
      if (!ctx) return

      this.categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Cartes Pokémon', 'Cartes Memes'],
          datasets: [{
            data: [30, 25],
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
            ]
          }]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Répartition des ventes par catégorie'
            }
          }
        }
      })
    },

    initBasketChart() {
      const ctx = document.getElementById('basketChart')
      if (!ctx) return

      this.basketChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [{
            label: 'Valeur moyenne du panier (€)',
            data: [85, 72, 78, 95, 82, 89],
            backgroundColor: 'rgba(153, 102, 255, 0.5)'
          }]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Valeur moyenne des paniers'
            }
          }
        }
      })
    },

    initCustomersChart() {
      const ctx = document.getElementById('customersChart')
      if (!ctx) return

      this.customersChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [{
            label: 'Nouveaux clients',
            data: [45, 38, 52, 48, 65, 58],
            backgroundColor: 'rgba(54, 162, 235, 0.5)'
          }]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Nouveaux clients par mois'
            }
          }
        }
      })
    }
  },
  mounted() {
    this.initCharts()
    
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<template>
  <div>
    <h2>Administration</h2>
    <nav>
      <ul>
        <li>
          <router-link to="/admin/">
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
          <router-link to="/admin/orders">Commandes</router-link>
        </li>
        <li>
          <router-link to="/admin/users">Utilisateurs</router-link>
        </li>
      </ul>
    </nav>
    
    <div class="timeframe-selector">
      <select v-model="selectedTimeframe">
        <option value="day">Par jour</option>
        <option value="month">Par mois</option>
        <option value="year">Par année</option>
      </select>
    </div>

    <main class="dashboard">
      <div class="chart-container">
        <canvas id="revenueChart"></canvas>
      </div>
      <div class="chart-container">
        <canvas id="categoryChart"></canvas>
      </div>
      <div class="chart-container">
        <canvas id="basketChart"></canvas>
      </div>
      <div class="chart-container">
        <canvas id="customersChart"></canvas>
      </div>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.chart-container {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: 400px;
  width: 100%;
}

.timeframe-selector {
  margin: 20px;
  text-align: right;
}

select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 10px;
  }

  .chart-container {
    height: 300px;
    padding: 10px;
  }

  .timeframe-selector {
    margin: 10px;
  }
}

@media (max-width: 480px) {
  .chart-container {
    height: 250px;
  }
}
</style>
