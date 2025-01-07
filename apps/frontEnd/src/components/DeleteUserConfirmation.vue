<script setup>
import { ref } from 'vue'
import ModalComponent from './ModalComponent.vue'

const isModalVisible = ref(false)
const emit = defineEmits(['userDeleted'])

function showDeleteConfirmation() {
  isModalVisible.value = true
}

function confirmDelete() {
  emit('userDeleted')
  isModalVisible.value = false
}

function cancelDelete() {
  isModalVisible.value = false
}

defineExpose({ showDeleteConfirmation })
</script>

<template>
  <ModalComponent
    v-model:is-visible="isModalVisible"
    title="Confirmation de suppression"
    message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
    confirm-button-text="Supprimer"
    cancel-button-text="Annuler"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template> 