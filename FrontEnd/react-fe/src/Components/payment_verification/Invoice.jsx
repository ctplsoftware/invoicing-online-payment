import React from "react";
import '../payment_verification/invoice.css'
import logoImg from '../../Assets/printaxlogo.png';
import Qrcode from '../../Assets/qrCode.png';

// import QRCode from "qrcode.react";

const TaxInvoice = () => {
    return (
      <div className="invoice-container" style={{marginTop:'-2%'}}>
        <div className="invoice-wrapper">
          <h2 className="invoice-title">TAX INVOICE</h2>
  
          <div className="invoice-section" style={{textAlign:'justify' }}>
            <p><strong>IRN:</strong> a3c39dfe5ab841ab3c8889a9ca39de71f9a5251de80cdf02d9-c60a7af3fa76c9</p>
            <p ><strong>Ack No.:</strong> 152420056447231</p>
            <p ><strong>Ack Date:</strong> 6-Dec-24</p>
            
            <div className="qr-code">
            <img src={Qrcode} alt="Company Logo" style={{ height:'140px', marginTop:'-15%',marginLeft:'80%' }} />
              {/* <QRCode value="a3c39dfe5ab841ab3c8889a9ca39de71f9a5251de80cdf02d9-c60a7af3fa76c9" size={100} /> */}
            </div>
          </div>
  
          <div className="invoice-header" style={{marginTop:'-2%',fontSize:'small'}}>
            <div className="seller-buyer-section">
              <div className="seller-details">
              <img src={logoImg} alt="Company Logo" style={{ fontSize:'12px',height:'42px',marginBottom:'-4%' }} />
                <h3 style={{marginTop:'-3%'}}>Printax LLP</h3>
                <p>New No.11, Old No.6, 1st Main Road, Karpagam Gardens, Adyar, Chennai - 600 020. 044-24902473,42054423 . PAN : AAZFP4517G. UDYAM : UDYAM-TN-02-0094436 (Micro)</p>
                <p>GSTIN/UIN: 33AAZFP4517G1ZX</p>
                <p>Email: printaxllp.chennai@gmail.com</p>
              </div>
              <div className="buyer-details">
                <h5> <span style={{fontSize:'14px'}}>Buyer (Bill to):</span><strong> CODENTRIX TECHNOLOGIES PRIVATE LIMITED </strong></h5>
                <span style={{textAlign:'left'}}>
                <p>6/43, NAVARATHNA GARDENS, 2nd Cross Street, EKKATUTHANGAL, Chennai - 600032</p>
                <p>GSTIN/UIN: 33AAGCC4141B1ZD</p>
                <p>State Name : Tamil Nadu, Code : 33</p>
                <p>Place of Supply : Tamil Nadu
                </p>
                </span>
              </div>
            </div>
  
            <div className="invoice-info">
              <p><strong>Invoice No.:</strong> 415/24-25</p>
              <hr />
              <p><strong>Dated:</strong> 6-Dec-24</p>
              <hr />
              <p><strong>Delivery Note:</strong></p>
              <hr />
              <p><strong>Reference No. & Date:</strong> 415/24-25 dt. 6-Dec-24</p>
              <hr />
              <p><strong>Other References:</strong></p>
              <hr />
              <p><strong>Buyer's Order No.:</strong></p>
              <hr />
              <p><strong>Dated:</strong></p>
              <hr />
              <p><strong>Dispatch through:</strong> Porter</p>
              <hr />
              <p><strong>Destination:</strong></p>
              <hr />
              <p><strong>Terms of Delivery:</strong> To-Pay</p>
              <hr />
            </div>
          
          </div>
  
          <div className="invoice-content">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Sl No.</th>
                  <th>Description of Goods</th>
                  <th>HSN/SAC</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>SGST</th>
                  <th>CGST</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{height:'250px'}}>
                  <td>1</td>
                  <td>Magic DS Cloth Tapes 300mm x 20m</td>
                  <td>59069910</td>
                  <td>1 NOS</td>
                  <td>1,450.00</td>
                  <td>1,450.00</td>
                  <td>₹87.00 (6%)</td>
                  <td>₹87.00 (6%)</td>
                  <td>₹1,624.00</td>
                </tr>
              </tbody>
            </table>
          </div>
  
          {/* Additional Summary Table */}
          <div className="invoice-content">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>HSN/SAC</th>
                  <th>Taxable Value</th>
                  <th>CGST</th>
                  <th>Rate</th>
                  <th>SGST/UTGST</th>
                  <th>Rate</th>
                  <th>Total Tax Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>59069910</td>
                  <td>₹1,450.00</td>
                  <td>₹87.00</td>
                  <td>6%</td>
                  <td>₹87.00</td>
                  <td>6%</td>
                  <td>₹174.00</td>
                </tr>
                <tr style={{fontWeight:'bold'}}>
                  <td>Total</td>
                  <td>₹1,450.00</td>
                  <td>₹87.00</td>
                  <td></td>
                  <td>₹87.00</td>
                  <td></td>
                  <td>₹174.00</td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <div className="invoice-footer" style={{ display: 'flex', justifyContent: 'space-between',border:'1px solid #000' }}>
  {/* Left Section */}
  <div className="footer-left" style={{ width: '58%',padding:'10px' }}>
    <p><strong>Tax Amount (in words):</strong> <span><h4><strong>INR One Hundred Seventy Four Only</strong></h4></span></p>
    <p><strong>Company's PAN:</strong>  <span><h5><strong>AAZFP4517G</strong></h5></span></p>
    <p><strong>Declaration:</strong> We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
  </div>

  {/* Right Section */}
  <div className="footer-right" style={{ width: '28%',marginLeft:'10%' }}>
    <p><strong>Company's Bank Details:</strong></p>
    <p>Bank Name: AXIS BANK</p>
    <p>Account No: 922030014857287</p>
    <p>Branch & IFSC Code: AMINJIKARAI, CHENNAI & UTIB0001372</p>

    <div className="signature-box" style={{ textAlign: 'center', marginTop: '5%' ,padding:'10px'}}>
    <h5>For <strong> Printax LLP</strong></h5>
    <p style={{ marginTop: "20%" }}><strong>Authorised Signatory</strong></p>
  </div>
  </div>

  {/* Signature Box */}
 
</div>

        </div>
      </div>
    );
};
  
export default TaxInvoice;
  
  