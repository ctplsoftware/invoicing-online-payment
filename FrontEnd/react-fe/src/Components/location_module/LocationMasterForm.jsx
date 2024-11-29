import React, { useState } from 'react';
import { API } from '../../API.js';
import '../../Styles/CustomerMaster.css';
import { useNavigate } from "react-router-dom";



const LocationMaster = () => {
    const api = new API();
    const navigate = useNavigate();




    const [formData, setFormData] = useState({
        name: '',
        status: 'active',
        location_address: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.locationmaster_create(formData);
            if (response) {
                alert("Location Added");
                navigate('/landingpage/locationmasterlist')

            } else {
                alert("Failed to add part");
            }
        } catch (error) {
            console.error("Error adding part:", error);
        }
    };

    return (
        <div className="customer-master" style={{ marginLeft: '460px' }}>
            <h2>Location Master</h2>
            <form onSubmit={handleSubmit}>

                <label>
                    Name
                    <div>

                        <input
                            type="text"
                            name="name"
                            placeholder='Enter  Name'
                            value={formData.name}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>

                </label>


                <label>
                    Location Address
                    <input
                        type="text"
                        name="location_address"
                        placeholder='Enter location address'
                        value={formData.location_address}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Status
                    <div>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                </label>

                <div style={{ display: 'flex' }}>


                    <div >

                        <button className="btn-save2" onClick={() => navigate("/landingpage/locationmasterlist")}>Back</button>
                    </div>

                    <div>
                        <button className="btn-save" type="Save">Save</button>

                    </div>

                </div>

            </form>
        </div>
    );
};

export default LocationMaster;
