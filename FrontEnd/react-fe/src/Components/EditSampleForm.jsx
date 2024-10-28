import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../Styles/EditSampleForm.css'; // Import the CSS file

const EditSampleForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [date, setDate] = useState("");
    const [age, setAge] = useState("");

    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:8000/api/sample-forms/detail/${id}/`)
            .then((res) => {
                setName(res.data.name);
                setEmail(res.data.email);
                setDate(res.data.date);
                setAge(res.data.age);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id]);

    const edit_details = (e) => {
        e.preventDefault();
        const data = { name, email, date, age };
        axios.put(`http://localhost:8000/api/sample-forms/update/${id}/`, data)
            .then((res) => {
                alert("Data has been saved successfully!");
            })
            .catch((err) => {
                console.error(err);
                alert("Couldn't save data.");
            });
    };

    return (
        <div className="taskform">
            <h2>Update Form</h2>
            <h5>Update the details and submit</h5>
            <form onSubmit={edit_details}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date">D-O-B:</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="age">Age:</label>
                    <input
                        type="number"
                        id="age"
                        placeholder="Enter your age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default EditSampleForm;
