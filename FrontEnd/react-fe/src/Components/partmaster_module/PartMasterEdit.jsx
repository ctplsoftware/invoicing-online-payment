import { API } from "../../API.js";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import permissionList from "../../permission.js";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { alertSuccess, alertWarning, alertError } from "../../alert.js";

const PartMasterEdit = () => {
  const api = new API();
  const navigate = useNavigate();
  const permissions = permissionList();
  const [errors, setErrors] = useState({});
  const { id } = useParams();

  const [formData, setFormData] = useState({
    part_name: "",
    status: "active",
    unit_price: "",
    hsn_code: "",
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
    console.log(formData,'formData');
    

    if (!formData.part_name.trim())
      newErrors.part_name = "Part name is required";
    if (!formData.unit_price)
      newErrors.unit_price = "Unit price is required";
    if (!formData.uom.trim()) newErrors.uom = "UOM is required";
    if (!/^\d+$/.test(formData.unit_price)) 
      newErrors.unit_price = "Unit price must be a number!";    
    if (!formData.hsn_code.trim()) newErrors.hsn_code = "HSN code is required";
    if (formData.unit_price == 0 || formData.unit_price < 0)
      newErrors.hsn_code = "Unit price must be greater than 0.";

    return newErrors;
  };

  useEffect(() => {
    const fetchPartMaster = async () => {
      try {
        const partmasterData = await api.editGet_part_master(id);
        if (partmasterData) {
          setFormData({
            id: partmasterData.id,
            part_name: partmasterData.part_name,
            status: partmasterData.status,
            unit_price: partmasterData.unit_price,
            hsn_code: partmasterData.hsn_code,
            uom: partmasterData.uom,
            hsn_code: partmasterData.hsn_code,
          });
        }
      } catch (error) {
        console.error("Failed to fetch part data:", error);
      }
    };
    fetchPartMaster();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
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

    const partmasterdatas = {
      ...formData,
      user_id: parsedDetails.user.id,
    };

    try {
      await api.update_part_master(partmasterdatas);
      alertSuccess("Update successful");
      navigate("/landingpage/partmaster-fecthList");
    } catch (error) {
      console.error("Update failed:", error);
      alertError("Update failed. Please try again.");
    }
  };

  function handleBack() {
    navigate("/landingpage/partmaster-fecthList");
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
                      onChange={handleChange}
                      className="input-border"
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
                      onChange={handleChange}
                      className="input-border"
                      required
                      style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px",  }}
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
                        Update
                    </Button>
                  </Col>
                  <Col md={1} className="d-flex justify-content-start">
                    <Button
                        onClick={handleBack}
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

export default PartMasterEdit;
