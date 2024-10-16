<template>
  <form @submit.prevent="register">
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
      email: '',
      password: ''
    }
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('http://localhost:8080/register', {
          email: this.email,
          password: this.password
        });
        console.log(response.data.message);
      } catch (error) {
        console.error("Erreur d'inscription:", error.response.data.message);
      }
    }
  }
}
</script>