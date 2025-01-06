<script setup>
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
    placeholder: 'Entrez votre email',
    validation: {
      pattern: /^[\w.]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
      message: 'L\'adresse email est invalide',
    },
  }
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
    :submit-url="`${baseUrl}/auth/request-reset-password`"
    submit-button-text="Envoyer le lien"
    @submit-success="handleSuccess"
    @submit-error="handleError"
  />
</template> 