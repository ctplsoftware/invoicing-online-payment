import { API } from '../../API.js';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import Container from "react-bootstrap/Container";
import permissionList from "../../permission.js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const LocationMasterEdit = () => {
    const api = new API();
    const navigate = useNavigate();
    const permissions = permissionList();
    const { id } = useParams(); // Get the ID from the URL

    const [formData, setFormData] = useState({
        name: '',
        status: 'active',
        location_address: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
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
        const locationdetails ={
            ...formData,
            user_id:parsedDetails.user.id
        }
        try {
            await api.update_locationmaster(locationdetails);
            alert("Update successful");
            navigate('/landingpage/locationmasterlist');
        } catch (error) {
            console.error("Update failed:", error);
            alert("Update failed. Please try again.");
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
            <Form onSubmit={handleSubmit}>  
                <Row>
                  <Col md={4}>
                    <Form.Label>Location Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-border"
                      style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px",  }}
                      required
                    />
                  </Col>

                  <Col md={4}>
                    <Form.Label>Location Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="location_address"
                      value={formData.location_address}
                      onChange={handleChange}
                      className="input-border"
                      style={{ borderRadius: "8px", padding: "10px", borderRadius: "30px",  }}
                      required
                    />
                  </Col>
                </Row>
                <Row>
                <Col md={10}>
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
                  <Button
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "rgb(73 81 88)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      minWidth: "120px",
                      marginLeft: "20px",
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

export default LocationMasterEdit;
