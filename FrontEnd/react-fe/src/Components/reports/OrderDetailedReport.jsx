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
import { useNavigate, useLocation, useParams } from "react-router-dom";
import moment from "moment";
import { BaseURL } from "../../utils.js";
import { cancelOrder } from "../../alert.js";

function OrderDetailedReport() {
  

  const api = new API();
  const navigate = useNavigate();
  const location = useLocation();
  const {id} = useParams();
  const order_header_id = id;
  const route = location?.state?.from == 'order' ? '/landingpage/order-reports': '/landingpage/einvoice-reports';
  

  const [formData, setFormData] = useState({});  
  const [paymentTable, setPaymentTable] = useState({});
  const [balanceLimit, setBalanceLimit] = useState(null);
  const [remainingAmount, setRemainingAmount] = useState(null);
  const [isusedLimit, setUsedLimit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordermasterfetch = await api.fetch_dispatchById(order_header_id);

        setFormData(ordermasterfetch);
        const balance_limit_calculate = ordermasterfetch?.customer_data?.credit_limit - ordermasterfetch?.customer_data?.used_limit;
      
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
        </div>
          

        <div style={{ display: "flex", justifyContent: "space-between"}}>
          <div>
            <button
              style={{ marginLeft: "-40%", marginTop: "6%" }}
              className="btn-save2"
              onClick={() => navigate(route)}
            >
              Back
            </button>
          </div>
        </div>
      </div>
  );
}

export default OrderDetailedReport;
