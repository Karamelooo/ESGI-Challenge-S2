<script setup lang="ts">
import userService from '@/services/userService';
import { onMounted, ref } from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
  picture: string;
  last_login: string;
  logins_count: number;
}

const users = ref<User[]>([]);
const message = ref<string>('');

const getUserData = async () => {
  try {
    const fetchedUsers = await userService.getUsers();
    users.value = fetchedUsers;
    console.log("aaaaaa")
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const deleteUser = async (deleteId: number) => {
  try {
    const response = await userService.deleteUserById(deleteId);
   // message.value = response;
    await getUserData(); // Refresh users list
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

onMounted(() => {
  getUserData(); // Fetch data when component is mounted
});
</script>
<template>
    <div class="dashboard">
      <h2 class="title is-size-3 has-text-centered">Welcome to your dashboard</h2>
      <div class="columns" v-if="message">
        <div class="column is-one-quarter is-offset-8">
          <div class="notification is-success">
            {{ message }}
          </div>
        </div>
      </div>
      <div class="columns is-multiline has-text-centered">
        <div v-for="user in users" :user="user" :key="user.id" class="column is-one-quarter">
          <img :src="user.picture" :alt="user.name" style="width:200px;margin-left:auto;margin-right:auto;"/>
          <h3 class="is-size-6">Name: {{ user.name }}</h3>
          <h3 class="is-size-6">Email: {{ user.email }}</h3>
          <h3 class="is-size-6">Last login: {{ user.last_login }}</h3>
          <h3 class="is-size-6">Login count: {{ user.logins_count }}</h3>
          <button @click="deleteUser(user.id)" class="button is-medium is-danger">Delete me 😵</button>
        </div>
      </div>
    </div>
    <div class="dashboard">
    <h1>This is an aaaaaaaaaaaaaaaaaaaaaaaaaaa page</h1>
  </div>
    </template>
    <!-- <script>
    import UserService from '@/services/userService.ts';
    export default {
        name: "dashboard",
        data() {
        return {
          users: [],
          message: ''
        };
      },
      created() {
        this.getUserData(); // call getEventData() when the instance is created
      },
      methods: {
        async getUserData() {
          // Pass the access token to the getUsers service
          UserService.getUsers()
          .then(
            (users => {
              this.$set(this, "users", users);
            }).bind(this)
          );
        },
        async deleteUser(deleteId) {
          // Pass specified id to the deleteUser service
          UserService.deleteUser(deleteId)
          .then(
            (response => {
              this.message = response; 
              this.getUserData(); // get refreshed users
            })
          );
        }
      }
    } -->
    <!-- </script> -->
    <style scoped>
      .notification {
        position: fixed;
        top: 800px;
        right: 40px;
      }
      .button {
        margin-top: 15px;
      }
    </style>