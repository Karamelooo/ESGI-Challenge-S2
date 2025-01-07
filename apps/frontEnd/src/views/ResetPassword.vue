<script setup lang="ts">
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
    validation: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/,
      message: 'Le mot de passe doit contenir 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
    },
  },
  {
    name: 'passwordVerification',
    type: 'password',
    label: 'Confirmer le mot de passe',
    required: true,
    validation: {
      matchField: 'password',
      message: 'Les mots de passe ne correspondent pas',
    },
  },
]

function handleSuccess(data: any) {
  showToast(data.message)
  router.push('/login')
}

function handleError(error: string) {
  showToast(error)
}
</script>

<template>
  <div>
    <h2>Réinitialisation du mot de passe</h2>
    <Form
      :fields="fields"
      :submit-url="`${baseUrl}/auth/reset-password/${route.params.token}`"
      method="POST"
      submit-button-text="Réinitialiser"
      @submit-success="handleSuccess"
      @submit-error="handleError"
    />
  </div>
</template> 