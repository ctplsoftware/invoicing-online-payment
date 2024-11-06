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
                    sno: index + 1 // Add serial number starting from 1
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
        { field: 'created_at', headerName: 'Created At', width: 180 },
        { field: 'updated_at', headerName: 'Updated At', width: 180 },
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

            <h1>Customer Master Dashboard</h1>

            <div> 

                <DataGrid
                    rows={customerData}
                    columns={columns}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
                    autoHeight
                    disableExtendRowFullWidth
                    getRowId={(row) => row.id}
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f4f4f4',
                            fontWeight: 'bold',
                        },
                        '& .MuiDataGrid-cell': {
                            padding: '0 10px',
                        },
                    }}
                />

            </div>

        </div>

    )


}

export default CustomerMasterdashboard;
