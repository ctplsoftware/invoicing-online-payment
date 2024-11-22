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
        { name: 'S No', selector: row => row.Sno, width: '70px' },
        { name: 'Part Name', selector: row => row.part_name, flex: 1 },
        { name: 'Unit Price', selector: row => row.unit_price, flex: 1.5 },
        { name: 'UOM (Unit of Measure)', selector: row => row.uom, width: '120px' },
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
                const partmasterfecth = await api.get_part_master();
                console.log("partmasterfecth", partmasterfecth);

                const fetchedata = partmasterfecth.map((item, index) => ({
                    id: item.id,
                    Sno: index + 1,
                    part_name: item.part_name,
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
                data={filteredRows} // Correct prop name
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

export default PartMasterList;
