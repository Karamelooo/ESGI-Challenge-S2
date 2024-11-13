<template>
    <div>
      <h2>User List</h2>
      <ul v-if="users.length">
        <li v-for="user in users" :key="user.id">
          {{ user.name }} - {{ user.role }}
          <button @click="deleteUser(user.id)">Delete</button>
        </li>
      </ul>
      <p v-else>No users found</p>
    </div>
  </template>
  
  <script lang="ts">
  import { deleteUserById, getUsers } from '@/services/userService';
import { defineComponent, onMounted, ref } from 'vue';
  
  interface User {
    id: number;
    name: string;
    role: string;
  }
  
  export default defineComponent({
    name: 'UserList',
    setup() {
      const users = ref<User[]>([]);
  
      onMounted(async () => {
        users.value = await getUsers();
      });
  
      const deleteUser = async (userId: number) => {
        try {
          await deleteUserById(userId);
          users.value = users.value.filter((user) => user.id !== userId);
        } catch (error) {
          console.error('Failed to delete user:', error);
        }
      };
  
      return {
        users,
        deleteUser,
      };
    },
  });
  </script>
  