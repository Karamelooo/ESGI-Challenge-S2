<template>
    <div class="container">
      <!-- Adds/removes the "show" class -->
      <div :class="modalClass" class="modal-container">
        <div class="user-modal">
          <h3 class="text-info">Edit User</h3>
          <form @submit.prevent="updateUser(user._id)">
            <div class="form-group">
              <label for="nameEdit">Name</label>
              <input v-model="user" required type="text" id="nameEdit" class="form-control"/>
            </div>
    
            <div class="form-group">
              <label for="emailEdit">Email</label>
              <input v-model="user.email" required type="email" id="emailEdit" class="form-control"/>
            </div>
            
            <div class="form-group">
              <label for="passwordEdit">Password</label>
              <input v-model="user.password" required type="password" id="passwordEdit" class="form-control"/>
            </div>
  
            <!-- On click, "showModal" becomes false -->
            <button @click.prevent="toggleModal" class="btn btn-secondary mr-1">Close</button>
            <button type="submit" class="btn btn-primary">Save</button> 
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { computed, defineComponent } from 'vue';
import { useUserStore } from '../stores/userStore';
  
  export default defineComponent({
    name: 'UserEditForm',
    setup() {
      const userStore = useUserStore();
      
      // Computed properties to access store data
      const user = computed(() => userStore.users);
      const modalClass = computed(() => (userStore.showModal ? 'show' : ''));
  
      // Toggle modal visibility
      const toggleModal = () => {
        userStore.toggleModal();
      };
  
      // PUT request to update user information
      const updateUser = async (id: string) => {
        try {
          const response = await fetch(`http://localhost:3000/api/users/edit/${id}`, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(userStore.users),
          });
  
          const data = await response.json();
          userStore.users = data; // Update user list if needed
          console.log('User updated');
          toggleModal(); // Close modal after saving
        } catch (err) {
          console.error(err);
        }
      };
  
      return {
        user,
        modalClass,
        toggleModal,
        updateUser,
      };
    },
  });
  </script>
  
  <style>
  /* Reuses the same styling as the registration modal */
  </style>
  