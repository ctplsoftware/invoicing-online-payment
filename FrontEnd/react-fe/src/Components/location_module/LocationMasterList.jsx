import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { API } from '../../API';
import DataTable from 'react-data-table-component';

function LocationMasterList() {
    const [pageSize, setPageSize] = useState(5);
    const [searchText, setSearchText] = useState('');
    const [filter, setFilter] = useState('');
    const [rows, setRows] = useState([]); // To store API data
    const [loading, setLoading] = useState(true); // Loading state

    const api = new API();
    const navigate = useNavigate();

    const columns = [
        { name: 'S No', selector: row => row.Sno, width: '70px' },
        { name: 'Name', selector: row => row.name, flex: 1 },
        { name: 'Location Address', selector: row => row.location_address, flex: 1.5 },
        { name: 'Status', selector: row => row.status, width: '110px' },

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
        {
            name: 'Actions',
            selector: row => row.id,
            cell: row => (
                <FaEdit
                    onClick={() => handleEditClick(row)}
                    style={{ height: '20px', width: '50px', cursor: 'pointer' }}
                />
            ),
            width: '80px',
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const locationmasterfecth = await api.fetch_locationmasterdata();
                console.log("afafafaf",locationmasterfecth);
                

                const fetchedata = locationmasterfecth.map((item, index) => ({
                    id: item.id,
                    Sno: index + 1,
                    name: item.name,
                    status: item.status,
                    location_address: item.location_address,
                    created_at: item.created_at,
                    updated_at: item.updated_at,
                }));
                setRows(fetchedata);
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
            row.name.toLowerCase().includes(searchText.toLowerCase()) &&
            (filter ? row.status.toLowerCase() === filter : true)
        );
    });

    const handleEditClick = (row) => {
        navigate(`/landingpage/locationmasteredit/${row.id}`);
    };

    return (
        <div style={{ width: '91%', marginLeft: '63px', marginTop: '25px' }}>
            {/* Button to create new Part */}
            <div style={{ marginRight: '48px', marginBottom: '-45px' }}>
                <button
                    onClick={() => navigate("/landingpage/locationmastercreate")}
                   className='btn-save'
                >
                    Location Create
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
                <div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ marginBottom: 10 }}
                    >
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* DataTable for displaying rows */}
            <DataTable
                title="Stock Report"
                columns={columns}
                loading={loading}
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

export default LocationMasterList;
