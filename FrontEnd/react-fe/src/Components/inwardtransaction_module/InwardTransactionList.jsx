import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { API } from '../../API';
import DataTable from 'react-data-table-component';

function InwardTransactionList() {
    const [pageSize, setPageSize] = useState(5);
    const [searchText, setSearchText] = useState('');
    const [filter, setFilter] = useState('');
    const [rows, setRows] = useState([]); 
    const [loading, setLoading] = useState(true); 

    const api = new API();
    const navigate = useNavigate();

    const columns = [
        { name: 'S No', selector: row => row.Sno, width: '70px' },
        { name: 'Part Name', selector: row => row.part_name, flex: 1 },
        { name: 'Inward Quantity', selector: row => row.inward_quantity, flex: 1.5 },
        { name: 'UOM (unit of measure) ', selector: row => row.uom , width: '220px' },
        { name: 'comments ', selector: row => row.comments , width: '320px' },
        {
            name: 'Inward Date',
            selector: row => row.inward_date,
            cell: row => {
                const formattedDate = new Date(row.inward_date).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    timeZone: 'Asia/Kolkata',
                });
                return formattedDate;
            },
            width: '180px',
        },
        { name: 'Inward By ', selector: row => row.inward_by , width: '120px' },
        

        
    ];
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Start loading
            try {
                const inwardtransactionfecth = await api.get_inward_transaction();

                const fetchedata = inwardtransactionfecth.map((item, index) => ({
                    id: item.id,
                    Sno: index + 1,
                    part_name: item.part_name,
                    inward_quantity: item.inward_quantity,
                    comments : item.comments ,
                    uom :item.uom,
                    inward_by:item.inward_by,
                    inward_date:item.inward_date,
                    created_at: item.created_at,
                    updated_at: item.updated_at,
                }));
                setRows(fetchedata);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); // Stop loading
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
            (filter ? row.quantity.toLowerCase() === filter : true)
        );
    });

    const handleEditClick = (row) => {
        navigate(`/landingpage/inwardtransactionedit/${row.id}`);
    };

    return (

        





        <div style={{ width: '91%', marginLeft: '63px', marginTop: '25px' }}>
            {/* Button to create new Inward Transaction */}
            <div style={{ marginRight: '48px', marginBottom: '-45px' }}>
                <button
                    onClick={() => navigate("/landingpage/inwardtransactionform")}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Create
                </button>
            </div>

            {/* Search and Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchText}
                        onChange={handleSearchChange}
                        style={{ width: 'auto', marginBottom: 10 }}
                    />
                </div>
            </div>

            {/* DataTable for displaying rows */}
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
                            padding: '10px',
                            justifyContent: 'flex-end', // Align pagination to the left
                        },
                    },
                }}
            />
        </div>
    );
}

export default InwardTransactionList;
