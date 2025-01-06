<script>
export default {
  name: 'FooterComponent',
  data() {
    return {
      legalDocuments: {
        terms: '/path/to/terms_of_service.pdf',
        privacy: '/path/to/privacy_policy.pdf',
        cookies: '/path/to/cookie_policy.pdf',
      },
    }
  },
}
</script>

<template>
  <footer class="container">
    <nav>
      <ul>
        <li><a :href="legalDocuments.terms" download="../assets/legals/CGU.pdf">Conditions d'utilisation</a></li>
        <li><a :href="legalDocuments.privacy" download="../assets/legals/CGV.pdf">Conditions Générales de Vente</a></li>
        <li><a :href="legalDocuments.cookies" download="../assets/legals/mentions-legales.pdf">Mentions Légales</a></li>
      </ul>
    </nav>
    <p class="message">
      Fait avec ❤️ et beaucoup de ☕️
    </p>
    <p class="trademark">
      Deckorama&reg;
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
