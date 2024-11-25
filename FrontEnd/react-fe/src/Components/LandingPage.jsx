import { Route, Routes } from "react-router-dom";
import Navbar1 from "./Navbar";
import Dashboard from "./Dashboard";
import '../Styles/LandingPage.css'
import CustomerMasterdashboard from "./customer_module/CustomerMasterdashboard.jsx";
import EditCustomerForm from './customer_module/EditCustomerForm.jsx'
import PartMaster from "./partmaster_module/PartMasterForm.jsx";
import PartMasterList from './partmaster_module/PartMasterList.jsx'
import PartMasterEdit from "./partmaster_module/PartMasterEdit.jsx";
import InwardTransactionForm from "./inwardtransaction_module/InwardTransactionForm.jsx";
import InwardTransactionList from "./inwardtransaction_module/InwardTransactionList.jsx";
import InwardTransactionEdit from "./inwardtransaction_module/InwardTransactionEdit.jsx";
import StockReport from "./stock_report/StockReport.jsx";
import Usercreate from "./user_create_module/Usercreate.jsx";
import Userlist from "./user_create_module/Userlist.jsx";
import Useredit from "./user_create_module/Useredit.jsx";
import StockDetails from './stock_report/StockDetails.jsx'

const LandingPage = () => {
    return (
        <div className="landingpage">
            <div id="navbar">
                <Navbar1 />
            </div>
            <div className="components">
                <Routes>
                    <Route path="/*" element={<Dashboard />} />
                    <Route path='/customermasterdashboard' element={<CustomerMasterdashboard />} />
                    <Route path="/editcustomer-form/:id" element={<EditCustomerForm />} />
                    <Route path="/partmaster-form" element={<PartMaster />} />
                    <Route path="/partmaster-fecthList" element={<PartMasterList />} />
                    <Route path="/partmaster-edit/:id" element={<PartMasterEdit />} />
                    <Route path="/inwardtransactionform" element={<InwardTransactionForm/>}/>
                    <Route path="/inwardtransactionlist" element={<InwardTransactionList/>}/>
                    <Route path="/inwardtransactionedit/:id" element={<InwardTransactionEdit/>}/>
                    <Route path="/stockreport" element={<StockReport/>}/>
                    <Route path="/usercreate" element={<Usercreate/>}/>
                    <Route path="/userlist" element={<Userlist/>}/>
                    <Route path="/useredit/:id" element={<Useredit/>}/>
                    <Route path="/stock-part-details/:partname" element={<StockDetails />} />



                </Routes>
            </div>
        </div>
    );
}

export default LandingPage;