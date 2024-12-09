import axios from 'axios';

const testRoles = async () => {
  try {
    // Step 1: Log in to get a token
    console.log('Logging in...');
    const loginResponse = await axios.post('http://localhost:8080/auth/login', {
      username: 'testuser',
      password: 'password',
    });

    const token = loginResponse.data.token;
    console.log('Token received:', token);

    // Step 2: Test access to /roles/user
    console.log('Testing /roles/user access...');
    const userResponse = await axios.get('http://localhost:8080/roles/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('/roles/user response:', userResponse.data);

    // Step 3: Test access to /roles/admin
    console.log('Testing /roles/admin access...');
    try {
      const adminResponse = await axios.get('http://localhost:8080/roles/admin', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('/roles/admin response:', adminResponse.data);
    } catch (err) {
      // Handle error specifically for admin access
      if (axios.isAxiosError(err) && err.response) {
        console.log('/roles/admin access denied:', err.response.data);
      } else {
        console.error('Unexpected error during /roles/admin:', err);
      }
    }
  } catch (err) {

    if (axios.isAxiosError(err) && err.response) {
      console.error('Error during test:', err.response.data);
    } else {
      console.error('Unexpected error:', err);
    }
  }
};

testRoles();
