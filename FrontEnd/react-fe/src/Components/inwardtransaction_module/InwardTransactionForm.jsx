import React, { useEffect, useState } from "react";
import { API } from "../../API.js";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import permissionList from "../../permission.js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { alertWarning, alertSuccess, alertError } from "../../alert.js";

const InwardTransactionForm = () => {
  const api = new API();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.part_name.trim())
      newErrors.part_name = "Part name is required";
    if (!formData.location_id.trim())
      newErrors.location_id = "Location name is required";
    if (!formData.uom.trim()) newErrors.uom = "UOM is required";
    if (!formData.inward_quantity) newErrors.uom = "Quantity is required";
    if (formData.inward_quantity == 0 || formData.inward_quantity < 0)
      newErrors.uom = "Quantity must be greater than 0";

    return newErrors;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inwardTransactioncreate = await api.get_part_master();
        console.log(inwardTransactioncreate, "inwardTransactioncreate");

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

      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        Object.values(validationErrors).forEach((erroMessage) => {
          alertWarning(erroMessage);
        });
        return;
      }

      // Add username to formData
      const dataToSubmit = {
        ...formData,
        inward_by: username,
      };
      console.log("dataToSubmit", dataToSubmit);

      const response = await api.inwardTransactioncreate(dataToSubmit);
      if (response) {
        alertSuccess("Inward Added");
        navigate("/landingpage/inwardtransactionlist");
        setFormData({
          part_name: "",
          inward_quantity: "",
          comments: "",
          uom: "",
        });
      } else {
        alertError("Failed to add inward");
      }
    } catch (error) {
      console.error("Error adding inward:", error);
    }
  };

  function handleBack() {
    navigate("/landingpage/inwardtransactionlist");
  }

  // Prevent users from typing `-`, `e`, `E`
  const handleKeyDown = (e) => {
    if (e.key === "-" || e.key === "e" || e.key === "E") {
      e.preventDefault();
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
            {" "}
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
                      onChange={(e) => {
                        const selectedPartName = e.target.value;
                        const selectedPart = partdatafetch.find(
                          (row) => row.part_name === selectedPartName
                        );

                        // Update formData with part_name and its corresponding UOM
                        setFormData({
                          ...formData,
                          part_name: selectedPartName,
                          uom: selectedPart ? selectedPart.uom : "", // Set UOM or empty if not found
                        });
                      }}
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
                    style={{
                      borderRadius: "8px",
                      padding: "10px",
                      borderRadius: "30px",
                    }}
                    required
                    readOnly
                  />
                </Col>
              </Row>

              <Row>
                <Col md={4} style={{ marginTop: "20px" }}>
                  <Form.Label>Inward Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    onKeyDown={handleKeyDown}
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
                    style={{
                      borderRadius: "8px",
                      padding: "10px",
                      borderRadius: "30px",
                    }}
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

export default InwardTransactionForm;
