import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { API } from '../../API';
import DataTable from 'react-data-table-component';

function PartMasterList() {
    const [pageSize, setPageSize] = useState(5);
    const [searchText, setSearchText] = useState('');
    const [filter, setFilter] = useState('');
    const [rows, setRows] = useState([]); // To store API data
    const [loading, setLoading] = useState(true); // Loading state

    const api = new API();
    const navigate = useNavigate();

    const columns = [
        { field: 'Sno', headerName: 'S No', width: 70 },
        { field: 'part_description', headerName: 'Part Description', flex: 1 },
        { field: 'status', headerName: 'Status', width: 110 },
        { field: 'unit_price', headerName: 'Unit Price', flex: 1.5 },
        { field: 'uom', headerName: 'UOM (unit of measure)', width: 120 },
        {
            name: 'Created At',
            selector: 'created_at',
           
            width: '150px',
            cell: (row) => {
                const formattedDate = new Date(row.created_at).toLocaleString('en-IN', {
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
        }, {
            field: 'actions',
            headerName: 'Actions',
            width: 80,
            renderCell: (params) => (
                <FaEdit onClick={() => handleEditClick(params.row)} style={{ height: '20px', width: '50px', cursor: 'pointer' }} />
            )
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Start loading
            try {
                const partmasterfecth = await api.get_part_master();
                console.log("partmasterfecth", partmasterfecth);

                const fetchedata = partmasterfecth.map((item, index) => ({
                    id: item.id, // Unique ID for DataGrid
                    Sno: index + 1, // S.No starting from 1
                    part_description: item.part_description,
                    status: item.status,
                    unit_price: item.unit_price,
                    uom: item.uom,
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

        fetchData(); // Call fetchData
    }, []);

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const filteredRows = rows.filter((row) => {
        return (
            row.part_description.toLowerCase().includes(searchText.toLowerCase()) &&
            (filter ? row.status.toLowerCase() === filter : true)
        );
    });

    const handleEditClick = (row) => {
        navigate(`/landingpage/partmaster-edit/${row.id}`);
    };

    return (
        <div style={{ width: '91%', marginLeft: '63px', marginTop: '25px' }}>
            {/* Button to create new Part */}
            <div style={{ marginRight: '48px', marginBottom: '-45px' }}>
                <button
                    onClick={() => navigate("/landingpage/partmaster-form")}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Part Create
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
                title="Part Master List"
                columns={columns}
                rows={filteredRows}
                pagination
                paginationPerPage={pageSize}
                onChangeRowsPerPage={(newPageSize) => {
                    console.log('New Page Size:', newPageSize); // For debugging
                    setPageSize(newPageSize);
                }}
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

export default PartMasterList;
