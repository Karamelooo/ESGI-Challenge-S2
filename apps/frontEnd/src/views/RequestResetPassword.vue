<script setup lang="ts">
import Form from '@/forms/Form.vue'
import { showToast } from '@/utils/toast'
import { useRouter } from 'vue-router'

const router = useRouter()
const baseUrl = import.meta.env.VITE_BACK_APP_URL

const fields = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    required: true,
    placeholder: 'Votre adresse email',
    validation: {
      pattern: /^[\w.]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
      message: 'L\'adresse email est invalide',
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
    <p>Entrez votre adresse email pour recevoir un lien de réinitialisation</p>
    <Form
      :fields="fields"
      :submit-url="`${baseUrl}/auth/reset-password-request`"
      method="POST"
      submit-button-text="Envoyer"
      @submit-success="handleSuccess"
      @submit-error="handleError"
    />
  </div>
</template> 