<script setup lang='ts'>
import { showToast } from '@/utils/toast'
import CGU from '../assets/legals/CGU.pdf'
import CGV from '../assets/legals/CGV.pdf'
import MARQUEBE from '../assets/legals/dossier_depot_marque_bel.pdf'
import MARQUE from '../assets/legals/dossier_depot_marque_fr.pdf'
import MENTIONS from '../assets/legals/mentions-legales.pdf'
import CONFI from '../assets/legals/politique-de-confidentialité.pdf'

const baseUrl = import.meta.env.VITE_BACK_APP_URL

async function downloadUserData() {
  const user = JSON.parse(localStorage.getItem('user'))

  if (!user) {
    showToast('Veuillez vous connecter.')
    return
  }

  try {
    const response = await fetch(`${baseUrl}/exportbdd/${user.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw showToast('Erreur lors du téléchargement des données utilisateur')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `user.json`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
  catch (error) {
    console.error(error)
    showToast('Une erreur est survenue lors du téléchargement.')
  }
}
</script>

<template>
  <footer class="container">
    <nav>
      <ul>
        <li><a :href="CGU" download="../assets/legals/CGU.pdf">Conditions d'utilisation</a></li>
        <li><a :href="CGV" download="../assets/legals/CGV.pdf">Conditions Générales de Vente</a></li>
        <li><a :href="MENTIONS" download="../assets/legals/mentions-legales.pdf">Mentions Légales</a></li>
        <li><a :href="CONFI" download="../assets/legals/politique-de-confidentialité.pdf">Politique de confidentialité</a></li>
        <li><a :href="MARQUE" download="../assets/legals/dossier_depot_marque_fr.pdf">Dépot de marque France</a></li>
        <li><a :href="MARQUEBE" download="../assets/legals/dossier_depot_marque_bel.pdf">Dépot de marque Belgique</a></li>
        <li>
          <button @click="downloadUserData">
            Télécharger les données utilisateur
          </button>
        </li>
      </ul>
    </nav>
    <p class="message">
      Fait avec le ❤️ et beaucoup de ☕️
    </p>
    <p class="trademark">
      Copyright Deckorama &copy {{ new Date().getFullYear() }}
    </p>
  </footer>
</template>

<style scoped>
footer {
  position: relative;
  text-align: center;
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
}

nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

nav a {
  text-decoration: none;
  color: #007bff;
}

nav a:hover {
  text-decoration: underline;
}

.message {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #6c757d;
}

.trademark {
  position: absolute;
  bottom: 0.5rem;
  left: 1rem;
  font-size: 0.875rem;
  color: #6c757d;
}
</style>
