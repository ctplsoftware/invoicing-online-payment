import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Styles/TaskOperations.css';

const TaskOperations = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        // Fetch user details from local storage
        const storedUser = JSON.parse(localStorage.getItem('userDetails'));

        if (storedUser) {
            const userId = storedUser.user.id; // Assuming `id` is the user ID

            // Fetch the user's roles and permissions from the backend
            axios.get(`http://localhost:8000/roles-and-permissions/${userId}/`)
                .then(response => {
                    setRoles(response.data.roles);
                    setPermissions(response.data.permissions);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    alert('Failed to load user data.');
                });
        }
    }, []);

    const handleRoleChange = (e) => {
        const selectedRole = e.target.value;
        setSelectedRole(selectedRole);

        // Update permissions based on the selected role and filter for 'SampleForm'
        const rolePermissions = permissions.filter(
            perm => perm.role.name === selectedRole && 
                    perm.permission.name.includes('sample form')
        );

        // Save the selected role and permissions to localStorage
        localStorage.setItem('selectedRole', selectedRole);
        localStorage.setItem('permissions', JSON.stringify(rolePermissions));
    };

    // Find the permissions for the selected role
    const selectedRolePermissions = JSON.parse(localStorage.getItem('permissions')) || [];

    return (
        <div >
            {/* <h3>Task Operations</h3> */}

            {/* Role selection dropdown */}
            {/* <label htmlFor="role-select"><strong>Select Role:</strong></label>
            <select id="role-select" value={selectedRole} onChange={handleRoleChange}>
                <option value="">Select a role</option>
                {roles.map(role => (
                    <option key={role.id} value={role.name}>
                        {role.name}
                    </option>
                ))}
            </select> */}

            {/* Conditionally render operations based on selected role's permissions */}
            {selectedRole && selectedRolePermissions.length > 0 && (
                <div className="operations">
                    {selectedRolePermissions.some(perm => perm.can_create) && (
                        <Link to='/landingpage/sample-form'><button>Create</button></Link>
                    )}
                    {selectedRolePermissions.some(perm => perm.can_read) && (
                        <Link to='/landingpage/view-form'><button>Read</button></Link>
                    )}
                    {/* {selectedRolePermissions.some(perm => perm.can_update) && (
                        <button>Update</button>
                    )} */}
                </div>
            )}
        </div>
    );
};

export default TaskOperations;
