
import axios from 'axios';

import { BaseURL } from '../../utils';

export async function fetchAndStorePermissions() {
    try {
        const accessToken = localStorage.getItem('accessToken'); // Get token from localStorage
        console.log("accessToken..in fetchandstore",accessToken);
        
        const response = await axios.get(`${BaseURL}/get_user_permissions/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Add token to header
            },
        });
        const { user, permissions } = response.data;

       // Store permissions and username in localStorage
       localStorage.setItem('permissions', JSON.stringify(permissions));

       
       return { permissions };
   } catch (error) {
       console.error('Error fetching permissions:', error.response?.data || error.message);
       return { permissions: [], username: null };
   }
}


