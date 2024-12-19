import '../payment_verification/dispatchdashboard.css';
import "react-image-lightbox/style.css"; // Import the lightbox styles
import Lightbox from "react-image-lightbox";
import React, { useState, useEffect } from "react";
import vickyimg from '../payment_verification/screeshot.png';
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Button, Card, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import { display, styled } from '@mui/system';
import { API } from '../../API.js';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import { BaseURL } from '../../utils.js';




function DispatchDashboard() {
    const [selectedImage, setSelectedImage] = useState(vickyimg);

    const api = new API();
    const navigate = useNavigate();
    const { order_header_id } = useParams();
    const [formData, setFormData] = useState({});
    const [dispatchStatus, setDispatchStatus] = useState(false);
    const [verifyStatus, setVerifyStatus] = useState(false);




    useEffect(() => {
        const fetchData = async () => {
            try {

                const ordermasterfetch = await api.fetch_dispatchById(order_header_id);

                console.log("ordermasterfetch", ordermasterfetch);
                setFormData(ordermasterfetch)

                setDispatchStatus(ordermasterfetch?.order_header?.dispatched_status === "yes");
                setVerifyStatus(ordermasterfetch?.order_header?.verified_status === "yes")



            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [order_header_id]);

    function formatToLocalTime(dateString) {
        return moment(dateString).format('LLLL'); // Example format: "Sunday, December 15, 2024 3:00 PM"
    }

    const handleDispatch = async (e) => {

        try {
            const orderheadedata = {
                order_header_id: formData.order_header.id
            }

            const response = await api.updateOrderHeaderStatus(orderheadedata);
            if (response) {
                alert("Working good");
                setDispatchStatus(true);


            } else {
                alert("Failed occurs");
            }


        } catch (error) {
            console.error("Error adding part:", error);

        }


    };


    const handleVerify = async (e) => {
        const userDetails = localStorage.getItem("userDetails");

        const parsedDetails = JSON.parse(userDetails); 

        try {
            const orderheadedata = {
                order_header_id: formData.order_header.id,
                payment_amount : formData.order_transaction.payment_amount,
                payment_date :formData.order_transaction.payment_date,
                payment_comments:formData.order_transaction.payment_comments,
                updated_by: parsedDetails.id

            }

            const response = await api.updateOrderHeaderVerifyStatus(orderheadedata);
            if (response) {
                alert("Working good");
                setVerifyStatus(true);


            } else {
                alert("Failed occurs");
            }


        } catch (error) {
            console.error("Error adding part:", error);

        }

    }




    return (
        <div className="head-conatiner">

            <div className="invoice-button">
                <button className="download-invoice-button">
                    <i className="fas fa-file-download"></i>
                    Download Invoice
                </button>
            </div>

            <div className="order-imgpreview">
                <div className="orderDetails">
                    <div className="orderDetailsHeader">
                        <h2>Order Details</h2>
                        <div className="orderDetailRow">
                            <span className="orderDetailKey">Payment Type:</span>
                            <span className="orderDetailValue">{formData.order_header?.payment_type}</span>
                        </div>
                    </div>
                    <div className="orderDetailsContent">

                        <div className="orderDetailRow">
                            <span className="orderDetailKey">Order Number:</span>
                            <span className="orderDetailValue">{formData.order_header?.order_number}</span>
                        </div>
                        <div className="orderDetailRow">
                            <span className="orderDetailKey">Quantity:</span>
                            <span className="orderDetailValue">{formData.order_header?.quantity}</span>
                        </div>
                        <div className="orderDetailRow">
                            <span className="orderDetailKey">Part Name:</span>
                            <span className="orderDetailValue">{formData.order_header?.part_name}</span>
                        </div>
                        <div className="orderDetailRow">
                            <span className="orderDetailKey">UOM:</span>
                            <span className="orderDetailValue">{formData.order_header?.uom}</span>
                        </div>
                        <div className="orderDetailRow">
                            <span className="orderDetailKey">Unit Price:</span>
                            <span className="orderDetailValue">{formData.order_header?.unit_price}</span>
                        </div>
                        <div className="orderDetailRow">
                            <span className="orderDetailKey">IRN:</span>
                            <span className="orderDetailValue">{formData.order_header?.irn_invoice_number}</span>
                        </div>
                        <div className="orderDetailRow">
                            <span className="orderDetailKey">Customer Name:</span>
                            <span className="orderDetailValue">{formData.order_header?.customer_name}</span>
                        </div>
                        <div className="orderDetailRow">
                            <span className="orderDetailKey">Delivery Address:</span>
                            <span className="orderDetailValue">{formData.order_header?.delivery_address}</span>
                        </div>
                        <div className="orderDetailRow">
                            <span className="orderDetailKey">Total Amount:</span>
                            <span className="orderDetailValue">{formData.order_header?.total_amount}</span>
                        </div>
                    </div>
                </div>


                {/* <div className='img-previews'>
                    <label>Last Uploaded Image :</label>
                    <PhotoProvider>
                        <PhotoView src={selectedImage}>
                            <img
                                src={selectedImage}
                                alt="Preview"
                                style={{
                                    width: "240px",
                                    height: "265px",
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                }}
                            />
                        </PhotoView>
                    </PhotoProvider>
                </div> */}

                <div style={{ display: 'flex', flexDirection: 'column' }}>

                    <div>
                        <Card
                            sx={{
                                marginBottom: 3,
                                padding: 2,
                                width: '749px',
                                marginLeft: '20px',
                                marginTop: '20px',
                                height: 'fit-content',
                                boxShadow: 'rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset',
                            }}
                        >
                            <TableContainer component={Paper}>
                                <Table sx={{ marginBottom: '0px' }}>
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
                                                <TableCell>{formatToLocalTime(transaction.payment_date)}</TableCell>
                                                <TableCell>{transaction.payment_comments}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>

                    </div>


                    <div>


                        {/* Data Table Section */}
                        <Card sx={{
                            marginBottom: 3, padding: 2, width: '749px',
                            marginLeft: '20px',
                            marginTop: '20px',
                            boxShadow: 'rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset'
                        }}>
                            <TableContainer component={Paper}>
                                <Table sx={{ marginBottom: '0px' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>SNo</TableCell>
                                            <TableCell>Image (Viewable)</TableCell>
                                            <TableCell>Attached At</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* Example Rows */}
                                        {formData.order_attachment_images?.map((attachments, index) => (

                                            <TableRow key={attachments.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell><PhotoProvider>
                                                    <PhotoView src={`${BaseURL}${attachments.attached_image}`}>
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

                                                    <span style={{ color: 'green' }}>
                                                        Click to view
                                                    </span>

                                                </PhotoProvider></TableCell>
                                                <TableCell>{formatToLocalTime(attachments.attached_at)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Typography variant="h6" align="right" sx={{ marginTop: 2 }}>
                                Total Paid Amount: ${formData.order_header?.paid_amount}
                            </Typography>
                        </Card>

                    </div>





                </div>





            </div>


            {/* <div style={{
                position: 'relative',
                right: '0%',
                display: 'flex'
                ,
                marginTop: '9%'
            }}> */}


            {/* Action Buttons */}
            {/* <Grid container spacing={2} justifyContent="flex-end" marginLeft='-135px'
                    marginTop='-60px'>
                    <Grid item>
                        <Button variant="contained" color="success">VERIFY</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="warning">DISPATCH</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="error">GENERATE</Button>
                    </Grid>
                </Grid>


            </div> */}

            <div style={{
                position: 'relative',
                right: '0%',
                display: 'flex',
                marginTop: '9%'
            }}>
                <Grid container spacing={2} justifyContent="flex-end" marginLeft='-135px' marginTop='-60px'>
                    {formData?.order_header?.payment_type === "credit" && !dispatchStatus && (
                        <>
                            <Grid item>
                                <Button variant="contained" color="warning" onClick={handleDispatch}>
                                    DISPATCH
                                </Button>
                            </Grid>
                            {/* <Grid item>
                                <Button variant="contained" color="error">
                                    GENERATE
                                </Button>
                            </Grid> */}
                        </>
                    )}

                    {dispatchStatus && (
                        <Grid item>
                            <Button variant="contained" color="success" onClick={handleVerify}>
                                VERIFY
                            </Button>
                        </Grid>
                    )}

                    {verifyStatus && (
                        <Grid item>
                            <Button variant="contained" color="error">
                                GENERATE
                            </Button>
                        </Grid>

                    )}
                </Grid>
            </div>





        </div>
    );
}

export default DispatchDashboard;
