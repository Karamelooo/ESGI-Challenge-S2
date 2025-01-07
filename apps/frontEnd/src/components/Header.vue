<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { authMiddleware } from '../middlewares/auth.middleware'
import { useAuthStore } from '@/stores/auth'

const isLoggedIn = ref(false)
const router = useRouter()
const searchQuery = ref('') // Modèle pour le champ de recherche
const navbarContent = [
  {
    label: 'Home',
    route: '/',
  },
  {
    label: 'Produits',
    route: '/products',
  },
  {
    label: 'Licenses',
    route: '/licenses',
    sub: [
      {
        label: 'pokemon',
        route: '/license/pokemon',
      },
      {
        label: 'Magic',
        route: '/license/magic',
      },
    ],
  },
]

const authStore = useAuthStore()

onMounted(() => {
  isLoggedIn.value = authMiddleware()
})

watch(() => router.currentRoute.value.path, () => {
  isLoggedIn.value = authMiddleware()
})

// Fonction pour gérer la recherche
function handleSearch() {
  console.log(`Recherche pour : ${searchQuery.value}`)
  // Ajoutez ici votre logique de recherche, par exemple une redirection ou une requête API.
}
</script>

<template>
  <div class="container">
    <div id="top-header">
      <nav class="nav-content">
        <div id="logo">
          <img alt="Vue logo" class="logo" src="@/assets/logoD.svg" width="100" height="100">
        </div>
        <div id="search-bar">
          <form id="search-form" @submit.prevent="handleSearch">
            <input
              id="search-input"
              v-model="searchQuery"
              type="search"
              name="search"
              placeholder="Search"
              aria-label="Search"
            >
          </form>
        </div>
        <div id="auth">
          <template v-if="!isLoggedIn">
            <RouterLink to="/register">
              Inscription
            </RouterLink>
            <RouterLink to="/login">
              Connexion
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink v-if="authStore.isAdmin" to="/admin">
              Admin
            </RouterLink>
            <RouterLink to="/cart">
              Panier
            </RouterLink>
            <RouterLink to="/orders">
              Historique des commandes
            </RouterLink>
            <RouterLink to="/logout">
              Déconnexion
            </RouterLink>
          </template>
        </div>
        <div id="shopping-bag" />
      </nav>
    </div>
    <div id="navbar" class="navbar">
      <nav>
        <ul>
          <li v-for="(key, index) in Object.keys(navbarContent)" :key="index">
            <details v-if="navbarContent[index].sub" class="dropdown">
              <summary>
                <RouterLink :to="navbarContent[index].route">
                  {{ navbarContent[index].label }}
                </RouterLink>
              </summary>
              <ul>
                <li v-for="(key2, index2) in Object.keys(navbarContent[index].sub)" :key="index2">
                  <RouterLink :to="navbarContent[index].sub[index2].route">
                    {{ navbarContent[index].sub[index2].label }}
                  </RouterLink>
                </li>
              </ul>
            </details>
            <RouterLink v-else :to="navbarContent[index].route">
              {{ navbarContent[index].label }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin-left: 5em;
}
.nav-content {
  width: 90vw;
  display: flex;
  padding: .5em;
  align-items: baseline;
  flex-direction: row;
}

#search-bar {
  flex: 1; /* Occupe l'espace disponible */
  display: flex;
  justify-content: center;
  align-items: center;
}

#search-form {
  display: flex;
  width: 100%;
  max-width: 400px; /* Largeur maximale de la barre de recherche */
}

#search-input {
  height: 2em;
}
</style>
