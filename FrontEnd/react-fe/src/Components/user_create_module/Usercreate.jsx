import React, { useEffect, useState } from 'react';
import { API } from '../../API.js';
import { useNavigate } from "react-router-dom";
import '../../Styles/AdminMaster.css'; // Make sure to import the CSS file

const Usercreate = () => {
    const api = new API();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirm_password: '',
        mail: '',
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
                customer_id :''
            });
        }
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                const rolesfetch = await api.fetch_rolesdata();
                const customerNamefetch = await api.customermaster_fetch();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            alert('Passwords do not match');
            return;
        }
        console.log("data", formData);

        const submitData = {
            username: formData.username,
            password: formData.password,
            mail: formData.mail,
            status: formData.status,
            role_id: formData.role_id,   // Send role_id
            customer_id: formData.customer_id,  // Send customer_id
        };

        console.log("submitData..",submitData);
        

        try {
            const response = await api.user_create(submitData);
            if (response) {
                alert("Added");
                navigate('/landingpage/userlist');

            } else {
                alert("Failed to add part");
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
            marginTop: '11vh',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '31px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',

        }}>

            <h2>User Create</h2>
            <form onSubmit={handleSubmit} className="admin-create-form">
                <div className="form-row">
                    <label>
                        Username
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter Username"
                            value={formData.username}
                            onChange={handleChange}
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
                            value={formData.password}
                            onChange={handleChange}
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
                            placeholder="Confirm Password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Email
                        <input
                            type="email"
                            name="mail"
                            placeholder="Enter Email"
                            value={formData.mail}
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
