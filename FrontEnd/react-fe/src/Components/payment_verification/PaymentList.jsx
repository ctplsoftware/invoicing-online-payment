
import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { API } from '../../API';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CheckCircle, ReceiptLong } from '@mui/icons-material';
import { IconButton } from '@mui/material';


const PaymentList = () => {

    const [pageSize, setPageSize] = useState(5);
    const [searchText, setSearchText] = useState('');
    const [filter, setFilter] = useState('');
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const api = new API();
    const navigate = useNavigate();


    const columns = [
        { name: 'S No', selector: row => row.Sno, width: '70px' },
        { name: 'Order Number', selector: row => row.order_no, width: '160px' },
        { name: 'Customer Name', selector: row => row.customer_name, width: '165px' },
        { name: 'Part Name', selector: row => row.part_name, width: '130px' },
        { name: 'Purchase Qty', selector: row => row.quantity, width: '160px' },
        { name: 'Amount', selector: row => row.total_amount, width: '185px' },
        { name: 'Payment Status', selector: row => row.status, width: '185px' },

    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const ordermasterfetch = await api.fetch_ordertransactiondata();
                const partmasterfetch = await api.get_part_master();

                const partLookup = partmasterfetch.reduce((lookup, part) => {
                    lookup[part.part_id] = part.part_name;
                    return lookup;
                }, {});
                
                const fetchedData = ordermasterfetch.map((item, index) => ({
                    id: item.id,
                    Sno: index + 1,
                    customer_name:item.customer_name,
                    status :item.status,
                    quantity:item.quantity,
                    total_amount:item.total_amount,
                    order_no:item.order_no,
                    part_name: partLookup[item.part_id] || "Unknown Part",

                   
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

    const handleVerify = () => {
        alert("helooo verified")
    }

    const filteredRows = rows.filter((row) => {
        return filter ? row.status.toLowerCase() === filter.toLowerCase() : true;
    });
    

    const handleEditClick = (row) => {
        //  navigate(`/landingpage/partmaster-edit/${row.id}`);
    };



    return (

        <div style={{ width: '62%', margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ justifyContent: 'flex-end', marginBottom: '10px' ,marginRight:'59px' }}>
                <button
                    onClick={() => navigate("/landingpage/payment-form")}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Create Payeer
                </button>
            </div>

            {/* DataTable */}
            <DataTable
                title="Payment Master List"
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
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: "#0b5ca0",
                            },
                        },
                        activeSortStyle: {
                            '&:hover': {
                                color: 'white',
                            },
                        },
                    },
                    rows: {
                        style: {
                            border: '0.4px solid #e0e0e0',
                        },
                    },
                    headCells: {
                        style: {
                            backgroundColor: "#0b5ca0",
                            color: '#ffffff', fontSize: '15px',
                            fontWeight: 'bold'
                        },
                    },
                    cells: {
                        style: {
                            border: '0.4px solid #e0e0e0',
                        },
                    },
                    pagination: {
                        style: {
                            fontSize: '12px',
                            padding: '30px',
                            justifyContent: 'flex-end', // Align pagination to the left
                        },
                    },
                }}
            />
        </div>
    )

}

export default PaymentList