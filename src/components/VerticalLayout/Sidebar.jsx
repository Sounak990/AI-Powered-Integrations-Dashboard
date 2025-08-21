import React from "react";
import { Link } from "react-router-dom";
import SidebarContent from "./SidebarContent";
import ChainwideLogo from "../../assets/images/chainwide/logo-dark.png";

const Sidebar = (props) => {
  return (
    <React.Fragment>
      <div className="vertical-menu !bg-card-color">
        <div className="navbar-brand-box !bg-card-color !w-[300px]">
          <Link to="/home" className="logo logo-light mt-4 mx-auto">
            <img src={ChainwideLogo} className="w-max h-max mx-auto" />
          </Link>
        </div>
        <div data-simplebar className="h-100 px-3 ">
          <SidebarContent />
          
        </div>
        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
