<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  confirmButtonText: {
    type: String,
    default: 'Confirmer',
  },
  cancelButtonText: {
    type: String,
    default: 'Annuler',
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['confirm', 'cancel', 'update:isVisible'])

function closeModal() {
  emit('update:isVisible', false)
}

function handleConfirm() {
  emit('confirm')
  closeModal()
}

function handleCancel() {
  emit('cancel')
  closeModal()
}
</script>

<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal">
      <header class="modal-header">
        <h2>{{ title }}</h2>
        <button class="close" @click="handleCancel">
          ×
        </button>
      </header>
      <section class="modal-body">
        <p>{{ message }}</p>
      </section>
      <footer class="modal-footer">
        <button class="btn btn-primary" @click="handleConfirm">
          {{ confirmButtonText }}
        </button>
        <button class="btn" @click="handleCancel">
          {{ cancelButtonText }}
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  margin-top: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--primary-color, #007bff);
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.btn {
  background-color: var(--secondary-color, #6c757d);
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}
</style>
