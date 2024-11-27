<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { authMiddleware } from '../middlewares/auth.middleware'

const isLoggedIn = ref(false)
const router = useRouter()
const searchQuery = ref('') // Modèle pour le champ de recherche

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
  <div>
    <div id="top-header" class="top-header">
      <nav>
        <div id="logo">
          <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50">
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
          <li>
            <a>
              <RouterLink to="/">
                Home
              </RouterLink>
            </a>
          </li>
          <li>
            <a>
              <RouterLink to="/about">
                About
              </RouterLink>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.top-header {
  display: flex;
  padding: .5em;
  align-items: baseline;
  flex-direction: row;
  gap: 20em;
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
