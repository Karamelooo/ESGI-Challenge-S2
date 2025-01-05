<script setup>
import Form from '@/forms/Form.vue';
import { showToast } from '@/utils/toast';
import { useRouter } from 'vue-router';

const router = useRouter()

const baseUrl = 'http://localhost:8080'

const fields = [
  {
    name: 'firstname',
    type: 'text',
    label: 'Prénom',
    required: true,
    placeholder: 'John',
    validation: {
      required: true,
      message: 'Le prénom est requis',
    },
  },
  {
    name: 'lastname',
    type: 'text',
    label: 'Nom',
    required: true,
    placeholder: 'Doe',
    validation: {
      required: true,
      message: 'Le nom est requis',
    },
  },
  {
    name: 'email',
    type: 'email',
    label: 'Adresse email',
    required: true,
    placeholder: 'john@doe.com',
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
    placeholder: 'Entrez un mot de passe de 12 caractères ou plus',
    validation: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/,
      message: 'Le mot de passe doit contenir 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
    },
  },
  {
    name: 'passwordVerification',
    type: 'password',
    label: 'Vérification du mot de passe',
    required: true,
    placeholder: 'Entrez le mot de passe précédemment saisi',
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
    :submit-url="`${baseUrl}/auth/register`"
    submit-button-text="S'inscrire"
    @submit-success="handleSuccess"
    @submit-error="handleError"
  />
</template>
