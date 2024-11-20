<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { authMiddleware } from './middlewares/auth.middleware'

const isLoggedIn = ref(false)
const router = useRouter()
const showProductSubmenu = ref(false)

onMounted(() => {
  isLoggedIn.value = authMiddleware()
})

watch(() => router.currentRoute.value.path, () => {
  isLoggedIn.value = authMiddleware()
  showProductSubmenu.value = router.currentRoute.value.path.startsWith('/products')
})
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">
          Home
        </RouterLink>
        <RouterLink to="/about">
          About
        </RouterLink>
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
          <div class="products-menu">
            <RouterLink to="/products">
              Produits
            </RouterLink>
            <div v-if="showProductSubmenu">
              <RouterLink to="/products/create">
                Créer
              </RouterLink>
            </div>
          </div>
        </template>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.products-menu {
  display: inline-block;
  position: relative;
}

.submenu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.5rem 0;
  z-index: 100;
}

.submenu a {
  display: block;
  border: none;
  padding: 0.5rem 1rem;
  text-align: left;
  white-space: nowrap;
}

.submenu a:hover {
  background-color: #f5f5f5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
