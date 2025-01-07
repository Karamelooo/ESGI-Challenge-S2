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
      return state.user?.roles ? state.user.roles.includes('ROLE_ADMIN') : false
    },
    isUser: (state) => {
      return state.user?.roles ? state.user.roles.includes('ROLE_USER') : false
    },
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    setUser(userData: User) {
      this.user = userData
      localStorage.setItem('user', JSON.stringify(userData))
    },

    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    initializeStore() {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        this.user = JSON.parse(userStr)
      }
    }
  }
}) 