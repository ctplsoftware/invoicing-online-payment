
import axios from 'axios';

export async function fetchAndStorePermissions() {
    try {
        const accessToken = localStorage.getItem('accessToken'); // Get token from localStorage
        const response = await axios.get('http://localhost:8000/get_user_permissions/', {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Add token to header
            },
        });
        const { user, permissions } = response.data;

       // Store permissions and username in localStorage
       localStorage.setItem('permissions', JSON.stringify(permissions));
       localStorage.setItem('username', user.username); // Store the username directly

       console.log("user.mame",user.username);
       
       return { permissions, username: user.username };
   } catch (error) {
       console.error('Error fetching permissions:', error.response?.data || error.message);
       return { permissions: [], username: null };
   }
}


