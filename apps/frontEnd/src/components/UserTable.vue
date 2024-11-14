<template>
    <div class="container">
      <h3 class="mt-2 mb-3 float-left text-primary">Users</h3>
      <!-- User Table -->
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">User ID</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Password</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <!-- Loop through users -->
          <tr v-for="(user, index) in userStore.users" :key="user._id" class="m-5">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ user._id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.password }}</td>
            <td>
              <form>
                <button @click.prevent="emitShowModal(user)" class="btn btn-sm btn-info mr-1">Edit</button>
                <button @click="deleteUser(user._id)" type="submit" class="btn btn-sm btn-danger">Delete</button>
              </form>
            </td>
          </tr>
          <!-- End "v-for" -->
        </tbody>
      </table>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
import { User, useUserStore } from '../stores/userStore';
  
  export default defineComponent({
    name: 'UsersTable',
    setup() {
      const userStore = useUserStore(); // Using Pinia store
      
      // Fetch users from the API
      const fetchUsers = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/users/');
          const data = await response.json();
          userStore.setUsers(data); // Set users in the store
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
  
      // Delete a user
      const deleteUser = async (id: string) => {
        try {
          await fetch(`http://localhost:3000/api/users/delete/${id}`, {
            method: 'DELETE',
          });
          // After deletion, fetch the users again to update the list
          fetchUsers();
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      };
  
      // Emit the selected user for editing and open modal
      const emitShowModal = (user: User) => {
        userStore.setSelectedUser(user);
        userStore.setShowModal(true);
      };
  
      // Fetch users when the component is created
      fetchUsers();
  
      return {
        userStore,
        deleteUser,
        emitShowModal,
      };
    },
  });
  </script>
  
  <style scoped>
  th {
    padding-left: 1.2rem;
  }
  </style>
  