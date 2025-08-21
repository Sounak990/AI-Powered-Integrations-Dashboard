/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EyeIcon, EyeOff } from "lucide-react";
import { checkUniqueIntegrationName, createIntegrationType1 } from "@/services/api";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";

let timeout;

let typingTimeout;

const FormSchema = z.object({
	integration_name: z.string().min(1, "Integration Name is required"),
	client_id: z.string().min(1, "Client ID is required"),
	client_secret: z.string().min(1, "Client Secret is required"),
	integration_description: z.string(),
});

const IntegrationFormType1 = ({ open, setOpen, children, data, provider, refreshPageData }) => {
	const [show, setShow] = useState(false);
	const [uploading, setUploading] = useState(false);
	const initialValues = {
		integration_name: '',
		integration_description: '',
		client_id: '',
		client_secret: '',
	}
	const tenantId = useSelector(
		(state) =>
			state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id
	)

	const { toast } = useToast();

	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: initialValues,
	});


	function onSubmit(integrations) {
		setUploading(true);
		form.clearErrors("integration_name");
		checkUniqueIntegrationName(form.watch("integration_name"))
			.then((response) => {
				if (!response.unique) {
					form.setError("integration_name", {
						type: "manual",
						message: "Integration Name already exists",
					});
					setUploading(false);
				}
				else {
					createIntegrationType1({ ...integrations, tenant_id: tenantId, provider })
						.then((response) => {
							setOpen(false);
							form.reset();
							setUploading(false);
							refreshPageData();
							toast({
								variant: "success",
								title: "Success",
								description: response.message,
							});
						})
						.catch((error) => {
							console.log(error);
							setUploading(false);
							toast({
								variant: "destructive",
								title: "Failure",
								description: error.message,
							});
						});
				}
			})
			.catch((error) => {
				console.log(error);
				setUploading(false);
				toast({
					variant: "destructive",
					title: "Failure",
					description: error.message,
				});
			});
	}

	const toggle = () => {
		if (show) {
			setShow(false);
			clearTimeout(timeout);
		}
		else {
			setShow(true);
			timeout = setTimeout(() => {
				setShow(false);
			}, 5000);
		}
	}
	useEffect(() => {
		clearTimeout(typingTimeout);
		typingTimeout = setTimeout(() => {
			if (form.watch("integration_name") === '') return;
			form.clearErrors("integration_name");
			checkUniqueIntegrationName(form.watch("integration_name"))
				.then((response) => {
					if (!response.unique) {
						form.setError("integration_name", {
							type: "manual",
							message: "Integration Name already exists",
						});
					}
				})
		}, 500);
	}, [form.watch("integration_name")]);

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
			className="!bg-card-color !border-none"
		>
			{children && <DialogTrigger asChild>{children}</DialogTrigger>}
			<DialogContent className="max-w-full w-[90%] sm:w-[500px] lg:w-[700px] max-h-[90vh] overflow-y-auto !bg-card-color !border-none">
				<DialogHeader className="flex flex-row items-center gap-4 text-left">
					<div className="w-12">
						{data.image ?
							<img src={data.image} alt="logo" />
							:
							data.icon
						}
					</div>
					<DialogTitle className="m-0">Add {data.name} Integration</DialogTitle>
				</DialogHeader>
				<Separator className="bg-gray-600 w-full" />
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-6 w-full"
					>
						<div className="flex flex-col gap-2.5 w-full">
							<FormField
								control={form.control}
								name="integration_name"
								render={({ field }) => (
									<FormItem className="space-y-0.5 flex-1 w-full">
										<FormLabel className="mb-0">Integration Name*</FormLabel>
										<FormControl>
											<Input {...field} className="w-full h-8" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="integration_description"
								render={({ field }) => (
									<FormItem className="space-y-0.5 flex-1 w-full">
										<FormLabel className="mb-0">Integration Description</FormLabel>
										<FormControl>
											<Input {...field} className="w-full h-8" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="client_id"
								render={({ field }) => (
									<FormItem className="space-y-0.5 flex-1 w-full">
										<FormLabel className="mb-0">Client ID*</FormLabel>
										<FormControl>
											<Input {...field} className="w-full h-8" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="client_secret"
								render={({ field }) => (
									<FormItem className="space-y-0.5 flex-1 w-full">
										<FormLabel className="mb-0">Client Secret*</FormLabel>
										<FormControl>
											<div className="flex flex-row gap-3 items-center">
												<Input type={show ? 'text' : 'password'} {...field} className="w-full h-8" />
												<button type="button" onClick={toggle} className="hover:text-primaryColor hover:bg-inherit">
													{show ? <EyeOff /> : <EyeIcon />}
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter className="flex flex-col sm:flex-row sm:gap-2 w-full justify-end">
							<DialogClose className="bg-primaryColor/15 text-primaryColor !border-none px-4 py-2 rounded-md">
								Cancel
							</DialogClose>
							<Button
								type="submit"
								className="bg-primaryColor flex flex-row items-center gap-3 text-white"
							>
								Add
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default IntegrationFormType1;
