<script setup>
import { showToast } from '@/utils/toast'
import axios from 'axios'
import { ref } from 'vue'

const firstname = ref('')
const lastname = ref('')
const email = ref('')
const password = ref('')
const passwordVerification = ref('')
const firstnameBlurred = ref(false)
const lastnameBlurred = ref(false)
const emailBlurred = ref(false)
const passwordBlurred = ref(false)
const passwordVerificationBlurred = ref(false)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/
const emailRegex = /^[\w.]+@[a-z0-9.-]+\.[a-z]{2,}$/i

async function register() {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACK_APP_URL}/auth/register`, {
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      password: password.value,
      passwordVerification: passwordVerification.value,
    })
    showToast(response.data.message)
  }
  catch (error) {
    showToast(error.response.data.message)
  }
}

function firstnameValid() {
  if (!firstnameBlurred.value) {
    return ''
  }
  return firstname.value === ''
}

function lastnameValid() {
  if (!lastnameBlurred.value) {
    return ''
  }
  return lastname.value === ''
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

function passwordVerificationValid() {
  if (!passwordVerificationBlurred.value || !password.value) {
    return ''
  }
  return password.value !== passwordVerification.value
}

function handleFirstnameBlur() {
  firstnameBlurred.value = true
}

function handleLastnameBlur() {
  lastnameBlurred.value = true
}

function handleEmailBlur() {
  emailBlurred.value = true
}

function handlePasswordBlur() {
  passwordBlurred.value = true
}

function handlePasswordVerificationBlur() {
  passwordVerificationBlurred.value = true
}

function allFieldsEmpty() {
  if (firstname.value === '' || lastname.value === '' || email.value === '' || password.value === '' || passwordVerification.value === '' || !passwordRegex.test(password.value) || !emailRegex.test(email.value) || password.value !== passwordVerification.value) {
    return true
  }
  return false
}
</script>

<template>
  <form @submit.prevent="register">
    <fieldset class="grid">
      <label for="firstname">
        Prénom
        <input v-model="firstname" type="text" placeholder="John" :aria-invalid="firstnameValid()" required @blur="handleFirstnameBlur">
        <small v-if="firstnameValid() === true">Le prénom est requis</small>
      </label>
      <label for="lastname">
        Nom
        <input v-model="lastname" type="text" placeholder="Doe" :aria-invalid="lastnameValid()" required @blur="handleLastnameBlur">
        <small v-if="lastnameValid() === true">Le nom est requis</small>
      </label>
    </fieldset>
    <fieldset>
      <label for="email">
        Adresse email
        <input
          v-model="email"
          type="email"
          placeholder="john@doe.com"
          :aria-invalid="emailValid()"
          required
          @blur="handleEmailBlur"
        >
        <small v-if="emailValid() === true">L'adresse email est invalide</small>
      </label>
    </fieldset>
    <fieldset class="grid">
      <label for="password">
        Mot de passe
        <input
          v-model="password"
          autocomplete="password"
          type="password"
          placeholder="Entrez un mot de passe de 12 caractères ou plus"
          :aria-invalid="passwordValid()"
          required
          @blur="handlePasswordBlur"
        >
        <small v-if="passwordValid() === true">Le mot de passe doit contenir 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial</small>
      </label>
      <label for="password-verification">
        Vérification du mot de passe
        <input
          v-model="passwordVerification"
          autocomplete="password"
          type="password"
          placeholder="Entrez le mot de passe précédemment saisi"
          :aria-invalid="passwordVerificationValid()"
          required
          @blur="handlePasswordVerificationBlur"
        >
        <small v-if="passwordVerificationValid() === true">Les mots de passe ne correspondent pas</small>
      </label>
    </fieldset>
    <button type="submit" :disabled="allFieldsEmpty()">
      S'inscrire
    </button>
  </form>
</template>
