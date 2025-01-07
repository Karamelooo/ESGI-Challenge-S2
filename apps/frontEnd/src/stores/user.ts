import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: '',
    userName: '',
  }),
  actions: {
    setUser(userId: string, userName: string) {
      this.userId = userId;
      this.userName = userName;
    },
  },
});