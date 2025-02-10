import { API } from "../../API.js";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import permissionList from "../../permission.js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { alertWarning } from "../../alert.js";

const LocationMasterEdit = () => {
  const api = new API();
  const navigate = useNavigate();
  const permissions = permissionList();
  const [errors, setErrors] = useState({});
  const { id } = useParams(); // Get the ID from the URL

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

  useEffect(() => {
    const fetchPartMaster = async () => {
      try {
        const locationmasterData = await api.edit_location_fetch(id);
        if (locationmasterData) {
          setFormData({
            id: locationmasterData.id,
            name: locationmasterData.name,
            status: locationmasterData.status,
            location_address: locationmasterData.location_address,
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

    const locationdetails = {
      ...formData,
      user_id: parsedDetails.user.id,
    };
    try {
      await api.update_locationmaster(locationdetails);
      alert("Update successful");
      navigate("/landingpage/locationmasterlist");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update failed. Please try again.");
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
          <Container fluid>
            <Form onSubmit={handleSubmit}>
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

              <div style={{ marginRight: "80px" }}>
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
                    marginRight: "10px",
                  }}
                >
                  Back
                </button>

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
              </div>
            </Form>
          </Container>
        </>
      )}
    </>
  );
};

export default LocationMasterEdit;
