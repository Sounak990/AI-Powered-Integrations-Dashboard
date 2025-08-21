import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
// Formik Validation

// action
import { registerUser, apiError } from "../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import MailIcon from "../assets/images/svg/mail-icon.svg";
import PassowrdIcon from "../assets/images/svg/password-icon.svg";

// import images
import LoginImage from "../assets/images/svg/auth-background.svg";
import ChainwideLogo from "../assets/images/chainwide/logo-dark.png";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Copyright, Loader, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ArrowLeft from "../assets/images/svg/arrow-left.svg";
import { useToast } from "@/components/ui/use-toast";

const signupSchema = z
	.object({
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		username: z.string().min(1, "User name is required"),
		email: z.string().email("Please enter a valid email"),
		password: z.string().min(1, "Password is required"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords must match",
		path: ["confirmPassword"], // Path of error message
	});

const Register = (props) => {
	document.title = "Register | Chainwide- Future of Sales";

	const [page, setPage] = useState(1);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const form = useForm({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = (values) => {
		console.log("Form values:", values);
		dispatch(registerUser(values));
	};

	const login = useSelector(
		(state) =>
			state.login
	)

	const { user, registrationError, loading } = useSelector((state) => ({
		user: state.Account.user,
		registrationError: state.Account.registrationError,
		loading: state.Account.loading,
	}));

	const { toast } = useToast();

	useEffect(() => {
		dispatch(apiError(""));
	}, []);

	useEffect(() => {
		if (user && !loading && !registrationError) {
			navigate("/auth-email-verification");
		}
	}, [user, loading, registrationError, navigate]);

	useEffect(() => {
		if (registrationError) {
			toast({
				variant: "destructive",
				title: "Failure",
				description: registrationError,
			});
		}
	}, [registrationError]);

	useEffect(() => {
		if (user) {
			toast({
				variant: "success",
				title: "Signup Success",
			});
		}
	}, [user]);

	useEffect(() => {
		if (login.user?.tenant_id) {
			navigate(login.hasOnboarded ? "/home" : '/onboarding');
		}
	}, [login]);

	return (
		<div className="w-screen h-screen flex flex-row">
			<div className="w-full hidden lg:block relative">
				<img
					src={LoginImage}
					className="w-full h-full object-cover"
					alt="Login"
				/>

				<img
					src={ChainwideLogo}
					className="w-64 absolute bottom-[50%] left-1/2 transform -translate-x-1/2 "
					alt="Chainwide logo"
				/>

				<div className="absolute bottom-[8%] left-1/2 transform -translate-x-1/2  flex flex-row items-center gap-3">
					<Copyright />
					<p className=" text-base">2024 Chainwide</p>
				</div>

				<p className="absolute bottom-[47%] left-[50%] transform -translate-x-1/2 text-nowrap">
					Multitenant Integration
				</p>
			</div>
			<div className="w-full h-full flex flex-col py-20 items-center justify-center">
				<div className="max-w-[85%] sm:max-w-[75%] w-full h-full py-3 sm:py-10 flex flex-col">
					<div className="w-full h-max flex flex-row items-center gap-1">
						{page === 2 && (
							<Button
								variant="ghost"
								type="button"
								className="bg-primaryColor/25  !py-2 !px-3"
								onClick={() => setPage(1)}
							>
								<img src={ArrowLeft} className="h-5 w-5" />
							</Button>
						)}
						<h1 className="font-semibold text-[32px] leading-[39.2px] text-left w-full">
							Sign Up
						</h1>
					</div>
					<p className="text-base leading-[19px] my-4 font-light">
						Your AI Middleware. Integrate it and get the response.
					</p>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col gap-3 w-full h-full mt-9 justify-between"
							autoComplete="off"
						>
							<>
								<div
									className={`${page === 1 ? "flex " : "hidden "
										} flex-col gap-3 w-full`}
								>
									<div className="flex flex-row items-center gap-3 w-full">
										{/* first name */}
										<FormField
											control={form.control}
											name="firstName"
											render={({ field }) => (
												<FormItem className="w-full">
													<FormLabel>First Name</FormLabel>
													<FormControl>
														<Input
															{...field}
															type="text"
															className="w-full !px-2 py-3 h-11 text-sm "
															autoComplete="off"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										{/* last name */}
										<FormField
											control={form.control}
											name="lastName"
											render={({ field }) => (
												<FormItem className="w-full">
													<FormLabel>Last Name</FormLabel>
													<FormControl>
														<Input
															{...field}
															type="text"
															className="w-full !px-2 py-3 h-11 text-sm "
															autoComplete="off"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									{/* username */}
									<FormField
										control={form.control}
										name="username"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Username</FormLabel>
												<FormControl>
													<Input
														{...field}
														type="text"
														className="w-full !px-2 py-3 h-11 text-sm rounded-md border border-input bg-background focus:border-primary focus:outline-none"
														autoComplete="off"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<Button
									className={`bg-primaryColor text-white w-full mt-6 ${page === 1 ? "block " : "hidden "
										}`}
									onClick={() => setPage(2)}
									type="button"
								>
									Next
								</Button>
							</>

							<>
								<div
									className={`${page === 2 ? "flex " : "hidden "
										}flex flex-col gap-3 w-full h-max`}
								>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<div className="relative flex items-center w-full">
														<img
															src={MailIcon}
															className="absolute left-4 w-5 h-5 text-muted-foreground"
														/>
														<Input
															{...field}
															type="email"
															placeholder="Enter your Email"
															className="w-full !pl-12 pr-4 py-3 h-11 text-sm rounded-md border border-input bg-background focus:border-primary focus:outline-none"
															autoComplete="off"
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<div className="relative flex items-center w-full">
														<img
															src={PassowrdIcon}
															className="absolute left-4 w-5 h-5 text-muted-foreground"
														/>
														<Input
															{...field}
															type="password"
															placeholder="Enter your Password"
															className="w-full !pl-12 pr-4 py-3 h-11 text-sm rounded-md border border-input bg-background focus:border-primary focus:outline-none"
															autoComplete="off"
														/>
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
												<FormLabel>Confirm Password</FormLabel>
												<FormControl>
													<div className="relative flex items-center w-full">
														<img
															src={PassowrdIcon}
															className="absolute left-4 w-5 h-5 text-muted-foreground"
														/>
														<Input
															{...field}
															type="password"
															placeholder="Confirm your Password"
															className="w-full !pl-12 pr-4 py-3 h-11 text-sm rounded-md border border-input bg-background focus:border-primary focus:outline-none"
															autoComplete="off"
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<Button
									type
									className={`bg-primaryColor text-white w-full mt-6 ${page === 2 ? "flex " : "hidden "
										} flex-row items-center`}
									disabled={loading}
								>
									{loading && <Loader className="animate-spin" />}
									Create Account
								</Button>
							</>
						</form>
					</Form>
					<div className="flex flex-col gap-1 mt-4">
						<p className="font-light text-base h-max text-white w-full text-center">
							Already have an account?
						</p>
						<a href="/login">
							<Button
								variant="outline"
								className="w-full bg-background !border-primaryColor text-primaryColor"
							>
								Login
							</Button>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
