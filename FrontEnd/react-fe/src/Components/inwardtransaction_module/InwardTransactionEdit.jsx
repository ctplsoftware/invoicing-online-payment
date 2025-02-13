import { API } from '../../API.js';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { alertWarning, alertSuccess, alertError } from "../../alert.js";


const InwardTransactionEdit = () => {
    const api = new API();
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        part_name: '',
        quantity: '',
        comments : ''
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
                        part_name: inwardmasterData.part_name,
                        quantity: inwardmasterData.quantity,
                        comments : inwardmasterData.comments ,

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
            alertSuccess("Update successful");
            navigate('/landingpage/inwardtransactionlist');
        } catch (error) {
            console.error("Update failed:", error);
            alertError("Update failed. Please try again.");
        }
    };

    return (
        <div className="customer-master">
            <h2>Inward Process Update</h2>
            <form onSubmit={handleEditSubmit}>
                <label>
                    Part Description
                    <div>
                        <select
                            name="part_name"
                            value={formData.part_name}
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
                    comments 
                    <input
                        type="text"
                        name="comments "
                        placeholder='Enter comments '
                        value={formData.comments }
                        onChange={handleChange}
                        required
                    />
                </label>


                <button onClick={() => navigate("/landingpage/inwardtransactionlist")}>Back</button>

                <button type="Save">Update</button>

            </form>
        </div>
    );
};

export default InwardTransactionEdit;
