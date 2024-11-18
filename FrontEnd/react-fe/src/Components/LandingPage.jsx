import { Route, Routes } from "react-router-dom";
import Navbar1 from "./Navbar";
import Dashboard from "./Dashboard";
import '../Styles/LandingPage.css'
import UserRoleForm from "./UserRoleForm";
import SampleViewForm from "./SampleViewForm";
import EditSampleForm from "./EditSampleForm";
import CustomerMasterdashboard from "./Dashboards/CustomerMasterdashboard";
import EditCustomerForm from '../Components/CustomerMasterEdit/EditCustomerForm.jsx'
import PartMaster from "../Components/PartMaster/PartMasterForm.jsx";
import PartMasterList from '../Components/PartMaster/PartMasterList.jsx'
import PartMasterEdit from "../Components/PartMaster/PartMasterEdit.jsx";
import InwardTransactionForm from "./InwardTransaction/InwardTransactionForm.jsx";
import InwardTransactionList from "./InwardTransaction/InwardTransactionList.jsx";
import InwardTransactionEdit from "./InwardTransaction/InwardTransactionEdit.jsx";
import StockReport from "./StockReport/StockReport.jsx";
import Admincreate from "./AdminCreate/Admincreate.jsx";

const LandingPage = () => {
    return (
        <div className="landingpage">
            <div id="navbar">
                <Navbar1 />
            </div>
            <div className="components">
                <Routes>
                    <Route path="/*" element={<Dashboard />} />
                    <Route path="/sample-form" element={<UserRoleForm />} />
                    <Route path="/view-form" element={<SampleViewForm />} />
                    <Route path="/edit-form/:id" element={<EditSampleForm />} />
                    <Route path='/customermasterdashboard' element={<CustomerMasterdashboard />} />
                    <Route path="/editcustomer-form/:id" element={<EditCustomerForm />} />
                    <Route path="/partmaster-form" element={<PartMaster />} />
                    <Route path="/partmaster-fecthList" element={<PartMasterList />} />
                    <Route path="/partmaster-edit/:id" element={<PartMasterEdit />} />
                    <Route path="/inwardtransactionform" element={<InwardTransactionForm/>}/>
                    <Route path="/inwardtransactionlist" element={<InwardTransactionList/>}/>
                    <Route path="/inwardtransactionedit/:id" element={<InwardTransactionEdit/>}/>
                    <Route path="/stockreport" element={<StockReport/>}/>
                    <Route path="/admincreate" element={<Admincreate/>}/>
                </Routes>
            </div>
        </div>
    );
}

export default LandingPage;