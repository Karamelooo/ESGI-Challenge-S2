import axios from 'axios';

const API_URL = 'http://localhost:8080'; 


interface NewUser {
  name: string;
  role: string;
}


export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    console.log("resss",response)
    return response.data;
  } catch (error) {
    console.error('Error fetching users', error);
    throw error;
  } 
    
};


export const deleteUserById = async (userId: number) => {
  try {
    await axios.delete(`${API_URL}/users/${userId}`);
  } catch (error) {
    console.error('Error deleting user', error);
    throw error;
  }
};

export const addUser = async (newUser: NewUser) => {
  try {
    const response = await axios.post(`${API_URL}/users`, newUser);
    return response.data; 
  } catch (error) {
    console.error('Error adding new user', error);
    throw error;
  }
};
export default {
  getUsers,
  deleteUserById,
  addUser,
};
