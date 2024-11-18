import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './Components/Loginpage';
import LandingPage from './Components/LandingPage';
import ProtectPage from './Components/ProtectPage';
import CustomerMasterdashboard from './Components/Dashboards/CustomerMasterdashboard';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/landingpage/*" element={<ProtectPage Child={LandingPage} />} />
            <Route path="/customermasterdashboard" element={<CustomerMasterdashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
