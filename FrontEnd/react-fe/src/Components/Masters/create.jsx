import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../Styles/MasterCreate.css';

export default function MasterCreate() {
  const navigate = useNavigate();

  const fields = [
    { name: "name", label: "Product Name", type: "text", tag: "input" },
    { name: "code", label: "Product Code", type: "text", tag: "input" },
    { name: "address", label: "Address", type: "text", tag: "input" },
    { name: "contact_name", label: "Contact Person", type: "text", tag: "input" },
    { name: "contact_number", label: "Contact Number", type: "tel", tag: "input" },
    { name: "status", label: "Status", type: "select", tag: "select" }, // Updated tag and type for dropdown
  ];

  const [inputValues, setInputValues] = useState({
    name: "",
    code: "",
    address: "",
    contact_name: "",
    contact_number: "",
    status: "Active", // Default to "Active"
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = inputValues;
    console.log(formData, 'formData');
    // Perform API calls or further processing
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2>Product Create</h2>
        </div>
        <form onSubmit={handleSubmit} className="card-body">
          <div className="form-grid">
            {fields.map((field, index) => (
              <div className="form-group" key={index}>
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                </label>
                {field.tag === 'input' ? (
                  <input
                    type={field.type}
                    name={field.name}
                    value={inputValues[field.name] || ""}
                    onChange={handleChange}
                    id={field.name}
                    className="form-input"
                    autoComplete="off"
                  />
                ) : field.tag === 'select' ? (
                  <select
                    name={field.name}
                    value={inputValues[field.name] || ""}
                    onChange={handleChange}
                    id={field.name}
                    className="form-input"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                ) : null}
              </div>
            ))}
          </div>
          <div className="form-buttons">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn-save2"
            >
              Back
            </button>
            <button type="submit" className="btn-save">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
