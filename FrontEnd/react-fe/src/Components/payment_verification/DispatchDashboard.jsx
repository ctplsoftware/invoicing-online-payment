import "../payment_verification/dispatchdashboard.css";
import "react-image-lightbox/style.css"; // Import the lightbox styles
import Lightbox from "react-image-lightbox";
import React, { useState, useEffect } from "react";
import vickyimg from "../payment_verification/screeshot.png";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
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
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { BaseURL } from "../../utils.js";
import cancelEInvoiceAlert from "../../alert.js";

function DispatchDashboard() {
  //const [selectedImage, setSelectedImage] = useState(vickyimg);

  const api = new API();
  const navigate = useNavigate();
  const { order_header_id } = useParams();

  
  
  const [formData, setFormData] = useState({});
  const [dispatchStatus, setDispatchStatus] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(false);
  const [locationStatus, setlocationStatus] = useState(false);
  const [generateStatus, setGenerateStatus] = useState(false);
  const [paymentTable, setPaymentTable] = useState({});
  const [balanceLimit, setBalanceLimit] = useState(null);
  const [locationVal, setlocationVal] = useState(null);
  const [remainingAmount, setRemainingAmount] = useState(null);
  const [isAttachVerifiying, setIsAttachVerifying] = useState(false);
  const [isusedLimit, setUsedLimit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordermasterfetch = await api.fetch_dispatchById(order_header_id);
        console.log(ordermasterfetch);
        
        setFormData(ordermasterfetch);
        setDispatchStatus(ordermasterfetch?.order_header?.dispatched_status === "yes");
        setVerifyStatus(ordermasterfetch?.order_header?.verified_status === "yes");
        setVerifyStatus(ordermasterfetch?.order_header?.location_name !== null);
        setGenerateStatus(ordermasterfetch?.order_header?.invoice_generated_status === "yes");
        setIsAttachVerifying(ordermasterfetch?.order_header?.attached_status === "no");
        const balance_limit_calculate = ordermasterfetch?.customer_data?.credit_limit - ordermasterfetch?.customer_data?.used_limit;
        const locationVal = ordermasterfetch?.location_master;  
        console.log(locationVal,'locationVal');
        setlocationVal(locationVal);    
        setBalanceLimit(balance_limit_calculate);
        const reaming_balance =
          ordermasterfetch?.order_header?.total_amount -
          ordermasterfetch?.order_header?.paid_amount;
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
    try {
      const orderheadedata = {
        order_header_id: formData.order_header.id,
      };

      const response = await api.updateOrderHeaderDispatchStatus(
        orderheadedata
      );
      if (response) {
        alert("Working good");
        setDispatchStatus(true);
        window.location.reload();
      } else {
        alert("Failed occurs");
      }
    } catch (error) {
      console.error("Error adding part:", error);
    }
  };

  function handleCreateEInvoice(){
    var data = {
        'order_header_id': order_header_id,
        'order_number': formData.order_header?.order_number
    }
    navigate(`/landingpage/generate-einvoice/${order_header_id}`, {state: data});

  }

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

    }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentTable({
      ...paymentTable,
      [name]: value,
    });
  };

  return (
    <div style={{ height: "753px", overflow: "scroll" }}>
      <div className="head-conatiner">
        
        <div className="invoice-button">
          
        </div>

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

          <div>
                    <h2>Select Location</h2>
                    <select name="location" id="location">
                        {locationVal.map((loc) => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                    </select>
                    
          </div>

          
        </div>

        
        
        
        
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
              {/* For Credit Payment Type */}
              {formData?.order_header?.payment_type === "credit" && (
                <>
                  {/* Show Dispatch button only if dispatchStatus is false */}
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

                  {/* Show Generate button if generateStatus is false */}
                  {!generateStatus && (
                    <Grid item>
                      <Button
                        variant="contained"
                        color="error"
                        style={{'width': '200px'}}
                        onClick={() => {
                            handleCreateEInvoice();
                        }}
                      >
                        CREATE E-INVOICE
                      </Button>
                    </Grid>
                  )}

                  {generateStatus && (
                    <Grid item>
                      <Button
                        variant="contained"
                        color="error"
                        style={{'width': '200px'}}
                        onClick={() => cancelEInvoiceAlert(order_header_id, formData.order_header?.irn_invoice_number)}
                        
                      >
                        CANCEL E-INVOICE
                      </Button>
                    </Grid>
                  )}

                  {/* Show Verify button if dispatchStatus is true */}
                  {dispatchStatus && !verifyStatus && (
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={isAttachVerifiying}
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

              {/* For Advance Payment Type */}
              {formData?.order_header?.payment_type === "advance" && (
                <>
                  {console.log("checkingg advance")}

                  {!locationStatus && (
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={isAttachVerifiying}
                        onClick={() => {
                          handleVerify();
                        }}
                      >
                        Confirm
                      </Button>
                    </Grid>
                  )}

                  {!verifyStatus && locationStatus && (
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={isAttachVerifiying}
                        onClick={() => {
                          handleVerify();
                        }}
                      >
                        VERIFY
                      </Button>
                    </Grid>
                  )}

                  {!generateStatus && verifyStatus && (
                    <Grid item>
                      <Button
                        variant="contained"
                        color="error"
                        style={{'width': '200px'}}
                        onClick={() => {
                            handleCreateEInvoice();
                        }}
                      >
                        CREATE E-INVOICE
                      </Button>
                    </Grid>
                  )}

                  {verifyStatus && generateStatus && !dispatchStatus && (
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

                  {generateStatus && (
                    <Grid item>
                      <Button
                        variant="contained"
                        color="error"
                        style={{'width': '200px'}}
                        onClick={() => cancelEInvoiceAlert(order_header_id, formData.order_header?.irn_invoice_number)}
                        
                      >
                        CANCEL E-INVOICE
                      </Button>
                    </Grid>
                  )}




                </>
              )}
            </Grid>
          </div>
        </div>
      </div>
    </div>
  
  );
};


export default DispatchDashboard;
