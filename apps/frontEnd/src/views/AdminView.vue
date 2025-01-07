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
          <router-link to="/admin/orders">Commandes</router-link>
        </li>
        <li>
          <router-link to="/admin/users">Utilisateurs</router-link>
        </li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>
