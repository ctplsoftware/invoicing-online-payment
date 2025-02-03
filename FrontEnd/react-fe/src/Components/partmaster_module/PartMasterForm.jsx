import React, { useState } from "react";
import { API } from "../../API.js";
import "../../Styles/CustomerMaster.css";
import { useNavigate } from "react-router-dom";
import permissionList from "../../permission.js";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

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

              <button
                style={{ marginTop: "20px", marginRight: "200px" }}
                className="btn-save"
                type="Save"
                onClick={handleSubmit}
              >
                {" "}
                Save{" "}
              </button>
            </Form>
          </Container>
        </>
      )}
    </>

     );
};

export default PartMaster;
