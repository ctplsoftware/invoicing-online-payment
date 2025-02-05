import { API } from '../../API.js';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import permissionList from "../../permission.js";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

const PartMasterEdit = () => {
    const api = new API();
    const navigate = useNavigate();
    const permissions = permissionList();
    const { id } = useParams(); // Get the ID from the URL

    const [formData, setFormData] = useState({
        part_name: '',
        status: 'active',  
        unit_price: '',
        hsn_code: '',
        uom: '',
        hsn_code: ''
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
                        hsn_code: partmasterData.hsn_code,
                        uom: partmasterData.uom,
                        hsn_code: partmasterData.hsn_code
                    });
                }
            } catch (error) {
                console.error("Failed to fetch part data:", error);
            }
        };
        fetchPartMaster();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const userDetails = localStorage.getItem("userDetails");
        const parsedDetails = JSON.parse(userDetails);   
        
        const partmasterdatas ={
            ...formData,
            user_id :parsedDetails.user.id
        }

        try {
            await api.update_part_master(partmasterdatas); 
            alert("Update successful");
            navigate('/landingpage/partmaster-fecthList');  
        } catch (error) {
            console.error("Update failed:", error);
            alert("Update failed. Please try again.");
        }
    };

    return (
        <>
        {permissions.includes("asset.view_sampleform") ? (
          <div className="empty-state">
            <h3 style={{ marginTop: "15%" }}>No access to this page</h3>
            {/* Optionally add more details or links */}
          </div>
        ) : (
          <>
            <Container fluid>
              <Form>
                <Row>
                  <Col md={4} style={{ marginTop: "20px" }}>
                    <Form.Label>Part Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="part_name"
                      value={formData.part_name}
                      onChange={handleChange}
                      className="input-border"
                      required
                    />
                  </Col>
  
                  <Col md={4} style={{ marginTop: "20px" }}>
                    <Form.Label>Unit Price</Form.Label>
                    <Form.Control
                      type="text"
                      name="unit_price"
                      value={formData.unit_price}
                      onChange={handleChange}
                      className="input-border"
                      required
                    />
                  </Col>
  
                  <Col md={4} style={{ marginTop: "20px" }}>
                    <Form.Label>UOM (Unit of Measure)</Form.Label>
                    <Form.Control
                      type="text"
                      name="uom"
                      value={formData.uom}
                      onChange={handleChange}
                      className="input-border"
                      required
                    />
                  </Col>
                </Row>
  
                <Row>
                  <Col md={4} style={{ marginTop: "20px" }}>
                    <Form.Label>HSN Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="hsn_code"
                      value={formData.hsn_code}
                      onChange={handleChange}
                      className="input-border"
                      required
                    />
                  </Col>
                </Row>
  
                <div>
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginTop: "20px",
                    marginRight: "200px"
                  }}
                >
                  Save
                </button>

                
              </div>
              </Form>
            </Container>
          </>
        )}
      </>



        // <div className="customer-master">

        //     <form onSubmit={handleEditSubmit}>
                
        //         <label>
        //             Part Name
        //             <input
        //                 type="text"
        //                 name="part_name"
        //                 placeholder='Enter Part Name'
        //                 value={formData.part_name}
        //                 onChange={handleChange}
        //                 required
        //                 autoFocus
        //             />
        //         </label>

        //         <label>
        //             Unit Price
        //             <input
        //                 type="text"
        //                 name="unit_price"
        //                 placeholder='Enter Unit Price'
        //                 value={formData.unit_price}
        //                 onChange={handleChange}
        //                 required
        //             />
        //         </label>

        //         <label>
        //             UOM (unit of measure)
        //             <div>
        //                 <select
        //                     name="uom"
        //                     value={formData.uom}
        //                     onChange={handleChange}
        //                     required
        //                 >
        //                     <option value="">Select UOM</option>
        //                     <option value="tons">tons</option>
        //                 </select>
        //             </div>
        //         </label>

        //         <label>
        //             HSN Code
        //             <input
        //                 type="text"
        //                 name="hsn_code"
        //                 placeholder='Enter HSN Code'
        //                 value={formData.hsn_code}
        //                 onChange={handleChange}
        //                 required
        //             />
        //         </label>

        //         <label>
        //             Status
        //             <div>
        //                 <select
        //                     name="status"
        //                     value={formData.status}
        //                     onChange={handleChange}
        //                     required
        //                 >
        //                     <option value="active">Active</option>
        //                     <option value="inactive">Inactive</option>
        //                 </select>
        //             </div>
        //         </label>

        //         <button  className='btn-save2 ' style={{marginLeft:'-45%'}} onClick={() => navigate("/landingpage/partmaster-fecthList")}>Back</button>

        //         <button className='btn-save' type="submit">Update</button>
                
        //     </form>
        // </div>
    );
};

export default PartMasterEdit;
