<script>
export default {
  name: 'FooterComponent',
  data() {
    return {
      legalDocuments: {
        cgu: '../assets/legals/CGU.pdf',
        cgv: '../assets/legals/CGV.pdf"',
        mentions: '../assets/legals/mentions-legales.pdf',
        confidentialite: '../assets/legals/politique-de-confidentialité.pdf',
        marque: '../assets/legals/placeholder.pdf',
      },
    }
  },
}
</script>

<template>
  <footer class="container">
    <nav>
      <ul>
        <li><a :href="legalDocuments.cgu" download="../assets/legals/CGU.pdf">Conditions d'utilisation</a></li>
        <li><a :href="legalDocuments.cgv" download="../assets/legals/CGV.pdf">Conditions Générales de Vente</a></li>
        <li><a :href="legalDocuments.mentions" download="../assets/legals/mentions-legales.pdf">Mentions Légales</a></li>
        <li><a :href="legalDocuments.confidentialite" download="../assets/legals/politique-de-confidentialité.pdf">Politique de confidentialité</a></li>
        <li><a :href="legalDocuments.marque" download="../assets/legals/placeholder.pdf">Dépot de marque</a></li>
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
