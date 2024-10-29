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
    const [file, setFile] = useState(null);

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

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            user,
            role,
            file, // You may want to process the file as needed
            ...permissions
        };

        try {
            await axios.post('http://localhost:8000/assign_permissions/', data);
            alert('Permissions saved successfully!');
        } catch (error) {
            console.error('Error saving permissions:', error);
            alert('Failed to save permissions.');
        }
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div style={{padding:'3%'}}>
            <h3 className='nonheadingfont'>Bulk Upload</h3>
            <div style={{ marginBottom: '20px', float: 'left' }}>
                <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ marginRight: '10px' }}
                />
            </div>
            <div id="btn">
                    <button style={{ float: 'right', marginBottom:'1%' }} type="submit" className="btn-save">Upload</button>
                </div>
            <form onSubmit={handleSubmit}>
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Brand Name</th>
                            <th>Field name 1</th>
                            <th>Field name 2</th>
                            <th>Field name 3</th>
                            <th>Field name 4</th>
                            <th>Field name 5</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Sample 1</td>
                            <td>NA</td>
                            <td>XXXXX</td>
                            <td>XXXXX</td>
                            <td>XXXXX</td>
                            <td>XXXXX</td>
                            <td>XXXXX</td>
                            <td>Active/Inactive</td>
                        </tr>
                    </tbody>
                    
                </table>
                <div style={{ marginTop: '20px', float: 'left' }}>
                <a href="/path/to/sample-template.xlsx" download>
                    Download sample template here
                </a>
                {/* <div style={{  marginTop: '10px' }}>
                    * Special characters  <span>@#$%^&*</span>are not allowed
                </div> */}
            </div>

            <div style={{marginTop:'10%'}}>
               

               
                
            <div style={{ marginTop: '0px', float: 'left' }}>
                <button onClick={handleBack} className="btn-save2">Back</button>
            </div>
            </div>
            </form>

           

        </div>
    );
};

export default UserPermissionForm;
