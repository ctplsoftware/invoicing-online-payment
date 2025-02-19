import React, { useState } from "react";
import "../../Styles/CustomerMaster.css";
import { API } from "../../API.js";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import permissionList from "../../permission.js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { alertError, alertSuccess, alertWarning } from "../../alert.js";

const CustomerMaster = () => {
  const api = new API();
  const navigate = useNavigate();
  const permissions = permissionList();
  const [formData, setFormData] = useState({
    name: "",
    gstin_number: "",

    credit_limit: "",
    credit_days: "30",

    contact_person: "",
    contact_number: "",

    billing_address: "",
    billing_address_city: "",
    billing_address_state: "",
    billing_address_state_code: "",

    delivery_address: "",
    delivery_address_city: "",
    delivery_address_state: "",
    delivery_address_state_code: "",

    additional_address1: "",
    additional_address1_city: "",
    additional_address1_state: "",
    additional_address1_state_code: "",

    additional_address2: "",
    additional_address2_city: "",
    additional_address2_state: "",
    additional_address2_state_code: "",
  });

  const [additionalAddresses, setAdditionalAddresses] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    console.log(!formData.name?.trim());
    
    if (!formData.name?.trim()) newErrors.name = "Customer name is required";
    if (!formData.delivery_address?.trim()) newErrors.delivery_address = "Delivery address is required";
    if (!formData.billing_address?.trim()) newErrors.billing_address = "Billing address is required";
    
    // State Code Validation
    const deliveryStateCode = formData.delivery_address_state_code?.toString().trim();
    const billingStateCode = formData.billing_address_state_code?.toString().trim();

    if (!deliveryStateCode) newErrors.delivery_address_state_code = "Delivery address state code is required"; 
    else if (!/^\d{6}$/.test(deliveryStateCode)) newErrors.delivery_address_state_code = "Delivery address state code must be a 6-digit number"; 
    
    if (!billingStateCode) newErrors.billing_address_state_code = "Billing address state code is required";
    else if (!/^\d{6}$/.test(billingStateCode)) newErrors.billing_address_state_code = "Billing address state code must be a 6-digit number";

    // GSTIN Validation
    if (!formData.gstin_number?.trim()) newErrors.gstin_number = "GSTIN is required";
    else if (!/^[0-9A-Za-z]{15}$/.test(formData.gstin_number)) newErrors.gstin_number = "GSTIN should be exactly 15 alphanumeric characters";

    // Credit Limit Validation
    if (formData.credit_limit === undefined || formData.credit_limit === null || isNaN(formData.credit_limit) || formData.credit_limit < 0)
        newErrors.credit_limit = "Credit limit must be a valid positive number";

    // Contact Person
    if (!formData.contact_person?.trim()) newErrors.contact_person = "Contact person is required";

    // Contact Number Validation
    if (!formData.contact_number?.trim()) newErrors.contact_number = "Contact number is required";
    else if (!/^\d{10}$/.test(formData.contact_number)) newErrors.contact_number = "Contact number must be a 10-digit number";

    return newErrors;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();


    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      Object.values(validationErrors).forEach((erroMessage) => {
        alertWarning(erroMessage);
      });

      return;
    }

    try {
      const userDetails = localStorage.getItem("userDetails");
      const parsedDetails = JSON.parse(userDetails);
      const completeFormData = {
        ...formData,
        additional_addresses: additionalAddresses,
        user_id: parsedDetails.user.id,
      };

      const response = await api.save_customer(completeFormData);
      if (response) {
        console.log("Customer added:", response);
        alertSuccess("Customer Added");
        navigate("/landingpage/customermasterdashboard");
        setAdditionalAddresses([]);
      } else {
        console.error("Error adding customer:", response.statusText);
        alertWarning("Couldn't add customer");
      }
    } catch (error) {
      alertError("Couldn't add customer");
      console.error("Error:", error);
    }
  };

  function handleBack() {
    navigate("/landingpage/customermasterdashboard");
  }

  // Prevent users from typing `-`, `e`, `E`
  const handleKeyDown = (e) => {
    if (e.key === "-" || e.key === "e" || e.key === "E") {
      e.preventDefault();
    }
  };

  return (
    <div style={{ maxHeight: "115vh", overflow: "auto" }}>
      {permissions.includes("asset.view_sampleform") ? (
        <div className="empty-state">
          <h3 style={{ marginTop: "15%" }}>No access to this page</h3>
          {/* Optionally add more details or links */}
        </div>
      ) : (
        <>
        <Container fluid style={{ backgroundColor: "#f5f5f5", padding: "30px", borderRadius: "8px" }}>
        <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6} style={{ marginTop: "20px" }}>
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-border"
                    autoFocus
                    style={{ borderRadius: "30px" }}
                  />
                </Col>

                <Col md={6} style={{ marginTop: "20px" }}>
                  <Form.Label>GSTIN</Form.Label>
                  <Form.Control
                    type="text"
                    name="gstin_number"
                    value={formData.gstin_number}
                    onChange={handleChange}
                    className="input-border"
                    required
                    style={{ borderRadius: "30px" }}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Credit Limit</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    onKeyDown={handleKeyDown}          
                    name="credit_limit"
                    value={formData.credit_limit}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Credit Days</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    onKeyDown={handleKeyDown}
                    name="credit_days"
                    value={formData.credit_days}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                    className="input-border"
                    required
                    style={{ borderRadius: "30px" }}
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    onKeyDown={handleKeyDown}
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    className="input-border"
                    required
                    style={{ borderRadius: "30px" }}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Billing Address</Form.Label>
                  <Form.Control
                    className="input-border"
                    name="billing_address"
                    value={formData.billing_address}
                    onChange={handleChange}
                    as="textarea"
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Billing Address City</Form.Label>
                  <Form.Control
                    type="text"
                    name="billing_address_city"
                    value={formData.billing_address_city}
                    onChange={handleChange}
                    className="input-border"
                    required
                    style={{ borderRadius: "30px" }}
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Billing Address State</Form.Label>
                  <Form.Control
                    type="text"
                    name="billing_address_state"
                    value={formData.billing_address_state}
                    onChange={handleChange}
                    className="input-border"
                    required
                    style={{ borderRadius: "30px" }}
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Billing Address State Pin Code</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    onKeyDown={handleKeyDown}
                    name="billing_address_state_code"
                    value={formData.billing_address_state_code}
                    onChange={handleChange}
                    className="input-border"
                    required
                    style={{ borderRadius: "30px" }}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Delivery Address</Form.Label>
                  <Form.Control
                    className="input-border"
                    name="delivery_address"
                    value={formData.delivery_address}
                    as="textarea"
                    onChange={handleChange}
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Delivery Address City</Form.Label>
                  <Form.Control
                    type="text"
                    name="delivery_address_city"
                    value={formData.delivery_address_city}
                    onChange={handleChange}
                    className="input-border"
                    required
                    style={{ borderRadius: "30px" }}
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Delivery Address State</Form.Label>
                  <Form.Control
                    type="text"
                    name="delivery_address_state"
                    value={formData.delivery_address_state}
                    onChange={handleChange}
                    className="input-border"
                    required
                    style={{ borderRadius: "30px" }}
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Delivery Address Pin Code</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    onKeyDown={handleKeyDown}
                    name="delivery_address_state_code"
                    value={formData.delivery_address_state_code}
                    onChange={handleChange}
                    className="input-border"
                    required
                    style={{ borderRadius: "30px" }}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Additional Address (Optional)</Form.Label>
                  <Form.Control
                    className="input-border"
                    name="additional_address1"
                    value={formData.additional_address1}
                    as="textarea"
                    onChange={handleChange}
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Additional Address City</Form.Label>
                  <Form.Control
                    type="text"
                    name="additional_address1_city"
                    value={formData.additional_address1_city}
                    onChange={handleChange}
                    className="input-border"
                    required
                    style={{ borderRadius: "30px" }}
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Additional Address State</Form.Label>
                  <Form.Control
                    type="text"
                    name="additional_address1_state"
                    value={formData.additional_address1_state}
                    onChange={handleChange}
                    className="input-border"
                    required
                    style={{ borderRadius: "30px" }}
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Additional Address Pin Code</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    onKeyDown={handleKeyDown}
                    name="additional_address1_state_code"
                    value={formData.additional_address1_state_code}
                    onChange={handleChange}
                    className="input-border"
                    required
                    style={{ borderRadius: "30px" }}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Additional Address (Optional)</Form.Label>
                  <Form.Control
                    className="input-border"
                    name="additional_address2"
                    value={formData.additional_address2}
                    as="textarea"
                    onChange={handleChange}
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Additional Address City</Form.Label>
                  <Form.Control
                    type="text"
                    name="additional_address2_city"
                    value={formData.additional_address2_city}
                    onChange={handleChange}
                    className="input-border"
                    required
                    style={{ borderRadius: "30px" }}
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Additional Address State</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    onKeyDown={handleKeyDown}
                    name="additional_address2_state"
                    value={formData.additional_address2_state}
                    onChange={handleChange}
                    className="input-border"
                    required
                    style={{ borderRadius: "30px" }}
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Additional Address Pin Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="additional_address2_state_code"
                    value={formData.additional_address2_state_code}
                    onChange={handleChange}
                    className="input-border"
                    required
                    style={{ borderRadius: "30px" }}
                  />
                </Col>
              </Row>
              <div style={{ marginRight: "180px" }}>
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
                  }}
                >
                  Back
                </button>
              </div>
            </Form>
          </Container>
        </>
      )}
    </div>
  );
};

export default CustomerMaster;
