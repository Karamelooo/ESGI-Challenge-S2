<script setup>
import axios from 'axios'
import Toast from 'typescript-toastify'
import { ref } from 'vue'

const email = ref('')
const password = ref('')

async function register() {
  try {
    const response = await axios.post('http://localhost:8080/auth/register', {
      email: email.value,
      password: password.value,
    })
    showToast(response.data.message)
  }
  catch (error) {
    showToast(error.response.data.message)
  }
}

function showToast(message) {
  const toast = new Toast({
    position: 'top-right',
    autoCloseTime: 2000,
    canClose: true,
    showProgress: true,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    type: 'default',
    theme: 'light',
  })
  toast.update({ toastMsg: message })
}

function allFieldsEmpty() {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/
  const emailRegex = /^[\w.]+@[a-z0-9.-]+\.[a-z]{2,}$/i
  if (email.value === '' || password.value === '' || !passwordRegex.test(password.value) || !emailRegex.test(email.value)) {
    return true
  }
  return false
}
</script>

<template>
  <form @submit.prevent="register">
    <fieldset>
      <label for="email">Email</label>
      <input v-model="email" type="email" placeholder="Email" required>
      <label for="password">Mot de passe</label>
      <input v-model="password" type="password" placeholder="Mot de passe" required>
    </fieldset>
    <button type="submit" :disabled="allFieldsEmpty()">
      S'inscrire
    </button>
  </form>
</template>
