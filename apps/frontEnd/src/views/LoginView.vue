<script setup>
import { showToast } from '@/utils/toast'
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const emailBlurred = ref(false)
const passwordBlurred = ref(false)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/
const emailRegex = /^[\w.]+@[a-z0-9.-]+\.[a-z]{2,}$/i
async function login() {
  try {
    const response = await axios.post('http://localhost:8080/auth/login', {
      email: email.value,
      password: password.value,
    })
    localStorage.setItem('token', response.data.token)
    showToast(response.data.message)
    router.push('/index')
  }
  catch (error) {
    showToast(error)
  }
}

function emailValid() {
  if (!emailBlurred.value) {
    return ''
  }
  return !emailRegex.test(email.value)
}

function passwordValid() {
  if (!passwordBlurred.value) {
    return ''
  }
  return !passwordRegex.test(password.value)
}

function handleEmailBlur() {
  emailBlurred.value = true
}

function handlePasswordBlur() {
  passwordBlurred.value = true
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
  <form @submit.prevent="login">
    <fieldset>
      <label for="email">Email</label>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        :aria-invalid="emailValid()"
        required
        @blur="handleEmailBlur"
      >
      <small v-if="emailValid() === true">L'adresse email est invalide</small>
      <label for="password">Mot de passe</label>
      <input
        v-model="password"
        type="password"
        placeholder="Mot de passe"
        :aria-invalid="passwordValid()"
        required
        @blur="handlePasswordBlur"
      >
      <small v-if="passwordValid() === true">Le mot de passe doit contenir 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial</small>
    </fieldset>
    <button type="submit" :disabled="allFieldsEmpty()">
      Se connecter
    </button>
  </form>
</template>
