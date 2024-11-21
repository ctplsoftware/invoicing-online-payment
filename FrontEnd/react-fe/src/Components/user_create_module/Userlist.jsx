import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaEdit } from 'react-icons/fa';
import { API } from '../../API';
import DataTable from 'react-data-table-component';


function Userlist() {
    const [pageSize, setPageSize] = useState(5);
    const [searchText, setSearchText] = useState('');
    const [filter, setFilter] = useState('');
    const [rows, setRows] = useState([]); // To store API data
    const [loading, setLoading] = useState(true); // Loading state


    const api = new API();
    const navigate = useNavigate();

    const columns = [
        { field: 'Sno', headerName: 'S No', width: 90 },
        { field: 'username', headerName: 'Username', flex: 0.5 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'groups', headerName: 'Roles', width: 300 },
        { field: 'is_active', headerName: 'Status', flex: 1.5 },
       
         {
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
                const usermasterfecth = await api.fetch_usermasterdata();

                const fetchedata = usermasterfecth.map((item, index) => ({
                    id: item.id, // Unique ID for DataGrid
                    Sno: index + 1, // S.No starting from 1
                    username: item.username,
                    email: item.email,
                    groups: item.groups,
                    is_active :item.is_active?'Active':'Inactive',
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
            row.username.toLowerCase().includes(searchText.toLowerCase()) &&
            (filter ? row.status.toLowerCase() === filter : true)
        );
    });

    const handleEditClick = (row) => {
        navigate(`/landingpage/admincreateedit/${row.id}`);
    };

    return (
        <div style={{ display: 'contents' }}>
            <div style={{ width: '91%', marginLeft: '63px', marginTop: '25px' }}>

                <div style={{ marginRight: '48px',marginBottom:'-45px' }}>
                    <button onClick={() => navigate("/landingpage/admincreate")}>User Create</button>
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

                <DataTable
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

export default Userlist;
