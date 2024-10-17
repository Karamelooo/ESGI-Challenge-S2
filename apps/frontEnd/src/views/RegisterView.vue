<script>
import axios from 'axios'
import Toast from 'typescript-toastify'

export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('http://localhost:8080/auth/register', {
          email: this.email,
          password: this.password,
        })
        const toast = new Toast({
          position: 'top-right',
          toastMsg: response.data.message,
          autoCloseTime: 2000,
          canClose: true,
          showProgress: true,
          pauseOnHover: true,
          pauseOnFocusLoss: true,
          type: 'default',
          theme: 'light',
        })
        toast.show()
      }
      catch (error) {
        const toast = new Toast({
          position: 'top-right',
          toastMsg: error.response.data.message,
          autoCloseTime: 2000,
          canClose: true,
          showProgress: true,
          pauseOnHover: true,
          pauseOnFocusLoss: true,
          type: 'default',
          theme: 'light',
        })
        toast.show()
      }
    },
  },
}
</script>

<template>
  <form @submit.prevent="register">
    <input v-model="email" type="email" placeholder="Email" required>
    <input v-model="password" type="password" placeholder="Mot de passe" required>
    <button type="submit">
      S'inscrire
    </button>
  </form>
</template>
