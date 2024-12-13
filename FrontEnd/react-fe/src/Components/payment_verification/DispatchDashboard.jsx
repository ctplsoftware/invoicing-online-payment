import '../payment_verification/dispatchdashboard.css';
import "react-image-lightbox/style.css"; // Import the lightbox styles
import Lightbox from "react-image-lightbox";
import React, { useState, useEffect } from "react";
import vickyimg from '../payment_verification/screeshot.png';
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Button, Card, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import { styled } from '@mui/system';



function DispatchDashboard() {
    const [selectedImage, setSelectedImage] = useState(vickyimg);







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
                            <span className="orderDetailValue">Pending</span>
                        </div>
                    </div>
                    <div className="orderDetailsContent">

                        <div className="orderDetailRow">
                            <span className="orderDetailKey">Order Number:</span>
                            <span className="orderDetailValue">239930</span>
                        </div>
                        <div className="orderDetailRow">
                            <span className="orderDetailKey">Quantity:</span>
                            <span className="orderDetailValue">67</span>
                        </div>
                        <div className="orderDetailRow">
                            <span className="orderDetailKey">Part Number:</span>
                            <span className="orderDetailValue">34322</span>
                        </div>
                        <div className="orderDetailRow">
                            <span className="orderDetailKey">UOM:</span>
                            <span className="orderDetailValue">Tons</span>
                        </div>
                        <div className="orderDetailRow">
                            <span className="orderDetailKey">Unit Price:</span>
                            <span className="orderDetailValue">67.9</span>
                        </div>
                        <div className="orderDetailRow">
                            <span className="orderDetailKey">IRN:</span>
                            <span className="orderDetailValue">16-digit number</span>
                        </div>
                        <div className="orderDetailRow">
                            <span className="orderDetailKey">Customer Name:</span>
                            <span className="orderDetailValue">Vicky</span>
                        </div>
                        <div className="orderDetailRow">
                            <span className="orderDetailKey">Total Amount:</span>
                            <span className="orderDetailValue">4567</span>
                        </div>
                    </div>
                </div>


                <div className='img-previews'>
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
                </div>
                <div className="payment-form">
                    <form>
                        <div className="form-group row">
                            <div className="col-md-4">
                                <label htmlFor="payment-amount">Payment Amount:</label>
                                <input type="number" id="payment-amount" name="payment-amount" placeholder="Enter payment amount" />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="payment-date">Payment Date:</label>
                                <input type="date" id="payment-date" name="payment-date" />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="comments">Comments:</label>
                                <textarea id="comments" name="comments" placeholder="Enter comments" rows="1"></textarea>
                            </div>
                        </div>
                    </form>
                </div>



            </div>




            {/* Data Table Section */}
            <Card sx={{
                marginBottom: 3, padding: 2, width: '749px',
                marginLeft: '20px',
                marginTop: '20px',
                boxShadow: 'rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset'
            }}>
                <TableContainer component={Paper}>
                    <Table sx={{marginBottom:'0px'}}>
                        <TableHead>
                            <TableRow>
                                <TableCell>SNo</TableCell>
                                <TableCell>Image (Viewable)</TableCell>
                                <TableCell>Uploaded By</TableCell>
                                <TableCell>Uploaded At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Example Rows */}
                            <TableRow>
                                <TableCell>1</TableCell>
                                <TableCell><img src="/placeholder-image.png" alt="Uploaded" style={{ width: 50, height: 50 }} /></TableCell>
                                <TableCell>Vickyy</TableCell>
                                <TableCell>2024-12-12</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography variant="h6" align="right" sx={{ marginTop: 2 }}>
                    Total Paid Amount: $0.00
                </Typography>
            </Card>

            {/* Action Buttons */}
            <Grid container spacing={2} justifyContent="flex-end" marginLeft='-135px'
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

        </div>
    );
}

export default DispatchDashboard;
