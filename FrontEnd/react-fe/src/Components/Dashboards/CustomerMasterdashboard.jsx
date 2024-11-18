import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { API } from '../../API.js';
import { Box } from '@mui/material';
import { FaEdit } from 'react-icons/fa';
import { FaPlus, FaMinus } from 'react-icons/fa';
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

    const handleEditClick = (row) => {
        navigate(`/landingpage/editcustomer-form/${row.id}`); // Ensure this matches your route definition
    };




    return (
        <div>


            <div style={{ width: '91%', marginLeft: '63px', marginTop: '25px' }}>
                <div style={{ marginRight: '48px' }}>
                    <button onClick={() => navigate("/landingpage")}>Customer Create</button>

                </div>
                <DataGrid
                    rows={customerData}
                    columns={columns}
                    pageSize={5} // Set initial page size to 5
                    rowsPerPageOptions={[5, 10, 20]} // Allow customization                    pagination
                    disableExtendRowFullWidth

                    getRowId={(row) => row.id}
                    sx={{
                        maxWidth: '200vw', // Limits the width to 95% of the viewport width
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f4f4f4',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#f4f4f4',
                                cursor: 'default',
                            },
                        },
                        '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-cell': {
                            padding: '0 10px',
                        },
                    }}
                />
            </div>


            {/* <DataGrid
                    rows={customerData}
                    columns={columns}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
                    autoHeight
                    disableExtendRowFullWidth
                    getRowId={(row) => row.id}
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f4f4f4', // Set the background color of column headers
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#f4f4f4', // Prevents hover color change by matching the background
                                cursor: 'default', // Removes pointer cursor on hover
                            },
                        },
                        '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                            outline: 'none', // Removes the focus outline to avoid any hover-like effect
                        },
                        '& .MuiDataGrid-cell': {
                            padding: '0 10px',
                        },
                    }}
                /> */}


        </div>

    )


}

export default CustomerMasterdashboard;
