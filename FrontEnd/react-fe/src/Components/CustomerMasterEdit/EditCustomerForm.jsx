import { FaPlus, FaMinus } from 'react-icons/fa';
import '../../Styles/CustomerMaster.css'

import { API } from '../../API.js';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';



const EditCustomerForm = ({ }) => {
    const { id } = useParams(); // Get the ID from the URL
    const navigate = useNavigate();


    const [currentCustomer, setCurrentCustomer] = useState({}); // Initialize as an empty object
    const [additionalAddresses, setAdditionalAddresses] = useState([""]); // Start with one empty address
    const [editMode, setEditMode] = useState(false);
    const [customerData, setCustomerData] = useState([]);

    const api = new API();


    useEffect(() => {
        const fetchCustomer = async () => {
            const api = new API();
            const customerData = await api.customerMasterEditFetch(id); // Fetch customer data by ID
            console.log("customerData..../", customerData);



            setCurrentCustomer({
                'id': customerData.id,
                'name': customerData.name,
                'delivery_address': customerData.delivery_address,
                'billing_address': customerData.billing_address,
                'gstin_number': customerData.gstin_number,
                'credit_limit': customerData.credit_limit,
                'credit_days': customerData.credit_days,
                'contact_person': customerData.contact_person,
                'contact_number': customerData.contact_number
            });
            setAdditionalAddresses([
                customerData.additional_address1 || "",
                customerData.additional_address2 || ""
            ].filter(address => address)); // Only include non-empty addresses
        };

        fetchCustomer();
    }, [id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentCustomer((prevCustomer) => ({ ...prevCustomer, [name]: value }));
    };

    const addAdditionalAddress = () => {
        setAdditionalAddresses([...additionalAddresses, ""]);
    };

    const removeAdditionalAddress = (index) => {
        const updatedAddresses = additionalAddresses.filter((_, i) => i !== index);
        console.log("updatedAddresses...",updatedAddresses);
        
        setAdditionalAddresses(updatedAddresses);
    };

    const handleAdditionalAddressChange = (index, value) => {
        const updatedAddresses = [...additionalAddresses];
        updatedAddresses[index] = value;
        setAdditionalAddresses(updatedAddresses);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            const updatedCustomer = { ...currentCustomer, additional_addresses: additionalAddresses };
            console.log("updatedCustomer", updatedCustomer);

            await api.customermaster_update(
                updatedCustomer,
                (response) => {
                    console.log("Update successful:", response);
                    navigate('/landingpage/customermasterdashboard');
                    // handle success (e.g., update state, show a success message)
                },
                (error) => {
                    console.error("Update failed:", error);
                    // handle failure (e.g., show an error message)
                }
            );
            setEditMode(false);
            setCurrentCustomer({});
            setAdditionalAddresses([""]);
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };

    const hasAdditionalAddresses = additionalAddresses.some(address => address.trim() !== "");


    return (

        <div className="customer-master">
            <h1>daddad</h1>

            <form onSubmit={handleEditSubmit}>
                <label>
                    Customer Name
                    <input
                        type="text"
                        name="name"
                        placeholder='Enter Customer name'
                        value={currentCustomer.name}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Delivery Address
                    <input
                        type="text"
                        name="delivery_address"
                        placeholder="Enter Billing Address"
                        value={currentCustomer.delivery_address}
                        onChange={handleInputChange}
                        required
                    />
                    <span className="icon-tag" onClick={addAdditionalAddress}>
                        <FaPlus /> {/* Plus icon */}
                    </span>
                </label>

                {additionalAddresses.length > 0 && additionalAddresses.map((address, index) => (
                    <div key={index} className="additional-address">
                        <label>
                            Additional Address {index + 1}
                            <input
                                type="text"
                                placeholder={`Enter Additional Address ${index + 1}`}
                                value={address}
                                onChange={(e) => handleAdditionalAddressChange(index, e.target.value)}
                            />
                            <span className="icon-tag" onClick={() => removeAdditionalAddress(index)}>
                                <FaMinus />
                            </span>
                        </label>
                    </div>
                ))}



                <label>
                    Billing Address
                    <input
                        type="text"
                        name="billing_address"
                        placeholder='Enter Company Address'
                        value={currentCustomer.billing_address}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    GSTIN Number
                    <input
                        type="text"
                        name="gstin_number"
                        placeholder='Enter GSTIN Number'
                        value={currentCustomer.gstin_number}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Credit Limit
                    <input
                        type="text"
                        name="credit_limit"
                        placeholder='Enter Credit Limit'
                        value={currentCustomer.credit_limit}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Credit Days
                    <div className='credit_days'>

                        <select
                            name="credit_days"
                            value={currentCustomer.credit_days}
                            onChange={handleInputChange}
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
                        value={currentCustomer.contact_person}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Contact Number
                    <input
                        type="text"
                        name="contact_number"
                        placeholder='Enter Contact Number'
                        value={currentCustomer.contact_number}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default EditCustomerForm;
