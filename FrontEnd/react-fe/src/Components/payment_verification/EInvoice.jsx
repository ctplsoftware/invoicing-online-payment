import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Container from "react-bootstrap/Container";
import permissionList from "../../permission.js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { API } from "../../API.js";

export default function EInvoice() {
  const location = useLocation();
  const navigate = useNavigate();
  const api = new API();
  const permissions = permissionList();

  const order_data = location.state || {};
  const order_header_id = order_data.order_header_id;
  const order_number = order_data.order_number;

  const [data, setData] = useState({
    order_header_id: "",
    delivery_note: "",
    other_references: "",
    buyer_order_number: "",
    buyer_order_date: "",
    dispatch_document_number: "",
    delivery_note_date: "",
    dispatched_through: "",
    terms_of_delivery: "To-Pay",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  async function handleGenerate() {
    try {
      data.order_header_id = order_header_id;

      const response = await api.generateEInvoice(data);
      if (response == "success") {
        navigate(`/landingpage/dispatch/${order_header_id}`);
      } else {
        alert("Failed occurs");
      }
    } catch (error) {
      console.error("Error adding part:", error);
    }
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={4} style={{ marginTop: "20px" }}>
            <Form.Label>Order Number</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={order_number}
              className="input-border"
              readOnly
            />
          </Col>

          <Col md={4} style={{ marginTop: "20px" }}>
            <Form.Label>Delivery Note (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="delivery_note"
              value={data.delivery_note}
              className="input-border"
              onChange={handleChange}
            />
          </Col>

          <Col md={4} style={{ marginTop: "20px" }}>
            <Form.Label>Other References (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="other_references"
              value={data.other_references}
              className="input-border"
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row>
          <Col md={4} style={{ marginTop: "20px" }}>
            <Form.Label>Customer Order Number (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="buyer_order_number"
              value={data.buyer_order_number}
              className="input-border"
              onChange={handleChange}
            />
          </Col>

          <Col md={4} style={{ marginTop: "20px" }}>
            <Form.Label>Customer Order Date (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="buyer_order_date"
              value={data.buyer_order_date}
              className="input-border"
              onChange={handleChange}
            />
          </Col>

          <Col md={4} style={{ marginTop: "20px" }}>
            <Form.Label>Dispatch Document Number (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="dispatch_document_number"
              value={data.dispatch_document_number}
              className="input-border"
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row>
        <Col md={4} style={{ marginTop: "20px" }}>
            <Form.Label>Delivery Note Date (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="delivery_note_date"
              value={data.delivery_note_date}
              className="input-border"
              onChange={handleChange}
            />
          </Col>



          <Col md={4} style={{ marginTop: "20px" }}>
            <Form.Label>Dispatch Through (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="dispatched_through"
              value={data.dispatched_through}
              className="input-border"
              onChange={handleChange}
            />
          </Col>

          <Col md={4} style={{ marginTop: "20px" }}>
            <Form.Label>Terms of Delivery (Optional)</Form.Label>
            <Form.Control
              type="text"
              name="terms_of_delivery"
              value={data.terms_of_delivery}
              className="input-border"
              onChange={handleChange}
            />
          </Col>
        </Row>

        <button
          onClick={handleGenerate}
          style={{
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            width: "250px",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px",
            marginRight: "200px",
          }}
        >
          GENERATE E-INVOICE
        </button>
      </Container>
    </>
  );
}
