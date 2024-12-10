
import React, { useState,useEffect } from 'react';
import { API } from '../../API.js';
import '../../Styles/CustomerMaster.css';
import { useNavigate } from "react-router-dom";

const PaymentForm = () => {

    const api = new API();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        customer_name: '',
        part_name:'',
        purchase_qty:'',
        amount:'',
        payment_status:''

    });
    const [partdatafetch, setPartDataFetch] = useState([]);

    const [locationnamefetch, setLocationnamefetch] = useState([]);

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
                const locationnamefetch = await api.fetch_locationmasterdata();
                console.log("Fetched Part Data:", inwardTransactioncreate);
                const activeParts = inwardTransactioncreate.filter(
                    (part) => part.status === "active"
                );

                const locationactive = locationnamefetch.filter(
                    (locationget) => locationget.status === 'active'
                );

                setLocationnamefetch(locationactive || [])



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
            const response = await api.part_master_Create(formData);
            if (response) {
                alert("Payeer added");
                navigate('/landingpage/payment-list')
               
            } else {
                alert("Failed to add part");
            }
        } catch (error) {
            console.error("Error adding part:", error);
        }
    };

    return (
        <div className="customer-master" style={{ marginLeft: '460px' }}>
            <h2>Payeer Master</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Customer Name
                    <input
                        type="text"
                        name="customer_name"
                        placeholder='Customer Name'
                        value={formData.customer_name}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                </label>


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
                    Purchase Qty
                    <input
                        type="text"
                        name="purchase_qty"
                        placeholder='Enter Purchase Qty'
                        value={formData.purchase_qty}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                </label>
                <label>
                    Amount
                    <input
                        type="text"
                        name="amount"
                        placeholder='Enter Amount'
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                </label>

                <label>
                    Payment Status
                    <input
                        type="text"
                        name="payment_status"
                        placeholder='Enter Payment Status'
                        value={formData.payment_status}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                </label>
                <div style={{display:'flex',gap:'15px'}}>
                <button style={{ marginLeft: '-40%', marginTop: '6%' }} className="btn-save2" onClick={() => navigate("/landingpage/payment-list")}>Back</button>
                <button style={{ width:'50px', marginTop: '6%' }} className="btn-save" type="Save">Save</button>
                </div>
              
            </form>
        </div>


    )

}
export default PaymentForm