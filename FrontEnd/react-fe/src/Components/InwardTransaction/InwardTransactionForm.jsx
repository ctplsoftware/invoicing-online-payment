import React, { useEffect, useState } from 'react';
import { API } from '../../API.js';
import { useNavigate } from "react-router-dom";

const InwardTransactionForm = () => {

    const api = new API();
    const navigate = useNavigate();



    const [formData, setFormData] = useState({
        part_description: '',
        quantity: '',
        remarks: '',
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
            const response = await api.inwardTransactioncreate(formData);
            if (response) {
                alert("Inward Added");
                navigate('/landingpage/inwardtransactionlist');
                setFormData({
                    part_description: '',
                    quantity: '',
                    remarks: ''
                });
            } else {
                alert("Failed to add part");
            }
        } catch (error) {
            console.error("Error adding part:", error);
        }
    };

    return (
        <div className="customer-master">
            <h2>Inward Transaction Master</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Part Description
                    <select
                        name="part_description"
                        value={formData.part_description}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select</option>
                        {partdatafetch.map((row, index) => (
                            <option key={index} value={row.part_description}>
                                {row.part_description}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Quantity
                    <input
                        type="text"
                        name="quantity"
                        placeholder="Enter quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Remarks
                    <input
                        type="text"
                        name="remarks"
                        placeholder="Enter remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        required
                    />
                </label>
                <div >
                </div>

                <div style={{ display: 'flex', gap: '32px' }}>
                    <div className="pm-button-container "  style={{ gap: "10px",marginLeft:'-20%',marginTop:'6%' }}>
                        <button className='btn-save2' onClick={() => navigate("/landingpage/inwardtransactionlist")}>Back</button>

                    </div>

                    <div className="pm-button-container" style={{ gap: "10px",marginTop:'6%',marginLeft:'80%' }}>
                        <button className='btn-save' type="submit">Submit</button>
                    </div>
                </div>


            </form>
        </div>
    );
};

export default InwardTransactionForm;
