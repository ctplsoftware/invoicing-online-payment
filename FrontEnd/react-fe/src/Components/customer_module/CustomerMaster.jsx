import React, { useEffect, useState } from 'react';

import '../../Styles/CustomerMaster.css';
import { API } from '../../API.js';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import permissionList from '../../permission.js';


const CustomerMaster = () => {
    const api = new API();
    const navigate = useNavigate();


    const permissions = permissionList();


    const [formData, setFormData] = useState({
        name: '',
        delivery_address: '',
        additional_addresses: [],
        billing_address: '',
        gstin_number: '',
        credit_limit: '',
        credit_days: '30',
        contact_person: '',
        contact_number: '',
    });
    const [additionalAddresses, setAdditionalAddresses] = useState([]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAdditionalAddressChange = (index, value) => {
        const newAddresses = [...additionalAddresses];
        newAddresses[index] = value;
        setAdditionalAddresses(newAddresses);
    };

    const addAdditionalAddress = () => {
        setAdditionalAddresses([...additionalAddresses, '']);
    };

    const removeAdditionalAddress = (index) => {
        const newAddresses = additionalAddresses.filter((_, i) => i !== index);
        setAdditionalAddresses(newAddresses);
    };

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        try {
            console.log(formData);

            const completeFormData = {
                ...formData,
                additional_addresses: additionalAddresses,
            };

            const response = await api.save_customer(completeFormData);
            if (response) {
                console.log('Customer added:', response);
                alert("Customer Added");
                navigate('/landingpage/customermasterdashboard');
                setAdditionalAddresses([]);
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

        <>
            {permissions.includes('asset.view_sampleform') ? (
                <div className="empty-state">
                    <h3 style={{ marginTop: "15%" }}>No access to this page</h3>
                    {/* Optionally add more details or links */}
                </div>
            ) : (





                <div className="customer-master" style={{ marginLeft: '460px' }}>

                    <u><h3 className='headingfont-bold'>Customer Master</h3></u>
                    <form style={{ marginLeft: '6%' }} onSubmit={handleSubmit}>
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
                            GSTIN Number
                            <input
                                type="text"
                                name="gstin_number"
                                placeholder='Enter GSTIN Number'
                                value={formData.gstin_number}
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
                            Credit Days
                            <div className='credit_days'>

                                <select
                                    name="credit_days"
                                    value={formData.credit_days}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="0">0 days</option>
                                    <option value="30">30 days</option>
                                    <option value="60">60 days</option>
                                    <option value="90">90 days</option>
                                </select>
                            </div>

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

                        <label>
                            Billing Address
                            <input
                                type="text"
                                name="billing_address"
                                placeholder='Enter Company Address'
                                value={formData.billing_address}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Delivery Address
                            <div className="billing-address-container">
                                <input
                                    type="text"
                                    name="delivery_address"
                                    placeholder="Enter Primary Address"
                                    value={formData.delivery_address}
                                    onChange={handleChange}
                                    required
                                />
                                <span style={{ marginLeft: '5%' }} className="icon-tag" onClick={addAdditionalAddress}>
                                    <FaPlus /> {/* Plus icon */}
                                </span>
                            </div>
                        </label>


                        {additionalAddresses.map((address, index) => (
                            <div key={index} className="additional-address">
                                <label>
                                    Additional Address {index + 1}
                                    <input
                                        type="text"
                                        placeholder={`Enter Additional Address ${index + 1}`}
                                        value={address}
                                        onChange={(e) => handleAdditionalAddressChange(index, e.target.value)}
                                    />
                                    <span style={{ marginLeft: '5%' }} className="icon-tag" onClick={() => removeAdditionalAddress(index)}>
                                        <FaMinus /> {/* Minus icon */}
                                    </span>
                                </label>
                            </div>
                        ))}









                    <div style={{ display: 'flex', gap: '30%', marginTop: "3%" }}>
                        <div className="pm-button-container" style={{ gap: "10px" }}>
                            <button className="btn-save2" onClick={() => navigate("/landingpage/customermasterdashboard")}>
                                Go to Customers
                            </button>
                        </div>

                        <div className="pm-button-container" style={{ gap: "10px" }}>
                            <button className='btn-save' type="Save">Save</button>
                        </div>
                    </div>

                    </form>

                </div>


            )

            }


        </>


    );
};

export default CustomerMaster;
