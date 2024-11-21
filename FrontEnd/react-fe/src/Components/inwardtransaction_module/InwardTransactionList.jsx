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
        { name: 'Part Description', selector: row => row.part_description, flex: 1 },
        { name: 'Quantity', selector: row => row.quantity, flex: 1.5 },
        { name: 'Remarks', selector: row => row.remarks, width: '120px' },
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
            width: '150px',
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
    ];
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Start loading
            try {
                const inwardtransactionfecth = await api.fetch_inward_transaction();

                const fetchedata = inwardtransactionfecth.map((item, index) => ({
                    id: item.id,
                    Sno: index + 1,
                    part_description: item.part_description,
                    quantity: item.quantity,
                    remarks: item.remarks,
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
            row.part_description.toLowerCase().includes(searchText.toLowerCase()) &&
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
                    Inward Create
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
                title="Inward Transaction List"
                columns={columns}
                data={filteredRows}
                pagination
                paginationPerPage={pageSize}
                onChangeRowsPerPage={(newPageSize) => setPageSize(newPageSize)}
                highlightOnHover
                striped
                responsive
                progressPending={loading} // Show loading indicator
                customStyles={{
                    headCells: {
                        style: {
                            backgroundColor: '#f4f4f4',
                            fontWeight: 'bold',
                        },
                    },
                    rows: {
                        style: {
                            fontSize: '0.875rem',
                        },
                    },
                }}
            />
        </div>
    );
}

export default InwardTransactionList;
