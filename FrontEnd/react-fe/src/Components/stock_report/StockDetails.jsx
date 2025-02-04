import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../../API";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";

const StockDetails = () => {
  const { partname } = useParams(); // Get part_name from the URL
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);

  const api = new API();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inwardTransactionFetch = await api.fetch_inward_transaction();

        // Filter data for the specific part_name
        const filteredData = inwardTransactionFetch.filter(
          (item) => item.part_name.toLowerCase() === partname.toLowerCase()
        );

        // Add unique id property for DataGrid
        const formattedData = filteredData.map((item, index) => ({
          Sno: index + 1, // Ensure unique ID for DataGrid rows
          ...item,
        }));

        console.log("formattedData...", formattedData);

        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [partname]);

  const columns = [
    { name: "Sno", selector: (row) => row.Sno, width: "70px" },
    { name: "Part Name", selector: (row) => row.part_name, width: "150px" },
    {
      name: "Quantity",
      selector: (row) => row.inward_quantity,
      width: "150px",
    },
    { name: "UOM", selector: (row) => row.uom, width: "100px" },
    { name: "Comments", selector: (row) => row.comments, width: "200px" },
    {
      name: "Inward date",
      selector: (row) => row.inward_date,
      cell: (row) => {
        const formattedDate = new Date(row.inward_date).toLocaleString(
          "en-IN",
          {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Asia/Kolkata",
          }
        );
        return formattedDate;
      },
      width: "180px",
    },
    { name: "Inward By", selector: (row) => row.inward_by, width: "173px" },
  ];

  return (
    <div
      style={{
        height: 268,
        width: "60%",
        marginLeft: "278px",
        marginTop: "29px",
      }}
    >   
        <div style={{'marginBottom': '20px', 'font-size': '20px'}} className="">
        <span ><b>Details for Part : {decodeURIComponent(partname)}</b></span>


        </div>
        
     
      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        pagination
        paginationPerPage={pageSize}
        onChangeRowsPerPage={(newPageSize) => setPageSize(newPageSize)}
        highlightOnHover
        striped
        responsive
        progressPending={loading}
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
          onClick={() => navigate("/landingpage/stockreport")}
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
};

export default StockDetails;
