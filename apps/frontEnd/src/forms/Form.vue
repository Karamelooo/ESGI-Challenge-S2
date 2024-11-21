<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Field {
  name: string
  type: string
  label: string
  required?: boolean
  placeholder?: string
  options?: Array<{ value: any, label: string }>
}

interface Props {
  fields: Field[]
  submitUrl: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  initialData?: Record<string, any>
  submitButtonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  method: 'POST',
  submitButtonText: 'Envoyer',
  initialData: () => ({}),
})

const emit = defineEmits(['submitSuccess', 'submitError'])

const formData = ref<Record<string, any>>({})

onMounted(() => {
  formData.value = { ...props.initialData }
})

async function handleSubmit() {
  try {
    const response = await fetch(props.submitUrl, {
      method: props.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value),
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la soumission du formulaire')
    }

    const data = await response.json()
    emit('submitSuccess', data)
  }
  catch (error) {
    emit('submitError', error)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div v-for="field in fields" :key="field.name" class="form-group">
      <!-- Input standard -->
      <template v-if="field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'number'">
        <label :for="field.name">{{ field.label }}</label>
        <input
          :id="field.name"
          v-model="formData[field.name]"
          :type="field.type"
          :name="field.name"
          :required="field.required"
          :placeholder="field.placeholder"
        >
      </template>

      <!-- Textarea -->
      <template v-else-if="field.type === 'textarea'">
        <label :for="field.name">{{ field.label }}</label>
        <textarea
          :id="field.name"
          v-model="formData[field.name]"
          :name="field.name"
          :required="field.required"
          :placeholder="field.placeholder"
        />
      </template>

      <!-- Select -->
      <template v-else-if="field.type === 'select'">
        <label :for="field.name">{{ field.label }}</label>
        <select
          :id="field.name"
          v-model="formData[field.name]"
          :name="field.name"
          :required="field.required"
        >
          <option v-for="option in field.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </template>
    </div>

    <button type="submit">
      {{ submitButtonText }}
    </button>
  </form>
</template>
