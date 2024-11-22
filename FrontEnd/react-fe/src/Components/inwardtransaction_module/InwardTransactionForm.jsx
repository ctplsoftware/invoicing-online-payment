import React, { useEffect, useState } from 'react';
import { API } from '../../API.js';
import { useNavigate } from "react-router-dom";

const InwardTransactionForm = () => {

    const api = new API();
    const navigate = useNavigate();



    const [formData, setFormData] = useState({
        part_name: '',
        inward_quantity: '',
        comments: '',
        uom: '',
    });

    const [partdatafetch, setPartDataFetch] = useState([]);




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const inwardTransactioncreate = await api.get_part_master();
                console.log("Fetched Part Data:", inwardTransactioncreate);
                const activeParts = inwardTransactioncreate.filter(
                    (part) => part.status === "active"
                );

                setPartDataFetch(activeParts || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const userDetails = localStorage.getItem("userDetails");

                const parsedUserDetails = JSON.parse(userDetails); // Parse the JSON string
                const username = parsedUserDetails.user?.username; // Safely access the username
                console.log("Username:", username);
           
            

            // Add username to formData
            const dataToSubmit = {
                ...formData,
                inward_by: username, 
            };
            const response = await api.inwardTransactioncreate(dataToSubmit);
            if (response) {
                alert("Inward Added");
                navigate('/landingpage/inwardtransactionlist');
                setFormData({
                    part_name: '',
                    inward_quantity: '',
                    comments: '',
                    uom: ''
                });
            } else {
                alert("Failed to add part");
            }
        } catch (error) {
            console.error("Error adding part:", error);
        }
    };

    return (
        <div className="customer-master" style={{ marginLeft: '460px' }}>
            <h2>Inward Process </h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Part Name
                    <select
                        name="part_name"
                        value={formData.part_name}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Part Name</option>
                        {partdatafetch.map((row, index) => (
                            <option key={index} value={row.part_name}>
                                {row.part_name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Inward Quantity
                    <input
                        type="text"
                        name="inward_quantity"
                        placeholder="Enter Inward quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    UOM (unit of measure)
                    <div>
                        <select
                            name="uom"
                            value={formData.uom}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select UOM</option>
                            <option value="tons">tons</option>
                        </select>
                    </div>

                </label>
                <label>
                    Comments
                    <input
                        type="text"
                        name="comments"
                        placeholder="Enter Comments"
                        value={formData.comments}
                        onChange={handleChange}
                        required
                    />
                </label>


                <div style={{ display: 'flex', gap: '12px', marginRight: '105%' }}>
                    <div className="pm-button-container " style={{ gap: "10px", marginLeft: '-20%', marginTop: '6%' }}>
                        <button className='btn-save2' onClick={() => navigate("/landingpage/inwardtransactionlist")}>Back</button>

                    </div>

                    <div className="pm-button-container" style={{ gap: "5px", marginTop: '6%', marginLeft: '10%' }}>
                        <button className='btn-save' type="Save">Inward</button>
                    </div>
                </div>


            </form>
        </div>
    );
};

export default InwardTransactionForm;
