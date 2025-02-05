import { useEffect, useState } from "react";
import { API } from "../../API.js";
import { FaEdit } from "react-icons/fa";
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
      setLoading(true); // Start loading
      try {
        const customerFetchdata = await api.customermaster_fetch();
        console.log("Fetched customer data:", customerFetchdata);
        const dataWithSNo = customerFetchdata.map((item, index) => ({
          ...item,
          sno: index + 1, // Add serial number
        }));
        setCustomerData(dataWithSNo); // Set fetched data
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, []);

  const columns = [
    { name: "S No", selector: (row) => row.sno, width: "70px" },
    { name: "Name", selector: (row) => row.name, width: "150px" },
    {
      name: "GSTIN Number",
      selector: (row) => row.gstin_number,
      width: "150px",
    },
    {
      name: "Delivery Address",
      selector: (row) => row.delivery_address,
      width: "150px",
    },
    {
      name: "Billing Address",
      selector: (row) => row.billing_address,
      width: "150px",
    },
    {
      name: "Credit Limit",
      selector: (row) => row.credit_limit,
      width: "120px",
    },
    {
      name: "Contact Person",
      selector: (row) => row.contact_person,
      width: "150px",
    },
    {
      name: "Contact Number",
      selector: (row) => row.contact_number,
      width: "150px",
    },
    {
      name: "Created at",
      selector: (row) => row.created_at,
      cell: (row) => {
        const formattedDate = new Date(row.created_at).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Asia/Kolkata",
        });
        return formattedDate;
      },
      width: "180px",
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
      width: "180px",
    },
    {
      name: "Actions",
      selector: (row) => row.id,
      cell: (row) => (
        <FaEdit
          onClick={() => handleEditClick(row)}
          style={{ height: "20px", width: "50px", cursor: "pointer" }}
        />
      ),
      width: "100px",
    },
  ];

  const handleEditClick = (row) => {
    navigate(`/landingpage/editcustomer-form/${row.id}`);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredRows = customerData.filter((row) => {
    return (
      row.name.toLowerCase().includes(searchText.toLowerCase()) &&
      (!filter || row.gstin_number.toLowerCase().includes(filter.toLowerCase()))
    );
  });

  return (
    <div style={{ width: "91%", marginLeft: "63px", marginTop: "25px" }}>
    

      <button
        onClick={() => navigate("/landingpage/customermastercreate")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Create
      </button>

      {/* Search and Filter */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search by Name..."
          value={searchText}
          onChange={handleSearchChange}
          style={{ padding: "8px", width: "200px" }}
        />
        <input
          type="text"
          placeholder="Filter by GSTIN..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "8px", width: "200px" }}
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
  );
};

export default CustomerMasterdashboard;
