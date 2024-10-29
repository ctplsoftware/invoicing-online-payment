import React, { useState } from 'react';
import '../Styles/CustomerMaster.css';
import { API } from '../API.js';

const CustomerMaster = () => {
    const api = new API();
    const [formData, setFormData] = useState({
        name: '',
        primary_address: '',
        secondary_address: '',
        credit_limit: '',
        expiration_date: '',
        contact_person: '',
        contact_number: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData);

            const response = await api.save_customer(formData);

            if (response) {
                console.log('Customer added:', response);
                alert("Customer Added");

                // Reset form data
                setFormData({
                    name: '',
                    primary_address: '',
                    secondary_address: '',
                    credit_limit: '',
                    expiration_date: '',
                    contact_person: '',
                    contact_number: '',
                });
            } else {
                console.error('Error adding customer:', response.statusText);
                alert("Couldn't add customer");
            }
        } catch (error) {
            alert("Couldn't add customer");
            console.error('Error:', error);
        }
    };

    return (
        <div className="customer-master">
            <h2>Customer Master</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Customer Name
                    <input
                        type="text"
                        name="name"
                        placeholder='Enter Customer name'
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                </label>
                <label>
                    Primary Address
                    <input
                        type="text"
                        name="primary_address" 
                        placeholder='Enter Primary Address'
                        value={formData.primary_address}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Secondary Address
                    <input
                        type="text"
                        name="secondary_address" 
                        placeholder='Enter Secondary Address'
                        value={formData.secondary_address}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Credit Limit
                    <input
                        type="text"
                        name="credit_limit" 
                        placeholder='Enter Credit Limit'
                        value={formData.credit_limit}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Expiration Date <br />
                    <input
                        type="date"
                        name="expiration_date" 
                        value={formData.expiration_date}
                        onChange={handleChange}
                        required
                        style={{ width: '340px' }}
                    />
                </label>
                <label>
                    Contact Person
                    <input
                        type="text"
                        name="contact_person" 
                        placeholder='Enter Contact Person'
                        value={formData.contact_person}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Contact Number
                    <input
                        type="text"
                        name="contact_number" 
                        placeholder='Enter Contact Number'
                        value={formData.contact_number}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CustomerMaster;
