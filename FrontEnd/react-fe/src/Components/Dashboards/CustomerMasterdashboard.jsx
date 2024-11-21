import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { API } from "../../API.js";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CustomerMasterdashboard = () => {
    const api = new API();
    const [customerData, setCustomerData] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [additionalAddresses, setAdditionalAddresses] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {

        const fetchData = async () => {


            try {

                const customerFetchdata = await api.customermaster_fetch()
                console.log("customerFetchdata....", customerFetchdata);
                const dataWithSNo = customerFetchdata.map((item, index) => ({
                    ...item,
                    sno: index + 1 
                }));
                setCustomerData(dataWithSNo);



            }
            catch (error) {
                
                console.error("Error fetching customer data:", error);

            }

        }

        fetchData()

    }, [])

    const columns = [
        { field: 'sno', headerName: 'S. No', width: 70 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'gstin_number', headerName: 'GSTIN Number', width: 150 },
        { field: 'delivery_address', headerName: 'Delivery Address', width: 150 },
        { field: 'billing_address', headerName: 'Billing Address', width: 150 },
        { field: 'credit_limit', headerName: 'Credit Limit', width: 120 },
        { field: 'contact_person', headerName: 'Contact Person', width: 150 },
        { field: 'contact_number', headerName: 'Contact Number', width: 150 },
        {
            field: 'created_at',
            headerName: 'Created At',
            width: 180,
            renderCell: (params) => {
                const formattedDate = new Date(params.value).toLocaleString('en-IN', {
                    dateStyle: 'full',
                    timeStyle: 'medium',
                    timeZone: 'Asia/Kolkata'
                });
                return formattedDate;
            }
        },
        {
            field: 'updated_at',
            headerName: 'Updated At',
            width: 140,
            renderCell: (params) => {
                // Check if `updated_at` is null
                if (!params.value) {
                    return 'No update';  // Display "No update" if null
                }
                // Format the date if it is not null
                const formattedDate = new Date(params.value).toLocaleString('en-IN', {
                    dateStyle: 'full',
                    timeStyle: 'medium',
                    timeZone: 'Asia/Kolkata'
                });
                return formattedDate;
            }
        },
        {
            field: 'edit',
            headerName: 'Edit',
            width: 100,
            renderCell: (params) => (
                <FaEdit onClick={() => handleEditClick(params.row)} style={{ height: '20px', width: '50px', cursor: 'pointer' }} />

            ),
        },
    ];

  // Navigate to edit form
  const handleEditClick = (row) => {
    navigate(`/landingpage/editcustomer-form/${row.id}`);
  };

  return (
    <div style={{ width: "100%", padding: "20px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <div style={{ display: "flex", float:'right',marginBottom: "20px" ,marginRight:'7%'}}>
        <button
        className="btn-save"
          onClick={() => navigate("/landingpage")}
          style={{
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create Customer
        </button>
      </div>
      <DataTable
        title="Customer Master"
        columns={columns}
        rows={customerData}
        pagination
        highlightOnHover
        striped
        responsive
        fixedHeader
        fixedHeaderScrollHeight="500px"
        noDataComponent={<div style={{ textAlign: "center", fontSize: "1rem", color: "#888" }}>No data available</div>}  // Custom message for empty data
        customStyles={{
          headCells: {
            style: {
              backgroundColor: "#f9f9f9",
              fontWeight: "bold",
              fontSize: "0.9rem",
            },
          },
          rows: {
            style: {
              fontSize: "0.875rem",
            },
          },
        }}
      />
    </div>
  );
};

export default CustomerMasterdashboard;
