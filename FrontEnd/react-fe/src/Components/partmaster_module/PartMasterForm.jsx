import React, { useState } from "react";
import { API } from "../../API.js";
import "../../Styles/CustomerMaster.css";
import { useNavigate } from "react-router-dom";
import permissionList from "../../permission.js";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const PartMaster = () => {
  const api = new API();
  const navigate = useNavigate();
  const permissions = permissionList();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userDetails = localStorage.getItem("userDetails");

    const parsedDetails = JSON.parse(userDetails);

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

  return (
    <>
      {permissions.includes("asset.view_sampleform") ? (
        <div className="empty-state">
          <h3 style={{ marginTop: "15%" }}>No access to this page</h3>
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
      <Form>
        <Row>
          <Col md={4}>
            <Form.Label>Part Name</Form.Label>
            <Form.Control
              type="text"
              name="part_name"
              value={formData.part_name}
              onChange={handleChange}
              className="input-border"
              required
              style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px",  }}
              autoFocus
            />
          </Col>

          <Col md={4}>
            <Form.Label>Unit Price</Form.Label>
            <Form.Control
              type="text"
              name="unit_price"
              value={formData.unit_price}
              onChange={handleChange}
              className="input-border"
              required
              style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px",  }}
            />
          </Col>

          <Col md={3}>
            <Form.Label>UOM (Unit of Measure)</Form.Label>
            <Form.Control
              type="text"
              name="uom"
              value={formData.uom}
              className="input-border"
              onChange={handleChange}
              required
              style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px",  }}
            />
          </Col>
        </Row>

        <Row className="align-items-end mt-3">
          <Col md={4}>
            <Form.Label>HSN Code</Form.Label>
            <Form.Control
              type="text"
              name="hsn_code"
              value={formData.hsn_code}
              className="input-border"
              onChange={handleChange}
              required
              style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px"}}
            />
          </Col>

          <Col md={2} className="d-flex justify-content-start">
            <Button
              onClick={handleSubmit}
              style={{
                padding: "10px 20px",
                backgroundColor: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                minWidth: "120px",
              }}
            >
              Save
            </Button>
          </Col>
          <Col md={1} className="d-flex justify-content-start">
            <Button
              style={{
                padding: "10px 20px",
                backgroundColor: "rgb(73 81 88)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                minWidth: "120px",
              }}
            >
              Back
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
        </>
      )}
    </>

     );
};

export default PartMaster;
