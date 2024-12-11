
import React, { useState, useEffect } from 'react';
import { API } from '../../API.js';
import '../../Styles/CustomerMaster.css';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";


const PaymentForm = () => {

    const api = new API();
    const navigate = useNavigate();
    const { order_no } = useParams();

    const [formData, setFormData] = useState({});
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
                const ordermasterfetch = await api.fetch_ordertransactiondata();
                const partmasterfetch = await api.get_part_master();
    
    
                const order = ordermasterfetch.find(item => item.order_no === order_no);
    
                if (order) {
                    const part = partmasterfetch.find(part => part.id === order.part);
    
                    setFormData({
                        id: order.id,
                        order_no: order.order_no,
                        customer_name: order.customer_name,
                        status: order.status,
                        purchase_qty: order.quantity,
                        amount: order.total_amount,
                        payment_status:order.status,
                        part_name: part ? part.part_name : 'Part not found', 
                    });
                } else {
                    console.error(`Order with order_no ${order_no} not found`);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
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
            <form onSubmit={handleSubmit}>
                <label>
                    Order Number                
                        <input
                        type="text"
                        name="orden_no"
                        placeholder='order Number'
                        value={formData.order_no}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                </label>
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
                    <input
                        type="text"
                        name="part_name"
                        placeholder='Enter part_name'
                        value={formData.part_name}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
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
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button style={{ marginLeft: '-40%', marginTop: '6%' }} className="btn-save2" onClick={() => navigate("/landingpage/payment-list")}>Back</button>
                    <button style={{ width: '50px', marginTop: '6%' }} className="btn-save" type="Save">Save</button>
                </div>

            </form>
        </div>


    )

}
export default PaymentForm