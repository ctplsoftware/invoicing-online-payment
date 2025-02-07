import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../../API";
import { useNavigate, useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";

const StockDetails = () => {
  const { partname } = useParams(); // Get part_name from the URL
  const location = useLocation();
  const location_master_id = location.state?.location_master_id;
  const location_name = location.state?.location_name;
  const part_name = location.state?.part_name;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);

  const api = new API();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(location_master_id && part_name){
          const data = {
            'location_master_id': location_master_id,
            'part_name': part_name
          };

          const inwardTransactionFetch = await api.get_inward_part_location_details(data);
          setRows(inwardTransactionFetch);

        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [partname]);

  const columns = [
    { name: "Sno", selector: (row, index) => index + 1, width: "70px" },
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
        <span ><b>Details for Part : {part_name} and Location: {location_name}</b></span>


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
