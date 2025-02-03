import React, { useEffect, useState } from "react";
import { API } from "../../API.js";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import permissionList from "../../permission.js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

const InwardTransactionForm = () => {
  const api = new API();
  const navigate = useNavigate();
  const permissions = permissionList();

  const [formData, setFormData] = useState({
    part_name: "",
    inward_quantity: "",
    comments: "",
    uom: "",
    location_id: "",
  });

  const [partdatafetch, setPartDataFetch] = useState([]);

  const [locationnamefetch, setLocationnamefetch] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inwardTransactioncreate = await api.get_part_master();
        const locationnamefetch = await api.fetch_locationmasterdata();
        const activeParts = inwardTransactioncreate.filter(
          (part) => part.status === "active"
        );

        const locationactive = locationnamefetch.filter(
          (locationget) => locationget.status === "active"
        );

        setLocationnamefetch(locationactive || []);

        setPartDataFetch(activeParts || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userDetails = localStorage.getItem("userDetails");

      const parsedUserDetails = JSON.parse(userDetails); // Parse the JSON string
      const username = parsedUserDetails.user?.username; // Safely access the username

      // Add username to formData
      const dataToSubmit = {
        ...formData,
        inward_by: username,
      };
      console.log("dataToSubmit", dataToSubmit);

      const response = await api.inwardTransactioncreate(dataToSubmit);
      if (response) {
        alert("Inward Added");
        navigate("/landingpage/inwardtransactionlist");
        setFormData({
          part_name: "",
          inward_quantity: "",
          comments: "",
          uom: "",
        });
      } else {
        alert("Failed to add part");
      }
    } catch (error) {
      console.error("Error adding part:", error);
    }
  };

  return (
    <>
      {permissions.includes("asset.view_sampleform") ? (
        <div className="empty-state">
          <h3 style={{ marginTop: "15%" }}>No access to this page</h3>
        </div>
      ) : (
        <>
          <Container fluid>
            <Form>
              <Row>
                <Col md={4} style={{ marginTop: "20px" }}>
                  <Form.Group controlId="partName">
                    <Form.Label>Part Name</Form.Label>
                    <Form.Control
                      as="select"
                      name="part_name"
                      value={formData.part_name}
                      className="input-border"
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Part Name</option>
                      {partdatafetch.map((row, index) => (
                        <option key={index} value={row.part_name}>
                          {row.part_name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col md={4} style={{ marginTop: "20px" }}>
                  <Form.Group controlId="locationName">
                    <Form.Label>Location Name</Form.Label>
                    <Form.Control
                      as="select"
                      name="location_id"
                      className="input-border"
                      value={formData.location_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Location Name</option>
                      {locationnamefetch.map((row) => (
                        <option key={row.id} value={row.id}>
                          {row.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
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
                  <Form.Label>Inward Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="inward_quantity"
                    value={formData.inward_quantity}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>

                <Col md={4} style={{ marginTop: "20px" }}>
                  <Form.Label>Comments</Form.Label>
                  <Form.Control
                    type="text"
                    name="comments"
                    value={formData.comments}
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

    // <div className="customer-master" style={{ marginLeft: '360px' }}>
    //     <h2>Inward Process </h2>
    //     <form onSubmit={handleSubmit}>
    //         <label>
    //             Part Name
    //             <select
    //                 name="part_name"
    //                 value={formData.part_name}
    //                 onChange={handleChange}
    //                 required
    //             >
    //                 <option value="">Select Part Name</option>
    //                 {partdatafetch.map((row, index) => (
    //                     <option key={index} value={row.part_name}>
    //                         {row.part_name}
    //                     </option>
    //                 ))}
    //             </select>
    //         </label>

    //         <label>
    //             Location Name
    //             <select
    //                 name="location_id" // Use location_id as the name
    //                 value={formData.location_id}
    //                 onChange={handleChange}
    //                 required
    //             >
    //                 <option value="">Select Location Name</option>
    //                 {locationnamefetch.map((row) => (
    //                     <option key={row.id} value={row.id}>
    //                         {row.name}
    //                     </option>
    //                 ))}
    //             </select>
    //         </label>

    //         <label>
    //             Inward Quantity
    //             <input
    //                 type="text"
    //                 name="inward_quantity"
    //                 placeholder="Enter Inward quantity"
    //                 value={formData.quantity}
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
    //             Comments
    //             <input
    //                 type="text"
    //                 name="comments"
    //                 placeholder="Enter Comments"
    //                 value={formData.comments}
    //                 onChange={handleChange}
    //                 required
    //             />
    //         </label>

    //         <div style={{ display: 'flex', gap: '12px', marginRight: '105%' }}>
    //             <div className="pm-button-container " style={{ gap: "10px", marginLeft: '-20%', marginTop: '6%' }}>
    //                 <button className='btn-save2' onClick={() => navigate("/landingpage/inwardtransactionlist")}>Back</button>

    //             </div>

    //             <div className="pm-button-container" style={{ gap: "5px", marginTop: '6%', marginLeft: '10%' }}>
    //                 <button className='btn-save' type="Save">Inward</button>
    //             </div>
    //         </div>

    //     </form>
    // </div>
  );
};

export default InwardTransactionForm;
