import { API } from '../../API.js';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';

const InwardTransactionEdit = () => {
    const api = new API();
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        part_description: '',
        quantity: '',
        remarks: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        const fetchPartMaster = async () => {
            try {
                const inwardmasterData = await api.edit_inward_transaction(id);  
                const inwardTransactionfetch = await api.get_part_master();

                if (inwardmasterData) {
                    setFormData({
                        id: inwardmasterData.id,
                        part_description: inwardmasterData.part_description,
                        quantity: inwardmasterData.quantity,
                        remarks: inwardmasterData.remarks,

                    });
                }
            } catch (error) {
                console.error("Failed to fetch part data:", error);
            }
        };
        fetchPartMaster();
    }, [id]);

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            await api.update_inwardtransaction(formData);
            alert("Update successful");
            navigate('/landingpage/inwardtransactionlist');
        } catch (error) {
            console.error("Update failed:", error);
            alert("Update failed. Please try again.");
        }
    };

    return (
        <div className="customer-master">
            <h2>Inward Master Update</h2>
            <form onSubmit={handleEditSubmit}>
                <label>
                    Part Description
                    <div>
                        <select
                            name="part_description"
                            value={formData.part_description}
                            onChange={handleChange}
                            required
                        >

                        </select>
                    </div>
                </label>

                <label>
                    Quantity
                    <input
                        type="text"
                        name="quantity"
                        placeholder='Enter Quantity'
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
                        placeholder='Enter Remarks'
                        value={formData.remarks}
                        onChange={handleChange}
                        required
                    />
                </label>


                <button onClick={() => navigate("/landingpage/inwardtransactionlist")}>Back</button>

                <button type="submit">Submit</button>

            </form>
        </div>
    );
};

export default InwardTransactionEdit;
