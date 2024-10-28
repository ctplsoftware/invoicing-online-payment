import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/UserRoleForm.css';  // Import the CSS file

const UserRoleForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [date, setDate] = useState("");
    const [age, setAge] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        const savedRole = localStorage.getItem('selectedRole');
        setRole(savedRole || '');
    }, []);

    const save_details = (e) => {
        e.preventDefault();
        const data = { name, email, date, age };
        axios.post("http://localhost:8000/api/sample-forms/create/", data)
            .then((res) => {
                console.log(res.data);
                alert("Data has been saved successfully!");
            })
            .catch((err) => {
                console.log(err);
                alert("Couldn't save data!");
            });
    };

    return (
        <div className="taskform">
            <h2>Sample Form</h2>
            <h5>Selected Role: {role}</h5>

            <form onSubmit={save_details}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type="text"
                        placeholder='Enter your name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date">D-O-B:</label>
                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="age">Age:</label>
                    <input
                        id="age"
                        type="number"
                        placeholder='Enter your Age'
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default UserRoleForm;
