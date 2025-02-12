import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import DataTable from "react-data-table-component";

import { API } from "../../API";

export default function OrderList() {
  const navigate = useNavigate();
  const api = new API();

  const [data, setData] = useState([]);

  useEffect(() => {
    async function get() {
      const response = await api.fetch_ordertransactiondata();
      console.log(response, "ress");

      setData(response);
    }

    get();
  }, []);

  const columns = [
    { name: "S No", selector: (row, index) => index + 1, width: "70px" },

    {
        name: "Order Number",
        cell: (row) => {
          const url = `/landingpage/cancel-order/${row.id}`;

            return (
            <NavLink
              to={url}
              state={{ order_header_id: row.id }}
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
                fontSize: "17px",
              }}
            >
              {row.order_number}
            </NavLink>
            );

        },
    },
      

    { name: "Customer Name", selector: (row) => row.customer_name },
    { name: "Payment Type", selector: (row) => row.payment_type },
    { name: "Purchase Qty", selector: (row) => row.quantity },
    { name: "Amount", selector: (row) => row.total_amount },
    {
      name: "Status",
      selector: (row) =>
        row.completed_status == 'yes' ? "Completed" : row.completed_status == 'no' ? 'Pending' : 'Cancelled',
    }
    
  ];

  return (
    <>
      <div
        style={{
          width: "51.1%",
          margin: "40px auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* DataTable */}
        <DataTable
          columns={columns}
          data={data}
          pagination
          highlightOnHover
          striped
          responsive
          customStyles={{
            headCells: {
              style: {
                backgroundColor: "#0b5ca0",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#0b5ca0",
                },
              },
              activeSortStyle: {
                "&:hover": {
                  color: "white",
                },
              },
            },
            rows: {
              style: {
                border: "0.4px solid #e0e0e0",
              },
            },
            headCells: {
              style: {
                backgroundColor: "#0b5ca0",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: "bold",
              },
            },
            cells: {
              style: {
                border: "0.4px solid #e0e0e0",
              },
            },
            pagination: {
              style: {
                fontSize: "12px",
                padding: "30px",
                justifyContent: "flex-end", // Align pagination to the left
              },
            },
          }}
        />
      </div>
    </>
  );
}
