<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api from '@/services/api'

interface Validation {
  pattern?: RegExp
  required?: boolean
  message: string
  matchField?: string
}

interface Field {
  name: string
  type: string
  label: string
  required?: boolean
  placeholder?: string
  options?: Array<{ value: any, label: string }>
  validation?: Validation
  multiple?: boolean
  accept?: string
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
const errors = ref<Record<string, string>>({})
const touched = ref<Record<string, boolean>>({})
const filePreview = ref<Record<string, string[]>>({})

onMounted(() => {
  formData.value = { ...props.initialData }
})

function validateField(field: Field, value: any): boolean {
  if (!field.validation)
    return true

  if (field.validation.required && !value)
    return false

  if (!field.required && !value)
    return true

  if (field.validation.pattern && value && !field.validation.pattern.test(value))
    return false

  if (field.validation.matchField && value !== formData.value[field.validation.matchField])
    return false

  return true
}

function handleBlur(fieldName: string) {
  touched.value[fieldName] = true
  const field = props.fields.find(f => f.name === fieldName)
  if (field && !validateField(field, formData.value[fieldName])) {
    errors.value[fieldName] = field.validation?.message || 'Champ invalide'
  }
  else {
    delete errors.value[fieldName]
  }
}

function isFormValid() {
  return props.fields.every(field => validateField(field, formData.value[field.name]))
}

async function handleFileChange(event: Event, fieldName: string) {
  const input = event.target as HTMLInputElement
  const files = input.files
  
  if (!files) return
  
  formData.value[fieldName] = []
  filePreview.value[fieldName] = []
  
  for (const file of files) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        filePreview.value[fieldName].push(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
    
    formData.value[fieldName].push(file)
  }
}

async function handleSubmit() {
  if (!isFormValid()) return

  try {
    const formDataToSend = new FormData()
    
    for (const [key, value] of Object.entries(formData.value)) {
      if (Array.isArray(value) && value[0] instanceof File) {
        value.forEach((file) => {
          formDataToSend.append('images', file)
        })
      } else {
        formDataToSend.append(key, value)
      }
    }

    const response = await api.request({
      url: props.submitUrl,
      method: props.method,
      data: formDataToSend,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (!response.data) {
      throw new Error('Erreur lors de la soumission du formulaire')
    }

    emit('submitSuccess', response.data)
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue'
    emit('submitError', errorMessage)
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
          :aria-invalid="touched[field.name] && errors[field.name] ? 'true' : touched[field.name] ? 'false' : undefined"
          @blur="handleBlur(field.name)"
        >
        <small v-if="touched[field.name] && errors[field.name]" class="error-message">
          {{ errors[field.name] }}
        </small>
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
      <template v-if="field.type === 'file'">
        <label :for="field.name">{{ field.label }}</label>
        <input
          :id="field.name"
          :type="field.type"
          :name="field.name"
          :required="field.required"
          :multiple="field.multiple"
          :accept="field.accept"
          @change="(e) => handleFileChange(e, field.name)"
        >
        <div v-if="filePreview[field.name]" class="image-preview">
          <img 
            v-for="(preview, index) in filePreview[field.name]"
            :key="index"
            :src="preview"
            :alt="'Preview ' + index"
            class="preview-image"
          >
        </div>
      </template>
    </div>

    <button type="submit" :disabled="!isFormValid()">
      {{ submitButtonText }}
    </button>
  </form>
</template>

<style scoped>
.error-message {
  color: #dc3545;
}

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}
</style>
