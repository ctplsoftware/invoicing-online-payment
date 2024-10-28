import { Route, Routes } from "react-router-dom";
import Navbar1 from "./Navbar";
import Dashboard from "./Dashboard";
import '../Styles/LandingPage.css'
import UserRoleForm from "./UserRoleForm";
import SampleViewForm from "./SampleViewForm";
import EditSampleForm from "./EditSampleForm";

const LandingPage = () => {
    return ( 
        <div className="landingpage">
            <div id="navbar">
            <Navbar1/>
            </div>
            <div className="components">
            <Routes>
                <Route path="/*" element={<Dashboard/>}/>
                <Route path="/sample-form" element={<UserRoleForm/>}/>
                <Route path="/view-form" element={<SampleViewForm/>}/>
                <Route path="/edit-form/:id" element={<EditSampleForm/>}/>
            </Routes>
            </div>
        </div>
     );
}
 
export default LandingPage;