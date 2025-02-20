import { useState, useEffect } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";

import { API } from "../../API";

export default function EInvoiceList(){
    const api = new API();
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState([]);
    var order_data = {}


    useEffect(() => {
        async function get(){
            const response = await api.get_einvoice_list();          
            setData(response);
        }
        get();
    }, []);

    const columns = [
        { name: "S No", selector: (row, index) => index + 1, width: "70px" },
    
        {
            name: "Order Number",
            selector: (row) => {
              const isNavLink =
                (row.payment_type === "credit" && row.location_master_id != null ||
                (row.payment_type === "advance" && row.verified_status === "yes" && row.location_master_id != null)) && row.invoice_generated_status == 'no';
          
              return isNavLink ? (
                <NavLink
                  to={`/landingpage/generate-einvoice/${row.id}`}
                  state={{ order_header_id: row.id, order_number: row.order_number }}
                >
                  {row.order_number}
                </NavLink>
              ) : (
                row.order_number
              );
            },
            flex: 1,
        },
          
    
        {
          name: "Customer Name",
          cell: (row) => row.customer_name,
          flex: 1.5,
        },
    
        {
          name: "Payment Type",
          cell: (row) => row.payment_type.charAt(0).toUpperCase() + row.payment_type.slice(1),
          flex: 1.5,
        },
    
        {
          name: "Part Name",
          cell: (row) => row.part_name,
          flex: 1.5,
        },
    
        {
          name: "Unit Price",
          cell: (row) => `₹${row.unit_price.toLocaleString("en-IN")}`,
          flex: 1.5,
        },
    
        {
          name: "Quantity",
          cell: (row) => row.quantity,
          flex: 1.5,
        },
    
        {
          name: "Total Amount",
          cell: (row) => `₹${row.total_amount.toLocaleString("en-IN")}`,
          flex: 1.5,
        },
    
        {
          name: "Dispatched Location",
          cell: (row) => row.location_name,
          flex: 1.5,
        },
    
        {
          name: "Deliery Address",
          cell: (row) => row.delivery_address,
          flex: 1.5,
        },

        {
            name: "Invoice Generated Status",
            cell: (row) => row.invoice_generated_status == 'yes' ? 'Completed' : 'Pending',
            flex: 1.5,
        },
    
        {
            name: "Order Status",
            cell: (row) => row.completed_status == 'yes' ? 'Completed' : 'Pending',
            flex: 1.5,
        },

        {
            name: "Ordered By",
            cell: (row) => row.ordered_by,
            flex: 1.5,
        },
    
        {
          name: 'Ordered Date',
          selector: row => row.ordered_at,
          cell: row => {
              const formattedDate = new Date(row.ordered_at).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                  timeZone: 'Asia/Kolkata',
              });
              return formattedDate;
          },
          width: '180px',
      },
        
    
        
    
    
    ];
    
      return (
        <>
           <div style={{ width: '91%', marginLeft: '63px', marginTop: '30px', marginBottom: '10px' }}>
    
           
          <DataTable
            columns={columns}
            data={data}
            pagination
            highlightOnHover
            striped
            responsive
            customStyles={{
              headCells: {
                style: {
                  backgroundColor: "#0b5ca0",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#0b5ca0",
                  },
                },
                activeSortStyle: {
                  "&:hover": {
                    color: "white",
                  },
                },
              },
              rows: {
                style: {
                  border: "0.4px solid #e0e0e0",
                },
              },
              headCells: {
                style: {
                  backgroundColor: "#0b5ca0",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: "bold",
                },
              },
              cells: {
                style: {
                  border: "0.4px solid #e0e0e0",
                },
              },
              pagination: {
                style: {
                  fontSize: "12px",
                  padding: "10px",
                  justifyContent: "flex-start", // Align pagination to the left
                },
              },
            }}
          />
        </div>

        </>

      );



    return (
        <>

        
        
        
        
        </>

    );


}