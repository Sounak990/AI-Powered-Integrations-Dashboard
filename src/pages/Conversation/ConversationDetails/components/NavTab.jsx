import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

const NavTabs = ({ activeTab, toggleTab }) => (
  <Nav pills className="navtab-bg nav-justified">
    <NavItem>
      <NavLink className={classnames({ active: activeTab === "5" })} onClick={() => toggleTab("5")}>
        Summary
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink className={classnames({ active: activeTab === "6" })} onClick={() => toggleTab("6")}>
        Questions
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink className={classnames({ active: activeTab === "7" })} onClick={() => toggleTab("7")}>
        Objections
      </NavLink>
    </NavItem>
  </Nav>
);

export default NavTabs;
