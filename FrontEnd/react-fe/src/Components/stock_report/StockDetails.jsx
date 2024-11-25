import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { API } from '../../API';
import { useNavigate } from "react-router-dom";


const StockDetails = () => {
    const { partname } = useParams(); // Get part_name from the URL
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const api = new API();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching details for part:", partname);
                const inwardTransactionFetch = await api.fetch_inward_transaction();

                // Filter data for the specific part_name
                const filteredData = inwardTransactionFetch.filter(
                    item => item.part_name.toLowerCase() === partname.toLowerCase()
                );

                // Add unique id property for DataGrid
                const formattedData = filteredData.map((item, index) => ({
                    id: index + 1, // Ensure unique ID for DataGrid rows
                    ...item,
                }));

                setRows(formattedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [partname]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'part_name', headerName: 'Part Name', width: 150 },
        { field: 'inward_quantity', headerName: 'Quantity', width: 150 },
        { field: 'uom', headerName: 'UOM', width: 100 },
        { field: 'comments', headerName: 'Comments', width: 200 },
        { field: 'inward_date', headerName: 'Inward Date', width: 200 },
        { field: 'inward_by', headerName: 'Inward By', width: 150 },

    ];

    return (
        <div style={{ height: 268, width: '60%', marginLeft: '278px', marginTop: '29px' }}>
            <h6 style={{ marginRight: '822px' }}><b>Details for Part :</b> {decodeURIComponent(partname)}</h6>
            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                disableSelectionOnClick
                hideFooter
            />

            <span style={{marginRight:'92px'}}>
                <button
                    onClick={() => navigate("/landingpage/stockreport")}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Back
                </button>
            </span>


        </div>
    );
};

export default StockDetails;
