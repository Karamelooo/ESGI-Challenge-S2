<script setup>
import { ref } from 'vue'

</script>

<template>
  <div>
    <h2>Administration</h2>
    <nav>
      <ul>
        <li>
          <router-link to="/admin/">Dashboard</router-link>
        </li>
        <li>
          <router-link to="/admin/products">Produits</router-link>
        </li>
        <li>
          <router-link to="/admin/users">Utilisateurs</router-link>
        </li>
      </ul>
    </nav>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
</style>
