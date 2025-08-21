import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  fetchUsersByTenant,
  inviteUser,
  fetchInactiveUsers,
} from "../../services/api";
import TabBar from "@/components/gobals/TabBar";
import { userManagementTabs } from "./constants";
import ActiveUsersTab from "./components/ActiveUsersTab";
import InvitationSentTab from "./components/InvitationSentTab";
import { Button } from "@/components/ui/button";
import AddUserDialog from "./components/AddUserDialog";
import { useToast } from "@/components/ui/use-toast";

const AddUser = () => {
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState("");
  const [usersData, setUsersData] = useState([]); // State to hold the user data
  const [invitedUsers, setInvitedUsers] = useState([]); // State to hold the invited user data
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [inactiveUsersError, setInactiveUsersError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState(userManagementTabs[0]);
  const { toast } = useToast();

  const tenantId = useSelector(
    (state) =>
      state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id
  );
  const invitedbyuseremail = useSelector((state) => state.login.user?.email);
  const isadmin = useSelector((state) => state.login.user?.is_admin);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const users = await fetchUsersByTenant(tenantId);
        setUsersData(users); // Corrected to set 'users'
        setInvitedUsers([...invitedUsers, { email, isActive: false }]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchInactive = async () => {
      setLoading(true);
      try {
        const inactiveUsersData = await fetchInactiveUsers(tenantId);
        setInactiveUsers(inactiveUsersData || []);
        setInactiveUsersError(
          inactiveUsersData && inactiveUsersData.length > 0
            ? null
            : "No records found"
        );
      } catch (error) {
        console.error("Error fetching inactive users:", error);
        setInactiveUsers([]); // Clear inactiveUsers data in case of an error
        setInactiveUsersError("Failed to load data. Please try again."); // Set a user-friendly error message
      } finally {
        setLoading(false);
      }
    };

    if (tenantId) {
      fetchUsers();
      fetchInactive();
    }
  }, [tenantId]);

  const toggleModal = () => setModal(!modal);

  const handleEmailChange = (e) => setEmail(e.target.value);

  const emailSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const handleSubmit = async () => {
    try {
      // Validate email
      await emailSchema.validate({ email });

      // Invite user
      const response = await inviteUser(email, tenantId, invitedbyuseremail);
      console.log("User invited successfully", response);
      //   setSuccessMessage("User invitation sent successfully."); // Set the success message
      toast({
        title: "Success",
        variant: "success",
        description: "User invitation sent successfully.",
      });
      setEmail(""); // Clear the email input
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error inviting user:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        toast({
          variant: "destructive",
          title: "Failure",
          description: `Invitation error: ${error.response.data.detail}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failure",
          description: "Failed to invite user due to an unexpected error.",
        });
      }
    }
  };


  return (
    <div className="flex flex-col gap-2 w-full  h-screen overflow-y-auto mt-[70px] font-Gilroy py-3 px-3 bg-background ">
      {/* main heading */}
      <div className="flex flex-row items-center justify-between gap-2">
        {" "}
        <h1 className="font-semibold  text-[32px] leading-[34px]">
          User Management
        </h1>
        <AddUserDialog
          email={email}
          setEmail={handleEmailChange}
          handleSubmit={handleSubmit}
        />
      </div>
      {/* tab bar */}
      <TabBar
        menuList={userManagementTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {userManagementTabs[0] === activeTab && (
        <ActiveUsersTab usersData={usersData} />
      )}

      {userManagementTabs[1] === activeTab && (
        <InvitationSentTab inactiveUsers={inactiveUsers} />
      )}
    </div>
  );
};

export default AddUser;
