<script setup>
import { onMounted, ref } from 'vue'
import ModalComponent from './ModalComponent.vue'

const isModalVisible = ref(false)

function checkCookieConsent() {
  const consent = localStorage.getItem('cookie_consent')
  if (!consent) {
    isModalVisible.value = true
  }
}

function acceptCookies() {
  localStorage.setItem('cookie_consent', 'accepted')
  isModalVisible.value = false
}

function declineCookies() {
  localStorage.setItem('cookie_consent', 'declined')
  isModalVisible.value = false
}

onMounted(() => {
  checkCookieConsent()
})
</script>

<template>
  <ModalComponent
    v-model:is-visible="isModalVisible"
    title="Utilisation des cookies"
    message="Nous utilisons des cookies pour améliorer votre expérience sur notre site. En poursuivant votre navigation, vous acceptez notre politique de confidentialité."
    confirm-button-text="Accepter"
    cancel-button-text="Refuser"
    @confirm="acceptCookies"
    @cancel="declineCookies"
  />
</template>
