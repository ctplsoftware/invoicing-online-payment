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
        { name: 'S No', selector: row => row.Sno, width: '90px' },
        { name: 'Username', selector: row => row.username, flex: 0.5 },
        { name: 'Email', selector: row => row.email, width: '250px' },
        { name: 'Roles', selector: row => row.groups, width: '300px' },
        { name: 'Status', selector: row => row.is_active, flex: 1.5 },
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
            setLoading(true); // Start loading
            try {
                const usermasterfecth = await api.fetch_usermasterdata();

                console.log("usermasterfecth",usermasterfecth);
                

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
            row.username?.toLowerCase().includes(searchText.toLowerCase()) &&
            (filter ? row.is_active?.toLowerCase() === filter : true)
        );
    });

    const handleEditClick = (row) => {
        navigate(`/landingpage/useredit/${row.id}`);
    };

    return (
        <div style={{ display: 'contents' }}>
            <div style={{ width: '91%', marginLeft: '63px', marginTop: '25px' }}>

                <div style={{ marginRight: '48px',marginBottom:'-45px' }}>
                    <button onClick={() => navigate("/landingpage/usercreate")}>User Create</button>
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
                title="User Management List"
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
        </div>
    );
}

export default Userlist;
