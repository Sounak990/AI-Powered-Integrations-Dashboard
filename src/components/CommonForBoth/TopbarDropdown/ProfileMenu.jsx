import React, { useState } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import withRouter from "../../Common/withRouter";
import { useSelector, connect } from "react-redux";
import { logoutUser } from "../../../store/actions";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useDispatch } from "react-redux";

const ProfileMenu = (props) => {
  const navigate = useNavigate();
  const username = useSelector(
    (state) => state.login.user?.username || "Admin"
  );
  const dispatch = useDispatch();

  const handleLogout = () => {
    // console.log(
    //   "Logging out user. Current authUser in localStorage:",
    //   localStorage.getItem("authUser")
    // );

    // localStorage.removeItem("authUser"); // Clear token from localStorage
    // console.log(
    //   "authUser removed from localStorage:",
    //   localStorage.getItem("authUser") === null
    // );

    // props.logoutUser(); // Dispatch a logout action
	dispatch(logoutUser());
    navigate("/login"); // Redirect to login page
  };

  return (
    <React.Fragment>
      <DropdownMenuContent className="">
        <DropdownMenuItem
          onClick={() => {
            navigate("/profile");
          }}
          className="flex flex-row items-center gap-2"
        >
          <User />
          <p>Profile</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            handleLogout();
          }}
          className="flex flex-row items-center gap-2"
        >
          <LogOut className="text-red-500" />
          <p>Logout</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withRouter(
  connect(null, { logoutUser })(withTranslation()(ProfileMenu))
);
