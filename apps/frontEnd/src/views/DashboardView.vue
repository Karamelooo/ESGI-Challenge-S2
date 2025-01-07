<script>
import { showToast } from '@/utils/toast'
import Chart from 'chart.js/auto'
import { onMounted, ref } from 'vue'

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
  },
}
</script>

<template>
  <div>
    <div class="timeframe-selector">
      <select v-model="selectedTimeframe">
        <option value="day">
          Par jour
        </option>
        <option value="month">
          Par mois
        </option>
        <option value="year">
          Par année
        </option>
      </select>
    </div>

    <main class="dashboard">
      <div class="chart-container">
        <canvas id="revenueChart" />
      </div>
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
