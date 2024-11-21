import { useEffect, useState } from "react";
import { API } from '../../API.js';
import { FaEdit } from 'react-icons/fa';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";



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
                if (!params.value) {
                    return 'No update';  
                }
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
        navigate(`/landingpage/editcustomer-form/${row.id}`); 
    };




    return (
        <div>


            <div style={{ width: '91%', marginLeft: '63px', marginTop: '25px' }}>
                <div style={{ marginRight: '48px' }}>
                    <button onClick={() => navigate("/landingpage")}>Customer Create</button>
                </div>
                <DataTable
                    rows={customerData}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableExtendRowFullWidth

                    getRowId={(row) => row.id}
                    sx={{
                        maxWidth: '200vw',
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
        </div>

    )


}

export default CustomerMasterdashboard;
