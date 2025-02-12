import React, { useState } from "react";
import { API } from "../../API.js";
import "../../Styles/CustomerMaster.css";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import permissionList from "../../permission.js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { alertWarning, alertSuccess, alertError } from "../../alert.js";

const LocationMaster = () => {
  const api = new API();
  const navigate = useNavigate();
  const permissions = permissionList();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    status: "active",
    location_address: "",
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

    if (!formData.name.trim()) newErrors.name = "Location name is required";
    if (!formData.location_address.trim())
      newErrors.location_address = "Location address is required";

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

    const locationdetails = {
      ...formData,
      user_id: parsedDetails.user.id,
    };
    try {
      const response = await api.createLocationMaster(locationdetails);
      if (response) {
        alertSuccess("Location Added");
        navigate("/landingpage/locationmasterlist");
      } else {
        alertError("Failed to add part");
      }
    } catch (error) {
      console.error("Error adding part:", error);
    }
  };

  function handleBack() {
    navigate("/landingpage/locationmasterlist");
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
          <Container
                fluid
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "30px",
                  borderRadius: "22px",
                  maxWidth: "90%",
                  marginTop: "80px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                }}
              >            
              <Form onSubmit={handleSubmit}>
              <div></div>

              <Row>
                <Col md={4} style={{ marginTop: "20px" }}>
                  <Form.Label>Location Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-border"
                    style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px",  }}
                    required
                  />
                </Col>

                <Col md={4} style={{ marginTop: "20px" }}>
                  <Form.Label>Location Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="location_address"
                    value={formData.location_address}
                    onChange={handleChange}
                    className="input-border"
                    style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px",  }}
                    required
                  />
                </Col>
              </Row>

              <div style={{ marginRight: "80px" }}>
              <button
                  onClick={handleSubmit}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    marginTop: "20px",
                    marginRight: "10px",
                  }}
                >
                  Save
                </button>
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
                    marginRight: "200px",
                  }}
                >
                  Back
                </button>
              </div>
            </Form>
          </Container>
        </>
      )}
    </>
  );
};

export default LocationMaster;