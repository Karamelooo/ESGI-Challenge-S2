<template>
    <div class="container">
      <!-- "showModal" becomes true -->
      <button @click="toggleModal" class="btn btn-lg btn-outline-primary float-right">Register User</button>
      
      <!-- Adds/removes the "show" class -->
      <div :class="modalClass" class="modal-container">
        <div class="user-modal">
          <h3 class="text-primary">User Registration</h3>
          <form @submit.prevent="createUser">
            <div class="form-group">
              <label for="name">Name</label>
              <input required v-model="formData.name" type="text" id="nameRegister" class="form-control"/>
            </div>
      
            <div class="form-group">
              <label for="email">Email</label>
              <input required v-model="formData.email" type="email" id="emailRegister" class="form-control"/>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input required v-model="formData.password" type="password" id="passwordRegister" class="form-control"/>
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
  import { defineComponent, reactive } from 'vue';
  
  interface User {
    name: string;
    email: string;
    password: string;
  }
  
  export default defineComponent({
    name: 'UserRegisterForm',
    data() {
      return {
        users: [] as User[],
        showModal: false,
        formData: reactive<User>({ name: '', email: '', password: '' }),
      };
    },
    methods: {
      toggleModal() {
        this.showModal = !this.showModal;
      },
      // POST request to create a new user
      async createUser() {
        try {
          const response = await fetch('http://localhost:3000/api/users/', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(this.formData),
          });
          
          const data = await response.json();
          this.users.push(data);
          console.log('User added');
          this.toggleModal(); // Close modal after saving
        } catch (err) {
          console.error(err);
        }
      },
    },
    // Function to toggle the "show" class on the modal
    computed: {
      modalClass(): string {
        return this.showModal ? 'show' : '';
      },
    },
  });
  </script>
  
  <style>
  .modal-container {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.3);
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease-in-out;
  }
  
  .modal-container.show {
    opacity: 1;
    pointer-events: auto;
  }
  
  .user-modal {
    color: #535353;
    background-color: #fff;
    background-image: url("../assets/background.jpg");
    width: 450px;
    padding: 40px 50px;
    max-width: 100%;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .user-modal h1 {
    margin: 0;
  }
  
  .user-modal p {
    opacity: 0.9;
  }
  </style>
  