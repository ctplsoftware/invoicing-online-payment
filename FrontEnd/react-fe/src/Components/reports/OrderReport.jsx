import { useState, useEffect } from "react";
import { API } from "../../API";

import { useNavigate, NavLink, useLocation } from "react-router-dom";

import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function OrderReport() {
  const api = new API();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const exportToExcel = (data, fileName = "Order Report.xlsx") => {
    const headers = [
      [
        "SNO",
        "Order Number",
        "Payment Type",
        "Customer Name",
        "Part Name",
        "Unit Price",
        "Quantity",
        "Total Amount",
        "Dispatched Location",
        "Delivery Address",
        "Ordered By",
        "Order Date",
        "Status",
      ],
    ];

    const formattedData = data.map((row, index) => ({
      SNO: index + 1,
      "Order Number": row.order_number || "N/A",
      "Payment Type":
        row.payment_type.charAt(0).toUpperCase() + row.payment_type.slice(1),
      "Customer Name": row.customer_name,
      "Part Name": row.part_name,
      "Unit Price": row.unit_price,
      "Quantity": row.quantity,
      "Total Amount": row.total_amount,
      "Dispatched Location": row.location_name == null ? "Not choosed" : row.location_name,
      "Delivery Address": row.delivery_address,
      "Ordered By": row.ordered_by,
      "Order Date": new Date(row.ordered_at.split(".")[0]).toLocaleDateString(
        "en-IN"
      ),
      Status: row.completed_status == "yes" ? "Completed" : "Pending",
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
      const response = await api.get_order_list();
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
          to={`/landingpage/order-details/${row.id}`}
          state={{ order_header_id: row.id, from: 'order' }}
        >
          {row.order_number}
        </NavLink>
      ),
      flex: 1,
    },

    {
      name: "Customer Name",
      cell: (row) => row.customer_name,
      flex: 1.5,
    },

    {
      name: "Payment Type",
      cell: (row) =>
        row.payment_type.charAt(0).toUpperCase() + row.payment_type.slice(1),
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
      cell: (row) => row.location_name == null ? "Not choosed" : row.location_name,
      flex: 1.5,
    },

    {
      name: "Deliery Address",
      cell: (row) => row.delivery_address,
      flex: 1.5,
    },

    {
      name: "Status",
      cell: (row) => (row.completed_status == "yes" ? "Completed" : "Pending"),
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
    <div style={{ width: '91%', marginLeft: '63px', marginTop: '25px' }}>
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
        <span style={{ paddingLeft: "30px", paddingRight: "15px" }}>
        <b> Start Date</b>
      </span>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Start Date"
        required
      />
      <span style={{ paddingLeft: "30px", paddingRight: "15px" }}>
        <b> End Date</b>
      </span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="End Date"
        required
      />
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
              justifyContent: "flex-end", // Align pagination to the left
            },
          },
        }}
      />
    </div>
    </>
  );
}
