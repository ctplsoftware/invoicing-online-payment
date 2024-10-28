import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/UserPermissionForm.css';

const UserPermissionForm = () => {
    const [user, setUser] = useState('');
    const [role, setRole] = useState('');
    const [permissions, setPermissions] = useState({
        can_create: false,
        can_read: false,
        can_update: false,
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('userDetails'));
        if (storedUser) {
            setUser(storedUser.user.id);
        }
    }, []);

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setPermissions((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            user,
            role,
            ...permissions
        };

        try {
            await axios.post('http://localhost:8000/api/assign_permissions/', data);
            alert('Permissions saved successfully!');
        } catch (error) {
            console.error('Error saving permissions:', error);
            alert('Failed to save permissions.');
        }
    };

    return (
        <div className="user-permission-form">
            <h3 className='headingfont-bold'>User Permission Master</h3>
            <form onSubmit={handleSubmit}>
                <table>
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Create</th>
                            <th>Read</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                    placeholder="Enter Role"
                                />
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    name="can_create"
                                    checked={permissions.can_create}
                                    onChange={handleCheckboxChange}
                                />
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    name="can_read"
                                    checked={permissions.can_read}
                                    onChange={handleCheckboxChange}
                                />
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    name="can_update"
                                    checked={permissions.can_update}
                                    onChange={handleCheckboxChange}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div id="btn" >
                    <button style={{float:'right'}} type="submit" className="btn-save">Save Permissions</button>
                </div>
            </form>
        </div>
    );
};

export default UserPermissionForm;
