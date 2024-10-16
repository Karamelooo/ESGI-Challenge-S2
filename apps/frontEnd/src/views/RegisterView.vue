<template>
  <form @submit.prevent="register">
    <!-- <input v-model="username" type="text" placeholder="Nom d'utilisateur" required> -->
    <input v-model="email" type="email" placeholder="Email" required>
    <input v-model="password" type="password" placeholder="Mot de passe" required>
    <button type="submit">S'inscrire</button>
  </form>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      //username: '',
      email: '',
      password: ''
    }
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('http://localhost:8080/register', {
          //username: this.username,
          email: this.email,
          password: this.password
        });
        console.log(response.data.message);
        // Rediriger vers la page de connexion ou afficher un message de succès
      } catch (error) {
        console.error("Erreur d'inscription:", error.response.data.message);
      }
    }
  }
}
</script>