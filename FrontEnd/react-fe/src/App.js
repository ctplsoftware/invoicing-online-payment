import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './Components/Loginpage';
// import CustomSidenav from './Components/CustomSideNav'
import LandingPage from './Components/LandingPage';
import ProtectPage from './Components/ProtectPage';


function App() {
  // const [expanded, setExpand] = React.useState(true);
  // const [activeKey, setActiveKey] = React.useState('1');
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/landingpage/*" element={<ProtectPage Child={LandingPage}/>}/>
        <Route path='/' element={<LoginPage/>}/>
        {/* <Route path='/navbar' element={<CustomSidenav
        activeKey={activeKey}
        onSelect={setActiveKey}
        expanded={expanded}
        onExpand={setExpand}
        appearance="inverse"/>}/> */}
      </Routes> 
      </BrowserRouter>
    </div>
  );
}

export default App;
