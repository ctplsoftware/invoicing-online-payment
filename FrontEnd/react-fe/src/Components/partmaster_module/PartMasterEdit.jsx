import { API } from '../../API.js';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';

const PartMasterEdit = () => {
    const api = new API();
    const navigate = useNavigate();
    const { id } = useParams(); // Get the ID from the URL

    const [formData, setFormData] = useState({
        part_name: '',
        status: 'active',  
        unit_price: '',
        uom: ''
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
                const partmasterData = await api.editGet_part_master(id);  
                if (partmasterData) {
                    setFormData({
                        id :partmasterData.id,
                        part_name: partmasterData.part_name,
                        status: partmasterData.status,
                        unit_price: partmasterData.unit_price,
                        uom: partmasterData.uom
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
            await api.update_part_master(formData); 
            alert("Update successful");
            navigate('/landingpage/partmaster-fecthList');  
        } catch (error) {
            console.error("Update failed:", error);
            alert("Update failed. Please try again.");
        }
    };

    return (
        <div className="customer-master">
            <h2>Part Master Update</h2>
            <form onSubmit={handleEditSubmit}>
                <label>
                    Part Name
                    <input
                        type="text"
                        name="part_name"
                        placeholder='Enter Part Name'
                        value={formData.part_name}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
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
                            <option value="tons">tons</option>
                        </select>
                    </div>
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

                <button onClick={() => navigate("/landingpage/partmaster-fecthList")}>Back</button>

                <button type="Save">Update</button>
                
            </form>
        </div>
    );
};

export default PartMasterEdit;
