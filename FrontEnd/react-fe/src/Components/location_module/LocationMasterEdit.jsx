import { API } from '../../API.js';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';

const LocationMasterEdit = () => {
    const api = new API();
    const navigate = useNavigate();
    const { id } = useParams(); // Get the ID from the URL

    const [formData, setFormData] = useState({
        name: '',
        status: 'active',
        location_address: '',
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
                const locationmasterData = await api.edit_location_fetch(id);
                if (locationmasterData) {
                    setFormData({
                        id: locationmasterData.id,
                        name: locationmasterData.name,
                        status: locationmasterData.status,
                        location_address: locationmasterData.location_address,
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
        const userDetails = localStorage.getItem("userDetails");
        const parsedDetails = JSON.parse(userDetails); 
        const locationdetails ={
            ...formData,
            user_id:parsedDetails.user.id
        }
        try {
            await api.update_locationmaster(locationdetails);
            alert("Update successful");
            navigate('/landingpage/locationmasterlist');
        } catch (error) {
            console.error("Update failed:", error);
            alert("Update failed. Please try again.");
        }
    };

    return (
        <div className="customer-master" style={{ marginLeft: '460px' }}>
            <h2>Location Master Update</h2>
            <form onSubmit={handleEditSubmit}>
                <label>
                    Name
                    <div>

                    <input
                        type="text"
                        name="name"
                        placeholder='Enter Name'
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                    </div>

                </label>

                <label>
                    Location Address
                    <input
                        type="text"
                        name="location_address"
                        placeholder='Enter location address'
                        value={formData.location_address}
                        onChange={handleChange}
                        required
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

                <div style={{ display: 'flex' }}>


                    <div >

                        <button className="btn-save2" onClick={() => navigate("/landingpage/locationmasterlist")}>Back</button>
                    </div>

                    <div>
                        <button className="btn-save" type="Save">Update</button>

                    </div>

                </div>



            </form>
        </div>
    );
};

export default LocationMasterEdit;
