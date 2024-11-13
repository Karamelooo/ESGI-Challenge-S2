<template>
  <div>
    <h3>Add New User</h3>
    <form @submit.prevent="addUser">
      <div>
        <label>Name:</label>
        <input v-model="name" required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label>Role:</label>
        <select v-model="role">
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
      </div>
      <button type="submit">Add User</button>
    </form>
  </div>
</template>

<script lang="ts">
import { addUser } from '@/services/userService';

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'NewUserForm',
  setup() {
    const name = ref('');
    const email = ref('');
    const role = ref('User');
    interface NewUser {
    name: string;      
    email: string;     
    role: string;     
  }
  

    const addUserHandler = async () => {
      const newUser: NewUser = { name: name.value, email: email.value, role: role.value };
      try {
        await addUser(newUser);
        newUser.name = '';
        newUser.email= '';
        newUser.role = 'User';
        alert('User added successfully');
      } catch (error) {
        console.error('Failed to add user:', error);
      }
    };

    return {
      name,
      email,
      role,
      addUser: addUserHandler, 
    };
  },
});
</script>
