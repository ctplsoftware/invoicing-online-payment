import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import permissionList from "../../permission.js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { generateEInvoiceAlert } from "../../alert.js";
import { API } from "../../API.js";

export default function EInvoice() {
  const location = useLocation();
  const navigate = useNavigate();

  const { id } = useParams();

  const api = new API();
  const permissions = permissionList();

  const [orderData, setOrderData] = useState([]);

  const order_header_id = id;

  useEffect(() => {
    async function get(){
      const response = await api.fetch_dispatchById(id);      
      setOrderData(response);
    }
    get();

  }, []);

  const [data, setData] = useState({
    order_header_id: order_header_id,
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

  function handleBack() {
    navigate("/landingpage/einvoice-list");
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
              value={orderData?.order_header?.order_number}
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

        <div style={{ marginRight: "80px" }}>

          {orderData?.order_header?.invoice_generated_status === 'no' && (<button
            onClick={() => generateEInvoiceAlert(data, navigate, orderData?.order_header?.payment_type)}
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
          </button>)}

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
              float: "left",
            }}
          >
            Back
          </button>
        </div>
      </Container>
    </>
  );
}
