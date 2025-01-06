import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  roles: string[]
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token')
  }),

  getters: {
    isAdmin: (state) => {
      console.log('Vérification isAdmin:', state.user?.roles)
      return state.user?.roles ? state.user.roles.includes('ROLE_ADMIN') : false
    },
    isUser: (state) => {
      return state.user?.roles ? state.user.roles.includes('ROLE_USER') : false
    },
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    setUser(userData: User) {
      console.log('Setting user with roles:', userData)
      this.user = userData
    },

    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  }
}) 