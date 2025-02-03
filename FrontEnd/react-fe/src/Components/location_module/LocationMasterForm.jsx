import React, { useState } from "react";
import { API } from "../../API.js";
import "../../Styles/CustomerMaster.css";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import permissionList from "../../permission.js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

const LocationMaster = () => {
  const api = new API();
  const navigate = useNavigate();
  const permissions = permissionList();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userDetails = localStorage.getItem("userDetails");
    const parsedDetails = JSON.parse(userDetails);

    const locationdetails = {
      ...formData,
      user_id: parsedDetails.user.id,
    };
    try {
      const response = await api.createLocationMaster(locationdetails);
      if (response) {
        alert("Location Added");
        navigate("/landingpage/locationmasterlist");
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
          {/* Optionally add more details or links */}
        </div>
      ) : (
        <>
          <Container fluid>
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
                    required
                  />
                </Col>
              </Row>

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
                  marginRight: "200px",
                }}
              >
                Save
              </button>
            </Form>
          </Container>
        </>
      )}
    </>
  );
};

export default LocationMaster;
