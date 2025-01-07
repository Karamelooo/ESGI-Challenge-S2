<script setup>
import Form from '@/forms/Form.vue'
import { showToast } from '@/utils/toast'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const baseUrl = import.meta.env.VITE_BACK_APP_URL

const fields = [
  {
    name: 'password',
    type: 'password',
    label: 'Nouveau mot de passe',
    required: true,
    placeholder: 'Entrez votre nouveau mot de passe',
    validation: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/,
      message: 'Le mot de passe doit contenir 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
    },
  },
  {
    name: 'passwordVerification',
    type: 'password',
    label: 'Confirmation du mot de passe',
    required: true,
    placeholder: 'Confirmez votre nouveau mot de passe',
    validation: {
      matchField: 'password',
      message: 'Les mots de passe ne correspondent pas',
    },
  },
]

function handleSuccess(data) {
  showToast(data.message)
  router.push('/login')
}

function handleError(error) {
  showToast(error)
}
</script>

<template>
  <Form
    :fields="fields"
    :submit-url="`${baseUrl}/auth/reset-password/${route.params.token}`"
    submit-button-text="Réinitialiser le mot de passe"
    @submit-success="handleSuccess"
    @submit-error="handleError"
  />
</template> 