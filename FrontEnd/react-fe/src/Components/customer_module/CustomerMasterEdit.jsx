import { FaPlus, FaMinus } from "react-icons/fa";
import "../../Styles/CustomerMaster.css";

import { API } from "../../API.js";
import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import CustomerMaster from "./CustomerMasterForm.jsx";

import Container from "react-bootstrap/Container";
import permissionList from "../../permission.js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

const EditCustomerForm = ({}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentCustomer, setCurrentCustomer] = useState({});
  const [additionalAddresses, setAdditionalAddresses] = useState([""]);
  const [editMode, setEditMode] = useState(false);
  const permissions = permissionList();
  const [errors, setErrors] = useState({});

  const api = new API();

  useEffect(() => {
    const fetchCustomer = async () => {
      const api = new API();
      const currentCustomer = await api.customerMasterEditFetch(id);
      
      setCurrentCustomer({
        id: currentCustomer.id,
        name: currentCustomer.name,
        gstin_number: currentCustomer.gstin_number,

        credit_limit: currentCustomer.credit_limit,
        credit_days: currentCustomer.credit_days,

        contact_person: currentCustomer.contact_person,
        contact_number: currentCustomer.contact_number,

        billing_address: currentCustomer.billing_address,
        billing_address_city: currentCustomer.billing_address_city,
        billing_address_state: currentCustomer.billing_address_state,
        billing_address_state_code: currentCustomer.billing_address_state_code,

        delivery_address: currentCustomer.delivery_address,
        delivery_address_city: currentCustomer.delivery_address_city,
        delivery_address_state: currentCustomer.delivery_address_state,
        delivery_address_state_code: currentCustomer.delivery_address_state_code,

        additional_address1: currentCustomer.additional_address1,
        additional_address1_city: currentCustomer.additional_address1_city,
        additional_address1_state: currentCustomer.additional_address1_state,
        additional_address1_state_code: currentCustomer.additional_address1_state_code,

        additional_address2: currentCustomer.additional_address2,
        additional_address2_city: currentCustomer.additional_address2_city,
        additional_address2_state: currentCustomer.additional_address2_state,
        additional_address2_state_code: currentCustomer.additional_address2_state_code,

      });
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrentCustomer((prevCustomer) => ({ ...prevCustomer, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    console.log(currentCustomer, 'checkk');
    
    if (!currentCustomer.name.trim())
      newErrors.name = "Customer name is required";
    if (!currentCustomer.delivery_address.trim())
      newErrors.delivery_address = "Delivery address is required";
    if (!currentCustomer.billing_address.trim())
      newErrors.billing_address = "Billing address is required";
    if (!/^[0-9A-Za-z]{15}$/.test(currentCustomer.gstin_number))
      newErrors.gstin_number = "GSTIN should be 15 digits";
    if (!currentCustomer.credit_limit || isNaN(currentCustomer.credit_limit))
      newErrors.credit_limit = "Credit limit must be a valid number";
    if (!currentCustomer.contact_person.trim())
      newErrors.contact_person = "Contact person is required";
    if (!/^\d{10}$/.test(currentCustomer.contact_number))
      newErrors.contact_number = "Contact number must be a 10-digit number";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    const userDetails = localStorage.getItem("userDetails");
    const parsedDetails = JSON.parse(userDetails);
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Object.values(validationErrors).forEach((erroMessage) => {
        alert(erroMessage);
      });
      return;
    }
    try {
      const updatedCustomer = {
        ...currentCustomer,
        user_id: parsedDetails.user.id,
      };
      console.log("updatedCustomer", updatedCustomer);
      await api.customermaster_update(
        updatedCustomer,
        (response) => {
          console.log("Update successful:", response);
          navigate("/landingpage/customermasterdashboard");
        },
        (error) => {
          console.error("Update failed:", error);
        }
      );
      setEditMode(false);
      setCurrentCustomer({});
      setAdditionalAddresses([""]);
    } catch (error) {
      console.error("Unexpected error:", error);
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

              <Row>
                <Col md={6} style={{ marginTop: "20px" }}>
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={currentCustomer.name}
                    onChange={handleChange}
                    required
                    className="input-border"
                    autoFocus
                  />
                </Col>

                <Col md={6} style={{ marginTop: "20px" }}>
                  <Form.Label>GSTIN</Form.Label>
                  <Form.Control
                    type="text"
                    name="gstin_number"
                    value={currentCustomer.gstin_number}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Credit Limit</Form.Label>
                  <Form.Control
                    type="number"
                    name="credit_limit"
                    value={currentCustomer.credit_limit}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Credit Days</Form.Label>
                  <Form.Control
                    type="number"
                    name="credit_days"
                    value={currentCustomer.credit_days}
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
                    value={currentCustomer.contact_person}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact_number"
                    value={currentCustomer.contact_number}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Billing Address</Form.Label>
                  <Form.Control
                    className="input-border"
                    name="billing_address"
                    value={currentCustomer.billing_address}
                    onChange={handleChange}
                    as="textarea"
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Billing Address City</Form.Label>
                  <Form.Control
                    type="text"
                    name="billing_address_city"
                    value={currentCustomer.billing_address_city}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Billing Address State</Form.Label>
                  <Form.Control
                    type="text"
                    name="billing_address_state"
                    value={currentCustomer.billing_address_state}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Billing Address State Pin Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="billing_address_state_code"
                    value={currentCustomer.billing_address_state_code}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Delivery Address</Form.Label>
                  <Form.Control
                    className="input-border"
                    name="delivery_address"
                    value={currentCustomer.delivery_address}
                    as="textarea"
                    onChange={handleChange}
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Delivery Address City</Form.Label>
                  <Form.Control
                    type="text"
                    name="delivery_address_city"
                    value={currentCustomer.delivery_address_city}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Delivery Address State</Form.Label>
                  <Form.Control
                    type="text"
                    name="delivery_address_state"
                    value={currentCustomer.delivery_address_state}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Delivery Address Pin Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="delivery_address_state_code"
                    value={currentCustomer.delivery_address_state_code}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Additional Address (Optional)</Form.Label>
                  <Form.Control
                    className="input-border"
                    name="additional_address1"
                    value={currentCustomer.additional_address1}
                    as="textarea"
                    onChange={handleChange}
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Additional Address City</Form.Label>
                  <Form.Control
                    type="text"
                    name="additional_address1_city"
                    value={currentCustomer.additional_address1_city}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Additional Address State</Form.Label>
                  <Form.Control
                    type="text"
                    name="additional_address1_state"
                    value={currentCustomer.additional_address1_state}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Additional Address Pin Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="additional_address1_state_code"
                    value={currentCustomer.additional_address1_state_code}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Additional Address (Optional)</Form.Label>
                  <Form.Control
                    className="input-border"
                    name="additional_address2"
                    value={currentCustomer.additional_address2}
                    as="textarea"
                    onChange={handleChange}
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Additional Address City</Form.Label>
                  <Form.Control
                    type="text"
                    name="additional_address2_city"
                    value={currentCustomer.additional_address2_city}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Additional Address State</Form.Label>
                  <Form.Control
                    type="text"
                    name="additional_address2_state"
                    value={currentCustomer.additional_address2_state}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>

                <Col md={3} style={{ marginTop: "20px" }}>
                  <Form.Label>Additional Address Pin Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="additional_address2_state_code"
                    value={currentCustomer.additional_address2_state_code}
                    onChange={handleChange}
                    className="input-border"
                    required
                  />
                </Col>
              </Row>
            </Form>
          </Container>
        </>
      )}
    </>
  );
};

export default EditCustomerForm;
