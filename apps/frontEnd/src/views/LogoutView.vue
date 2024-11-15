<script setup lang="ts">
import axios from 'axios'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(async () => {
  try {
    await axios.post('http://localhost:8080/auth/logout')

    localStorage.removeItem('token')

    router.push('/login')
  }
  catch (error) {
    console.error('Erreur lors de la déconnexion', error)
  }
})
</script>

<template>
  <div class="logout">
    <p>Déconnexion en cours...</p>
  </div>
</template>
