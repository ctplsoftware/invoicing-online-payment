import { useState, useEffect } from "react";
import { API } from "../../API";

import { useNavigate, NavLink, useLocation } from "react-router-dom";

import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function CustomerCreditReport() {
  const api = new API();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
      const response = await api.get_customer_list();
      console.log(response);
      
      setData(response);
    }

    get();
  }, []);

  const columns = [
    { name: "S No", selector: (row, index) => index + 1, width: "70px" },

    {
      name: "Customer Name",
      selector: (row) => (
        <NavLink
          to={`/landingpage/customer-credit-detailed-reports/${row.id}`}
          state={{customer_name: row.name, credit_limit: `₹${row.credit_limit.toLocaleString("en-IN")}`, available_limit: `₹${(row.credit_limit - row.used_limit).toLocaleString("en-IN")}`, used_limit: `₹${row.used_limit.toLocaleString("en-IN")}`}}
        >
          {row.name}
        </NavLink>
      ),
      flex: 1,
    },

    {
      name: "GSTIN",
      cell: (row) => row.gstin_number,
      flex: 1.5,
    },

    {
      name: "Credit Limit",
      cell: (row) => `₹${row.credit_limit.toLocaleString("en-IN")}`,
      flex: 1.5,
    },

    {
      name: "Used Limit",
      cell: (row) => `₹${row.used_limit.toLocaleString("en-IN")}`,
      flex: 1.5,
    },

    {
      name: "Available Limit",
      cell: (row) => `₹${(row.credit_limit - row.used_limit).toLocaleString("en-IN")}`,
      flex: 1.5,
    },

    

    {
      name: "Credit Days",
      cell: (row) => row.credit_days,
      flex: 1.5,
    },

    {
      name: "Contact Person",
      cell: (row) => row.contact_person,
      flex: 1.5,
    },

    {
      name: "Contact Number",
      cell: (row) => row.contact_number,
      flex: 1.5,
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
