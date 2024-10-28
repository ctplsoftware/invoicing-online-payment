import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/SampleViewForm.css';
import { useNavigate } from 'react-router-dom';

const SampleViewForm = () => {
    const [data, setData] = useState([]);
    const [canUpdate, setCanUpdate] = useState(false);
    const [role, setRole] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch form data
        axios.get("http://localhost:8000/api/sample-forms/")
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

        // Retrieve role and permissions from localStorage
        const savedRole = localStorage.getItem('selectedRole');
        const savedPermissions = JSON.parse(localStorage.getItem('permissions'));

        if (savedRole) {
            setRole(savedRole);
        }

        if (savedPermissions) {
            // Check if the selected role has update permission
            const hasUpdatePermission = savedPermissions.some(perm => perm.can_update);
            setCanUpdate(hasUpdatePermission);
        }
    }, []);

    const editForm = (id) => {
        navigate(`/landingpage/edit-form/${id}`);
    };

    return (
        <div className="sample-view-form">
            <h2>Selected Role: {role}</h2> {/* Display the selected role */}
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Date of Birth</th>
                        <th>Age</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.date}</td>
                            <td>{item.age}</td>
                            <td>
                                {canUpdate && (
                                    <button
                                        className="action-button"
                                        onClick={() => editForm(item.id)}
                                    >
                                        Edit
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SampleViewForm;
