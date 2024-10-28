import React from 'react';
import '../Styles/CustomSideNav.css';
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';

const CustomSidenav = ({ appearance, expanded, onExpand, ...navProps }) => {
  const [openKeys, setOpenKeys] = React.useState(['3', '4']);

  const handleOpenChange = (newOpenKeys) => {
    const latestOpenKey = newOpenKeys.find((key) => !openKeys.includes(key));
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  return (
    <div className="sidenav-container">
      <Sidenav
        appearance={appearance}
        expanded={expanded}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        style={{ height: '100%' }} // Ensure Sidenav takes full height
      >
        <div className="sidenav-content">
          <div className="sidenav-body">
            <Sidenav.Body>
              <Nav {...navProps}>
                <Nav.Item eventKey="1" active icon={<DashboardIcon />}>
                  Dashboard
                </Nav.Item>
                <Nav.Item eventKey="2" icon={<GroupIcon />}>
                  User Group
                </Nav.Item>
                <Nav.Menu eventKey="3" title="Title 1" icon={<MagicIcon />}>
                  <Nav.Item eventKey="3-1">Sub-title 1</Nav.Item>
                  <Nav.Item eventKey="3-2">Sub-title 2</Nav.Item>
                  <Nav.Item eventKey="3-3">Sub-title 3</Nav.Item>
                  <Nav.Item eventKey="3-4">Sub-title 4</Nav.Item>
                </Nav.Menu>
                <Nav.Menu eventKey="4" title="Title 2" icon={<GearCircleIcon />}>
                  <Nav.Item eventKey="4-1">Sub-title 1</Nav.Item>
                  <Nav.Item eventKey="4-2">Sub-title 2</Nav.Item>
                  <Nav.Item eventKey="4-3">Sub-title 3</Nav.Item>
                  <Nav.Menu eventKey="4-5" title="Custom Action">
                    <Nav.Item eventKey="4-5-1">Action Name</Nav.Item>
                    <Nav.Item eventKey="4-5-2">Action Params</Nav.Item>
                  </Nav.Menu>
                </Nav.Menu>
              </Nav>
            </Sidenav.Body>
          </div>
          {/* Sidenav.Toggle is now at the bottom */}
          <div className="sidenav-toggle">
            <Sidenav.Toggle onToggle={onExpand} />
          </div>
        </div>
      </Sidenav>
    </div>
  );
};

export default CustomSidenav;
