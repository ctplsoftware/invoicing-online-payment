import React, { useEffect, useState } from 'react';
import { API } from '../../API.js';
import { useNavigate } from "react-router-dom";
import '../../Styles/AdminMaster.css'; // Make sure to import the CSS file
import { alertSuccess, alertError, alertWarning } from '../../alert.js';

const Usercreate = () => {
    const api = new API();
    const navigate = useNavigate();

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

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'role') {
            const selectedRole = roledata.find(role => role.name === value);
            setFormData({
                ...formData,
                role: value,
                role_id: selectedRole ? selectedRole.id : '',
            });
        } else if (name === 'customer') {
            const selectedCustomer = customerName.find(customer => customer.name === value);
            setFormData({
                ...formData,
                customer: value,
                customer_id: selectedCustomer ? selectedCustomer.id : '',
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
                customer_id: ''
            });
        }
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                const rolesfetch = await api.fetch_rolesdata();
                const customerNamefetch = await api.customermaster_fetch();

                console.log(customerNamefetch, 'customerNamefetch');
                

                const fetchedata = rolesfetch.map((item, index) => ({
                    id: item.id,
                    name: item.name,

                }));

                const fetchdataincustomer = customerNamefetch.map((item, index) => ({

                    id: item.id,
                    name: item.name


                }));



                setRoleData(fetchedata);
                setCustomerName(fetchdataincustomer);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            alertWarning('Passwords do not match');
            return;
        }
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {

            Object.values(validationErrors).forEach(erroMessage => {
                alertWarning(erroMessage);
            });

            return;

        }
        const submitData = {
            username: formData.username,
            password: formData.password,
            email: formData.email,
            status: formData.status,
            role_id: formData.role_id,
            customer_id: formData.customer_id,
        };



        try {
            const response = await api.user_create(submitData);
            if (response) {
                alertSuccess("Added");
                navigate('/landingpage/userlist');

            } else {
                alertError("Failed to add user");
            }
        } catch (error) {
            console.error("Error adding part:", error);
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
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',

        }}>

            <h3 className="nonheadingfont-bold">User Create</h3>
            <form onSubmit={handleSubmit} className="admin-create-form">
                <div className="form-row">
                    <label>
                        Username
                        <input
                            type="text"
                            name="username"
                            className="input-border"
                            placeholder="Enter Username"
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
                            className="input-border"
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px"}}
                            required
                        />
                    </label>
                </div>

                <div className="form-row">
                    <label>
                        Confirm Password
                        <input
                            type="password"
                            name="confirm_password"
                            className="input-border"
                            placeholder="Confirm Password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px"}}
                            required
                        />
                    </label>
                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            className="input-border"
                            placeholder="Enter Email"
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
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px"}}
                            required
                        >
                            <option value="">Select Role</option>
                            {roledata.map((row, index) => (
                                <option key={index} value={row.name}>
                                    {row.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Customer
                        <select
                            name="customer"
                            value={formData.customer}
                            onChange={handleChange}
                            style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px"}}
                            required
                            disabled={formData.role !== "Customer"}
                        >
                            <option value="">Select Customer</option>
                            {customerName.map((row, index) => (
                                <option key={index} value={row.name}>
                                    {row.name}
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
                            Go to User
                        </button>
                    </div>

                    <div className="pm-button-container" style={{ gap: "10px" }}>
                        <button className='btn-save' type="Save">Save</button>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default Usercreate;
