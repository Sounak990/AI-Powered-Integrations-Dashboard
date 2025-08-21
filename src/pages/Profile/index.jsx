import React, { useState } from "react";
import { useSelector } from "react-redux";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiChangePassword } from "../../services/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PasswordIcon from "../../assets/images/svg/password-icon.svg";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";

const PasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(1, "New password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // Path of error message
  });

const Profile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const username = useSelector((state) => state.login.user?.username);
  const tenantId = useSelector(
    (state) =>
      state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id
  );
  const [showApiKey, setShowApiKey] = useState(false);

  const userData = useSelector((state) => state.login);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    setSuccessMessage("");
    setErrorMessage("");
    try {
      setChangePasswordLoading(true);
      const response = await apiChangePassword(
        username,
        tenantId,
        values.currentPassword,
        values.newPassword
      );
      console.log(response);
      setSuccessMessage("Password successfully changed!");
      form.reset();
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Error updating password");
    } finally {
      setChangePasswordLoading(false);
    }
  };

  // Generate initials from user's full name
  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return "";
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="flex flex-col gap-3 w-full h-screen overflow-y-auto bg-background mt-[70px] py-3 px-3 font-Gilroy">
      <h1 className="font-semibold text-[32px] ">User Profile</h1>
      <div className="flex flex-col md:flex-row gap-3 w-full h-max">
        {/* user info card */}
        <Card className="!border-none bg-card-color w-full !h-max">
          <CardContent className="bg-card-color flex flex-col h-max !border-none w-full">
            {/* initials avatar and user info */}
            <div className="flex flex-row items-center gap-4">
              <div className="bg-gray-600 w-32 h-32 flex items-center justify-center rounded-full">
                <span className="text-white text-5xl font-bold">
                  {getInitials(userData?.user?.firstName, userData?.user?.lastName)}
                </span>
              </div>
              <div className="flex flex-col  w-full">
                <p className="text-primaryColor text-[32px] font-normal">{`${userData?.user?.firstName} ${userData?.user?.lastName}`}</p>
                <p className="text-mutedtext text-wrap text-sm">
                  {userData?.user?.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-14 w-full mt-4">
              <p className="text-base text-mutedtext">Tenant ID</p>
              <p className="font-semibold text-base">
                {userData?.user?.tenant_id}
              </p>
              <p className="text-base text-mutedtext">Api Key</p>
              <div className="font-semibold text-base flex items-center">
                <p className="mr-2">
                  {showApiKey 
                    ? userData?.user?.api_key 
                    : userData?.user?.api_key?.substring(0, 0) + "......................."}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-0"
                >
                  {showApiKey ? (
                    <EyeOffIcon className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showApiKey ? "Hide API key" : "Show API key"}
                  </span>
                </Button>
              </div>
              <p className="text-base text-mutedtext">Username</p>
              <p className="font-semibold text-base">
                {userData?.user?.username}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="!border-none bg-card-color w-full">
          <CardHeader>
            <CardTitle className="text-left">Change Password</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <CardContent className="bg-card-color flex flex-col gap-9 h-max !border-none w-full">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <img src={PasswordIcon} className=" w-5 h-5 " />
                          </div>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="!pl-10 !pr-10 py-3"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <EyeIcon className="w-5 h-5 text-muted-foreground" />
                              <span className="sr-only">
                                Toggle password visibility
                              </span>
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <img src={PasswordIcon} className=" w-5 h-5 " />
                          </div>
                          <Input
                            {...field}
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            className="!pl-10 !pr-10 py-3"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                            >
                              <EyeIcon className="w-5 h-5 text-muted-foreground" />
                              <span className="sr-only">
                                Toggle password visibility
                              </span>
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <img src={PasswordIcon} className=" w-5 h-5 " />
                          </div>
                          <Input
                            {...field}
                            type={showConfirmNewPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            className="!pl-10 !pr-10 py-3"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setShowConfirmNewPassword(
                                  !showConfirmNewPassword
                                )
                              }
                            >
                              <EyeIcon className="w-5 h-5 text-muted-foreground" />
                              <span className="sr-only">
                                Toggle password visibility
                              </span>
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-row-reverse">
                <Button
                  type="submit"
                  variant="outline"
                  className="!border-primaryColor bg-primaryColor/25 text-primaryColor flex flex-row items-center"
                  disabled={changePasswordLoading}
                >
                  {changePasswordLoading && <Loader className="animate-spin" />}
                  <p>Update Password</p>
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
      {successMessage && (
        <p className="text-green-600 text-center mt-4">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-600 text-center mt-4">{errorMessage}</p>
      )}
    </div>
  );
};

export default Profile;
