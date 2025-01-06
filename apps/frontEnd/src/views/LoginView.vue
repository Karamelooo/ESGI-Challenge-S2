<script setup>
import Form from '@/forms/Form.vue'
import { showToast } from '@/utils/toast'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const baseUrl = import.meta.env.VITE_BACK_APP_URL

const authStore = useAuthStore()

const fields = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    required: true,
    placeholder: 'Email',
    validation: {
      pattern: /^[\w.]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
      message: 'L\'adresse email est invalide',
    },
  },
  {
    name: 'password',
    type: 'password',
    label: 'Mot de passe',
    required: true,
    placeholder: 'Mot de passe',
    validation: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/,
      message: 'Le mot de passe doit contenir 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
    },
  },
]

function handleSuccess(data) {
  authStore.setToken(data.token)
  if (data.user) {
    authStore.setUser({
      id: data.user.id,
      email: data.user.email,
      roles: data.user.roles
    })
  }
  showToast(data.message)
  router.push('/')
}

function handleError(error) {
  showToast(error)
}
</script>

<template>
  <div>
    <Form
      :fields="fields"
      :submit-url="`${baseUrl}/auth/login`"
      submit-button-text="Se connecter"
      @submit-success="handleSuccess"
      @submit-error="handleError"
    />
    <div class="password-reset-link">
      <router-link to="/request-reset-password">
        Mot de passe oublié ?
      </router-link>
    </div>
  </div>
</template>
