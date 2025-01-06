<script setup lang="ts">
import Form from '@/forms/Form.vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from '@/utils/toast'

const route = useRoute()
const router = useRouter()
const users = ref<User[]>([])

interface User {
  _id: string
  firstname: string
  lastname: string
  email: string
  isActive: boolean
}

const editingUser = ref<User | null>(null)
const baseUrl = import.meta.env.VITE_BACK_APP_URL

const getFormFields = (isEditing = false) => [
  {
    name: 'firstname',
    type: 'text',
    label: 'Prénom',
    required: true,
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
    validation: {
      required: true,
      message: 'Le nom est requis',
    },
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    required: true,
    validation: {
      pattern: /^[\w.]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
      message: 'L\'adresse email est invalide',
    },
  },
  {
    name: 'password',
    type: 'password',
    label: isEditing ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe',
    required: !isEditing,
    validation: isEditing ? {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/,
      message: 'Le mot de passe doit contenir 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
    } : {
      required: true,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/,
      message: 'Le mot de passe doit contenir 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
    },
  },
  ...((!isEditing) ? [{
    name: 'passwordVerification',
    type: 'password',
    label: 'Vérification du mot de passe',
    required: true,
    validation: {
      matchField: 'password',
      message: 'Les mots de passe ne correspondent pas',
    },
  }] : []),
  {
    name: 'isActive',
    type: 'select',
    label: 'Statut',
    options: [
      { value: true, label: 'Actif' },
      { value: false, label: 'Inactif' },
    ],
  },
]

async function fetchUsers() {
  try {
    const response = await axios.get(`${baseUrl}/users`)
    users.value = response.data
  }
  catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
  }
}

async function editUser(userId: string) {
  try {
    const response = await axios.get(`${baseUrl}/users/${userId}`)
    editingUser.value = response.data
  }
  catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error)
  }
}

async function deleteUser(userId: string) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
    try {
      await axios.delete(`${baseUrl}/users/${userId}`)
      fetchUsers()
    }
    catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error)
    }
  }
}

function handleSubmitSuccess(data: any) {
  const message = editingUser.value 
    ? 'Utilisateur modifié avec succès'
    : 'Utilisateur créé avec succès'
    
  showToast(message)
  router.push('/admin/users')
}

function handleError(error: string) {
  showToast(error)
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div>
    <h1>Gestion des Utilisateurs</h1>
    <div class="create-button-container">
      <router-link to="/admin/users/create" class="create-button">
        Créer un utilisateur
      </router-link>
    </div>
    <Form
      v-if="route.path === '/admin/users/create'"
      :fields="getFormFields(false)"
      :submit-url="`${baseUrl}/users/create`"
      method="POST"
      submit-button-text="Créer"
      @submit-success="handleSubmitSuccess"
      @submit-error="handleError"
    />
    <div v-else-if="editingUser">
      <h2>Modifier l'utilisateur</h2>
      <Form
        :fields="getFormFields(true)"
        :submit-url="`${baseUrl}/users/${editingUser._id}`"
        method="PUT"
        :initial-data="editingUser"
        submit-button-text="Sauvegarder"
        @submit-success="handleSubmitSuccess"
        @submit-error="handleError"
      >
        <template #after-form>
          <button type="button" @click="editingUser = null">
            Annuler
          </button>
        </template>
      </Form>
    </div>
    <div v-else>
      <h2>Liste des utilisateurs</h2>
      <div v-if="users.length" class="users-grid">
        <div v-for="user in users" :key="user._id" class="user-card">
          <h3>{{ user.firstname }} {{ user.lastname }}</h3>
          <p>Email: {{ user.email }}</p>
          <p>Statut: {{ user.isActive ? 'Actif' : 'Inactif' }}</p>
          <div class="button-group">
            <button @click="editUser(user._id)">
              Éditer
            </button>
            <button @click="deleteUser(user._id)" class="danger">
              Supprimer
            </button>
          </div>
        </div>
      </div>
      <p v-else>
        Aucun utilisateur disponible
      </p>
    </div>
  </div>
</template>

<style scoped>
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.user-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.danger {
  background-color: #dc3545;
  color: white;
}

.create-button-container {
  margin-bottom: 1rem;
}

.create-button {
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 4px;
}

.create-button:hover {
  background-color: #45a049;
}
</style>