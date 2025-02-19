import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../API";
import DataTable from "react-data-table-component";

function PartMasterList() {
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = new API();
  const navigate = useNavigate();

  const columns = [
    { name: "S No", selector: (row) => row.Sno, width: "auto" },
    { name: "Part Name",
      selector: (row) =>(<a href="#" onClick={(e) => { e.preventDefault(); handleEditClick(row);
              }} 
              style={{ textDecoration: "none", color: "#007bff", cursor: "pointer" }}>
              {row.part_name}
              </a>), width: "auto"
    },
    { name: "Part Description", selector: (row) => row.part_desc  , width: "auto" },
    { name: "Unit Price", selector: (row) => row.unit_price, width: "auto" },
    {
      name: "UOM (Unit of Measure)",
      selector: (row) => row.uom,
      width: "auto",
    },
    { name: "Status", selector: (row) => row.status, width: "auto" },

    {
      name: "Created At",
      selector: (row) => row.created_at,
      cell: (row) => {
        const formattedDate = new Date(row.created_at).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Asia/Kolkata",
        });
        return formattedDate;
      },
      width: "auto",
    },
    {
      name: "Updated At",
      selector: (row) => row.updated_at,
      cell: (row) =>
        row.updated_at
          ? new Date(row.updated_at).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Asia/Kolkata",
            })
          : "No update",
      width: "auto",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const partmasterfetch = await api.get_part_master();
        const fetchedData = partmasterfetch.map((item, index) => ({
          id: item.id,
          Sno: index + 1,
          part_name: item.part_name,
          part_desc: item.part_description,
          status: item.status,
          unit_price: item.unit_price,
          uom: item.uom,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
        setRows(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredRows = rows.filter((row) => {
    return (
      row.part_name.toLowerCase().includes(searchText.toLowerCase()) &&
      (filter ? row.status.toLowerCase() === filter : true)
    );
  });

  const handleEditClick = (row) => {
    navigate(`/landingpage/partmaster-edit/${row.id}`);
  };

  return (
      <div style={{width: "91%", marginLeft: "50px", marginTop: "20px" }}>
      {/* Create Button */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px"}}>
        <button
          onClick={() => navigate("/landingpage/partmaster-form")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "100px",
            fontWeight: "bold", 
          }}
        >
          Create   
        </button>
      </div>

      {/* Search and Filter */}
      <div style={{ display: "flex", gap: "10px",  marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearchChange}
          style={{
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "250px",
          }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "150px",
          }}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredRows}
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
              justifyContent: "flex-start", // Align pagination to the left
            },
          },
        }}
      />
      </div>
  );
}

export default PartMasterList;
