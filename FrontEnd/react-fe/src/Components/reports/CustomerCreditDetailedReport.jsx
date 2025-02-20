import { useState, useEffect } from "react";
import { API } from "../../API";

import { useNavigate, NavLink, useLocation, useParams } from "react-router-dom";

import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function CustomerCreditReport() {
  const api = new API();
  const location = useLocation();
  const customer_name = location?.state?.customer_name;
  const credit_limit = location?.state?.credit_limit;
  const available_limit = location?.state?.available_limit;
  const used_limit = location?.state?.used_limit;
  const {id} = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);


  const exportToExcel = (data, fileName = "Customer Credit Report.xlsx") => {
    const headers = [
      [
        "SNO",
        "Customer Name",
        "GSTIN",
        "Credit Limit",
        "Available Limit",
        "Used Limit",
        "Credit Days",
        "Contact Person",
        "Contact Number",
      ],
    ];

    const formattedData = data.map((row, index) => ({
      SNO: index + 1,
      "Customer Name": row.name,
      "GSTIN": row.gstin_number,
      "Credit Limit": `₹${row.credit_limit.toLocaleString("en-IN")}`,
      "Available Limit": `₹${(row.credit_limit - row.used_limit).toLocaleString("en-IN")}`,
      "Used Limit": `₹${row.used_limit.toLocaleString("en-IN")}`,
      "Credit Days": row.credit_days,
      "Contact Person": row.contact_person,
      "Contact Number": row.contact_number,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    XLSX.utils.sheet_add_aoa(worksheet, headers, { origin: "A1" });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, fileName);
  };

  useEffect(() => {
    async function get() {
      const response = await api.get_customer(id);
      console.log(response);
      
      setData(response);
    }

    get();
  }, []);

  const columns = [
    { name: "S No", selector: (row, index) => index + 1, width: "70px" },

    {
        name: "Order Number",
        cell: (row) => row.order_number,
        flex: 1.5,
      },

    {
      name: "Part Name",
      cell: (row) => row.part_name,
      flex: 1.5,
    },

    {
        name: "Quantity",
        cell: (row) => row.quantity,
        flex: 1.5,
    },

    {
        name: "Unit Price",
        cell: (row) => row.quantity,
        flex: 1.5,
    },

    {
      name: "Total Amount",
      cell: (row) => `₹${row.total_amount.toLocaleString("en-IN")}`,
      flex: 1.5,
    },


    
  ];

  return (
    <div style={{ width: '91%', marginLeft: '63px', marginTop: '25px' }}>
 
        <div className="mb-3 fs-5 fw-bold">
          <span style={{paddingRight: '20px'}}>Credit Report for: <strong>{customer_name}</strong></span>
          <span style={{paddingRight: '20px'}}>Credit Limit: <strong>{credit_limit}</strong></span>
          <span style={{paddingRight: '20px'}}>Available Limit: <strong>{available_limit}</strong></span>
          <span style={{paddingRight: '20px'}}>Used Limit: <strong>{used_limit}</strong></span>
          
          
          
        </div>


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
              justifyContent: "flex-end", // Align pagination to the left
            },
          },
        }}
      />

        
     
    

      <span style={{ marginRight: "92px" }}>
        <button
          onClick={() => navigate("/landingpage/customer-credit-reports")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </span>
    </div>
  );

}
