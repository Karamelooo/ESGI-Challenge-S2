<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from '@/utils/toast'

const route = useRoute()
const router = useRouter()
const baseUrl = import.meta.env.VITE_BACK_APP_URL

onMounted(async () => {
  try {
    const response = await fetch(`${baseUrl}/auth/confirm-email/${route.params.token}`, {
      method: 'POST'
    })
    const data = await response.json()
    
    showToast(data.message)
    router.push('/login')
  } catch (error) {
    showToast("Erreur lors de la confirmation du compte")
    router.push('/login')
  }
})
</script>