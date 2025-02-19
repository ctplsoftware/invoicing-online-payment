import React, { useEffect, useState } from 'react';
import { API } from '../../API.js';
import { useNavigate, useParams } from "react-router-dom";
import '../../Styles/AdminMaster.css'; // Make sure to import the CSS file
import { alertSuccess, alertError, alertWarning } from '../../alert.js';


const Useredit = () => {
    const api = new API();
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirm_password: '',
        email: '',
        customer: '',
        status: 'Active',
        role: '',
    });
    const [roledata, setRoleData] = useState([]);
    const [customerName, setCustomerName] = useState([]);
    const [isCustomerDropdownEnabled, setIsCustomerDropdownEnabled] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update formData
        setFormData({ ...formData, [name]: value });

        // Enable or disable the Customer dropdown based on the selected role
        if (name === 'role_id') {
            const selectedRole = roledata.find((role) => role.id === parseInt(value));
            if (selectedRole?.name === 'Customer') {
                setIsCustomerDropdownEnabled(true);
            } else {
                setIsCustomerDropdownEnabled(false);
                setFormData((prevData) => ({ ...prevData, customer_id: '' })); // Clear customer_id
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rolesfetch = await api.edit_usermaster_fetch(id);
                const fetch_roles = await api.fetch_rolesdata();
                const customerNamefetch = await api.customermaster_fetch();

                console.log("get succes rolesfetch ", rolesfetch);


                if (rolesfetch) {

                    setFormData({
                        id: rolesfetch.id,
                        username: rolesfetch.username,
                        email: rolesfetch.email,
                        customer_id: rolesfetch.customer?.id || '', 
                        role_id: rolesfetch.groups[0]?.id || '', 
                        status: rolesfetch.is_active ? 'Active' : 'Inactive',
                    })

                    const initialRole = fetch_roles.find((role) => role.id === rolesfetch.groups[0]?.id);
                    setIsCustomerDropdownEnabled(initialRole?.name === 'Customer');
                }

                // Fetch all roles
                setRoleData(fetch_roles);

                // Fetch all customers
                setCustomerName(customerNamefetch);


            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.password != "" && formData.confirm_password != ""){
            if (formData.password !== formData.confirm_password) {
                alertWarning('Passwords do not match');
                return;
            }

        }
        

        const submitData = {
            id: formData.id,
            username: formData.username,
            password: formData.password,
            email: formData.email,
            status: formData.status,
            role_id: formData.role_id,
            customer_id: formData.customer_id,
        };


        try {
            await api.update_usermaster(
                submitData,
                (response) => {
                    if (response.data.success) {
                        alertSuccess("User updated successfully!");
                        navigate('/landingpage/userlist');
                    } else {
                        alert("Failed to edit user. Backend returned a failure.");
                    }
                },
                (error) => {
                    console.error("Error in onFailure:", error);
                    alertError("Failed to edit user. An error occurred.");
                }
            );
        } catch (error) {
            console.error("Unexpected error in handleSubmit:", error);
            alert("Failed to edit user. Please try again.");
        }
    
    };

    return (
        <div style={{
            width: '816px',
            maxWidth: 'max-content',
            margin: '0 auto',
            marginTop: '5vh',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '31px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>

            <h2>User Edit</h2>
            <form onSubmit={handleSubmit} className="admin-create-form">
                <div className="form-row">
                    <label>
                        Username
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter Username"
                            className="input-border"
                            value={formData.username}
                            onChange={handleChange}
                            style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px"}}
                            required
                            autoFocus
                        />
                    </label>
                    <label>
                        Password
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            className="input-border"
                            value={formData.password}
                            style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px"}}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <div className="form-row">
                    <label>
                        Confirm Password
                        <input
                            type="password"
                            name="confirm_password"
                            placeholder="Confirm Password"
                            className="input-border"
                            value={formData.confirm_password}
                            style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px"}}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            className="input-border"
                            value={formData.email}
                            style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px"}}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>

                <div className="form-row">
                    <label>
                        Role
                        <select
                            name="role_id"
                            value={formData.role_id}
                            onChange={handleChange}
                            style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px"}}
                            required
                        >
                            <option value="">Select Role</option>
                            {roledata.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Customer
                        <select
                            name="customer_id"
                            value={formData.customer_id}
                            onChange={handleChange}
                            style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px"}}
                            required
                            disabled={!isCustomerDropdownEnabled}


                        >
                            <option value="">Select Customer</option>
                            {
                                customerName.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                        </select>
                    </label>
                </div>

                <div className="form-row">
                    <label>
                        Status
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px"}}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </label>
                </div>

                <div style={{ display: 'flex', gap: '10%', marginTop: "3%" }}>
                        <div className="pm-button-container" style={{ gap: "10px" }}>
                            <button className="btn-save2" onClick={() => navigate("/landingpage/userlist")}>
                                Go to user
                            </button>
                        </div>

                        <div className="pm-button-container" style={{ gap: "10px" }}>
                            <button className='btn-save' type="Save">Update</button>
                        </div>
                    </div>
            </form>
        </div>
    );
};

export default Useredit;
