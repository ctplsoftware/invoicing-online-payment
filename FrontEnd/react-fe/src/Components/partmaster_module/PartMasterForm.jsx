import React, { useState } from "react";
import { API } from "../../API.js";
import "../../Styles/CustomerMaster.css";
import { useNavigate } from "react-router-dom";
import permissionList from "../../permission.js";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { alertWarning } from "../../alert.js";

const PartMaster = () => {
  const api = new API();
  const navigate = useNavigate();
  const permissions = permissionList();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    part_name: "",
    status: "active",
    unit_price: "",
    uom: "",
    hsn_code: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.part_name.trim()) 
      newErrors.part_name = "Part name is required";
    if (!formData.unit_price.trim())
      newErrors.unit_price = "Unit price is required";
    if (!formData.uom.trim())
      newErrors.uom = "UOM is required";
    if (!/^[0-9A-Za-z]{15}$/.test(formData.unit_price))
      newErrors.unit_price = "Unit price must be a number!";
    if (!formData.hsn_code.trim())
      newErrors.hsn_code = "HSN code is required";
    if (formData.unit_price == 0 || formData.unit_price < 0)
      newErrors.hsn_code = "Unit price must be greater than 0.";

    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userDetails = localStorage.getItem("userDetails");

    const parsedDetails = JSON.parse(userDetails);

    const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          Object.values(validationErrors).forEach((erroMessage) => {
            alertWarning(erroMessage);
          });
          return;
    }

    try {
      const partmasterdatas = {
        ...formData,
        user_id: parsedDetails.user.id,
      };
      const response = await api.part_master_Create(partmasterdatas);
      if (response) {
        alert("Part Added");
        navigate("/landingpage/partmaster-fecthList");
      } else {
        alert("Failed to add part");
      }
    } catch (error) {
      console.error("Error adding part:", error);
    }
  };



  function handleBack(){
    navigate('/landingpage/partmaster-fecthList');
  }

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
                    type="number"
                    name="unit_price"
                    value={formData.unit_price}
                    onChange={handleChange}
                    className="input-border"
                    min={1}
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

              <div style={{ marginRight: "80px" }}>
              <button
                  onClick={() => handleBack()}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "rgb(73 81 88)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    marginTop: "20px",
                    marginRight: "10px",
                  }}
                >
                  Back
                </button>

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

     );
};

export default PartMaster;
