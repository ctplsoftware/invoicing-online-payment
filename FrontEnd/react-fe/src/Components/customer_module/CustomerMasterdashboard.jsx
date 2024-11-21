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
        { name: 'S No', selector: row => row.sno, width: '70px' },
        { name: 'Name', selector: row => row.name, width: '150px' },
        { name: 'GSTIN Number', selector: row => row.gstin_number, width: '150px' },
        { name: 'Delivery Address', selector: row => row.delivery_address, width: '150px' },
        { name: 'Billing Address', selector: row => row.billing_address, width: '150px' },
        { name: 'Credit Limit', selector: row => row.credit_limit, width: '120px' },
        { name: 'Contact Person', selector: row => row.contact_person, width: '150px' },
        { name: 'Contact Number', selector: row => row.contact_number, width: '150px' },
        {
            name: 'Created At',
            selector: row => row.created_at,
            cell: row => {
                const formattedDate = new Date(row.created_at).toLocaleString('en-IN', {
                    dateStyle: 'full',
                    timeStyle: 'medium',
                    timeZone: 'Asia/Kolkata',
                });
                return formattedDate;
            },
            width: '180px',
        },
        {
            name: 'Updated At',
            selector: row => row.updated_at,
            cell: row => {
                if (!row.updated_at) {
                    return 'No update';
                }
                const formattedDate = new Date(row.updated_at).toLocaleString('en-IN', {
                    dateStyle: 'full',
                    timeStyle: 'medium',
                    timeZone: 'Asia/Kolkata',
                });
                return formattedDate;
            },
            width: '140px',
        },
        {
            name: 'Actions',
            selector: row => row.id,
            cell: row => (
                <FaEdit
                    onClick={() => handleEditClick(row)}
                    style={{ height: '20px', width: '50px', cursor: 'pointer' }}
                />
            ),
            width: '100px',
        },
    ];
    
    const handleEditClick = (row) => {
        navigate(`/landingpage/editcustomer-form/${row.id}`); 
    };




    return (
        <div>


            <div style={{ width: '91%', marginLeft: '63px', marginTop: '25px' }}>
                <div style={{ marginRight: '5%',marginBottom:'1%' }}>
                    <button className="btn-save" onClick={() => navigate("/landingpage")}>Customer Create</button>
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
