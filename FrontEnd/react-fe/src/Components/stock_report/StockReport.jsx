import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
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
        { name: 'S No', selector: row => row.Sno, width: '70px' },
        { name: 'Part Name', selector: row => row.part_name, flex: 1 },
        { 
            name: 'Current Stock', 
            cell: row => (
                <span 
                    style={{
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    }} 
                    onClick={() => handleQuantityClick(row.part_name)}
                >
                    {row.inward_quantity}
                </span>
            ), 
            flex: 1.5 
        },
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

                const itemMap = inwardtransactionfetch.reduce((acc, item) => {
                    const normalizedDescription = item.part_name.toLowerCase();

                    if (acc[normalizedDescription]) {
                        acc[normalizedDescription].inward_quantity += item.inward_quantity;
                    } else {
                        acc[normalizedDescription] = {
                            id: item.id,
                            part_name: item.part_name,
                            inward_quantity: item.inward_quantity,
                        };
                    }
                    return acc;
                }, {});

                const fetchedData = Object.values(itemMap).map((item, index) => ({
                    Sno: index + 1,
                    ...item,
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

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const filteredRows = rows.filter((row) => {
        return (
            row.part_name.toLowerCase().includes(searchText.toLowerCase()) &&
            (filter ? row.inward_quantity.toLowerCase() === filter : true)
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
                title="Stock Report"
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
};

export default StockReport;
