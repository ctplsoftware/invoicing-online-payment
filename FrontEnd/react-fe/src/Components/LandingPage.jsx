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
import CustomerMaster from "./customer_module/CustomerMaster.jsx";
import LocationMaster from "./location_module/LocationMasterForm.jsx";
import LocationMasterList from "./location_module/LocationMasterList.jsx";
import LocationMasterEdit from "./location_module/LocationMasterEdit.jsx";
import CustomerDashboard from "./customer_module/CustomerDashboard.jsx";
import PaymentList from "./payment_verification/PaymentList.jsx";
import PaymentForm from "./payment_verification/PaymentForm.jsx";

const LandingPage = () => {
    return (
        <div className="landingpage">
            <div id="navbar">
                <Navbar1 />
            </div>
            <div className="components">
                <Routes>
                    <Route path="/*" element={<Dashboard />} />
                    <Route path='/customermastercreate' element={<CustomerMaster />} />
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
                    <Route path="/locationmastercreate" element={<LocationMaster />} />
                    <Route path="/locationmasterlist" element={<LocationMasterList />} />
                    <Route path="/locationmasteredit/:id" element={<LocationMasterEdit />} />
                    <Route path="/customerdashboard" element={<CustomerDashboard />} />
                    <Route path="/payment-list" element={<PaymentList />} />
                    <Route path="/payment-form" element={<PaymentForm />} />
                </Routes>
            </div>
        </div>
    );
}

export default LandingPage;