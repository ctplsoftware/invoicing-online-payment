import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useNavigate, NavLink } from "react-router-dom";
import { API } from '../../API';
import DataTable from 'react-data-table-component';

const StockReport = () => {

    const api = new API();
    const navigate = useNavigate();

    const [pageSize, setPageSize] = useState(5);
    const [searchText, setSearchText] = useState('');
    const [filter, setFilter] = useState('');
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { name: 'S No', selector: (row, index) => index + 1, width: '70px' },

    
        { 
            name: 'Location', 
            cell: row => row.location_master_id__name, 
            flex: 1 
        },
          
        { 
            name: 'Part Name', 
            cell: row => row.part_name, 
            flex: 1.5 
        },



        { name: 'Available Quantity', selector: row => row.total_quantity, flex: 1 },
        
    ];

    const handleQuantityClick = (partName) => {
        console.log('Clicked Part Name:', partName);
        // Navigate to another page or perform an API call with the partName
        navigate(`/landingpage/stock-part-details/${encodeURIComponent(partName)}`);
    };


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const inwardtransactionfetch = await api.fetch_inward_transaction();
                setRows(inwardtransactionfetch);
                console.log(inwardtransactionfetch, 'checkkk');
                

               
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
            (filter ? row.total_inward_quantity.toLowerCase() === filter : true) &&
            (filter ? row.locationmaster_id__name.toLowerCase() === filter : true)
        );
    });





    return (
        <div style={{ width: '91%', marginLeft: '63px', marginTop: '25px' }}>
            {/* Search bar */}
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
                            justifyContent: 'flex-start', // Align pagination to the left
                        },
                    },
                }}
            />
        </div>
    );
};

export default StockReport;
