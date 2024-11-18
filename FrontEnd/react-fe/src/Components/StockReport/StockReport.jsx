import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import { FaEdit } from 'react-icons/fa';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { API } from '../../API';



const StockReport = () => {

    const api = new API();
    const navigate = useNavigate();

    const [pageSize, setPageSize] = useState(5);
    const [searchText, setSearchText] = useState('');
    const [filter, setFilter] = useState('');
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { field: 'Sno', headerName: 'S No', width: 70 },
        { field: 'part_description', headerName: 'Part Description', flex: 1 },
        { field: 'quantity', headerName: 'Quantity', flex: 1.5 },

    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const inwardtransactionfetch = await api.fetch_inward_transaction();

                const itemMap = inwardtransactionfetch.reduce((acc, item) => {
                    const normalizedDescription = item.part_description.toLowerCase();

                    if (acc[normalizedDescription]) {
                        acc[normalizedDescription].quantity += item.quantity;
                    } else {
                        acc[normalizedDescription] = {
                            id: item.id,
                            part_description: item.part_description,
                            quantity: item.quantity,

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
            row.part_description.toLowerCase().includes(searchText.toLowerCase()) &&
            (filter ? row.quantity.toLowerCase() === filter : true)
        );
    });






    return (
        <div style={{ display: 'contents' }}>
            <div style={{ width: '91%', marginLeft: '63px', marginTop: '25px' }}>


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

                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
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
    )



}

export default StockReport