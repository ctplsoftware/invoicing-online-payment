

function OrderDetails() {
    


    return(

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

{formData?.order_header?.payment_type === "credit" &&
    dispatchStatus &&
    !verifyStatus && (
      <Card
        sx={{
          marginBottom: 3,
          width: "50%",
          margin: "0 auto",
          padding: 2,
          marginRight: "12%",
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

  {formData?.order_header?.payment_type === "advance" &&
    !verifyStatus && (
      <Card
        sx={{
          marginBottom: 3,
          width: "50%",
          margin: "0 auto",
          padding: 2,
          marginRight: "12%",
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

        

    )

}
 
export default OrderDetails;