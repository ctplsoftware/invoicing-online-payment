import { useState, useEffect } from "react";
import { API } from "../../API";

import { useNavigate, NavLink, useLocation } from "react-router-dom";

import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { alertError, alertSuccess, alertWarning } from "../../alert.js";


export default function EInvoiceReport() {
  const api = new API();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const exportToExcel = (data, fileName = "E-Invoice Report.xlsx") => {
    // Define custom headers
    const headers = [
      [
        "SNO",
        "Order Number",
        "IRN",
        "Customer Name",
        "Customer GSTIN",
        "Subtotal",
        "CGST Amount",
        "SGST Amount",
        "IGST Amount",
        "Total Amount",
        "Tax Percentage",
        "Invoice Date",
      ],
    ];

    const formattedData = data.map((row, index) => ({
      SNO: index + 1,
      "Order Number": row.order_header_id__order_number || "N/A",
      IRN: row.Irn || "N/A",
      "Customer Name": row.order_header_id__customer_name || "N/A",
      "Customer GSTIN":
        row.order_header_id__customer_master_id__gstin_number || "N/A",
      Subtotal: row.order_header_id__amount_for_quantity ?? 0,
      "CGST Amount": row.order_header_id__cgst_amount ?? 0,
      "SGST Amount": row.order_header_id__sgst_amount ?? 0,
      "IGST Amount": row.order_header_id__igst_amount ?? 0,
      "Total Amount": row.order_header_id__total_amount ?? 0,
      "Tax Percentage": "18%",
      "Invoice Date": row.AckDt
        ? new Date(row.AckDt).toLocaleDateString("en-IN")
        : "N/A",
      Status: row.einvoice_status
        ? row.einvoice_status.charAt(0).toUpperCase() +
          row.einvoice_status.slice(1)
        : "Generated",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    XLSX.utils.sheet_add_aoa(worksheet, headers, { origin: "A1" });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "E-Invoice Report");

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
      const response = await api.get_einvoice_order_list();
      setData(response);
    }

    get();
  }, []);

  const columns = [
    { name: "S No", selector: (row, index) => index + 1, width: "70px" },

    {
      name: "Order Number",
      selector: (row) => (
        <NavLink
          to={`/landingpage/order-details/${row.order_header_id}`}
          state={{ order_header_id: row.id, from: "e-invoice" }}
        >
          {row.order_header_id__order_number}
        </NavLink>
      ),
      flex: 1,
    },

    {
      name: "Customer Name",
      cell: (row) => row.order_header_id__customer_name,
      flex: 1.5,
    },

    {
      name: "Customer GSTIN",
      cell: (row) => row.order_header_id__customer_master_id__gstin_number,
      flex: 1.5,
    },

    {
      name: "IRN",
      cell: (row) => row.Irn,
      flex: 1.5,
    },

    {
      name: "Subtotal",
      cell: (row) =>
        `₹${row.order_header_id__amount_for_quantity.toLocaleString("en-IN")}`,
      flex: 1.5,
    },

    {
      name: "CGST Amount",
      cell: (row) =>
        `₹${(row.order_header_id__cgst_amount ?? 0).toLocaleString("en-IN")}`,
      flex: 1.5,
    },

    {
      name: "SGST Amount",
      cell: (row) =>
        `₹${(row.order_header_id__sgst_amount ?? 0).toLocaleString("en-IN")}`,
      flex: 1.5,
    },

    {
      name: "IGST Amount",
      cell: (row) =>
        `₹${(row.order_header_id__igst_amount ?? 0).toLocaleString("en-IN")}`,
      flex: 1.5,
    },

    {
      name: "Total Amount",
      cell: (row) =>
        `₹${row.order_header_id__total_amount.toLocaleString("en-IN")}`,
      flex: 1.5,
    },

    {
      name: "Tax Percentage",
      cell: (row) => `18%`,
      flex: 1.5,
    },

    {
      name: "Invoice Date",
      selector: (row) => row.AckDt,
      cell: (row) => {
        const utcDate = new Date(row.AckDt);

        const istDate = new Date(utcDate.getTime() - 5.5 * 60 * 60 * 1000);

        const formattedDate = istDate.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        });
        return formattedDate;
      },
      width: "180px",
    },
    {
      name: "Status",
      cell: (row) =>
        row.einvoice_status
          ? row.einvoice_status.charAt(0).toUpperCase() +
            row.einvoice_status.slice(1)
          : "Generated",
      flex: 1.5,
    },
  ];

  function handleFilter(){
      if(startDate == "" || endDate == ""){
        alertWarning("Please select both the dates!");
      }
      else{
        const form_data = {
          start_date: startDate,
          end_date: endDate,
          key: 'e-invoice'
        }
  
        async function get_reports_filter(){
          const response = await api.get_reports_filtered(form_data);
          setData([]);
          setData(response);
          
        }
  
        get_reports_filter();
  
      }
  
    }

  return (
    <>
      <div style={{ width: "91%", marginLeft: "63px", marginTop: "25px" }}>
        <div
          style={{
            width: "91%",
            marginLeft: "63px",
            marginTop: "30px",
            marginBottom: "10px",
          }}
        >
          <button onClick={() => exportToExcel(data)}>Download Excel</button>
        </div>
        <div>
          <span
            style={{ paddingLeft: "30px", paddingRight: "15px", width: "40px" }}
          >
            <b> Start Date</b>
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
            style={{ width: "20%" }}
            required
          />
          <span
            style={{ paddingLeft: "30px", paddingRight: "15px", width: "30px" }}
          >
            <b> End Date</b>
          </span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
            style={{ width: "20%" }}
            required
          />
          <span style={{ paddingLeft: "30px" }}>
            <button
              onClick={() => handleFilter()}
              style={{ left: "auto" }}
            >
              Filter
            </button>
          </span>
        </div>

        <span
          style={{
            paddingLeft: "35px",
            paddingRight: "10px",
            paddingTop: "10px",
          }}
        ></span>

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
                justifyContent: "flex-start",
              },
            },
          }}
        />
      </div>
    </>
  );
}
