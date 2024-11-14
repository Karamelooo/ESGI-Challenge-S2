import { defineStore } from 'pinia';

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    selectedUser: null as User | null,
    showModal: false,
  }),
  actions: {
    setUsers(users: User[]) {
      this.users = users;
    },
    setSelectedUser(user: User) {
      this.selectedUser = user;
    },
    toggleModal() {
      this.showModal = !this.showModal;
    },
    setShowModal(show: boolean) {
      this.showModal = show;
    },
  },
});
