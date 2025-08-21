import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";
import { Menu, SquarePlus } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { withTranslation } from "react-i18next";
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "../../store/actions";
import ClientCredentialsForm from "@/components/Integration/Salesforce/ClientCredentialsForm"; // Update the path to where your ClientCredentialsForm is located

const Header = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const username = useSelector((state) => state.login.user?.username);

  function tToggle() {
    var body = document.body;
    if (window.screen.width <= 998) {
      body.classList.toggle("sidebar-enable");
    } else {
      body.classList.toggle("vertical-collpsed");
      body.classList.toggle("sidebar-enable");
    }
  }

  const handleConnect = async (clientId, clientSecret) => {
    // Handle the connection logic here
    console.log("Client ID:", clientId);
    console.log("Client Secret:", clientSecret);
  };

  // Generate initials from username
  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    const initials = nameParts.map(part => part[0]).join("");
    return initials.toUpperCase();
  };

  return (
    <header className="w-full h-[70px] flex flex-row items-center fixed top-0 bg-background z-20 justify-between px-3 shadow-md">
      <div className="w-max h-full flex flex-row items-center">
        <Button
          variant="ghost"
          className="block lg:hidden"
          onClick={() => {
            tToggle();
          }}
        >
          <Menu />
        </Button>
        <div className="flex items-center ml-3">
          <img src="/path/to/logo.png" alt="Logo" className="h-8" />
          <span className="ml-2 text-xl font-bold">App Name</span>
        </div>
      </div>
      <div className="flex items-center">
        {/* <Button
          variant="ghost"
          className="mx-2"
          onClick={() => setDialogOpen(true)}
        >
          <SquarePlus />
        </Button> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="rounded-full h-10 w-10 cursor-pointer flex items-center justify-center bg-gray-300">
              <span className="text-lg font-bold text-gray-700">{getInitials(username)}</span>
            </div>
          </DropdownMenuTrigger>
          <ProfileMenu />
        </DropdownMenu>
      </div>
      <ClientCredentialsForm
        open={dialogOpen}
        setOpen={setDialogOpen}
        onConnect={handleConnect}
        actionButtonText="Connect"
      />
    </header>
  );
};

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
};

const mapStatetoProps = (state) => {
  const { layoutType, showRightSidebar, leftMenu, leftSideBarType } =
    state.Layout;
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header));
