import React, { useEffect } from "react";
import withRouter from "../components/Common/withRouter";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../services/api";
import { logoutUser, resetOnboardingForm } from "../store/actions";
import { useSelector, useDispatch } from "react-redux";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginImage from "../assets/images/svg/auth-background.svg";
import ChainwideLogo from "../assets/images/chainwide/logo-dark.png";
import { Mail, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
// actions
import { loginUser } from "../store/actions";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Copyright } from "lucide-react";

import MailIcon from "../assets/images/svg/mail-icon.svg";
import PasswordIcon from "../assets/images/svg/password-icon.svg";

const loginSchema = z.object({
	email: z.string().email("Please enter a valid email"),
	password: z.string().min(1, "Please enter your password"),
});

const Login = (props) => {
	document.title = "Login | Chainwide - AI Middleware";
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = (values) => {
		dispatch(loginUser(values, navigate));
	};

	const error = useSelector((state) => state.login?.error);

	const login = useSelector(
		(state) =>
			state.login
	)

	useEffect(() => { }, [error]);

	useEffect(() => {
		const authUser = JSON.parse(localStorage.getItem("authUser"));
		dispatch(resetOnboardingForm());
		if (authUser && authUser.token) {
			verifyToken(authUser.token).then((isValid) => {
				if (isValid) {
					navigate("/home");
				} else {
					localStorage.removeItem("authUser");
					dispatch(logoutUser());
				}
			});
		}
	}, [navigate, dispatch]);

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
				<div className="max-w-[75%] w-full h-max flex flex-col">
					<h1 className="font-semibold text-[32px] leading-[39.2px] text-left w-full">
						Login
					</h1>
					<p className="text-base leading-[19px] my-4 font-light">
						Your AI Middleware. Integrate it and get the response.
					</p>
					{error && <p className="text-red-500">{error}</p>}

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col gap-3 w-full mt-9"
						>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email Address</FormLabel>
										<FormControl>
											<div className="relative flex items-center w-full">
												<img
													src={MailIcon}
													className="absolute left-4 w-5 h-5 text-muted-foreground"
												/>
												<Input
													{...field}
													type="email"
													id="email"
													placeholder="Enter your email"
													className="w-full !pl-12 pr-4 py-3 h-11 text-sm rounded-md border border-input bg-background focus:border-primary focus:outline-none"
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
													src={PasswordIcon}
													className="absolute left-4 w-5 h-5 text-muted-foreground"
												/>
												<Input
													{...field}
													type="password"
													id="password"
													placeholder="Enter your Password"
													className="w-full !pl-12 pr-4 py-3 h-11 text-sm rounded-md border border-input bg-background focus:border-primary focus:outline-none"
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex flex-row items-center justify-between w-full gap-3">
								<div className="flex flex-row items-center gap-2">
									<Checkbox className="text-white" />
									<p>Remember Me</p>
								</div>
								<a
									href="/forgot-password"
									className="text-primaryColor font-semibold"
								>
									Forgot Password?
								</a>
							</div>
							<Button
								type="submit"
								className="bg-primaryColor text-white w-full h-12 mt-10"
							>
								Login
							</Button>
							<div className="flex flex-col gap-1 mt-4">

								<p className="font-light text-base h-max text-white w-full text-center">
									Don't have an account?
								</p>

								<Button
									variant="outline"
									type="button"
									className="!border-primaryColor text-primaryColor bg-background w-full h-12"
									onClick={() => {
										navigate("/register");
									}}
								>
									Sign Up
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default withRouter(Login);
