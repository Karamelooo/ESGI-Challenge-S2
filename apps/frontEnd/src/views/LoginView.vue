<script>
import axios from 'axios'

export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:8080/auth/login', {
          email: this.email,
          password: this.password,
        })
        console.log(response.data.message)
      }
      catch (error) {
        console.error('Erreur de connexion:', error.response.data.message)
      }
    },
  },
}
</script>

<template>
  <form @submit.prevent="login">
    <input v-model="email" type="email" placeholder="Email" required>
    <input v-model="password" type="password" placeholder="Mot de passe" required>
    <button type="submit">
      Se connecter
    </button>
  </form>
</template>
