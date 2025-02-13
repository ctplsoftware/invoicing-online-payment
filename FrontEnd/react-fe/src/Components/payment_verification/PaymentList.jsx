import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API } from "../../API";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CheckCircle, ReceiptLong } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { NavLink } from "react-router-dom";

const PaymentList = () => {
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = new API();
  const navigate = useNavigate();

  const columns = [
    { name: "S No", selector: (row) => row.Sno },
    {
      name: "Order Number",
      cell: (row) => {
        const url =
          row.payment_type === "advance"
            ? `/landingpage/dispatch/advance/${row.id}`
            : `/landingpage/dispatch/credit/${row.id}`;

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
  ];

  const handleQuantityClick = (order_header_id) => {
    navigate(`/landingpage/dispatch/${encodeURIComponent(order_header_id)}`);
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const ordermasterfetch = await api.fetch_ordertransactiondata();
        const partmasterfetch = await api.get_part_master();

        console.log("ordermasterfetch...", ordermasterfetch);

        // Create the fetchedData array by mapping over the ordermasterfetch array
        const fetchedData = ordermasterfetch.map((item, index) => {
          // Find the part from partmasterfetch based on part_id
          const part = partmasterfetch.find((part) => part.id === item.part);

          console.log("part", part); // Debugging the found part

          return {
            id: item.id,
            Sno: index + 1,
            customer_name: item.customer_name,
            status: item.status,
            quantity: item.quantity,
            total_amount: item.total_amount,
            order_number: item.order_number,
            payment_type: item.payment_type,
          };
        });

        console.log("fetchedData...", fetchedData);

        // Set the fetched data into the state
        setRows(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error); // Log the error if fetch fails
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once

  const handleVerify = () => {
    alert("helooo verified");
  };

  const filteredRows = rows.filter((row) => {
    return filter ? row.status.toLowerCase() === filter.toLowerCase() : true;
  });

  const handleEditClick = (row) => {
    //  navigate(`/landingpage/partmaster-edit/${row.id}`);
  };

  return (
    <div style={{ width: '91%', marginLeft: '63px', marginTop: '30px', marginBottom: '10px' }}>
      {/* DataTable */}
      <DataTable
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
              justifyContent: "flex-start", // Align pagination to the left
            },
          },
        }}
      />
    </div>
  );
};

export default PaymentList;
