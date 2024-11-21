import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import { FaEdit } from 'react-icons/fa';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { API } from '../../API';

function PartMasterList() {
    const [pageSize, setPageSize] = useState(5);
    const [searchText, setSearchText] = useState('');
    const [filter, setFilter] = useState('');
    const [rows, setRows] = useState([]); 
    const [loading, setLoading] = useState(true); 

    const api = new API();
    const navigate = useNavigate();

    const columns = [
        { field: 'Sno', headerName: 'S No', width: 70 },
        { field: 'part_description', headerName: 'Part Description', flex: 1 },
        { field: 'status', headerName: 'Status', width: 110 },
        { field: 'unit_price', headerName: 'Unit Price', flex: 1.5 },
        { field: 'uom', headerName: 'UOM (unit of measure)', width: 120 },
        {
            field: 'created_at',
            headerName: 'Created At',
            width: 150,
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
            setLoading(true); 
            try {
                const partmasterfecth = await api.get_part_master();
                console.log("partmasterfecth", partmasterfecth);

                const fetchedata = partmasterfecth.map((item, index) => ({
                    id: item.id, 
                    Sno: index + 1, 
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
            row.part_description.toLowerCase().includes(searchText.toLowerCase()) &&
            (filter ? row.status.toLowerCase() === filter : true)
        );
    });

    const handleEditClick = (row) => {
        navigate(`/landingpage/partmaster-edit/${row.id}`);
    };

    return (
        <div style={{ display: 'contents' }}>
            <div style={{ width: '91%', marginLeft: '63px', marginTop: '25px' }}>

                <div style={{ marginRight: '48px',marginBottom:'-45px' }}>
                    <button onClick={() => navigate("/landingpage/partmaster-form")}>Part Create</button>
                </div>

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

                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
                    autoHeight
                    disableExtendRowFullWidth
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f4f4f4',
                            fontWeight: 'bold',
                        },
                        '& .MuiDataGrid-cell': {
                            padding: '0 10px',
                        },
                    }}
                />
            </div>
        </div>
    );
}

export default PartMasterList;
