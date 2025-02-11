import "../payment_verification/dispatchdashboard.css";
import "react-image-lightbox/style.css"; // Import the lightbox styles
import Lightbox from "react-image-lightbox";
import React, { useState, useEffect } from "react";
import vickyimg from "../payment_verification/screeshot.png";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import Swal from "sweetalert2";
import {
  Button,
  Card,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Container,
  getBottomNavigationUtilityClass,
} from "@mui/material";
import { display, styled } from "@mui/system";
import { API } from "../../API.js";
import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import { BaseURL } from "../../utils.js";
import { alertWarning, cancelEInvoiceAlert } from "../../alert.js";

function DispatchCredit() {

  const api = new API();
  const navigate = useNavigate();
  const location = useLocation();
  const order_header_id = location.state?.order_header_id;
  

  const [formData, setFormData] = useState({});  
  const [dispatchStatus, setDispatchStatus] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(false);
  const [locationStatus, setLocationStatus] = useState(false);
  const [generateStatus, setGenerateStatus] = useState(false);
  const [paymentTable, setPaymentTable] = useState({});
  const [balanceLimit, setBalanceLimit] = useState(null);
  const [locationVal, setlocationVal] = useState(null);
  const [remainingAmount, setRemainingAmount] = useState(null);
  const [isusedLimit, setUsedLimit] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordermasterfetch = await api.fetch_dispatchById(order_header_id);

        setFormData(ordermasterfetch);
        setDispatchStatus(ordermasterfetch?.order_header?.dispatched_status === "yes");
        setLocationStatus (ordermasterfetch?.order_header?.location_id !== null);
        setVerifyStatus(ordermasterfetch?.order_header?.verified_status === "yes");
        setVerifyStatus(ordermasterfetch?.order_header?.location_name !== null);
        setGenerateStatus(ordermasterfetch?.order_header?.invoice_generated_status === "yes");
        

        const balance_limit_calculate = ordermasterfetch?.customer_data?.credit_limit - ordermasterfetch?.customer_data?.used_limit;
        const locationVal = ordermasterfetch?.location_master;
        setlocationVal(locationVal);
        setBalanceLimit(balance_limit_calculate);
        const reaming_balance = ordermasterfetch?.order_header?.total_amount - ordermasterfetch?.order_header?.paid_amount;
        setRemainingAmount(reaming_balance);

        const used_limit_balance = ordermasterfetch?.customer_data?.used_limit;
        setUsedLimit(used_limit_balance);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  function formatToLocalTime(dateString) {
    return moment(dateString).format("LLLL");
  }

  const handleDispatch = async (e) => {
    Swal.fire({
      text: "Do you want to dispatch this order?",
      showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        width: "0p65x",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const orderheadedata = {
            order_header_id: formData.order_header.id,
          };
          const response = await api.updateOrderHeaderDispatchStatus(orderheadedata);
          if (response) {
            Swal.fire("Success!", "Order dispatched successfully.", "success").then(() => {
              setDispatchStatus(true);
              window.location.reload();
            });
          } else {
            Swal.fire("Failed!", "Failed to dispatch order.", "error");
          }
        } catch (error) {
          console.error("Error dispatching order:", error);
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  const handleVerify = async (e) => {
    const userDetails = localStorage.getItem("userDetails");

    const parsedDetails = JSON.parse(userDetails);

    let paidAmount = formData.order_header?.paid_amount || 0;
    const paymentAmount = parseFloat(paymentTable.payment_amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      alert("Invalid payment amount. Please enter a valid number.");
      return;
    }

    try {
      const orderheadedata = {
        ...paymentTable,
        order_header_id: formData.order_header.id,
        updated_by: parsedDetails.user.id,
      };

      const response = await api.updateOrderHeaderVerifyStatus(orderheadedata);
      if (response) {
        alert("Working good");
        setVerifyStatus(true);
        window.location.reload();
      } else {
        alert("Failed occurs");
      }
    } catch (error) {
      console.error("Error adding part:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentTable({
      ...paymentTable,
      [name]: value,
    });
  };

  const handleLocation = () => {
    const selectedLocation = document.getElementById("location").value;

    if (selectedLocation === "") {
        Swal.fire({
            title: "Please select a location",
            confirmButtonText: "OK",
            width: "700px",
        });
        return;
    }

    Swal.fire({
        title: "Do you want to update this location?",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        width: "700px",
    }).then((result) => {
        if (result.isConfirmed) {
            const form_data = {
                order_header_id: formData.order_header.id,
                location_master_id: selectedLocation,
            };
            setIsVisible(false);

            api.update_dispatch_location(form_data)
                .then(() => {
                    Swal.fire({
                        title: "Location updated successfully! Do you want to generate an E-Invoice?",
                        showCancelButton: true,
                        confirmButtonText: "Yes",
                        cancelButtonText: "No",
                        width: "700px",
                    }).then((result) => {
                      if(result.isConfirmed){
                        navigate(`/landingpage/generate-einvoice/${order_header_id}`, {
                        });
                      }else{
                        window.location.reload();
                      }
                    });
                })
                .catch(() => {
                    Swal.fire({
                        title: "Update failed. Please try again.",
                        confirmButtonText: "OK",
                        width: "700px",
                    });
                });
        }
    });
  };




  return (
      <div className="head-conatiner">
        <div className="invoice-button"></div>

        <div className="order-imgpreview">
          <div className="orderDetails">
            <div className="orderDetailsHeader">
              <h2>Order Details</h2>
              <div className="orderDetailRow">
                <span className="orderDetailKey">Payment Type:</span>
                <span className="orderDetailValue">
                  {formData.order_header?.payment_type}
                </span>
              </div>
            </div>
            <div className="orderDetailsContent">
              <div className="orderDetailRow">
                <span className="orderDetailKey">Order Number:</span>
                <span className="orderDetailValue">
                  {formData.order_header?.order_number}
                </span>
              </div>
              <div className="orderDetailRow">
                <span className="orderDetailKey">Quantity:</span>
                <span className="orderDetailValue">
                  {formData.order_header?.quantity}
                </span>
              </div>
              <div className="orderDetailRow">
                <span className="orderDetailKey">Part Name:</span>
                <span className="orderDetailValue">
                  {formData.order_header?.part_name}
                </span>
              </div>
              <div className="orderDetailRow">
                <span className="orderDetailKey">UOM:</span>
                <span className="orderDetailValue">
                  {formData.order_header?.uom}
                </span>
              </div>
              <div className="orderDetailRow">
                <span className="orderDetailKey">Unit Price:</span>
                <span className="orderDetailValue">
                  {formData.order_header?.unit_price}
                </span>
              </div>
              <div className="orderDetailRow">
                <span className="orderDetailKey">IRN:</span>
                <span className="orderDetailValue">
                  {formData.order_header?.irn_invoice_number}
                </span>
              </div>
              <div className="orderDetailRow">
                <span className="orderDetailKey">Customer Name:</span>
                <span className="orderDetailValue">
                  {formData.order_header?.customer_name}
                </span>
              </div>
              <div className="orderDetailRow">
                <span className="orderDetailKey">Delivery Address:</span>
                <span className="orderDetailValue">
                  {formData.order_header?.delivery_address}
                </span>
              </div>
              <div className="orderDetailRow">
                <span className="orderDetailKey">Purchase Amount:</span>
                <span className="orderDetailValue">
                  {formData.order_header?.total_amount}
                </span>
              </div>
              <div className="orderDetailRow">
                <span className="orderDetailKey">Credit Limit:</span>
                <span className="orderDetailValue">
                  {formData.customer_data?.credit_limit}
                </span>
              </div>
              <div className="orderDetailRow">
                <span className="orderDetailKey">Balance Limit:</span>
                <span className="orderDetailValue">{balanceLimit}</span>
              </div>
              <div className="orderDetailRow">
                <span className="orderDetailKey">Used Limit:</span>
                <span className="orderDetailValue">{isusedLimit}</span>
              </div>
            </div>
          </div>

        {/* select Location */}
          <div>            
            {formData?.order_header?.location_master === null && (
                <div className="location-container">
                    <h2>Select Location</h2>
                    {locationVal && Array.isArray(locationVal) && locationVal.length > 0 ? (
                        <select id="location" name="location">
                            {locationVal.map((loc) => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p>No locations available</p>
                    )}
                </div>
            )}
          </div>

            {/* Carts */}
          {formData?.order_header?.payment_type === "credit" &&
          formData?.order_header?.location_master !== null &&
          dispatchStatus && formData?.order_header.attached_status !== "no" &&
           (

            <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "0px",
            }}
            >
            <div>
              <Card
                sx={{
                  marginBottom: 3,
                  padding: 2,
                  width: "749px",
                  marginLeft: "20px",
                  marginTop: "20px",
                  height: "fit-content",
                  boxShadow:
                    "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
                }}
              >
                <TableContainer component={Paper}>
                  <Table sx={{ marginBottom: "0px" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>SNo</TableCell>
                        <TableCell>Payment Amount</TableCell>
                        <TableCell>Payment Date</TableCell>
                        <TableCell>Comments</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.order_transaction?.map((transaction, index) => (
                        <TableRow key={transaction.id}>
                          {/* Serial Number starts from 1 */}
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{transaction.payment_amount}</TableCell>
                          <TableCell>
                            {formatToLocalTime(transaction.payment_date)}
                          </TableCell>
                          <TableCell>{transaction.payment_comments}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography variant="h6" align="right" sx={{ marginTop: 2 }}>
                  Total Paid Amount: &#8377;{formData.order_header?.paid_amount}
                </Typography>
                <Typography variant="h6" align="right" sx={{ marginTop: 2 }}>
                    {remainingAmount != null && !isNaN(remainingAmount)
                      ? remainingAmount >= 0
                        ? `Remaining Amount: ₹${remainingAmount.toFixed(2)}`
                        : `Extra Paid Amount: ₹${Math.abs(remainingAmount).toFixed(2)}`
                      : "Invalid Amount"}
                </Typography>

              </Card>
            </div>

            <div>
              {/* Data Table Section */}
              <Card
                sx={{
                  marginBottom: 3,
                  padding: 2,
                  width: "749px",
                  marginLeft: "20px",
                  marginTop: "20px",
                  boxShadow:
                    "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
                }}
              >
                <TableContainer component={Paper}>
                  <Table sx={{ marginBottom: "0px" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>SNo</TableCell>
                        <TableCell>Image (Viewable)</TableCell>
                        <TableCell>Attached At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Example Rows */}
                      {formData.order_attachment_images?.map(
                        (attachments, index) => (
                          <TableRow key={attachments.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <PhotoProvider>
                                <PhotoView
                                  src={`${BaseURL}${attachments.attached_image}`}
                                >
                                  <img
                                    src={`${BaseURL}${attachments.attached_image}`}
                                    alt="Preview"
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      borderRadius: "10px",
                                      cursor: "pointer",
                                    }}
                                  />
                                </PhotoView>

                                <span style={{ color: "green" }}>
                                  Click to view
                                </span>
                              </PhotoProvider>
                            </TableCell>
                            <TableCell>
                              {formatToLocalTime(attachments.attached_at)}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </div>
            </div>
          )}
        </div>
          {/* input fields */}
        {formData?.order_header?.payment_type === "credit" &&
          formData?.order_header?.location_master !== null &&
          dispatchStatus && formData?.order_header.attached_status !== "no" &&
          (
              <Card
                sx={{
                  marginBottom: 3,
                  width: "50%",
                  margin: "0 auto",
                  padding: 2,
                  marginRight: "7%",
                }}
              >
                <form onSubmit={handleVerify}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <TextField
                        name="payment_amount"
                        placeholder="Payment Amount"
                        onChange={handleChange}
                        value={paymentTable.payment_amount || ""}
                        sx={{ width: "60%" }}
                        required
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        name="payment_date"
                        placeholder="Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                        value={paymentTable.payment_date || ""}
                        required
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        name="payment_comments"
                        placeholder="Comments"
                        variant="outlined"
                        onChange={handleChange}
                        value={paymentTable.payment_comments || ""}
                        sx={{ width: "60%" }}
                        required
                      />
                    </Grid>
                  </Grid>
                </form>
              </Card>
          )}


        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <button
              style={{ marginLeft: "-40%", marginTop: "6%" }}
              className="btn-save2"
              onClick={() => navigate("/landingpage/payment-list")}
            >
              Back
            </button>
          </div>

          <div
            style={{
              position: "relative",
              right: "0%",
              display: "flex",
              marginTop: "5%",
            }}
          >
            <Grid
              container
              spacing={2}
              justifyContent="flex-end"
              marginLeft="-135px"
              marginTop="-60px"
            >
              {formData?.order_header?.payment_type === "credit" && (
                <>
                {formData?.order_header?.location_master === null && (
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            handleLocation();
                          }}
                        >
                        Confirm
                        </Button>
                      </Grid>
                  )}

                  {!dispatchStatus && generateStatus && (
                    <Grid item>
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                          handleDispatch();
                        }}
                      >
                        DISPATCH
                      </Button>
                    </Grid>
                  )}          

                  {dispatchStatus && formData?.order_header?.verified_status === "no" && formData?.order_header.attached_status !== "no" && (
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          handleVerify();
                        }}
                      >
                        VERIFY
                      </Button>
                    </Grid>
                  )}
                </>
              )}

              
            </Grid>
          </div>
        </div>
      </div>
  );
}

export default DispatchCredit;
