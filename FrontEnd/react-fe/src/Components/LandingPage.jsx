import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar1 from "./Navbar";
import '../Styles/LandingPage.css'
import CustomerMasterdashboard from "./customer_module/CustomerMasterList.jsx";
import EditCustomerForm from './customer_module/CustomerMasterEdit.jsx'
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
import CustomerMaster from "./customer_module/CustomerMasterForm.jsx";
import LocationMaster from "./location_module/LocationMasterForm.jsx";
import LocationMasterList from "./location_module/LocationMasterList.jsx";
import LocationMasterEdit from "./location_module/LocationMasterEdit.jsx";
import CustomerDashboard from "./customer_module/CustomerDashboard.jsx";
import PaymentList from "./payment_verification/PaymentList.jsx";
import PaymentView from "./payment_verification/PaymentView.jsx";
import DispatchDashboard from "./payment_verification/DispatchDashboard.jsx";
import EInvoice from "./payment_verification/EInvoice.jsx";
import Invoice from "./payment_verification/Invoice.jsx";
import OrderReport from "./reports/OrderReport.jsx";
import EInvoiceReport from "./reports/EInvoiceReport.jsx";
import { LocationSearching } from "@mui/icons-material";

const LandingPage = () => {

    
    const location = useLocation();
    const excludedPaths = ["/landingpage/einvoice-print"];

    const routeTitles = {
        '/landingpage': 'Chakravarthy Commercials',
        '/landingpage/customermastercreate': 'Create Customer ',
        '/landingpage/customermasterdashboard': 'Customer Master',
        '/landingpage/editcustomer-form/': 'Edit Customer',
        '/landingpage/partmaster-form': 'Create Part',
        '/landingpage/partmaster-fecthList': 'Part Master',
        '/landingpage/partmaster-edit/': 'Edit Part',
        '/landingpage/inwardtransactionform': 'Create Inward Transaction',
        '/landingpage/inwardtransactionlist': 'Inward Transaction',
        '/landingpage/inwardtransactionedit/': 'Edit Inward Transaction',
        '/landingpage/stockreport': 'Stock Report',
        '/landingpage/usercreate': 'Create User',
        '/landingpage/userlist': 'User Master',
        '/landingpage/useredit/': 'Edit User',
        '/landingpage/stock-part-details/': 'Detailed Stock Report',
        '/landingpage/locationmastercreate': 'Create Location',
        '/landingpage/locationmasterlist': 'Location Master',
        '/landingpage/locationmasteredit/': 'Edit Location',
        '/landingpage/customerdashboard': 'Customer Dashboard',
        '/landingpage/payment-list': 'Order Transaction',
        '/landingpage/payment-view/:order_no': 'Payment View',
        '/landingpage/dispatch/': 'Order Transaction - Verify/Dispatch/Generate',
        '/landingpage/generate-einvoice/': 'Generate E-Invoice',
        '/landingpage/order-reports': 'Order Reports',
        '/landingpage/einvoice-reports': 'E-Invoice Reports',
    };

    const getRouteTitle = (pathname) => {
        const sortedPaths = Object.keys(routeTitles).sort((a, b) => b.length - a.length);
    
        for (let path of sortedPaths) {
            if (pathname.startsWith(path)) {
                return routeTitles[path]; 
            }
        }
        return 'Default Title';
    };

    const currentTitle = getRouteTitle(location.pathname);
    

    return (
        <div className="landingpage">
             {!excludedPaths.includes(location.pathname) && (
                <div id="navbar">
                    <Navbar1 title = {currentTitle} />
                </div>
            )}

            
            <div className="components" style={{maxHeight: "115vh", overflow: "auto"}}>
                <Routes>
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
                    <Route path="/payment-view/:order_no" element={<PaymentView />} />
                    <Route path="/dispatch/:order_header_id" element={<DispatchDashboard />} />
                    <Route path="/generate-einvoice/:id" element={<EInvoice />} />
                    <Route path="/einvoice-print" element={<Invoice />} />
                    <Route path="/order-reports" element={<OrderReport />} />
                    <Route path="/einvoice-reports" element={<EInvoiceReport />} />

                    
                </Routes>
            </div>
        </div>
    );
}

export default LandingPage;