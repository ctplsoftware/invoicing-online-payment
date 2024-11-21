import React, { useState } from 'react';
import { API } from '../../API.js';
import '../../Styles/CustomerMaster.css';
import { useNavigate } from "react-router-dom";



const PartMaster = () => {
    const api = new API();
    const navigate = useNavigate();


    

    const [formData, setFormData] = useState({
        part_description: '',
        status: 'active',  
        unit_price: '',
        uom:''

    });

       const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.part_master_Create(formData);
            if (response) {
                alert("Part Added");
                navigate('/landingpage/partmaster-fecthList')
                setFormData({
                    part_description: '',
                    status: 'active',  
                    unit_price: '',
                    uom:''
                });
            } else {
                alert("Failed to add part");
            }
        } catch (error) {
            console.error("Error adding part:", error);
        }
    };

    return (
        <div className="customer-master" style={{marginLeft:'460px'}}>
            <h2>Part Master</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Part Description
                    <input
                        type="text"
                        name="part_description"
                        placeholder='Enter Part Description'
                        value={formData.part_description}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                </label>


                <label>
                    Status
                    <div>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                </label>

                <label>
                    Unit Price
                    <input
                        type="text"
                        name="unit_price"
                        placeholder='Enter Unit Price'
                        value={formData.unit_price}
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
                            <option value="kg">kg</option>
                            <option value="tons">tons</option>
                        </select>
                    </div>

                </label>
                <button  style={{marginLeft:'-40%',marginTop:'6%'}} className="btn-save2" onClick={() => navigate("/landingpage/partmaster-fecthList")}>Back</button>
                    <button style={{marginTop:'6%'}} className="btn-save" type="submit">Submit</button>
            </form>
        </div>
    );
};

export default PartMaster;
