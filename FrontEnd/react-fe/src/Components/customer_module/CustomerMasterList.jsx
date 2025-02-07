import { useEffect, useState } from "react";
import { API } from "../../API.js";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";

const CustomerMasterdashboard = () => {
  const api = new API();
  const [customerData, setCustomerData] = useState([]); // Fetched data
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [filter, setFilter] = useState(""); // GSTIN filter
  const [pageSize, setPageSize] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const customerFetchdata = await api.customermaster_fetch();
        const dataWithSNo = customerFetchdata.map((item, index) => ({
          ...item,
          sno: index + 1,
        }));
        setCustomerData(dataWithSNo);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { name: "S. No", selector: (row) => row.sno, width: "70px" },
    { 
      name: "Name",
      selector: (row) => (<a href="#" onClick={(e) => { e.preventDefault(); handleEditClick(row);
            }} 
            style={{ textDecoration: "none", color: "#007bff", cursor: "pointer" }}
        >
            {row.name}
        </a>
    ),       minWidth: "80px" 
    },
    { name: "GSTIN Number", selector: (row) => row.gstin_number, minWidth: "150px" },
    { name: "Delivery Address", selector: (row) => row.delivery_address, minWidth: "180px" },
    { name: "Billing Address", selector: (row) => row.billing_address, minWidth: "180px" },
    { name: "Credit Limit", selector: (row) => row.credit_limit, width: "120px" },
    { name: "Contact Person", selector: (row) => row.contact_person, minWidth: "150px" },
    { name: "Contact Number", selector: (row) => row.contact_number, minWidth: "150px" },
    {
      name: "Created at",
      selector: (row) => row.created_at,
      cell: (row) => new Date(row.created_at).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      }),
      minWidth: "180px",
    },
    {
      name: "Updated at",
      selector: (row) => row.updated_at,
      cell: (row) =>
        row.updated_at
          ? new Date(row.updated_at).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Asia/Kolkata",
            })
          : "No update",
      minWidth: "180px",
    },
  ];

  const handleEditClick = (row) => {
    navigate(`/landingpage/editcustomer-form/${row.id}`);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredRows = customerData.filter((row) =>
    row.name.toLowerCase().includes(searchText.toLowerCase()) &&
    (!filter || row.gstin_number.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div style={{maxHeight: "115vh", overflow: "auto", width: "91%", marginLeft: "50px", marginTop: "20px" }}>
      {/* Button Section */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px"}}>
        <button
          onClick={() => navigate("/landingpage/customermastercreate")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "#fff",
            marginRight: "100px", 
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Create
        </button>
      </div>

      {/* Search & Filter Inputs */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search by Name..."
          value={searchText}
          onChange={handleSearchChange}
          style={{
            padding: "8px",
            width: "200px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <input
          type="text"
          placeholder="Filter by GSTIN..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "8px",
            width: "200px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
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
              fontSize: "14px",
              fontWeight: "bold",
            },
          },
          rows: {
            style: {
              border: "0.4px solid #e0e0e0",
            },
          },
          cells: {
            style: {
              border: "0.4px solid #e0e0e0",
              fontSize: "13px",
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
  );
};

export default CustomerMasterdashboard;
