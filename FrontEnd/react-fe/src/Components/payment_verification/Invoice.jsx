import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

import '../payment_verification/invoice1.css'
import logoImg from '../../Assets/printaxlogo.png';
import Qrcode from '../../Assets/qrCode.png';

import { QRCodeCanvas } from 'qrcode.react';

import { API } from "../../API";


const TaxInvoice = () => {

  const location = useLocation();
  const api = new API();
  const [isRendered, setIsRendered] = useState(false);

  const [data, setData] = useState([]);
  const {id} = useParams();
  const order_header_id = id;


  useEffect(() => {
    async function get(){
      const order_data = {
        'order_header_id': order_header_id
      }
      const response = await api.get_einvoice_details(order_data);
      setData(response);
    }

    get();


  }, []);

  useEffect(() => {
    if (data) {
      setIsRendered(true);
    }
  }, [data]);

  // Wait until rendering is complete before printing
  useEffect(() => {
    if (isRendered) {
      setTimeout(() => {
        window.print();
        window.close();
      }, 500); // Small delay to ensure rendering
    }
  }, [isRendered]);

  

  if (data.length === 0) {
    return null;
  }


  return (
    <div className="invoice-container" style={{marginTop:'-2%'}}>
      <div className="invoice-wrapper">
        <h2 className="invoice-title">TAX INVOICE</h2>

        {/* <div className="invoice-section" style={{textAlign:'justify' }}>
          <p>IRN: {data?.irn_no}</p>
          <p >Ack No.: {data?.ack_no}</p>
          <p >Ack Date: {data?.ack_date}</p>
          
          <div className="qr-code">
          <QRCodeCanvas 
            size={140} 
            value={data?.qr_code_data} 
            style={{ height: "140px", marginTop: "-16%", marginLeft: "80%" }} 
          />
          </div>
        </div> */}

        <div className="invoice-header" style={{marginTop:'-2%',fontSize:'18px'}}>
          <div className="seller-buyer-section">
            <div className="seller-details">
            <div style={{marginBottom:'2%' }}> </div>
              <h3 style={{marginTop:'-3%'}}>{data?.vendor_company_name}</h3>
              <p style={{marginLeft:'22%',marginTop:'-1%'}}>{data?.vendor_company_address} . PAN : {data?.vendor_company_pan}. UDYAM : UDYAM-TN-02-0094436 (Micro)</p>
              <p style={{marginLeft:'22%',marginTop:'-2%'}}>GSTIN/UIN: {data?.vendor_company_gstin}</p>
              <p style={{marginLeft:'22%',marginTop:'-2%',marginBottom:'-1%'}}>Email: {data?.vendor_company_email}</p>
            </div>
            <div className="buyer-details">
              <h5> <span style={{fontSize:'14px'}}>Buyer (Bill to):</span><br /><strong> {data?.buyer_company_name} </strong></h5>
              <span style={{textAlign:'left'}}>
              <p style={{marginTop:'-2%'}}>{data?.buyer_company_address}</p>
              <p style={{marginTop:'-2%'}}>GSTIN/UIN: {data?.buyer_company_gstin}</p>
              <p style={{marginTop:'-2%'}}>State Name : {data?.buyer_state_name}, Code : {data?.buyer_state_code}</p>
              <p style={{marginTop:'-2%',marginBottom:'-1%'}}>Place of Supply : {data?.buyer_state_name}
              </p>
              </span>
            </div>
          </div>

<div className="invoice-grid">
  <div className="invoice-cell">
    <p>Invoice No.: <strong>{data?.invoice_no}</strong></p>
  </div>
  <div className="invoice-cell">
    <p>Dated: <strong>{data?.ack_date}</strong></p>
  </div>
  <div className="invoice-cell">
    <p><strong>Delivery Note: {data?.delivery_note}</strong></p>
  </div>
  <div className="invoice-cell">
    <p>Reference No. & Date: <strong>{data?.reference_number}</strong></p>
  </div>
  <div className="invoice-cell">
    <p><strong>Other References: {data?.other_references}</strong></p>
  </div>
  <div className="invoice-cell">
    <p><strong>Buyer's Order No.: {data?.other_references}</strong></p>
  </div>
  <div className="invoice-cell">
    <p><strong>Dated: {data?.ack_date}</strong></p>
  </div>
  <div className="invoice-cell">
    <p>Dispatch through: <strong>{data?.dispatched_through}</strong></p>
  </div>
  <div className="invoice-cell">
    <p><strong>Destination: {data?.buyer_company_address}</strong></p>
  </div>
  
  <div className="invoice-cell">
    <p>Dispatch Doc No.: <strong>{data?.dispatch_doc_no}</strong></p>
  </div>
  
  <div className="invoice-cell">
    <p>Mode/Terms of Payment: {data?.mode_of_payment}</p>
  </div>
  <div className="invoice-cell">
    <p><strong>Immediate Payment</strong></p>
  </div>
  <div style={{width:'200%'}} className="invoice-cell">
    <p>Terms of Delivery: <strong>{data?.terms_of_delivery}</strong></p>
    <p></p>

  </div>
  
</div>

        
        </div>

        <div className="invoice-content">
          <table className="invoice-table">
            <thead style={{textAlign:'center'}}>
              <tr>
                <th style={{width:'8%'}}>Sl No.</th>
                <th style={{width:'35%'}}>Description of Goods</th>
                <th>HSN/SAC</th>
                <th>Quantity</th>
                <th>Rate</th>
                {/* <th>Amount</th> */}
                <th>SGST</th>
                <th>CGST</th>
                <th>IGST</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{height:'200px'}}>
                <td>1</td>
                <td><strong>{data?.description_of_goods}</strong></td>
                <td>{data?.hsn_code}</td>
                <td> <strong>{data?.quantity}</strong></td>
                <td>₹{data?.rate?.toLocaleString('en-IN')}</td>
                {/* <td>1,450.00</td> */}
                <td>₹{data?.sgst_amount?.toLocaleString('en-IN')} ({data?.sgst_per}%)</td>
                <td>₹{data?.cgst_amount?.toLocaleString('en-IN')} ({data?.cgst_per}%)</td>
                <td>₹{data?.igst_amount?.toLocaleString('en-IN')} ({data?.igst_per}%)</td>
                <td><strong>₹{data?.total_amount?.toLocaleString('en-IN')}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Additional Summary Table */}
        <div className="invoice-content">
          <table className="invoice-table">
            <thead style={{textAlign:'center'}}>
              <tr>
                <th style={{width:'33%'}}>HSN/SAC</th>
                <th>Taxable Value</th>
                <th>CGST</th>
                <th>Rate</th>
                <th>SGST</th>
                <th>Rate</th>
                <th>IGST</th>
                <th>Rate</th>
                <th>Total Tax Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data?.hsn_code}</td>
                <td>₹{data?.amount_for_quantity?.toLocaleString('en-IN')}</td>
                <td>₹{data?.cgst_amount?.toLocaleString('en-IN')}</td>
                <td>{data?.cgst_per}%</td>
                <td>₹{data?.sgst_amount?.toLocaleString('en-IN')}</td>
                <td>{data?.sgst_per}%</td>
                <td>₹{data?.igst_amount?.toLocaleString('en-IN')}</td>
                <td>{data?.igst_per}%</td>
                <td>₹{data?.total_tax_amount?.toLocaleString('en-IN')}</td>
              </tr>
              <tr style={{fontWeight:'bold'}}>
                <td>Total</td>
                <td>₹{data?.amount_for_quantity?.toLocaleString('en-IN')}</td>
                <td>₹{data?.cgst_amount?.toLocaleString('en-IN')}</td>
                <td></td>
                <td>₹{data?.sgst_amount?.toLocaleString('en-IN')}</td>
                <td></td>
                <td>₹{data?.igst_amount?.toLocaleString('en-IN')}</td>
                <td></td>
                <td>₹{data?.total_tax_amount?.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
  <p style={{textAlign:'justify', marginTop:'-1.5%', marginBottom:'-1.5%'}}><strong> Amount chargable(in words):</strong> <span style={{fontSize:'16px'}}><strong>INR {data?.amount_in_words} Only</strong></span></p>


        <div className="invoice-footer" style={{ display: 'flex', justifyContent: 'space-between',border:'1px solid #000' }}>
{/* Left Section */}
<div className="footer-left" style={{ width: '58%',padding:'10px' }}>
  <p style={{ marginTop:'-1.5%',marginBottom:'-0.5%'}}><strong>Tax Amount (in words):</strong> <span style={{fontSize:'16px'}}><strong>INR {data?.amount_in_words} Only</strong></span></p>
  <p><strong>Company's PAN:</strong>  <span><strong>{data?.vendor_company_pan}</strong></span></p>
  <p><strong>Declaration:</strong> We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
</div>

{/* Right Section */}
<div className="footer-right" style={{ width: '43%',marginLeft:'10%' }}>
  <p><strong>Company's Bank Details:</strong></p>
  <p style={{ marginTop:'-1.5%',marginBottom:'-0.5%'}}>Bank Name: <span style={{fontWeight:'bold'}}>{data?.vendor_company_bank_name} </span></p>
  <p style={{ marginTop:'-1.5%',marginBottom:'-0.5%'}}>Account No: <span style={{fontWeight:'bold'}}>{data?.vendor_company_bank_account}</span></p>
  <p style={{ marginTop:'-1.5%',marginBottom:'-0.5%'}}>Branch & IFSC Code: <span style={{fontWeight:'bold'}}> {data?.vendor_company_bank_branch} </span></p>

  <div className="signature-box" style={{ textAlign: 'center', marginTop: '5%' ,padding:'10px'}}>
  <h5>For <strong></strong>{data?.buyer_company_name}</h5>
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
  
  