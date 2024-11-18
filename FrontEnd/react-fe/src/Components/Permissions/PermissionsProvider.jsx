
import axios from 'axios';

export async function fetchAndStorePermissions() {
    try {
        const accessToken = localStorage.getItem('accessToken'); // Get token from localStorage
        const response = await axios.get('http://localhost:8000/get_user_permissions/', {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Add token to header
            },
        });
        const permissions = response.data.permissions;
        localStorage.setItem('permissions', JSON.stringify(permissions));
        return permissions;
    } catch (error) {
        console.error('Error fetching permissions:', error.response?.data || error.message);
        return [];
    }
}


