<script>
import { showToast } from '@/utils/toast'
import { ref } from 'vue'

const baseUrl = import.meta.env.VITE_BACK_APP_URL

export default {
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
  },
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
      </ul>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
</style>
